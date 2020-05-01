const express = require('express');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../SchemaMongoDB/user');
const Product = require('../SchemaMongoDB/product');
const db = "mongodb+srv://mn1994:mn10091994@cluster0-d4do9.mongodb.net/shop?retryWrites=true&w=majority"
const router =express.Router();

mongoose.connect(db,{
        useNewUrlParser: true,
        useUnifiedTopology: true
},err =>{
    if(err){ console.log('Kết nối mongo false')}else { console.log('Kết nối mongo thành công')}
    }
)

function VerifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('không có Authorization gửi đến');
    }
    let token = req.headers.authorization.split(' ')[1] // lấy đoạn token sau khóa bí mật secretKey
    if(token === 'null'){
        return res.status(401).send('không có Authorization gửi đến');
    }
    let payload =jwt.verify(token,'secretKey');
    if(!payload){
        return res.status(401).send('không có Authorization gửi đến');
    }
        req.userID = payload.subject;
    next(); // callback next
}

router.get('/',(req,res)=>{
    res.send('API ne');
});

router.post('/adduser',(req,res)=>{
    let userData = req.body;
    console.log(userData);
    let user = new User(userData)
    user.save((err,dkkuser) => {
        if(err){
            console.log(err)
        } else {
            let payload = { subject: userData._id};
            let token = jwt.sign(payload,'secretKey')
            res.status(200).send({token})
        }
    })
});

router.post('/login',(req,res)=>{
    let userData = req.body;
    console.log('vào /api/login nè');
    User.findOne({name: userData.name},(err,user)=>{
        if(err){
            console.log(err);
        }else {
            if(!user){
                res.status(401).send('Tên Đăng Nhập không tồn tại');
            }else {
                if(user.pass !== userData.pass){
                    res.status(401).send('Sai mật khẩu');
                }else {
                    let payload = { subject: userData._id};
                    let token = jwt.sign(payload,'secretKey')
                    res.status(200).send({token});
                }
            }
        }
    })
})

//  API SẢN PHẨM Ở ĐÂY
router.get('/allproduct',(req,res)=>{
        console.log('vào /api/allproduct nè..');
        Product.find((err,product)=>{
            if(err){
                res.status(401).send('không kết nối được mongo cloud');
            }else {
                res.status(200).json(product);
            }
        })
})
router.get('/admin-product',VerifyToken,(req,res)=>{
    console.log('vào /api/allproduct nè..');
    Product.find((err,product)=>{
        if(err){
            res.status(401).send('không kết nối được mongo cloud');
        }else {
            res.status(200).json(product);
        }
    })
})
router.post('/user-productid',(req,res)=>{
    console.log('vào /api/admin-productid nè..');
    let userData = req.body;
    console.log(userData);
    Product.findById({_id:userData.id},(err,product)=>{
        console.log(product);
        if(err){
            res.status(401).send('không tìm được id');
        }else {
            res.status(200).json(product);
        }
    })
})
// thêm sản phẩm
router.post('/addproduct',(req,res)=>{
    let productData = req.body;
    let product = new Product(productData)
    product.save((err,dkkuser) => {
        if(err){
            res.status(401).send('Thêm thất bại');
        } else {
            res.status(200).send("Thêm thành công")
        }
    })
});
router.post('/updateproduct',(req,res)=>{
    let productData = req.body;
    // let product = new Product(productData)
    Product.updateOne({_id:productData._id},productData,(err,dkkuser) => {
        if(err){
            res.status(401).send('Sửa thất bại');
        } else {
            res.status(200).send("Sửa thành công")
        }
    })
});
router.post('/deleteproduct',async (req,res)=>{
    let productData = req.body;
    console.log('vào delete product nè');
  //   console.log(productData)
  // Product.deleteOne({_id:productData.id}, (err,dkkuser) => {
  //       if(err){
  //           res.status(401).send('Xóa thất bại');
  //       } else {
  //           res.status(200).send
  //
  //       }
  //   })
    try {
        var result = await Product.deleteOne({ _id: productData.id });
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }

});
router.post('/search-name',(req,res)=>{
    console.log('vào /user-seach nè..');
    let userData = req.body;
    console.log(userData);
    Product.find({name: userData.name},(err,product)=>{
        console.log(product);
        if(err){
            res.status(401).send('không tìm được tên');
        }else {
            res.status(200).json(product);
        }
    })
})
router.get('/search-men',(req,res)=>{
    console.log('vào /user-seach nè..');
    let userData = req.body;
    console.log(userData);
    Product.find({gender: "MEN"},(err,product)=>{
        console.log(product);
        if(err){
            res.status(401).send('không tìm được men');
        }else {
            res.status(200).json(product);
        }
    })
})
router.get('/search-women',(req,res)=>{
    console.log('vào /user-seach nè..');
    let userData = req.body;
    console.log(userData);
    Product.find({gender: "WOMEN"},(err,product)=>{
        console.log(product);
        if(err){
            res.status(401).send('không tìm được men');
        }else {
            res.status(200).json(product);
        }
    })
})
module.exports = router;

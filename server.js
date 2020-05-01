const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// mongodb+srv://mn1994:<password>@cluster0-d4do9.mongodb.net/test?retryWrites=true&w=majority

const  api =require('./router/api');
const PORT = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api',api);

app.get('/',function (req,res) {
    res.send('home neeeeeee');
})

app.listen(PORT,function () {
    console.log('Server chay neeee');
})

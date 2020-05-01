const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    gender: String,
    price: Number,
    image: String,
    note: String
});


module.exports = mongoose.model('product',ProductSchema,'product');

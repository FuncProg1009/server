const mongose = require('mongoose');

const Schema = mongose.Schema;

const UserSchema = new Schema({
    name: String,
    pass: String
})

module.exports = mongose.model('user',UserSchema,'user');

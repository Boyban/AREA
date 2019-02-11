const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username : String,
    email : String,
    image : String,
    password : String 
});
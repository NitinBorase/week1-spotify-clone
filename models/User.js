const mongoose = require("mongoose");

const User = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
});

const UserModel = mongoose.model("User", User);

module.exports = UserModel;
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const {getToken} = require("../utils/helpers")

router.post("/register", async(req, res) => {
    const { userName, email, password , firstName, lastName } = req.body;

    const user =await User.findOne({email:email});
    if(user){
        return res.status(403).json({error:"A user with this email is already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = { userName, email, password: hashedPassword , firstName, lastName };
    const newUser = await User.create(newUserData);

    const token = getToken(newUser);

    const userToReturn = {...newUser.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email:email});
    if(!user){
        return res.status(403).json({err:"Invalid Credintial"});

    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if(!isPasswordvalid){
        return res.status(403).json({err:"Invalid Credintial"});
    }
    const token = await getToken(user);
    const userToReturn = {...user.toJSON(), token};
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

module.exports = router;
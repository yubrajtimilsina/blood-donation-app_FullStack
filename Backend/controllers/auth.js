const CryptoJS = require("crypto-js");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); 
const dotenv = require("dotenv");


dotenv.config();


//REGISTER
const registerUser = async(req,res)=>{
    const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, 
            process.env.PASS_SEC).toString(),
    }); 
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json(error);
    }
}
//LOGIN
const loginUser = async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        if(!user){
            return res.status(401).json("Wrong credentials!");
        }
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if(OriginalPassword !== req.body.password){
            return res.status(401).json("Wrong credentials!");
        }
        const accessToken = jwt.sign({id:user._id,role:user.role},process.env.JWT_SEC,{expiresIn:"30d"});
        const {password,...info} = user._doc;
        res.status(200).json({...info,accessToken});
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports={registerUser,loginUser};

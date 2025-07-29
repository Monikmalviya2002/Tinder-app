const express = require("express");
const{validateSignUpData}  = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user"); 
const jwt = require("jsonwebtoken");

const authRouter = express.Router();


//signu api

authRouter.post("/signup", async(req,res)=>{

    try{
        //validate the user data
    validateSignUpData(req);

    //encrypred password
    const{ firstName ,lastName ,emailId,password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);

    const existingUser = await User.findOne({ emailId });
   if (existingUser) {
    return res.status(400).json({ error: "Email already registered" });
     }



     const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
     });
      const savedUser=  await user.save();
    const token = await jwt.sign({_id: user._id}, "Monik@2002")

        res.cookie("token", token);

       res.json({ message: "User Added Successfully", data: savedUser });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
     };
   


});

//login api
authRouter.post("/login", async(req,res)=>{
    try{
     const {emailId, password} = req.body;
     const user = await User.findOne({emailId : emailId})
     if(!user){
        throw new Error("invalide emailId and password");
     }
     const isPasswordValid =  await bcrypt.compare(password, user.password)

     if(isPasswordValid){
        //create a JWT token

        const token = await jwt.sign({_id: user._id}, "Monik@2002")
        //adding token to the cookies

        res.cookie("token", token);
        res.send(user);
     }
     else{
        throw new Error("invalide emailId and password")
     }
    }catch(err){
        res.status(400).send("ERROR:" + err.message);
}

});

//logout api
authRouter.post("/logout",async(req,res)=>{
      res.cookie("token", null,{
    expires: new Date(Date.now()),
      });

      

      res.send("log out successfully");

});



  module.exports =  authRouter;
   
  
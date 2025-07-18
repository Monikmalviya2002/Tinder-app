const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const{validateProfileEditData} = require("../utils/validation");
const User = require("../models/user"); 
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// to see profile;
profileRouter.get("/profile", userAuth,async(req,res)=>{
   try{
      const user = req.user 
      res.send(user)
}catch(err){
          res.status(400).send("ERROR:" + err.message);
    }
})

//to edit profile
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
            try{
                 if(!validateProfileEditData(req)){
                   throw new Error("invalid edit request");
                 }

                   const loggedInUser = req.user;

                   Object.keys(req.body).forEach((key) => (loggedInUser[key]= req.body[key]));
                   
                   await loggedInUser.save();
                  res.json({
                        message:`${loggedInUser.firstName},your profile updated succesfully`,
                        data:loggedInUser
                  });
            }catch(err){
          res.status(400).send("ERROR:" + err.message);
    }
}

);


//forget password
profileRouter.post("/profile/forget-password",async(req,res)=>{
         try{
            const{emailId} = req.body;
            if(!emailId){
                  throw new Error("emailId is required");   
            }

            const user = await User.findOne({emailId:emailId});
            if(!user){
                  throw new Error("usr not found");
            };
             const token = await jwt.sign({_id: user._id}, "Monik@2002");
             console.log(token);
             res.send("Reset link sent to email");
         }catch(err){
          res.status(400).send("ERROR:" + err.message);
}
});

profileRouter.post("/profile/reset-password", async(req,res)=>{
     try{
             
             const{token,newPassword} = req.body;
             
             if(!token || !newPassword)
             {
                 throw new Error("Token and password required");
             }
           //verify the token
           const decodeData = await jwt.verify(token, "Monik@2002");
           const{_id} = decodeData; 
           //find the user
           const user = await User.findById(_id);
                 if(!user){
                   throw new Error("User doesn't exist");
                 }

                 user.password = await bcrypt.hash(newPassword,10);
                 await user.save();
                 res.send("Password updated succesfully");
            }catch(err){
        res.status(400).send("ERROR:" + err.message);
}
});





module.exports = profileRouter;
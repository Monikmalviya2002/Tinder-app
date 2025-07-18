const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    
     try{
        //read the token from the cookies
        const{token} = req.cookies;
        if(!token){
            throw new Error("Invalid token");
        }
      //verify the token
      const decodeData = await jwt.verify(token, "Monik@2002");
      const{_id} = decodeData; 
      //find the user
      const user = await User.findById(_id);
            if(!user){
              throw new Error("User doesn't exist");
            }
            
           
  req.user = user;
   next();
     
    }catch(err){
          res.status(400).send("ERROR:" + err.message);
    }

} 

module.exports = {
    userAuth
}
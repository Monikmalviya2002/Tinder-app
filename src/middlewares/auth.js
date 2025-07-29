const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next)=>{
    
     try{
      if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
        //read the token from the cookies
        const{token} = req.cookies;
      if (!token) {
  return res.status(401).send("Please login");
}

        
      //verify the token
      const decodeData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const{_id} = decodeData; 
      //find the user
      const user = await User.findById(_id);
            if (!user) {
  return res.status(404).send("User doesn't exist");
}

            
           
  req.user = user;
   next();

    }catch(err){
         return res.status(400).send("ERROR: " + err.message);

    
    }
} 

module.exports = {
    userAuth
}
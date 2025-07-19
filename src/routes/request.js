const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user"); 
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");



// to send connection request
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
         const fromUserId =  req.user._id;
         const toUserId = req.params.toUserId;
         const status = req.params.status;

         const allowedStatus= ["interested", "ignored"]
         if(!allowedStatus.includes(status)){
            return res.status(400)
            .json({message: "status is not allowed :"  + status})
         };
         
         //to see user exist in db
         const toUser = await User.findById(toUserId);
         if(!toUser){
            return res.status(400).json({ message: "user not found"
            });
             
            };
               
         
         //if there is existing connection request
         const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId,},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
         });
         if(existingConnectionRequest){
            res.status(400).json({
                message: "Request already sent"
            });
         };

         const connectionRequest = new ConnectionRequest({
              fromUserId,
              toUserId,
              status
         });
        
         const data = await connectionRequest.save();
         res.json({
            message: req.user.firstName  +  " is " +  status  +  " in "  +  toUser.firstName,
            data,

         })

    }catch(err){
         res.status(400).send("ERROR:" + err.message);
    }

});

//to review request(accepted or rejected)
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{ 
      const loggedInUser = req.user;
      const{status,requestId} = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"invalid status"})
       
      };

<<<<<<< HEAD
=======


        console.log("loggedInUser:", loggedInUser._id);
        console.log("requestId:",requestId);
>>>>>>> b5428f484474c97b49c7d023e3e0b3d64093230c
      const connectionRequest = await ConnectionRequest.findOne({
         _id: requestId,
         toUserId:loggedInUser._id,
         status:"interested"
      });
<<<<<<< HEAD

=======
console.log("Full request object from DB:", connectionRequest);
>>>>>>> b5428f484474c97b49c7d023e3e0b3d64093230c
      if(!connectionRequest){
         return res.status(400).json({message:"connection request not found"})
      };

      connectionRequest.status = status;

       const data = await connectionRequest.save();
       res.json({message: "connection request " + status,data});
    }catch(err){
      res.status(404).send("ERROR:" + err.message);

    }
});

module.exports = requestRouter;
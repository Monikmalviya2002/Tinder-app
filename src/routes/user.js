const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
   try{
         const loggedInUser = req.user;

          const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested",
          }
          ).populate("fromUserId",["firstName", "lastName","photoUrl","gender","about"]);

          res.json({message:"request fetched successfully",
            data:connectionRequests
          });
   }catch(err){
    res.status(400).send("ERROR:" + err.message);
   }
});

// to see all the conncetion(frds) accepted request
userRouter.get("/user/connections",userAuth,async(req,res)=>{
   try{
          const loggedInUser = req.user;

          const connectionRequest = await ConnectionRequest.find({
            $or:[
                    {toUserId:loggedInUser._id ,status:"accepted"},
                    {fromUserId:loggedInUser._id, status:"accepted"}
                ],
          }).populate("fromUserId",["firstName", "lastName","photoUrl","gender","about"])
          .populate("toUserId",["firstName", "lastName","photoUrl","gender","about"]);

             
          const data = connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
   });
          res.json({data});


   }catch(err){
      res.status(400).send("ERROR:" + err.message);
   }
});


//to get feed
userRouter.get("/feed",userAuth,async(req,res)=>{
   try{
      const loggedInUser = req.user;
              
          const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            limit=  limit> 50 ? 50 : limit;
            const skip = (page-1)* limit;

    const connectionRequest = await ConnectionRequest.find({
        $or:[{fromUserId:loggedInUser._id }, {toUserId: loggedInUser._id}],                
        
    }).select("fromUserId  toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) =>{
        hideUserFromFeed.add(req.fromUserId.toString());
        hideUserFromFeed.add(req.toUserId.toString());
    });
     
    const users = await User.find({
        $and:[
            {_id: {$nin:Array.from(hideUserFromFeed)}},
            {_id:{$ne: loggedInUser._id}}
        ]
    })
    .select("firstName lastName photoUrl gender about")
    .skip(skip)
    .limit(limit);

      res.send(users);
   }catch(err){
    res.status(400).send("ERROR:" + err.message);
   }
});

module.exports = userRouter;
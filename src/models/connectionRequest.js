const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "rejected", "accepted"],
                message: '{VALUE} is an incorrect status type',
            },
        },
    },
    { timestamps: true }
);
 
     connectionRequestSchema.pre("save", function(next){
          const connectionRequest= this;
            if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
                throw new Error("you can't send request to yourself");
            }
            next();
        });

const connectionRequestModel = mongoose.model(
    "ConnectionRequest", connectionRequestSchema
);

module.exports = connectionRequestModel;

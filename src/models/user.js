const mongoose = require("mongoose");
const validator = require("validator");

const userSchema =  new mongoose.Schema({

    firstName: {
   type : String,
    required: true,
    minLength : 3,
    maxLength : 20

    },

    lastName: {
   type : String,
    minLength : 3,
    maxLength : 20
  
    },

    emailId: {
   type : String,
    required: true,
    lowercase :true,
    trim : true,
    unique : true,
    },

    password: {
     type : String,
     require: true,
}, 
    age: {
   type : Number,
    },

      gender: {
   type :String,
    },

    photoUrl : {
      type : String,
      default : "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg"
    },
  

    about:{
      type : String,
    },

    skills:{
      type: [String],
    },
    
    
},{timestamps:true,});

module.exports = mongoose.model("User", userSchema);
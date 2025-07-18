const mongoose = require("mongoose");

async function connectDB() {
     await mongoose.connect("mongodb+srv://monikmalviya2:knObj0x9qHuikiYi@monik04.vyrcayb.mongodb.net/devTinder");
};
    
  module.exports = connectDB;


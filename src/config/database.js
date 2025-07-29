const mongoose = require("mongoose");

const connectDB = async () => {
  const dbURL = process.env.DB_CONNECTION_STRING;

  if (!dbURL) {
    console.error("❌ DB_CONNECTION_STRING is undefined");
    return;
  }

  try {
    await mongoose.connect(dbURL);
     
    console.log("✅ MongoDB connected");
  } catch (error) {
    throw error; // Let the calling code catch and log it
  }
};

module.exports = connectDB;

const express = require("express");
const connectDB = require("./config/database");``
const app = express();
const cookieParser = require("cookie-parser");


//to read the json data from user
app.use(express.json());
//to read the cookie
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)

connectDB()
.then(()=>{
    console.log(" DATABSE connection is succesfull");
    
app.listen(7777, ()=>{
   console.log("server is active");
});
})
.catch((err)=>{
    console.log(" DATABASE coonection failed");
});


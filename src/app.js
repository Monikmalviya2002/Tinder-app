
const express = require("express");
const connectDB = require("./config/database");``
const app = express();
const cookieParser = require("cookie-parser");
const cors = require ("cors");
require("dotenv").config();



//to solve cors error
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,

};

app.use(cors(corsOptions));


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
app.use("/request",requestRouter);
app.use("/",userRouter)



connectDB()
.then(()=>{
    console.log(" DATABSE connection is succesfull");
    

app.listen(process.env.PORT,'0.0.0.0', ()=>{
   console.log("server is active");
});
})
.catch((err)=>{
    console.log(" DATABASE coonection failed");
});


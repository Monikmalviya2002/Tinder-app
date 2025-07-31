
const express = require("express");
const connectDB = require("./config/database");``
const app = express();
const cookieParser = require("cookie-parser");
const cors = require ("cors");
require("dotenv").config();
const http = require("http");
const initializeSocket = require("./utils/socket");


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
const chatRouter = require("./routes/chat");

const initializeSockett = require("./utils/socket");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/request",requestRouter);
app.use("/",userRouter)
app.use("/",chatRouter)

const server = http.createServer(app);
initializeSocket(server);

connectDB()
.then(()=>{
    console.log(" DATABSE connection is succesfull");
    

server.listen(process.env.PORT,'0.0.0.0', ()=>{
   console.log("server is active");
});
})
.catch((err)=>{
    console.log(" DATABASE coonection failed");
});


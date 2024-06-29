require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const userModel = require("./userSchema");
const mongoose = require("mongoose");
const otpRouter = require("./otp");
const postRouter = require("./post");
const multer = require("multer");
app.use(cors({
    origin:"https://todos-task-manager-front.vercel.app",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
const connectDB = async(req,res)=>{
    try{
        await mongoose.connect(process.env.URI);
        console.log("connected to db.")
    }catch(err){
console.log(err);
    }
}
connectDB();
app.get("/",(req,res)=>{
    res.set("Access-Control-Allow-Origin","https://todos-task-manager-front.vercel.app");
    res.set("Access-Control-Allow-Credentials","true");
    res.send("hello")
})

app.use("/user",require("./user"));

app.use("/otp",otpRouter);

app.use("/post",postRouter)


app.use(express.static("images"));

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + file.originalname );
    }
})

const upload = multer({
    storage,
})
 
app.post("/uploadPic",upload.single("img"),async(req,res)=>{
    const email = req.body.email;
    const user = await userModel.findOne({email}).exec();
    if(user){
        user.image = `https://todos-task-manager-back.onrender.com/${req.file.filename}`;
        await user.save();
    }
    res.status(200).json("image uploaded");
})

app.listen(5000,()=>{
    console.log("port created")
})
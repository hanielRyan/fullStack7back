const router = require("express").Router();
const nodemailer = require("nodemailer");
const userModel = require("./userSchema");
const {customOtpGen} = require("otp-gen-agent");
const bcrypt = require("bcrypt");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"hanielryanephin@gmail.com",
        pass:process.env.MAIL_PASS
    }
})
router.post("/createUser",async(req,res)=>{
    try{
const user = req.body.data;
const duplicate = await userModel.findOne({email:user.email}).exec();
if(duplicate){
res.status(409).json("user already exists.");
}else{
    const otp = await customOtpGen({length:4});
    transporter.sendMail({
        from:"hanielryanephin@gmail.com",
        to:user.email,
        subject:"Create Your Todo Task Manager account.",
        html:`
        <div>
        <h2>To create your account, enter the following otp : </h3>
        <h2 style="display:block"><b>${otp}</b></h2>
        </div>`
    },(err,info)=>{
          if(err){
            res.status(err.status).json(err.message);
          }
    })

    const hashedPass = await bcrypt.hash(user.password,10);
    const hashOtp = await bcrypt.hash(otp,10);

    const modifiedUser={
        name:user.name,
        email:user.email,
        password:hashedPass,
        otp:hashOtp,
    }
    const create = await userModel.create(modifiedUser);
    await create.save();
    res.cookie("email",user.email,{secure:true,sameSite:"lax"});
    res.json("user created").status(200);
}
    }catch(err){
res.send(err.message);
    }

})

module.exports = router;
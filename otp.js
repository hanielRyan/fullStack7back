const router = require("express").Router();
const userModel = require("./userSchema");
const bcrypt = require("bcrypt");
router.get("/email",(req,res)=>{
const email = req.cookies.email;
email ? res.json(email) : res.status(404).json("email not found");
})

router.post("/verifyOtp",async(req,res)=>{
    const otp = String(req.body.otp);
    const email = req.cookies.email;
    const user = await userModel.findOne({email}).exec();
    if(user &&  Date.now() < user.expireDate ){
        const compareOtp =await bcrypt.compare(otp,user.otp);
        if(compareOtp){
            user.verified = true;
            user.expireDate = null,
            user.otp = null;
            await user.save();
            res.clearCookie("email",{httpOnly:true,sameSite:"strict"})
            res.json("user verified");
        }else{
            res.status(400).json("invalid otp");
        }
    }else{
        await userModel.deleteOne({email:email});
        res.status(204).json("user deleted");
    }
})

module.exports = router;
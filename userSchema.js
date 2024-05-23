const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    image:{
        type:String,
        default:"https://scontent.ffjr7-1.fna.fbcdn.net/v/t1.30497-1/143086968_2856368904622192_1959732218791162458_n.png?_nc_cat=1&ccb=1-7&_nc_sid=db1b99&_nc_ohc=ai7e9x4HZdsAX_gFIB-&_nc_ht=scontent.ffjr7-1.fna&oh=00_AfB5R7xoBqW5wd5ixsOUJspvFN23xNFFES9LCx-TU6iv9Q&oe=6596FF38"
    },
    password:String,
    otp:String,
    verified:{
        type:Boolean,
        default:false
    },
    expireDate:{
        type:Date,
        default:Date.now() + 3600000
    }
})

module.exports = mongoose.model("FullStackUser7",userSchema)
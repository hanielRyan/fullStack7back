const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    email:String,
    content:String,
    status:{
        type:String,
        default:"pending"
    }
});

module.exports = mongoose.model("FullStackPost7",schema);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        enum : ["Admin", "Candidate"],
        default : "Candidate"
    }
},{
    timestamps : true
});

const User = mongoose.model("User", userSchema);
module.exports = User ;
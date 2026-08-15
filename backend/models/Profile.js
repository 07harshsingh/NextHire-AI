const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    college : {
        type : String,
        required : true
    },
    degree : {
        type : String,
        required : true
    },
    skills : {
        type : [String],
        required : true
    },
    experience : {
        type : String,
        default : "Fresher"
    },
    github : {
        type : String,
        default : ""
    },
    linkedIn : {
        type : String,
        default : ""
    },
    resume : {
        type : String,
        default : ""
    }
},{
    timestamps : true
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;


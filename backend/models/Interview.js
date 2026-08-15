const mongoose = require("mongoose");

const interview = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        required : true
    },
    experience : {
        type : String,
        required : true
    },
    technologies : [{type : String}],
    description : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        enum : ["Easy", "Medium", "Hard"],
        default : "Medium",
    },
    questionCount : {
        type : Number,
        default : 10
    },
    currentQuestion : {
         type : Number,
         default : 0
    },
    answeredQuestions : {
        type : Number,
        default : 0
    },
    overallScore : {
        type : Number,
        default : 0
    },
    accuracy: {
        type: Number,
        default: 0
    },
    overallFeedback: {
        type: String,
        default: ""
    },
    strengths: [{
        type: String
    }],
    weaknesses: [{
        type: String
    }],
    scheduleDate : {
        type : Date
    },
    startedDate : Date,
    completedDate : Date,
    status : {
        type : String,
        enum : ["Pending", "Starting", "Started", "Completed"],
        default : "Pending"
    }
},{
    timestamps : true
})

const Interview = mongoose.model("Interview", interview);
module.exports = Interview;
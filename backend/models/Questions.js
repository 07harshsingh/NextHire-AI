const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    interview : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Interview",
        required : true
    },
    order : {
        type : Number,
        required : true
    },
    question : {
        type : String,
        required : true
    },
    expectedAnswer : {
        type : String,
        default : ""
    },
    userAnswer : {
        type : String,
        default : ""
    },
    technology : {
        type : String,
        default : ""
    },
    difficulty : {
        type : String,
        enum : ["Easy", "Medium", "Hard"],
        default : "Medium"
    },
    answered: {
        type: Boolean,
        default: false
    },

    // AI Evaluation
    
    technicalScore: {
        type: Number,
        default: 0
    },

    communicationScore: {
        type: Number,
        default: 0
    },

    confidenceScore: {
        type: Number,
        default: 0
    },

    overallScore: {
        type: Number,
        default: 0
    },

    feedback: {
        type: String,
        default: ""
    },

    strength: {
        type: String,
        default: ""
    },
    improvements: {
        type: String,
        default: ""
    }
},{
    timestamps : true
})

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
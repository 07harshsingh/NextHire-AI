const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
            unique: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        overallScore: {
            type: Number,
            default: 0
        },

        accuracy: {
            type: Number,
            default: 0
        },

        overallFeedback: {
            type: String,
            default: ""
        },

        strengths: {
            type: [String],
            default: []
        },

        weaknesses: {
            type: [String],
            default: []
        },

        questions: [
            {
                order: Number,
                question: String,
                expectedAnswer: String,
                userAnswer: String,
                technicalScore: Number,
                communicationScore: Number,
                confidenceScore: Number,
                overallScore: Number,
                feedback: String,
                strength: String,
                improvements: String
            }
        ]
    },
    {
        timestamps: true
    }

)

module.exports = mongoose.model("Result", resultSchema)
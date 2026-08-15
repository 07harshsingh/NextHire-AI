const Question = require("../models/Questions");
const Interview = require("../models/Interview")
const {generateQuestion, evaluateInterview} = require("../services/geminiService")
const Result = require("../models/Result")


const startInterview = async (req, res, next) => {
    try{
        const {interviewId} = req.params;
        const interview = await Interview.findOne({
            _id : interviewId,
            user : req.user.id
        });
        if(!interview){
            const error = new Error("Interview not found");
            error.statusCode = 400;
            return next(error);
        }
        if(interview.status==="Started" || interview.status==="Completed"){
           const error = new Error("Interview already started");
           error.statusCode = 400;
            return next(error); 
        }

        const aiQuestion = await generateQuestion(interview);

        const questionToSave = aiQuestion.map((item, index) => {
            let difficulty = item.difficulty;

            // Normalize Gemini's response
            if (difficulty === "Medium-Hard") {
                difficulty = "Hard";
            } else if (difficulty === "Easy-Medium") {
                difficulty = "Medium";
            }

            // Final safety check
            if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
                difficulty = "Medium";
            }

            return {
                interview: interview._id,
                question: item.question,
                expectedAnswer: item.expectedAnswer,
                technology: item.technology,
                difficulty: difficulty,
                order: index + 1
            };
        });


        const questions = await Question.insertMany(questionToSave);

        interview.status = "Started";
        interview.currentQuestion = 1;
        interview.startedDate = new Date();
        interview.questionCount = questions.length;
        interview.answeredQuestions = 0;
        await interview.save();

        res.status(200).json({
            success : true,
            message : "Interview started successfully",
            question : questions[0],
            currentQuestion : 1,
            totalQuestion : questions.length
        })

    }catch(err){
        next(err)
    }
}

const getCurrentQuestion = async (req, res, next) => {
    try{
       const {interviewId} = req.params ;
       const interview = await Interview.findOne({_id: interviewId, user: req.user.id});
       if(!interview){
            const error = new Error("Interview not found");
            error.statusCode = 400;
            return next(error);
       }
       const question = await Question.findOne({
               interview : interviewId,
               order : interview.currentQuestion
       }).select("-expectedAnswer");
       if(!question){
            const error = new Error("Question not found");
            error.statusCode = 400;
            return next(error);
       }
       res.status(200).json({
        success : true,
        currentQuestion : interview.currentQuestion,
        totalQuestion : interview.questionCount, 
        question
       });
    }catch(err){
         next(err )
    }
}

const submitAnswer = async (req, res, next) => {
    try{
        const {questionId} = req.params;
        const {answer} = req.body;

        if(!answer){
            const error = new Error("Answer is required");
            error.statusCode = 400;
            return next(error);
        }

        if (typeof answer !== "string" || !answer.trim()) {
           const error = new Error("Answer is required");
           error.statusCode = 400;
           return next(error);
        }

        const cleanAnswer = answer.trim();
        
        const question = await Question.findById(questionId);

if (!question) {
    const error = new Error("Question not found");
    error.statusCode = 404;
    return next(error);
}

const interview = await Interview.findOne({
    _id: question.interview,
    user: req.user.id
});

if (!interview) {
    const error = new Error("Unauthorized access");
    error.statusCode = 403;
    return next(error);
}

if (interview.status !== "Started") {
    const error = new Error("Interview is not active");
    error.statusCode = 400;
    return next(error);
}

if (question.answered) {
    const error = new Error("Question already answered");
    error.statusCode = 400;
    return next(error);
}

question.userAnswer = cleanAnswer;
question.answered = true;
await question.save();

interview.answeredQuestions += 1;
await interview.save();

        res.status(200).json({
            success : true,
            message : "Answer submitted"
        });

    }catch(err){
        next(err)
    }
}

const nextQuestion = async (req, res, next) => {
    try{
        const {interviewId} = req.params;
        
        const interview = await Interview.findOne({_id: interviewId, user: req.user.id});
        if(!interview){
            const error = new Error("Interview not found");
            error.statusCode = 400;
            return next(error);
        }
        if (interview.status !== "Started") {
            const error = new Error("Interview is not active");
            error.statusCode = 400;
            return next(error);
        }
        if(interview.currentQuestion >= interview.questionCount){
            return res.status(200).json({
                success : true,
                message : "Interview completed",
                completed : true
            })
        }
        interview.currentQuestion += 1;
        await interview.save();
        
        const question = await Question.findOne({
            interview : interviewId,
            order : interview.currentQuestion
        }).select("-expectedAnswer");
        if (!question) {
          const error = new Error("Question not found");
          error.statusCode = 404;
          return next(error);
          }
        res.status(200).json({
            success : true,
            completed : false,
            currentQuestion : interview.currentQuestion, 
            totalQuestion : interview.questionCount,
            question
        })
    }catch(err){
         next(err)
    }
}

const completeInterview = async (req, res, next) => {
    try{
        const {interviewId} = req.params;
        const interview = await Interview.findOne({
            _id : interviewId,
            user : req.user.id
        });
        if(!interview){
            const error = new Error("Interview not found");
            error.statusCode = 400;
            return next(error);
        }
        if (interview.status === "Completed") {
           return res.status(200).json({
            success: true,
            message: "Interview already completed"
           });
        }
        const questions = await Question.find({
            interview : interview._id
        }).sort({order : 1});

        if(questions.length === 0){
            const error = new Error("Questions not found");
            error.statusCode = 400;
            return next(error); 
        }

        const result = await evaluateInterview(questions);
        ////Update every question
        for(const item of result.questions){
            await Question.findOneAndUpdate({
                interview : interviewId,
                order : item.order
        }, {
        technicalScore : item.technicalScore,
        communicationScore : item.communicationScore,
        confidenceScore : item.confidenceScore,
        overallScore : item.overallScore,
        feedback : item.feedback,
        strength : item.strength,
        improvements : item.improvements
            })
        }
        
        ////update interview result

        interview.overallScore = result.overallScore;
        interview.accuracy = result.accuracy;
        interview.overallFeedback = result.overallFeedback;
        interview.strengths = result.strengths;
        interview.weaknesses = result.weaknesses;
        interview.completedDate = new Date();
        interview.status = "Completed" ;
        await interview.save();

        await Result.findOneAndUpdate(
            {interview: interviewId},
            {
                interview: interviewId,
                user: req.user.id,
                overallScore: result.overallScore,
                accuracy: result.accuracy,
                overallFeedback: result.overallFeedback,
                strengths: result.strengths,
                weaknesses: result.weaknesses,
                questions: result.questions.map((item) => {
                    const originalQuestion = questions.find((q) => q.order === item.order);
                    return{
                        ...item,
                        expectedAnswer: originalQuestion?.expectedAnswer || ""
                    };
                })
            },
            {
                new: true,
                upsert: true
            }
        )

        res.status(200).json({
            success : true,
            message : "Interview completed successfully",
            result
        })

    }catch(err){
        next(err)
    }
}

const getInterviewResult = async (req, res, next) => {
    try{
       const {interviewId} = req.params;
       const interview = await Interview.findOne({
        _id : interviewId,
        user : req.user.id
       });
       if(!interview){
           const error = new Error("Interview not found");
            error.statusCode = 400;
            return next(error);
       }
       if(interview.status !== "Completed"){
          const error = new Error("Interview not completed");
            error.statusCode = 400;
            return next(error);
       }
       const question = await Question.find({
          interview : interviewId
       }).sort({order : 1});

       const averageScore = (score) => {
        if(score.length===0) return 0;
        return score.reduce((sum, score) => sum+(Number(score) || 0), 0) /score.length;
       };

       const technicalScore = averageScore(question.map(q => q.technicalScore));
       const communicationScore = averageScore(question.map(q => q.communicationScore));
       const confidenceScore = averageScore(question.map(q => q.confidenceScore));

       res.status(200).json({
           success : true,
           result : {
           overallScore : interview.overallScore,
           technicalScore,
           communicationScore,
           confidenceScore,
           accuracy : interview.accuracy,
           overallFeedback : interview.overallFeedback,
           strengths : interview.strengths,
           weaknesses : interview.weaknesses, 
           completedDate : interview.completedDate,
           question
           }
       });
    }catch(err){
        next(err);
    }
}

module.exports = {startInterview, getCurrentQuestion, submitAnswer, nextQuestion, completeInterview, getInterviewResult};
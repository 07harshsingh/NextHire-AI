const Interview = require("../models/Interview")
const Question = require("../models/Questions");

const interviewController = async (req, res, next) => {
    try{
        const {title, role, experience, technologies, description, difficulty, questionCount, scheduleDate} = req.body;
        console.log(req.body);
        
        if(!title || !role || !experience || !description){
            const error = new Error("Please fill all required fields");
            error.statusCode = 400;
            return next(error)
        };

        const interview = await Interview.create({
            user : req.user.id,
            title, role, experience, technologies, description, difficulty, questionCount, scheduleDate
        });
        res.status(200).json({
            success : true,
            message : "Interview created successfully",
            data : interview
        })
    }catch(err){
        next(err);
    }
}

// const getAllInterview = async (req, res, next) => {
//     try{
//         const interview = await Interview.find({user : req.user.id});
//         if(!interview){
//             const error = new Error("No interview found");
//             error.statusCode = 400;
//             return next(error);
//         }
//         res.status(200).json({
//             success : true,
//             data : interview
//         });
//     }catch(err){
//         next(err)
//     }
// };

const getAllInterview = async (req, res, next) => {
    try {
        console.log("REQ.USER:", req.user);
        console.log("USER ID:", req.user.id);

        const interview = await Interview.find({
            user: req.user.id
        });

        console.log("INTERVIEWS FOUND:", interview);

        res.status(200).json({
            success: true,
            data: interview
        });
    } catch (err) {
        next(err);
    }
};

const getInterviewById = async (req, res, next) => {
    try{
       const {id} = req.params;
       const interview = await Interview.findOne({
        _id : id,
        user : req.user.id});
       if(!interview){
            const error = new Error("No interview found");
            error.statusCode = 400;
            return next(error);
        }
        res.status(200).json({
            success : true,
            message : "Interview Found",
            data : interview
        });
    }catch(err){
        next(err)
    }
};

const updateInterview = async (req, res, next) => {
    try{
        const {id} = req.params;
        const interview = await Interview.findOneAndUpdate({_id : id, user : req.user.id}, req.body, {new:true, runValidators:true});
        if(!interview){
            const error = new Error("No interview found");
            error.statusCode = 400;
            return next(error);
        }
        res.status(200).json({
            success : true,
            message : "Interview updated successfully",
            data : interview
        });

    }catch(err){
        next(err)
    }
};

const deleteInterview = async (req, res, next) => {
    try{
        const {id} = req.params;
        const interview = await Interview.findOneAndDelete({_id : id, user : req.user.id});
        if(!interview){
            const error = new Error("No interview found");
            error.statusCode = 400;
            return next(error);
        }
        res.status(200).json({
            success : true,
            message : "Interview deleted successfully"
        });

    }catch(err){
        next(err)
    }
};

const resultHistory = async (req, res, next) => {
    try{
       const interview = await Interview.find({user: req.user.id, status: "Completed"}).sort({completedDate : -1});
       res.status(200).json({
        success : true,
        results : interview
       })
    }catch(err){
       next(err)
    }
}


module.exports = {interviewController, getAllInterview, getInterviewById, updateInterview, deleteInterview, resultHistory};
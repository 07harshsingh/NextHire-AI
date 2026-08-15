const Profile = require("../models/Profile")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

const createProfile = async (req, res, next) => {
     try{
        const {fullName, college, degree, skills, experience, github, linkedIn} = req.body;
        if(!fullName || !degree || !college){
            const error = new Error("Name, college and degree required");
            error.statusCode = 400;
            return next(error);
        }

        const existProfile = await Profile.findOne({user : req.user.id});
        if(existProfile){
            const error = new Error("Profile already exists");
            error.statusCode = 400;
            return next(error);
        }

        const profile = await Profile.create({
            user : req.user.id,
            fullName, college, degree, skills, experience, github, linkedIn
        });
        res.status(201).json({
            success : true,
            message : "New profile created",
            data : profile
        });

     }catch(err){
        next(err)
     }
};

const getMyProfile = async (req, res, next) => {
    try{
        const profile = await Profile.findOne({user : req.user.id});
        if(!profile){
            const error = new Error("Profile doesn't exists");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({
            success : true,
            data : profile
        });

    }catch(err){
        next(err)
    }
}

const updateProfile = async (req, res, next) => {
    try{
        const profile = await Profile.findOneAndUpdate({user : req.user.id}, req.body, {new:true, runValidators:true});
        if(!profile){
            const error = new Error("Profile doesn't exists");
            error.statusCode = 404;
            return next(error);
        }
        res.status(200).json({
            success : true,
            message : "Profile updated",
            data : profile
        })

    }catch(err){
        next(err)
    }
}

const deleteProfile = async (req, res, next) => {
    try{
        const profile = await Profile.findOneAndDelete({user: req.user.id});
        if(!profile){
            const error = new Error("Profile doesn't exists");
            error.statusCode = 404;
            return next(error);
    }
        res.status(200).json({
        success : true,
        message : "Profile deleted successfully"
    });

    }catch(err){
        next(err)
    }
};

const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("Please upload file");
            error.statusCode = 400;
            return next(error);
        }
        const fileBase64 = req.file.buffer.toString("base64");

        const fileData = `data:application/pdf;base64,${fileBase64}`;

        const result = await cloudinary.uploader.upload(fileData, {
            folder: "NextHire/resumes",
            resource_type: "image"
        });

        const profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { resume: result.secure_url },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "File uploaded",
            data: profile
        });

    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        next(err);
    }
};

module.exports ={createProfile, getMyProfile, updateProfile, deleteProfile, uploadResume};
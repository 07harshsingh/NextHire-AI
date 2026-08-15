const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res, next) => {
    try{
        const {username, email, password, confirmPassword} = req.body;

        if(!username || !email || !password || !confirmPassword){
            const error = new Error("All fields are required");
            error.statusCode = 400;
            return next(error);
        }

        if(password !== confirmPassword){
            const error = new Error("Password do not match");
            error.statusCode = 400;
            return next(error)
        }

        const existUser = await User.findOne({email});
        if(existUser){
            const error = new Error("User already registered");
            error.statusCode = 400;
            return next(error);
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password : hashPassword
        });
        res.status(201).json({
            success : true,
            message : "User registered successfully",
            data : {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    }catch(err){
           next(err);
    }
}

const loginUser = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){
            const error = new Error("All fields are required");
            error.statusCode = 400;
            return next(error);
        }

        const user = await User.findOne({email});
        if(!user){
            const error = new Error("Invalid email or password");
            error.statusCode = 400;
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            const error = new Error("Password doesn't match");
            error.statusCode = 400;
            return next(error);
        }

        const token = await jwt.sign({id:user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn:"1d"});
        res.status(200).json({
            success : true,
            message : "User login succesfull",
            token,
            role : user.role,
            username : user.username
        });
    }catch(err){
        next(err)
    };
};


module.exports = {registerUser, loginUser}
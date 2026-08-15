const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            const error = new Error("Unauthorized");
            error.statusCode = 400;
            return next(error);
        }
        const token = await authHeader.split(" ")[1];
        
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }catch(err){
        const error = new Error("Invalid or expired token");
        error.statusCode = 401;
        return next(error)
    };
};

module.exports = auth;
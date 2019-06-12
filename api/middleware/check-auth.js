const jwt = require("jsonwebtoken")

module.exports = (req,res, next) =>{
    try {
        console.log(req.headers.authorization);
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_KEY, null, null);
        req.userData = decoded;
        next();    
    } catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
};
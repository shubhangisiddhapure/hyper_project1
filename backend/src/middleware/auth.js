const jwt=require('jsonwebtoken')
const config=require("../config/config.json")


module.exports = function (req,res,next) {
    //get the token from header
    const token=req.header('x-auth-token');

    //checke if no token
    if(!token){
        return res.status(401).json({msg:"no token,authorization denied"});

    }
    //verify token
    try{
        const decoded=jwt.verify(token,config.jwtSecret);
        req.user=decoded.user;
        next();

    }catch(err){
        res.status(401).json({msg:"Token is not valid"});

    }
}
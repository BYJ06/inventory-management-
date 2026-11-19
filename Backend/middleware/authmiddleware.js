const jwt=require("jsonwebtoken");
const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({message:"Access denied. No token provided."});
    }
    const token=authHeader.split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:"Invalid token"});
        }
        req.user=decoded;
        next()
    })
}
const authorizeRole=(role)=>{
    return(req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).json({message:"Access denied. You do not have permission to perform this action."});
        }
        next()
    }
}
module.exports={authenticateToken,authorizeRole};
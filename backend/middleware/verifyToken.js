const jwt= require("jsonwebtoken")
const verifyToken = (req,res,next)=>{
    const token = req.cookies.token
    if(!token) 
        return res.status(401).json({success:false, message:"unauthorized-no token provided"})
        try{
            const decoded = jwt.verify(token,process.env.JWT_TOKEN)
            if(!decoded){
                return res.status(401).json({success:false, message:"unauthorized-token is invalid"})
            }
            req.userId = decoded.userId
            next()
    }catch(e){
        
        return res.status(500).json({success:false, message:e.message})
    }
}



module.exports= verifyToken;
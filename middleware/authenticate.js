const jwt=require('jsonwebtoken');
const user=require('../models/user');

const authenticate= async(req,res,next)=>{
    const token = req.header('Authorization')?.split(' ')[1];
    if(!token){
     return   res.status(401).json({success:false,message:"Authorization failed No Token found"})
    }
    try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const User = await user.findByPk(decoded.id);
    if (!User) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = User; 
    
    next();
    }catch(err){
        res.status(400).json({success:false,message:"Error in authenticatin Invalid token",error:err})
    }
    
}
module.exports={authenticate};
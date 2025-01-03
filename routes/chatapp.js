const express=require('express');
const router=express.Router();
const chatdb=require('../models/chatapp');
const authenticate=require('../middleware/authenticate');

router.post('/message',authenticate.authenticate,async(req,res,next)=>{
    const {message}=req.body;
    const userId=req.user.id;
    try{
       await chatdb.create({chat:message,userId});
       res.status(201).json({success:true,message:'Chat added to database successfully!'});
    }catch(err){
        console.log('Error in postin data to database',err);
        res.status(500).json({success:false,message:'Error in  adding chat  to database!'}); 
    }
})

module.exports=router;
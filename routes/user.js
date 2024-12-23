const express=require('express');
const bcrypt=require('bcrypt');
const user=require('../models/user');
const router=express.Router();

router.post('/signup',async(req,res,next)=>{
    const {name,email,phone,password}=req.body;
    try{
        if(!name||!email||!phone||!password)
            return  res.status(400).json({success:false,message:'Please Enter Everything correctly'})
        const saltRounds=10;
        const hash=await bcrypt.hash(password,saltRounds);
        await user.create({name,email,phone,password:hash});
        res.status(201).json({success:true,message:'Data added to successfully!'})
    }catch(err){
       res.status(500).json({success:false,message:'Error in Adding data!!',Error:err})
    }
})
module.exports=router
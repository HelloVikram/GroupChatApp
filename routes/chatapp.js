const express=require('express');
const router=express.Router();
const chatdb=require('../models/chatapp');
const userdb=require('../models/user');
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
router.get('/getmessages',authenticate.authenticate,async(req,res,next)=>{
    const userId=req.user.id;
    try{
        const result=await chatdb.findAll({
        attributes:['chat'],
        include:[{
            model:userdb,
            attributes:['name']
        }]
    })
        res.status(200).json({status:true,message:'Data fetched from database successfully',data:result});
    }catch(err){
        res.status(500).json({status:false,message:'Error in fetching data from database'});
    }   
})
module.exports=router;
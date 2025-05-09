const chatdb=require('../models/chatapp');
const userdb=require('../models/user');
const { Op } = require('sequelize');

const messages=async(req,res,next)=>{
    const {message}=req.body;
    const userId=req.user.id;
    try{
       await chatdb.create({chat:message,userId});
       res.status(201).json({success:true,message:'Chat added to database successfully!'});
    }catch(err){
        console.log('Error in postin data to database',err);
        res.status(500).json({success:false,message:'Error in  adding chat  to database!'}); 
    }
}
const getmessages=async(req,res,next)=>{
    const lastMessageId=parseInt(req.query.lastMessageId)||0;
    try{
        const result=await chatdb.findAll({
        where:{
         id:{
            [Op.gt]:lastMessageId
         }
        },
        attributes:['chat','id'],
        include:[{
            model:userdb,
            attributes:['name']
        }],
        order:[['id','ASC']]
    });
        res.status(200).json({status:true,message:'Data fetched from database successfully',MessageData:result});
    }catch(err){
        res.status(500).json({status:false,message:'Error in fetching data from database'});
    }   
}


module.exports={messages,getmessages};
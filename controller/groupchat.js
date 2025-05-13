const groups = require('../models/groups');
const groupmembers = require('../models/groupmembers');
const usersdb = require('../models/user');
const groupchats = require('../models/messages');

const getgroupmessages=async(req,res,next)=>{
    const {groupId}=req.query;
    try{
       const result=await groupchats.findAll({
        where:{groupId},
        attributes:['chat','createdAt'],
        include:[{
            model:usersdb,
            attributes:['name']
        }],
        order:[['createdAt','ASC']]
       })
       res.status(200).json({success:true,result});
    }catch(err){
     res.status(500).json({success:false,Err:err.response});
    }
    
}

const creategroup = async (req, res, next) => {
    const { groupName, users } = req.body;
    try {
        const adminid = req.user.id;
        const groupresult = await groups.create({ name: groupName, userId: adminid });
        const groupId = groupresult.id;
        const membersid = await usersdb.findAll({
            where: {
                email: users
            },
            attributes: ['id']
        })
        const memberusers = [{ userId: adminid, groupId: groupId }];
        membersid.forEach(user => {
            memberusers.push({ userId: user.id, groupId: groupId });
        });
        const membersresult = await groupmembers.bulkCreate(memberusers);
        res.status(201).json({ success: true, 'group': groupresult, 'members': membersresult });
    } catch (err) {
        console.log('error in creating group', err);
    }
}
const groupsadded = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const yourgroups = await groupmembers.findAll({
  where: { userId },
  include: [{
    model: groups,
    attributes: ['id', 'name']
  }],
  attributes:[]
});
        res.status(200).json({ success: true, yourgroups });
    } catch (err) {
        console.log('Error in groupsadded', err);
        res.status(500).json({ err });
    }
}
const groupmessages = async (req, res, next) => {
    const { message, groupId } = req.body;
    const senderId = req.user.id;
    try {
        if (!message || !groupId) {
      return res.status(400).json({ success: false, message: 'Missing message or groupId' });
    }
        const result = await groupchats.create({ chat:message, userId:senderId, groupId });
        res.status(200).json({ success: true, message: 'message send successfull in group!', messagedata: result })
    }catch(err){
        res.status(500).json({success:false,message:'Error in adding chats!!',Err:err});
    }
}

module.exports = { creategroup, groupmessages, groupsadded ,getgroupmessages };
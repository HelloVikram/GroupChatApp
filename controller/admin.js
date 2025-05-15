const groupmemberdb = require('../models/groupmembers');
const userdb = require('../models/user');

const promoteToAdmin = async (req, res, next) => {
    const { groupId, memberId } = req.body;
    try {
        if (!groupId || !memberId) {
            return res.status(400).json({ success: false, message: 'Missing groupId or memberId' });
        }
        const requestingUserId = req.user.id;
        const isAdmin = await groupmemberdb.findOne({
            where: { groupId, userId: requestingUserId, isAdmin: true }
        });
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can perform this action.' });
        }
        const result = await groupmemberdb.update({ isAdmin: true }, { where: { id: memberId, groupId } });
        if (result[0] > 0) {
            res.status(201).json({ success: true, message: 'Member promoted to Admin' });
        }
        else {
            res.status(400).json({ success: false, message: 'Error in promoting' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error in promoting' });
    }
}
const removeUser = async (req, res, next) => {
    const { groupId, memberId } = req.body;
    try {

        if (!groupId || !memberId) {
            return res.status(400).json({ success: false, message: 'Missing groupId or memberId' });
        }
        const requestingUserId = req.user.id;
        const isAdmin = await groupmemberdb.findOne({
            where: { groupId, userId: requestingUserId, isAdmin: true }
        });
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can perform this action.' });
        }

        if (requestingUserId === memberId) {
            return res.status(400).json({ success: false, message: "You can't modify your own admin status." });
        }


        const result = await groupmemberdb.destroy({ where: { id: memberId, groupId } });
        if (result > 0) {
            res.status(201).json({ success: true, message: 'Member removed from group' });
        }
        else {
            res.status(400).json({ success: false, message: 'Error in removing member from group' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error in removing member from group' });
    }
}
const removeAdmin = async (req, res, next) => {
    const { groupId, memberId } = req.body;
    try {
        if (!groupId || !memberId) {
            return res.status(400).json({ success: false, message: 'Missing groupId or memberId' });
        }
        const requestingUserId = req.user.id;
        const isAdmin = await groupmemberdb.findOne({
            where: { groupId, userId: requestingUserId, isAdmin: true }
        });
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can perform this action.' });
        }

        if (requestingUserId === memberId) {
            return res.status(400).json({ success: false, message: "You can't modify your own admin status." });
        }


        const result = await groupmemberdb.update({ isAdmin: false }, { where: { id: memberId, groupId } });
        if (result[0] > 0) {
            res.status(201).json({ success: true, message: 'Member removed from Admin' });
        }
        else {
            res.status(400).json({ success: false, message: 'Error in Removing from admin' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error in removing from admin' });
    }
}
const groupmembers = async (req, res, next) => {
    const  groupId  = req.query.groupId;
    try {
        if (!groupId) {
            return res.status(400).json({ success: false, message: 'Missing groupId' });
        }
        const allmembers = await groupmemberdb.findAll({
            where: { groupId },
            attributes: ['id', 'userId','isAdmin'],
            include: {
                model: userdb,
                attributes: ['name']
            }
        })
        const members = allmembers.map(member => ({
            id: member.id,
            userId: member.userId,
            isAdmin:member.isAdmin,
            name: member.user.name
        }));
        res.status(200).json({ success: true, members })
    } catch (err) {
        res.status(400).json({ success: false, message: 'Error in getting group members' });
    }
}
const addmembers=async(req,res,next)=>{
 const { groupId, users } = req.body;

  if (!groupId ) {
    return res.status(400).json({success:false, message: 'Invalid data' });
  }

  try {
    const isAdmin = await groupmemberdb.findOne({
      where: {
        groupId,
        userId: req.user.id,
        isAdmin: true
      }
    });

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can add members' });
    }

    for (let email of users) {
      const user = await userdb.findOne({ where: { email } });

      if (user) {
        const exists = await groupmemberdb.findOne({
          where: { groupId, userId: user.id }
        });

        if (!exists) {
          await groupmemberdb.create({
            groupId,
            userId: user.id,
            isAdmin: false
          });
        }
      }
    }

    return res.status(200).json({ message: 'Members added successfully' });
  } catch (err) {
    console.error('Error in adding members:', err);
    return res.status(500).json({success:false, message: 'Server error' });
  }
}
module.exports = { promoteToAdmin, removeUser, removeAdmin, groupmembers, addmembers};
const personalchatdb = require('../models/personalChats');
const userdb = require('../models/user');
const { Op } = require('sequelize');

const getUsers = async (req, res, next) => {
    const userId=req.user.id;
    try {
        const result = await userdb.findAll({
            where:{
            id:{
                [Op.ne]:userId
            }
            },
            attributes: ['id', 'name'],
        })
        res.status(201).json({ Users: result });
    } catch (err) {
        res.status(400).json({ error: err })
    }
}

const messages = async (req, res, next) => {
    const { message, receiverId } = req.body;
    const userId = req.user.id;
    try {
        await personalchatdb.create({ senderId: userId, receiverId: receiverId, chat: message });
        res.status(201).json({ success: true, message: 'Message sent!!!' });
    } catch (err) {
        console.log('Error in posting data to database', err);
        res.status(500).json({ success: false, message: 'Error in  adding chat  to database!' });
    }
}
const getmessages = async (req, res, next) => {
    const receiverId = Number(req.query.receiverId);
    const senderId = req.user.id;
    try {
        const result = await personalchatdb.findAll({
            where: {
                [Op.or]: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            attributes: ['chat', 'id', 'senderId'],
            include: [{
                model: userdb,
                as: 'sender',
                attributes: ['name']
            }],
            order: [['id', 'ASC']]
        });
        res.status(200).json({
            status: true,
            message: 'Data fetched from database successfully',
            messageData:result
        });
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error in fetching data from database' });
    }
}


module.exports = { messages, getmessages, getUsers };
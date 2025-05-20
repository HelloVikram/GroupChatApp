const PersonalMessages = require('../models/personalChats');
const ArchivePersonalChats = require('../models/archivechats');
const { Op } = require('sequelize');

const archiveOldPersonalMessages = async () => {
  try {
    // Calculate date 1 day ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find messages older than 1 day
    const oldMessages = await PersonalMessages.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });

    if (oldMessages.length === 0) {
      console.log('No old personal messages to archive.');
      return;
    }

    // Prepare data to bulk insert into archive table
    const archiveData = oldMessages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      chat: msg.chat,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));

    // Insert into archive table
    await ArchivePersonalChats.bulkCreate(archiveData);

    // Delete old messages from original table
    await PersonalMessages.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo
        }
      }
    });

    console.log(`${oldMessages.length} personal messages archived successfully.`);
  } catch (err) {
    console.error('Error archiving personal messages:', err);
  }
};

module.exports = { archiveOldPersonalMessages };

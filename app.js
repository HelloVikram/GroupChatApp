const express = require('express');
require('dotenv').config();

const cron = require('node-cron');
const { archiveOldPersonalMessages } = require('./util/archive');

const db = require('./util/database');
const userroute = require('./routes/user');
const chatapproute = require('./routes/chatapp');
const groupchatroute = require('./routes/groupchat');
const adminrotes = require('./routes/admin');

const chatdb = require('./models/chatapp');
const userdb = require('./models/user');
const groupmembersdb = require('./models/groupmembers');
const groupsdb = require('./models/groups');
const messagesdb = require('./models/messages');
const personalchatsdb = require('./models/personalChats');

const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const path=require('path');

const app = express();
const server = http.createServer(app);

//setup io.socketserver
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ['GET', 'POST']
}));

app.use(express.static(path.join(__dirname,'public')));

cron.schedule('0 1 * * *', () => {
  console.log('Running nightly archive job for personal messages...');
  archiveOldPersonalMessages();
});

userdb.hasMany(chatdb);
chatdb.belongsTo(userdb);

userdb.hasMany(groupsdb);
groupsdb.belongsTo(userdb);

groupmembersdb.belongsTo(userdb);
groupmembersdb.belongsTo(groupsdb);
userdb.hasMany(groupmembersdb);
groupsdb.hasMany(groupmembersdb);

userdb.hasMany(messagesdb);
messagesdb.belongsTo(userdb);
groupsdb.hasMany(messagesdb);
messagesdb.belongsTo(groupsdb);

userdb.hasMany(personalchatsdb, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});
userdb.hasMany(personalchatsdb, {
  foreignKey: 'receiverId',
  as: 'receivedMessages'
});
personalchatsdb.belongsTo(userdb, { foreignKey: 'senderId', as: 'sender' });
personalchatsdb.belongsTo(userdb, { foreignKey: 'receiverId', as: 'receiver' });

app.use(userroute);
app.use(chatapproute);
app.use(groupchatroute);
app.use(adminrotes);


async function database() {
    try {
        await db.sync({ force: false })
        console.log('Database sync successfull!')
    } catch (err) {
        console.log('Error in syncing database', err)
    }
}
database();

//socket.io logic
io.on('connection', socket => {
    console.log('User connected:', socket.id)
    let currentUser = null;
    socket.on('registerUser', (username) => {
        currentUser = username;
        io.emit('userConnected', username);
    });

    socket.on('joinGroup', groupId => {
        socket.join(groupId);
        console.log(`User ${socket.id} joined Group ${groupId}`);
    })

    socket.on('groupMessage', data => {
        io.to(data.groupId).emit('groupMessage', data);
    });

    socket.on('leaveGroup', groupId => {
        console.log(`User ${socket.id} left Group ${groupId}`)
    })

    //for personal chats
    socket.on('registerPersonalUser',userId=>{
        socket.join(userId);
        console.log(`${userId} has joinded personal chat`);
    })

    socket.on('sendPersonalMessage', data => {
    const { senderId, sender, receiverId, message, type } = data;

    // Emit to receiver
    io.to(receiverId).emit('sendPersonalMessage', {
        senderId,
        sender,
        message,
        type
    });

    // Emit back to sender so sender sees their own message immediately
    io.to(senderId).emit('sendPersonalMessage', {
        senderId,
        sender,
        message,
        type
    });

    console.log(`${senderId} sent msg to ${receiverId}`);
});


    socket.on('disconnect', () => {
        if (currentUser) {
            io.emit('userDisconnected', currentUser);
        }
    })

});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/chatselector.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','chatselector.html'))
})

app.get('/groupchat.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','groupchat.html'))
})

app.get('/chatapp.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'chatapp.html'));
});


//start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});
const express=require('express');
require('dotenv').config();
const db=require('./util/database');
const userroute=require('./routes/user');
const chatapproute=require('./routes/chatapp');
const groupchatroute=require('./routes/groupchat');

const chatdb=require('./models/chatapp');
const userdb=require('./models/user');
const groupmembersdb=require('./models/groupmembers');
const groupsdb=require('./models/groups');
const messagesdb=require('./models/messages');

const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors({
    origin:"*",
    methods:['GET','POST']
}));

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

app.use(userroute);
app.use(chatapproute);
app.use(groupchatroute);
async function database() {
    try{
     await db.sync({force:false})
     console.log('Database sync successfull!')
    }catch(err){
        console.log('Error in syncing database',err)
    }
}
database();
app.listen(process.env.PORT);
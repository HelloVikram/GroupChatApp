const express=require('express');
require('dotenv').config();
const db=require('./util/database');
const userroute=require('./routes/user');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors({
    origin:"*",
    methods:['GET','POST']
}));
app.use(userroute);
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

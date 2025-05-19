const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const personalchats=sequelize.define('personalchats',{
id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
},
senderId:{
    type:Sequelize.INTEGER,
    allowNull:false,
},
receiverId:{
    type:Sequelize.INTEGER,
    allowNull:false
    
},
chat:{
    type:Sequelize.STRING,
}
})
module.exports=personalchats;
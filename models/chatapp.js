const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const chatdb=sequelize.define('chatdb',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    chat:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
module.exports=chatdb;
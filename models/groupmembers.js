const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const groupmembers=sequelize.define('groupmembers',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})

module.exports=groupmembers;
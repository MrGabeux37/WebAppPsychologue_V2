const Sequelize =require('sequelize');
const sequelize = require('../models.js')

const Client = sequelize.define('Client',{
  id_client:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  nom:{type:Sequelize.STRING},
  prenom:{type:Sequelize.STRING},
  permission:{
    type:Sequelize.BOOLEAN,
    defaultValue: false
  }
},{
  tableName:'client',
  timestamps: false,
});


Client.sync();

module.exports=Client

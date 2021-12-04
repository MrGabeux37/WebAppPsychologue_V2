const Sequelize =require('sequelize');
const sequelize = require('../models.js');
const Client = require('../models/client.js');

const Contact = sequelize.define('Contact',{
  ID_Contact:{
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true
  },
  Nom:{type:Sequelize.STRING},
  Prenom:{type:Sequelize.STRING},
  Num_Tel:{type:Sequelize.STRING},
  Email:{
    type:Sequelize.STRING,
    alowNull:false,
    validate:{isEmail:true},
    unique: true
  },
  Mot_Passe:{
    type:Sequelize.STRING,
    allowNull:true
  },
  Email_Extra1:{
    type:Sequelize.STRING,
    alowNull:true,
    validate:{isEmail:true},
    unique: true
  },
  Email_Extra2:{
    type:Sequelize.STRING,
    alowNull:true,
    validate:{isEmail:true},
    unique: true
  },
  Email_Extra3:{
    type:Sequelize.STRING,
    alowNull:true,
    validate:{isEmail:true},
    unique: true
  },
  Client:{
    type:Sequelize.INTEGER,
    allowNull:false,
    references:{
      model:Client,
      key:'id_client'
    }
  }
},{
  tableName:'Contact',
  timestamps: false,
});



Contact.sync();

module.exports=Contact

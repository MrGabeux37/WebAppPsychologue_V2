const Sequelize =require('sequelize');
const sequelize = require('../models.js');
const Client = require('../models/client.js');

validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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
    allowNull:false,
    validate:{isEmail:true},
    unique: true
  },
  Mot_Passe:{
    type:Sequelize.STRING,
    allowNull:true
  },
  Email_Extra1:{
    type:Sequelize.STRING,
    allowNull:true,
    validate:{
      isEmailOrEmpty(val, next) {
        if (!val || val === "" || validateEmail(val)) {
          return next()
        }
        else {
          return next('email is invalid')
        }
      }
    },
    unique: true
  },
  Email_Extra2:{
    type:Sequelize.STRING,
    allowNull:true,
    validate:{
      isEmailOrEmpty(val, next) {
        if (!val || val === "" || validateEmail(val)) {
          return next()
        }
        else {
          return next('email is invalid')
        }
      }
    },
    unique: true
  },
  Email_Extra3:{
    type:Sequelize.STRING,
    allowNull:true,
    validate:{
      isEmailOrEmpty(val, next) {
        if (!val || val === "" || validateEmail(val)) {
          return next()
        }
        else {
          return next('email is invalid')
        }
      }
    },
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

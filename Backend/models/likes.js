const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Like = db.define("Likes", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  edu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }});

module.exports = Like;

const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Session = db.define("Sessions", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Session;

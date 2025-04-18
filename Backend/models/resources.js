const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Resource = db.define("Resources", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.STRING,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Resource;

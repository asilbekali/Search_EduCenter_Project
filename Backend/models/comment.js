const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Comments = db.define("Comments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  edu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Comments;

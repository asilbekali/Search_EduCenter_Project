const { db } = require("../config/db");
const { DataTypes } = require("sequelize");

const EduCenter_Subject = db.define("EduCenter_Subject", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  edu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = EduCenter_Subject;

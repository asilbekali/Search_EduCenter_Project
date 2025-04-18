const { db } = require("../config/db");
const { DataTypes } = require("sequelize");

const EduCenter_Field = db.define("EduCenter_Field", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  edu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  field_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = EduCenter_Field;

const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const courseRegistration = db.define("courseRegistration", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = courseRegistration;

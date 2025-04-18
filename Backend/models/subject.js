const { DataTypes } = require("sequelize");
const { db } = require("../config/db");

const Subjet = db.define("Subject", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Subjet;

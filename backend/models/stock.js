import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";

export const Stock = sequelize.define("Stock", {
    ticker: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(2000),
        allowNull: false
    },
    sector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

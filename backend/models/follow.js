import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Stock } from "./stock.js";

export const Follow = sequelize.define("Follow", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

User.belongsToMany(Stock, { through: Follow });
Stock.belongsToMany(User, { through: Follow });
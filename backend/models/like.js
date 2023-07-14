import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Stock } from "./stock.js";

export const Like = sequelize.define("Like", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

User.belongsToMany(Stock, { through: Like });
Stock.belongsToMany(User, { through: Like });
Like.belongsTo(Stock);
Stock.hasMany(Like);
Like.belongsTo(User);
User.hasMany(Like);
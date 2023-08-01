import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Stock } from "./stock.js";

export const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING(2000),
        allowNull: false
    }
});

Comment.belongsTo(User);
Comment.belongsTo(Stock);
User.hasMany(Comment);
Stock.hasMany(Comment);

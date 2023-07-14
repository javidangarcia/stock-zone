import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Stock } from "./stock.js";

export const Dislike = sequelize.define("Dislike", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

User.belongsToMany(Stock, { through: Dislike });
Stock.belongsToMany(User, { through: Dislike });
Dislike.belongsTo(Stock);
Stock.hasMany(Dislike);
Dislike.belongsTo(User);
User.hasMany(Dislike);
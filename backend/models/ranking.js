import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";

export const Ranking = sequelize.define('Ranking', {
    ranking: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false,
        unique: false
    }
});

Ranking.belongsTo(User, { foreignKey: 'UserId' });
User.hasOne(Ranking, { foreignKey: 'UserId' });
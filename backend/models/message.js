import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";

export const Message = sequelize.define("Message", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    room: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    content: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        unique: false
    },
    UserId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    },
    UserId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id"
        }
    }
});

User.hasMany(Message, {
    foreignKey: "UserId1",
    as: "sentMessages"
});
User.hasMany(Message, {
    foreignKey: "UserId2",
    as: "receivedMessages"
});

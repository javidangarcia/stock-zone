import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "../models/user.js";

export const Post = sequelize.define("Post", {
    title: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        unique: false
    },
    content: {
        type: DataTypes.STRING(2000),
        allowNull: false,
        unique: false
    }
});

Post.belongsTo(User);
User.hasMany(Post);

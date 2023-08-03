import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";
import { Post } from "./post.js";

export const PostComment = sequelize.define("PostComment", {
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

PostComment.belongsTo(User);
PostComment.belongsTo(Post);
User.hasMany(PostComment);
Post.hasMany(PostComment);

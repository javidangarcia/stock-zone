import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { User } from "./user.js";

export const Friend = sequelize.define("Friend", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

User.belongsToMany(User, {
    through: Friend,
    as: "user1",
    foreignKey: "UserId1",
    otherKey: "UserId2"
});
User.belongsToMany(User, {
    through: Friend,
    as: "user2",
    foreignKey: "UserId2",
    otherKey: "UserId1"
});
User.hasMany(Friend, { foreignKey: "UserId1" });
User.hasMany(Friend, { foreignKey: "UserId2" });
Friend.belongsTo(User, { foreignKey: "UserId1", as: "user1" });
Friend.belongsTo(User, { foreignKey: "UserId2", as: "user2" });

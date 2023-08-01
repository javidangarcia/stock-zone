import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { User } from "./models/user.js";
import { sequelize } from "./database.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const userData = JSON.parse(
    fs.readFileSync(path.resolve(dirname, "./seeders/users.json"), "utf8")
);

const seedDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });

        const usersWithHashedPasswords = await Promise.all(
            userData.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword };
            })
        );

        await User.bulkCreate(usersWithHashedPasswords);
        console.log("User data has been seeded!");
    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await sequelize.close();
    }
};

seedDatabase();

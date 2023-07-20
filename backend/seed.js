import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { User } from "./models/user.js";
import { sequelize } from "./database.js";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./seeders/users.json"), "utf8")
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

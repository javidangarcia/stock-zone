import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    user: process.env.POSTGRES_USER || "postgres",
    host: "postgres",
    database: process.env.POSTGRES_DB || "stockzone",
    password: process.env.POSTGRES_PASSWORD || "awesome",
    port: process.env.POSTGRES_PORT || 5432,
});

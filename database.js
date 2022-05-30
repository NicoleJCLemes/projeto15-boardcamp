import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const database = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "#2688Nicole",
    database: "boardcamp"
    //connectionString: process.env.DATABASE_URL
});

export default database
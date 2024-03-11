import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: './.env'})

const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 3306
})

export default connection;
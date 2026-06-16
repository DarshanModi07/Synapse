import dotenv from "dotenv";

dotenv.config({
    path:"./backend/.env"
})

console.log(process.env.DATABASE_URL);

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { configDotenv } from "dotenv";

const { Pool } = pg;

console.log(process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

export default prisma;
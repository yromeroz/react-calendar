import { drizzle } from "drizzle-orm/mysql2";
import { config } from "dotenv";
import mysql from "mysql2/promise";
import * as schema from './schema'

config({ path: ".env" }); // or .env.local

const pool = mysql.createPool(process.env.DATABASE_URL as string);
export const db = drizzle(pool, { schema, mode: "default" });
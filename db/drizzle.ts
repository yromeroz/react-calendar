// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/mysql2";
import { config } from "dotenv";
import mysql from "mysql2/promise";
// import * as schema from './schema'

config({ path: ".env" }); // or .env.local

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, {schema});
const pool = mysql.createPool(process.env.DATABASE_URL as string);
export const db = drizzle(pool);
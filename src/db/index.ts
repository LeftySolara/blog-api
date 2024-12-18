import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const dbURL = process.env.DATABASE_URL;
if (!dbURL) {
  throw new Error("Invalid database URL");
}

const db = drizzle(dbURL);

export default db;

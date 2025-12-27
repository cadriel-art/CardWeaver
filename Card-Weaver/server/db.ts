import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "DATABASE_URL is not set. Falling back to in-memory storage for this session.",
  );
}

export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : null;
export const db = pool ? drizzle(pool, { schema }) : null;

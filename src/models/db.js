import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load SSL certificate
const sslCertPath = path.join(__dirname, "../../bin/byuicse-psql-cert.pem");

// export the CA cert so other files (server.js session store) can use it
const caCert = fs.readFileSync(sslCertPath).toString();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    ca: caCert,
  },
});

const ENABLE_SQL_LOGGING = process.env.ENABLE_SQL_LOGGING === "true";

export async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    if (ENABLE_SQL_LOGGING) {
      console.log("Executed query:", {
        text,
        duration: `${Date.now() - start}ms`,
        rows: result.rowCount,
      });
    }
    return result;
  } catch (err) {
    console.error("Error in query:", { text, error: err.message });
    throw err;
  }
}

export async function testConnection() {
  const result = await query("SELECT NOW() as current_time");
  console.log("Database connection successful:", result.rows[0].current_time);
}

export { caCert };

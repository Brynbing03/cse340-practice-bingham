import { query } from "../db.js";

const emailExists = async (email) => {
  const sql = `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1) as exists`;
  const result = await query(sql, [email]);
  return result.rows[0].exists;
};

const saveUser = async (name, email, hashedPassword) => {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const result = await query(sql, [name, email, hashedPassword]);
  return result.rows[0];
};

const getAllUsers = async () => {
  const sql = `
    SELECT id, name, email, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};

export { emailExists, saveUser, getAllUsers };

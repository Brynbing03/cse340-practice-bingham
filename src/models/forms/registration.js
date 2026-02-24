import { query } from "../db.js";

// checks if an email address is already registered in the db
const emailExists = async (email) => {
  const sql = `
    SELECT EXISTS(
      SELECT 1 FROM users WHERE email = $1
    ) as exists
  `;
  const result = await query(sql, [email]);
  return result.rows[0]?.exists === true;
};

// saves a new user to the database with a hashed password
const saveUser = async (name, email, hashedPassword) => {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const result = await query(sql, [name, email, hashedPassword]);
  return result.rows[0];
};

// retrieves all registered users with role information
const getAllUsers = async () => {
  const sql = `
    SELECT 
      users.id,
      users.name,
      users.email,
      users.created_at,
      roles.role_name AS "roleName"
    FROM users
    INNER JOIN roles ON users.role_id = roles.id
    ORDER BY users.created_at DESC
  `;
  const result = await query(sql);
  return result.rows;
};

// retrieve a single user by id with role information
const getUserById = async (id) => {
  const sql = `
    SELECT 
      users.id,
      users.name,
      users.email,
      users.created_at,
      roles.role_name AS "roleName"
    FROM users
    INNER JOIN roles ON users.role_id = roles.id
    WHERE users.id = $1
  `;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
};

// this updates a users name and email
const updateUser = async (id, name, email) => {
  const sql = `
    UPDATE users
    SET name = $1,
        email = $2,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING id, name, email, updated_at
  `;
  const result = await query(sql, [name, email, id]);
  return result.rows[0] || null;
};

// this deletes a user account
const deleteUser = async (id) => {
  const sql = `DELETE FROM users WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rowCount > 0;
};

export {
  emailExists,
  saveUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
import bcrypt from "bcrypt";
import { query } from "../db.js";

/**
 * this finds a user by email for login verification
 * now also joins roles so we get roleName
 *
 * @param {string} email this is the email address to search for
 * @returns {Promise<Object|null>} user object with password hash or null if not found
 */
const findUserByEmail = async (email) => {
  const sql = `
    SELECT 
      users.id,
      users.name,
      users.email,
      users.password,
      users.created_at,
      roles.role_name AS "roleName"
    FROM users
    INNER JOIN roles ON users.role_id = roles.id
    WHERE LOWER(users.email) = LOWER($1)
    LIMIT 1
  `;

  const result = await query(sql, [email]);
  return result.rows[0] || null;
};

/**
 * this verifys a plain text password against a stored bcrypt hash
 *
 * @param {string} plainPassword the password to verify
 * @param {string} hashedPassword the stored password hash
 * @returns {Promise<boolean>} true if password matches, false otherwise
 */
const verifyPassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

export { findUserByEmail, verifyPassword };
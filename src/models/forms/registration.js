import { query } from "../db.js";
/**this checks if an email address is already registered in the db
 * @param {string} email - the email address to check
 * @returns {Promise<boolean>} it is true if the email exists but false is otherwise
 */
const emailExists = async (email) => {
  const sql = `
    SELECT EXISTS(
      SELECT 1 FROM users WHERE email = $1
    ) as exists
  `;
  const result = await query(sql, [email]);
  return result.rows[0]?.exists === true;
};

/**this saves a new user to the database with a hashed password keeping it secret
 *
 * @param {string} name user's full name
 * @param {string} email user's email address
 * @param {string} hashedPassword the bcrypt-hashed password
 * @returns {Promise<Object>} the newly created user record, without password
 */
const saveUser = async (name, email, hashedPassword) => {
  const sql = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const result = await query(sql, [name, email, hashedPassword]);
  return result.rows[0];
};

/**this retrieves all registered users from the database
 *
 * @returns {Promise<Array>} this is an array of user records, without passwords
 */
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

import { query } from "../db.js";

const createContactForm = async (subject, message) => {
  const sql = `
    INSERT INTO contact_form (subject, message)
    VALUES ($1, $2)
    RETURNING id, subject, message, submitted
  `;
  const result = await query(sql, [subject, message]);
  return result.rows[0];
};

const getAllContactForms = async () => {
  const sql = `
    SELECT id, subject, message, submitted
    FROM contact_form
    ORDER BY submitted DESC
  `;
  const result = await query(sql);
  return result.rows;
};

export { createContactForm, getAllContactForms };

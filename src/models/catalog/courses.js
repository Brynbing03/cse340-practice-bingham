import { query } from "../db.js";

function toCourse(row) {
  return {
    courseCode: row.course_code,
    name: row.name,
    creditHours: row.credit_hours,
    department: row.department,
    slug: row.slug,
  };
}

export async function getAllCourses() {
  const result = await query(
    `SELECT course_code, name, credit_hours, department, slug
     FROM courses
     ORDER BY course_code ASC`
  );
  return result.rows.map(toCourse);
}

export async function getCourseBySlug(slug) {
  const result = await query(
    `SELECT course_code, name, credit_hours, department, slug
     FROM courses
     WHERE slug = $1
     LIMIT 1`,
    [slug]
  );

  if (result.rows.length === 0) return {};
  return toCourse(result.rows[0]);
}

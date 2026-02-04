import { query } from "../db.js";

function toSection(row) {
  return {
    courseCode: row.course_code,
    courseName: row.course_name,
    professor: row.professor,
    professorSlug: row.professor_slug,
    time: row.time,
    room: row.room,
  };
}

export async function getSectionsByCourseSlug(courseSlug, sortBy = "time") {
  const allowedSorts = {
    time: "time",
    professor: "professor",
    room: "room",
  };

  const sortColumn = allowedSorts[sortBy] || "time";

  // safe because sortColumn is only ever from allowedSorts
  const result = await query(
    `SELECT course_code, course_name, professor, professor_slug, time, room
     FROM sections
     WHERE course_slug = $1
     ORDER BY ${sortColumn} ASC`,
    [courseSlug]
  );

  return result.rows.map(toSection);
}

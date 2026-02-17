import { query, testConnection } from "./db.js";
//adding these for building your first form:contact us assignment
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupDatabase() {
  //check if faculty table has data
  try {
    const check = await query(
      "SELECT EXISTS (SELECT 1 FROM faculty LIMIT 1) AS has_data"
    );

    if (check.rows[0].has_data) {
      return;
    }
  } catch {
    // table probably doesn't exist yet — continue to setup
  }

  console.log("Seeding database...");

  await query(`
    CREATE TABLE IF NOT EXISTS faculty (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      title TEXT NOT NULL,
      office TEXT,
      phone TEXT,
      email TEXT
    );

    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      course_code TEXT NOT NULL,
      name TEXT NOT NULL,
      credit_hours INTEGER NOT NULL,
      department TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      course_slug TEXT NOT NULL,
      course_code TEXT NOT NULL,
      course_name TEXT NOT NULL,
      professor TEXT NOT NULL,
      professor_slug TEXT NOT NULL,
      time TEXT NOT NULL,
      room TEXT NOT NULL
    );
  `);

  await query(`
    INSERT INTO faculty (first_name, last_name, name, slug, department, title, office, phone, email)
    VALUES
      ('Nathan', 'Jack', 'Nathan Jack', 'nathan-jack', 'Computer Science', 'Associate Professor', 'STC 392', '208-496-1234', 'jackb@byui.edu'),
      ('Sarah', 'Enkey', 'Sarah Enkey', 'sarah-enkey', 'Computer Science', 'Assistant Professor', 'STC 394', '208-496-2345', 'enkeys@byui.edu'),
      ('Brad', 'Keers', 'Brad Keers', 'brad-keers', 'Computer Science', 'Professor', 'STC 390', '208-496-3456', 'keersb@byui.edu')
    ON CONFLICT DO NOTHING;
  `);

  await query(`
    INSERT INTO courses (course_code, name, credit_hours, department, slug)
    VALUES
      ('CSE 110', 'Introduction to Programming', 3, 'Computer Science', 'cse-110'),
      ('CSE 121', 'Object-Oriented Programming', 3, 'Computer Science', 'cse-121'),
      ('CSE 340', 'Web Backend Development', 3, 'Computer Science', 'cse-340')
    ON CONFLICT DO NOTHING;
  `);

  await query(`
    INSERT INTO sections (course_slug, course_code, course_name, professor, professor_slug, time, room)
    VALUES
      ('cse-110', 'CSE 110', 'Introduction to Programming', 'Nathan Jack', 'nathan-jack', 'MWF 10:00–10:50', 'STC 353'),
      ('cse-110', 'CSE 110', 'Introduction to Programming', 'Brad Keers', 'brad-keers', 'TR 12:30–1:45', 'STC 355'),
      ('cse-340', 'CSE 340', 'Web Backend Development', 'Nathan Jack', 'nathan-jack', 'MWF 1:00–1:50', 'STC 349')
    ON CONFLICT DO NOTHING;
  `);

  //run practice.sql if it exists (for assignment only...)
  const practicePath = path.join(__dirname, "sql", "practice.sql");
  if (fs.existsSync(practicePath)) {
    const practiceSQL = fs.readFileSync(practicePath, "utf8");
    await query(practiceSQL);
    console.log("Practice database tables initialized");
  }

  console.log("Database seeded successfully");
}

export { testConnection };

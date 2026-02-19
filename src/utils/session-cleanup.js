import { query } from "../models/db.js";

// this removes expired sessions from the database and in production this would normally use cron job
const cleanupExpiredSessions = async () => {
  try {
    const result = await query(`DELETE FROM session WHERE expire < NOW()`);
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired sessions`);
    }
  } catch (error) {
    //session table missing
    if (error.code === "42P01") {
      console.log(
        "Session table does not exist yet:\n→ It will be created when the first session is initialized."
      );
      return;
    }
    console.error("Error cleaning up sessions:", error);
  }
};

// this starts auto session cleanup that runs every 12 hrs... it runs immediately on startup to handle any sessions that expired while the server was online... 
const startSessionCleanup = () => {
  cleanupExpiredSessions();

  const twelveHours = 12 * 60 * 60 * 1000;
  setInterval(cleanupExpiredSessions, twelveHours);

  console.log("Session cleanup scheduled to run every 12 hours");
};

export { startSessionCleanup };

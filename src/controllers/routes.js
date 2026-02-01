import { Router } from "express";

import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage, studentPage } from "./index.js";

// here is my import for the faculty challenge
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";


const router = Router();

// routes for the home and basic chill pages
router.get("/", homePage);
router.get("/about", aboutPage);
router.get("/student", studentPage);


//course catalog routes
router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);

//the demo page with special middleware
router.get("/demo", addDemoHeaders, demoPage);

//route to set off a test error
router.get("/test-error", testErrorPage);

// factulty challenge routes
router.get("/faculty", facultyListPage);
router.get("/faculty/:facultyId", facultyDetailPage);


export default router;

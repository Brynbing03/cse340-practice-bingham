import contactRoutes from "./forms/contact.js";

import { Router } from "express";

import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage, studentPage } from "./index.js";

// this is for the registration system assignment
import registrationRoutes from "./forms/registration.js";

//here is my import for the faculty challenge
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";
//login imports
import loginRoutes, { processLogout, showDashboard } from "./forms/login.js";
import { requireLogin } from "../middleware/auth.js";


const router = Router();

//this adds catalog-specific styles to all catalog routes
router.use("/catalog", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

//this adds faculty-specific styles to all of the faculty routes
router.use("/faculty", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

//i added contact-specific styles to all contact routes for that contact us first form assignment
router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

//this adds registration-specific styles to all registration routes
router.use("/register", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
  next();
});

//this is for to add middleware do longin.css loads only on the login pg
router.use("/login", (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
  });
  

// routes for the home and basic chill pages
router.get("/", homePage);
router.get("/about", aboutPage);
router.get("/student", studentPage);

// course catalog routes
router.get("/catalog", catalogPage);
router.get("/catalog/:slugId", courseDetailPage);

// the demo page with special middleware
router.get("/demo", addDemoHeaders, demoPage);

//route to set off a test error
router.get("/test-error", testErrorPage);

//factulty challenge routes
router.get("/faculty", facultyListPage);
router.get("/faculty/:slugId", facultyDetailPage);

//this is the contact form routes
router.use("/contact", contactRoutes);

//this is the registration routes
router.use("/register", registrationRoutes);

//login routes
router.use("/login", loginRoutes);
router.get("/logout", processLogout);
router.get("/dashboard", requireLogin, showDashboard);


export default router;

import { body, validationResult } from "express-validator";
import { findUserByEmail, verifyPassword } from "../../models/forms/login.js";
import { Router } from "express";

const router = Router();

//these are the validatio rules for the login form
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password is required"),
];

//this displays the login form
const showLoginForm = (req, res) => {
  res.render("forms/login/form", {
    title: "User Login",
  });
};

//this works it and processes the login form submision from the user
const processLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // show each validation error to the user
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/login");
  }

  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    // security: do not reveal if email exists or not
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    const valid = await verifyPassword(password, user.password);
    // security: same exact message for wrong password
    if (!valid) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/login");
    }

    //i did this for SECURITY:it removes the password before storing in session
    delete user.password;

    req.session.user = user;

    // make sure session is saved before redirect (helps with DB session stores)
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        req.flash("error", "Login failed. Please try again.");
        return res.redirect("/login");
      }

      // success message (personalized)
      const name = user.name || "there";
      req.flash("success", `Welcome back, ${name}!`);
      return res.redirect("/dashboard");
    });
  } catch (error) {
    console.error("Error processing login:", error);
    req.flash("error", "Unable to log in right now. Please try again later.");
    return res.redirect("/login");
  }
};

//this handles the user logout
const processLogout = (req, res) => {
  if (!req.session) {
    return res.redirect("/");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.clearCookie("connect.sid");
      return res.redirect("/");
    }

    res.clearCookie("connect.sid");

    // optional but super nice: confirm logout worked
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
};

//this displays protected dashboad haha that means you have to login
const showDashboard = (req, res) => {
  const user = req.session.user;
  const sessionData = req.session;

  //this is the security check! make sure that the user and sessionData do not contain password field
  if (user && user.password) {
    console.error("Security error: password found in user object");
    delete user.password;
  }
  if (sessionData.user && sessionData.user.password) {
    console.error("Security error: password found in sessionData.user");
    delete sessionData.user.password;
  }

  res.render("dashboard", {
    title: "Dashboard",
    user,
    sessionData,
  });
};

//routes
router.get("/", showLoginForm);
router.post("/", loginValidation, processLogin);

//this exports router as default, and specific functions for root level routes
export default router;
export { processLogout, showDashboard };
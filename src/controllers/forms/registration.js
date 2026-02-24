import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { emailExists, saveUser, getAllUsers } from "../../models/forms/registration.js";

const router = Router();

// these are the RULES! for user registration
const registrationValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, hyphens, and apostrophes"),

  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),

  body("emailConfirm")
    .trim()
    .custom((value, { req }) => value === req.body.email)
    .withMessage("Email addresses must match"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character"),

  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

// this is the registration form page heck yeah
const showRegistrationForm = (req, res) => {
  res.render("forms/registration/form", {
    title: "User Registration",
  });
};

// this handles user registration with validation and pasword hashing
const processRegistration = async (req, res) => {
  console.log("POST /register received");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // show each validation error to the user
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/register");
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    console.error("Missing required registration fields");
    req.flash("error", "Please fill out all required fields.");
    return res.redirect("/register");
  }

  try {
    const exists = await emailExists(email);
    if (exists) {
      // not an error exactly, but the user needs to know
      req.flash(
        "warning",
        "An account with that email already exists. Try logging in instead."
      );
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await saveUser(name, email, hashedPassword);
    console.log("User registered successfully:", {
      id: newUser.id,
      email: newUser.email,
    });

    // success message + redirect to login (so everyone can see it)
    req.flash("success", "Registration complete! You can now log in.");
    return res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash("error", "Unable to register right now. Please try again later.");
    return res.redirect("/register");
  }
};

// this displays all of the registered users
const showAllUsers = async (req, res) => {
  let users = [];
  try {
    users = await getAllUsers();
  } catch (error) {
    console.error("Error retrieving users:", error);
  }

  res.render("forms/registration/list", {
    title: "Registered Users",
    users,
  });
};

//these are the routes
router.get("/", showRegistrationForm);
router.post("/", registrationValidation, processRegistration);
router.get("/list", showAllUsers);

export default router;
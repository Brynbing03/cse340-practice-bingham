import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { emailExists, saveUser, getAllUsers } from "../../models/forms/registration.js";

const router = Router();

// these are the RULES! for user registration 
const registrationValidation = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Must be a valid email address"),
  body("emailConfirm")
    .trim()
    .custom((value, { req }) => value === req.body.email)
    .withMessage("Email addresses must match"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),
  body("passwordConfirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords must match"),
];

// this is the registration form page heck yeah
const showRegistrationForm = (req, res) => {
  res.render("forms/registration/form", { 
    title: "User Registration" });
};

// this handles user registration with validation and pasword hashing
const processRegistration = async (req, res) => {
    console.log("POST /register received");
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("Registration validation errors:", errors.array());
    return res.redirect("/register");
  }

  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  if (!name || !email || !password) {
    console.error("Missing required registration fields");
    return res.redirect("/register");
  }

  try {
    const exists = await emailExists(email);
    if (exists) {
      console.log("Email already registered");
      return res.redirect("/register");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await saveUser(name, email, hashedPassword);
    console.log("User registered successfully:", { id: newUser.id, email: newUser.email });
    return res.redirect("/register/list");
  } catch (error) {
    console.error("Error registering user:", error);
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

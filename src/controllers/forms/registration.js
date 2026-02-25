import { Router } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

import {
  emailExists,
  saveUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../../models/forms/registration.js";

import { requireLogin } from "../../middleware/auth.js";
import {
  registrationValidation,
  updateAccountValidation,
} from "../../middleware/validation/forms.js";

const router = Router();

// this is the registration form page
const showRegistrationForm = (req, res) => {
  res.render("forms/registration/form", {
    title: "User Registration",
  });
};

// this handles user registration with validation + password hashing
const processRegistration = async (req, res) => {
  console.log("POST /register received");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash("error", error.msg));
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

    req.flash("success", "Registration complete! You can now log in.");
    return res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash("error", "Unable to register right now. Please try again later.");
    return res.redirect("/register");
  }
};

// show all registered users
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
    user: req.session && req.session.user ? req.session.user : null,
  });
};

// show edit account form
const showEditAccountForm = async (req, res) => {
  const targetUserId = parseInt(req.params.id, 10);
  const currentUser = req.session.user;

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    req.flash("error", "User not found.");
    return res.redirect("/register/list");
  }

  const canEdit =
    currentUser.id === targetUserId || currentUser.roleName === "admin";

  if (!canEdit) {
    req.flash("error", "You do not have permission to edit this account.");
    return res.redirect("/register/list");
  }

  res.render("forms/registration/edit", {
    title: "Edit Account",
    user: targetUser,
  });
};

// process edit account
const processEditAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => req.flash("error", error.msg));
    return res.redirect(`/register/${req.params.id}/edit`);
  }

  const targetUserId = parseInt(req.params.id, 10);
  const currentUser = req.session.user;
  const { name, email } = req.body;

  try {
    const targetUser = await getUserById(targetUserId);
    if (!targetUser) {
      req.flash("error", "User not found.");
      return res.redirect("/register/list");
    }

    const canEdit =
      currentUser.id === targetUserId || currentUser.roleName === "admin";

    if (!canEdit) {
      req.flash("error", "You do not have permission to edit this account.");
      return res.redirect("/register/list");
    }

    const emailTaken = await emailExists(email);
    if (emailTaken && targetUser.email !== email) {
      req.flash("error", "An account with this email already exists.");
      return res.redirect(`/register/${targetUserId}/edit`);
    }

    await updateUser(targetUserId, name, email);

    if (currentUser.id === targetUserId) {
      req.session.user.name = name;
      req.session.user.email = email;
    }

    req.flash("success", "Account updated successfully.");
    return res.redirect("/register/list");
  } catch (error) {
    console.error("Error updating account:", error);
    req.flash("error", "An error occurred while updating the account.");
    return res.redirect(`/register/${targetUserId}/edit`);
  }
};

// process delete account
const processDeleteAccount = async (req, res) => {
  const targetUserId = parseInt(req.params.id, 10);
  const currentUser = req.session.user;

  if (currentUser.roleName !== "admin") {
    req.flash("error", "You do not have permission to delete accounts.");
    return res.redirect("/register/list");
  }

  if (currentUser.id === targetUserId) {
    req.flash("error", "You cannot delete your own account.");
    return res.redirect("/register/list");
  }

  try {
    const deleted = await deleteUser(targetUserId);
    if (deleted) req.flash("success", "User account deleted successfully.");
    else req.flash("error", "User not found or already deleted.");
  } catch (error) {
    console.error("Error deleting user:", error);
    req.flash("error", "An error occurred while deleting the account.");
  }

  return res.redirect("/register/list");
};

// routes
router.get("/", showRegistrationForm);
router.post("/", registrationValidation, processRegistration);

router.get("/list", showAllUsers);

router.get("/:id/edit", requireLogin, showEditAccountForm);
router.post("/:id/edit", requireLogin, updateAccountValidation, processEditAccount);

router.post("/:id/delete", requireLogin, processDeleteAccount);

export default router;
import { Router } from "express";
import { body, validationResult } from "express-validator";
import { createContactForm, getAllContactForms } from "../../models/forms/contact.js";

const router = Router();

// this displays that form contact form
const showContactForm = (req, res) => {
  res.render("forms/contact/form", {
    title: "Contact Us",
  });
};

// this handles contact form submisions with validation
const handleContactSubmission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // flash each validation error so the user can see it
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/contact");
  }

  const { subject, message } = req.body;

  try {
    await createContactForm(subject, message);

    // success message for the user
    req.flash("success", "Thank you for contacting us! We will respond soon.");
    return res.redirect("/contact");
  } catch (error) {
    // keep server log for debugging
    console.error("Error saving contact form:", error);

    // user-friendly message
    req.flash("error", "Unable to submit your message. Please try again later.");
    return res.redirect("/contact");
  }
};

// this displays all contact form submissions
const showContactResponses = async (req, res) => {
  let contactForms = [];
  try {
    contactForms = await getAllContactForms();
  } catch (error) {
    console.error("Error retrieving contact forms:", error);
  }

  res.render("forms/contact/responses", {
    title: "Contact Form Submissions",
    contactForms,
  });
};

// GET /contact
router.get("/", showContactForm);

// POST /contact
router.post(
  "/",
  [
    body("subject")
      .trim()
      .isLength({ min: 2, max: 255 })
      .withMessage("Subject must be between 2 and 255 characters")
      .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
      .withMessage("Subject contains invalid characters"),
    body("message")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Message must be between 10 and 2000 characters")
      .custom((value) => {
        // spam check: too many repeated words
        const words = value.split(/\s+/);
        const uniqueWords = new Set(words);

        if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
          throw new Error("Message appears to be spam");
        }

        return true;
      }),
  ],
  handleContactSubmission
);

// GET /contact/responses
router.get("/responses", showContactResponses);

export default router;
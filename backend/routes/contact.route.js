import express from "express";
import { createContact } from "../controllers/contact.controller.js";
import { contactRateLimiter } from "../middlewares/rateLimit.js";
import {
  contactValidationRules,
  validateContact,
} from "../middlewares/sanitize.js";

const router = express.Router();

// POST /api/contact - Create new contact submission
router.post(
  "/",
  contactRateLimiter,
  contactValidationRules,
  validateContact,
  createContact,
);

export default router;

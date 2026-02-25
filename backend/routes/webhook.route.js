import express from "express";
import { clerkWebhook } from "../controllers/webhook.controller.js";
import bodyParser from "body-parser";

const router = express.Router();

// Clerk webhook endpoint
// IMPORTANT: Uses bodyParser.raw() to preserve raw body as Buffer
// This is required for Svix signature verification - parsed JSON won't work
router.post(
  "/clerk",
  bodyParser.raw({ type: "application/json" }),
  clerkWebhook,
);

export default router;

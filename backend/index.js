import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import connectDB from "./lib/connectDB.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import cors from "cors";

const app = express();

// Enable CORS for client requests
app.use(cors(process.env.CLIENT_URL));

// CRITICAL: Webhook route MUST come BEFORE express.json() middleware
// Webhooks need raw body for signature verification, but express.json()
// transforms the body into a parsed object, breaking verification
app.use("/webhooks", webhookRouter);

// Parse JSON bodies for all other routes
app.use(express.json());

// Apply Clerk authentication middleware to all routes (except webhooks above)
app.use(clerkMiddleware());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// app.get("/test", (req, res) => {
//   res.status(200).send("It works!");
// });

// app.get("/auth-state", (req, res) => {
//   const authState = req.auth;
//   res.json({ authState });
// });

// app.get("/protect", (req, res) => {
//   const { userId } = req.auth;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   res.status(200).json("content for authenticated users only");
// });

app.get("/protect2", requireAuth(), (req, res) => {
  res.status(200).json("content for authenticated users only");
});

app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Internal Server Error",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});

// export default router;

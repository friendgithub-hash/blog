import express from "express";
import {
  getPosts,
  getPost,
  getPostById,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
  updatePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.get("/id/:id", getPostById);

router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);

export default router;

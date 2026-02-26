// FIXED: Corrected import path - file is comment.model.js (lowercase), not Comment.model.js
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const getPostComments = async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });
  res.status(200).json(comments);
};

export const addComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.postId;

  // Check if user is authenticated via Clerk
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  // Find user in MongoDB by their Clerk ID
  let user = await User.findOne({ clerkUserId });

  // FIXED: Fallback user creation if webhook failed (same as createPost)
  // This prevents "user not found" errors when commenting
  if (!user) {
    console.log("[addComment] User not found in DB, creating fallback user");

    // Get user info from Clerk session claims
    const userInfo = req.auth.sessionClaims;

    // FIXED: Log session claims to see what's available
    console.log(
      "[addComment] Clerk session claims:",
      JSON.stringify(userInfo, null, 2),
    );

    // FIXED: Extract username from Clerk session - try multiple sources
    const username =
      userInfo.username ||
      userInfo.email?.split("@")[0] ||
      userInfo.sub?.split("_")[1] ||
      `user_${clerkUserId.slice(-8)}`;

    const email = userInfo.email || `${clerkUserId}@temp.com`;
    const img = userInfo.image_url || userInfo.picture || "";

    user = new User({
      clerkUserId: clerkUserId,
      username: username,
      email: email,
      img: img,
    });

    try {
      await user.save();
      console.log("[addComment] Fallback user created successfully");
    } catch (err) {
      console.error("[addComment] Failed to create fallback user:", err);
      return res.status(500).json("Failed to create user profile");
    }
  }

  const newComment = new Comment({
    user: user._id,
    post: postId,
    ...req.body,
  });
  const savedComment = await newComment.save();

  // FIXED: Populate user info before sending response so client has username and img
  const populatedComment = await savedComment.populate("user", "username img");
  res.status(201).json(populatedComment);
};

export const deleteComment = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.params.id;
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json("Comment has been deleted");
  }

  // FIXED: Added missing await keyword for async database query
  const user = await User.findOne({ clerkUserId });

  const deletedComment = await Comment.findByIdAndDelete({
    _id: id,
    user: user._id,
  });
  if (!deletedComment) {
    return res.status(403).json("You can only delete your own comments");
  }
  res.status(200).json("Comment deleted successfully");
};

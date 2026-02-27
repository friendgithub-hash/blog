import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.cat = cat;
  }
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");
    if (!user) {
      return res.status(404).json("No post found!");
    }
    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visits: -1 };
        break;
      case "trending":
        sortObj = { visits: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };

      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img clerkUserId",
  );
  res.status(200).json(post);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "user",
    "username img clerkUserId",
  );
  if (!post) {
    return res.status(404).json("Post not found");
  }
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  console.log("[createPost] headers:", req.headers);
  console.log("[createPost] body:", req.body);

  // Check if user is authenticated via Clerk
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  // Find user in MongoDB by their Clerk ID
  let user = await User.findOne({ clerkUserId });

  // Fallback: If user doesn't exist in MongoDB (webhook might have failed),
  // create them now to prevent blocking post creation
  if (!user) {
    console.log("[createPost] User not found in DB, creating fallback user");

    // Get user info from Clerk session claims
    const userInfo = req.auth.sessionClaims;

    // FIXED: Log session claims to see what's available
    console.log(
      "[createPost] Clerk session claims:",
      JSON.stringify(userInfo, null, 2),
    );

    // FIXED: Extract username from Clerk session - try multiple sources
    // Clerk JWT has different structure than webhook payload
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
      console.log("[createPost] Fallback user created successfully");
    } catch (err) {
      console.error("[createPost] Failed to create fallback user:", err);
      return res.status(500).json("Failed to create user profile");
    }
  }

  // server-side sanity check instead of relying solely on mongoose
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  let slug = title.replace(/\s+/g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });
  const post = await newPost.save();

  // populate user field before sending response so client has username, img, etc
  const populatedPost = await post.populate("user", "username img");

  res.status(201).json(populatedPost);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return (res.status(200), json("Post has been deleted"));
  }

  const user = await User.findOne({ clerkUserId });

  const deletedPost = await Post.findByIdAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can only delete your own posts");
  }
  res.status(200).json("Post deleted successfully");
};

export const updatePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.params.id;

  // Authentication check
  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  // Validation - required fields
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json("Title is required");
  }
  if (!content) {
    return res.status(400).json("Content is required");
  }

  // Validation - title length
  if (title.length > 200) {
    return res.status(400).json("Title is too long");
  }

  // Category validation
  const validCategories = [
    "application",
    "service",
    "products",
    "distributors",
    "news",
  ];
  if (req.body.category && !validCategories.includes(req.body.category)) {
    return res.status(400).json("Invalid category");
  }

  // Find existing post
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json("Post not found");
  }

  // Find user
  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json("User not found");
  }

  // Authorization check
  const role = req.auth.sessionClaims?.metadata?.role || "user";
  const isAuthor = post.user.toString() === user._id.toString();
  const isAdmin = role === "admin";

  if (!isAuthor && !isAdmin) {
    return res.status(403).json("You can only edit your own posts");
  }

  // Update post (excluding slug to preserve it)
  const { slug, ...updateData } = req.body;

  const updatedPost = await Post.findByIdAndUpdate(postId, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "username img");

  res.status(200).json(updatedPost);
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true },
  );

  res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
  urlEndpoint: process.env.IK_URL_ENDPOINT,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};

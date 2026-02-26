import rateLimit from "express-rate-limit";

// Rate limiter for contact form submissions
// 3 requests per 15 minutes per user/IP
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  // Use default IP-based rate limiting (handles IPv6 properly)
  // Authenticated users will be tracked by their Clerk ID via custom key generator
  keyGenerator: (req) => {
    // Use Clerk user ID if authenticated
    if (req.auth?.userId) {
      return `clerk:${req.auth.userId}`;
    }
    // For anonymous users, return undefined to use default IP-based tracking
    // This allows express-rate-limit to handle IPv6 properly
    return undefined;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

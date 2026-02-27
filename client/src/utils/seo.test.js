/**
 * Tests for SEO utility functions
 *
 * Run these tests manually in the browser console or with a test runner
 */

import { stripHtml, truncateText, makeAbsoluteUrl } from "./seo.js";

// Test stripHtml
console.group("Testing stripHtml");

console.assert(
  stripHtml("<p>Hello <strong>World</strong></p>") === "Hello World",
  "Should strip HTML tags",
);

console.assert(
  stripHtml("<div><h1>Title</h1><p>Content</p></div>") === "Title Content",
  "Should strip nested HTML tags",
);

console.assert(stripHtml("") === "", "Should handle empty string");

console.assert(stripHtml(null) === "", "Should handle null");

console.assert(
  stripHtml("<p>Multiple   spaces</p>") === "Multiple spaces",
  "Should normalize whitespace",
);

console.groupEnd();

// Test truncateText
console.group("Testing truncateText");

console.assert(
  truncateText("Short text", 20) === "Short text",
  "Should not truncate short text",
);

console.assert(
  truncateText("This is a very long text that needs to be truncated", 20) ===
    "This is a very lo...",
  "Should truncate long text",
);

console.assert(
  truncateText("Exactly 20 chars txt", 20) === "Exactly 20 chars txt",
  "Should handle exact length",
);

console.assert(truncateText("", 20) === "", "Should handle empty string");

console.assert(truncateText(null, 20) === "", "Should handle null");

console.assert(truncateText("Test", 0) === "", "Should handle zero maxLength");

console.groupEnd();

// Test makeAbsoluteUrl
console.group("Testing makeAbsoluteUrl");

console.assert(
  makeAbsoluteUrl("/images/photo.jpg", "https://example.com") ===
    "https://example.com/images/photo.jpg",
  "Should convert relative URL to absolute",
);

console.assert(
  makeAbsoluteUrl(
    "https://cdn.example.com/image.jpg",
    "https://example.com",
  ) === "https://cdn.example.com/image.jpg",
  "Should keep absolute URL unchanged",
);

console.assert(
  makeAbsoluteUrl("/path", "https://example.com/") ===
    "https://example.com/path",
  "Should handle trailing slash in baseUrl",
);

console.assert(
  makeAbsoluteUrl("path/to/file.jpg", "https://example.com") ===
    "https://example.com/path/to/file.jpg",
  "Should handle URL without leading slash",
);

console.assert(
  makeAbsoluteUrl("", "https://example.com") === "https://example.com",
  "Should handle empty URL",
);

console.assert(
  makeAbsoluteUrl(null, "https://example.com") === "https://example.com",
  "Should handle null URL",
);

console.groupEnd();

console.log("All SEO utility tests completed!");

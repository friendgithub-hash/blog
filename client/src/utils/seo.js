/**
 * SEO Utility Functions
 *
 * This module provides utility functions for SEO operations including
 * HTML stripping, text truncation, and URL absolutization.
 */

/**
 * Removes all HTML tags from a string and returns plain text.
 *
 * @param {string} html - The HTML string to strip tags from
 * @returns {string} Plain text with all HTML tags removed
 *
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>')
 * // Returns: 'Hello World'
 */
export const stripHtml = (html) => {
  if (!html || typeof html !== "string") {
    return "";
  }

  try {
    // Create a temporary DOM element to parse HTML
    const tmp = document.createElement("div");
    tmp.innerHTML = html;

    // Extract text content
    const text = tmp.textContent || tmp.innerText || "";

    // Clean up extra whitespace and line breaks
    return text.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Error stripping HTML:", error);
    return "";
  }
};

/**
 * Truncates text to a specified length and adds ellipsis if truncated.
 *
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the text (default: 160)
 * @returns {string} Truncated text with ellipsis if needed
 *
 * @example
 * truncateText('This is a long text that needs truncation', 20)
 * // Returns: 'This is a long te...'
 */
export const truncateText = (text, maxLength = 160) => {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (maxLength <= 0) {
    return "";
  }

  // If text is already shorter than maxLength, return as is
  if (text.length <= maxLength) {
    return text;
  }

  // Truncate and add ellipsis
  // Subtract 3 for the ellipsis length
  const truncated = text.substring(0, maxLength - 3).trim();
  return `${truncated}...`;
};

/**
 * Converts a relative URL to an absolute URL using the provided base URL.
 * If the URL is already absolute, returns it unchanged.
 *
 * @param {string} url - The URL to convert (relative or absolute)
 * @param {string} baseUrl - The base URL to use for conversion
 * @returns {string} Absolute URL
 *
 * @example
 * makeAbsoluteUrl('/images/photo.jpg', 'https://example.com')
 * // Returns: 'https://example.com/images/photo.jpg'
 *
 * makeAbsoluteUrl('https://cdn.example.com/image.jpg', 'https://example.com')
 * // Returns: 'https://cdn.example.com/image.jpg'
 */
export const makeAbsoluteUrl = (url, baseUrl) => {
  if (!url || typeof url !== "string") {
    return baseUrl || "";
  }

  if (!baseUrl || typeof baseUrl !== "string") {
    return url;
  }

  try {
    // If URL is already absolute (starts with http:// or https://), return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // Remove trailing slash from baseUrl if present
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    // Ensure URL starts with a slash
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;

    // Combine base URL and relative URL
    return `${cleanBaseUrl}${cleanUrl}`;
  } catch (error) {
    console.error("Error making absolute URL:", error);
    return url;
  }
};

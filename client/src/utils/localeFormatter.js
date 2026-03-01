/**
 * Locale-specific formatting utilities for dates, times, numbers, and currency
 * Uses the Intl API for locale-aware formatting
 */

/**
 * Format a date according to the specified locale
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale code (e.g., 'en', 'es', 'zh-CN', 'ar')
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = "en", options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a time according to the specified locale
 * @param {Date|string|number} date - The date/time to format
 * @param {string} locale - The locale code
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, locale = "en", options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

/**
 * Format a number according to the specified locale
 * @param {number} number - The number to format
 * @param {string} locale - The locale code
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = "en", options = {}) => {
  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Format a currency value according to the specified locale
 * @param {number} amount - The amount to format
 * @param {string} locale - The locale code
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'CNY')
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  amount,
  locale = "en",
  currency = "USD",
  options = {},
) => {
  const defaultOptions = {
    style: "currency",
    currency,
    ...options,
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(amount);
};

/**
 * Format relative time using translation keys
 * @param {Date|string|number} date - The date to compare
 * @param {Function} t - The translation function from i18next
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (date, t) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  // Just now (less than 1 minute)
  if (diffInSeconds < 60) {
    return t("time.justNow");
  }

  // Minutes ago
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return t("time.minutesAgo", { count: diffInMinutes });
  }

  // Hours ago
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return t("time.hoursAgo", { count: diffInHours });
  }

  // Days ago
  const diffInDays = Math.floor(diffInHours / 24);
  return t("time.daysAgo", { count: diffInDays });
};

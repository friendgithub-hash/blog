import { describe, it, expect, vi } from "vitest";
import {
  formatDate,
  formatTime,
  formatNumber,
  formatCurrency,
  formatRelativeTime,
} from "../localeFormatter";

describe("localeFormatter", () => {
  describe("formatDate", () => {
    const testDate = new Date("2024-03-15T10:30:00Z");

    it("should format date in English", () => {
      const result = formatDate(testDate, "en");
      expect(result).toContain("March");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format date in Spanish", () => {
      const result = formatDate(testDate, "es");
      expect(result).toContain("marzo");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format date in Chinese", () => {
      const result = formatDate(testDate, "zh-CN");
      expect(result).toContain("2024");
      expect(result).toContain("3");
      expect(result).toContain("15");
    });

    it("should format date in Arabic", () => {
      const result = formatDate(testDate, "ar");
      expect(result).toContain("2024");
      expect(result).toContain("15");
    });

    it("should accept custom options", () => {
      const result = formatDate(testDate, "en", {
        year: "2-digit",
        month: "short",
        day: "numeric",
      });
      expect(result).toContain("Mar");
      expect(result).toContain("15");
      expect(result).toContain("24");
    });

    it("should handle string dates", () => {
      const result = formatDate("2024-03-15", "en");
      expect(result).toContain("March");
      expect(result).toContain("2024");
    });

    it("should handle timestamp numbers", () => {
      const result = formatDate(testDate.getTime(), "en");
      expect(result).toContain("March");
      expect(result).toContain("2024");
    });
  });

  describe("formatTime", () => {
    const testDate = new Date("2024-03-15T14:30:00Z");

    it("should format time in English", () => {
      const result = formatTime(testDate, "en");
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should format time in Spanish", () => {
      const result = formatTime(testDate, "es");
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it("should format time in Chinese", () => {
      const result = formatTime(testDate, "zh-CN");
      expect(result).toBeTruthy();
    });

    it("should format time in Arabic", () => {
      const result = formatTime(testDate, "ar");
      expect(result).toBeTruthy();
    });

    it("should accept custom options", () => {
      const result = formatTime(testDate, "en", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
    });
  });

  describe("formatNumber", () => {
    it("should format number in English", () => {
      const result = formatNumber(1234567.89, "en");
      expect(result).toBe("1,234,567.89");
    });

    it("should format number in Spanish", () => {
      const result = formatNumber(1234567.89, "es");
      // Spanish uses period for thousands and comma for decimals
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toContain("567");
    });

    it("should format number in Chinese", () => {
      const result = formatNumber(1234567.89, "zh-CN");
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toContain("567");
    });

    it("should format number in Arabic", () => {
      const result = formatNumber(1234567.89, "ar");
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should accept custom options", () => {
      const result = formatNumber(1234.5678, "en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe("1,234.57");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency in English with USD", () => {
      const result = formatCurrency(1234.56, "en", "USD");
      expect(result).toContain("1,234.56");
      expect(result).toMatch(/\$|USD/);
    });

    it("should format currency in Spanish with EUR", () => {
      const result = formatCurrency(1234.56, "es", "EUR");
      expect(result).toContain("1");
      expect(result).toContain("234");
      expect(result).toMatch(/€|EUR/);
    });

    it("should format currency in Chinese with CNY", () => {
      const result = formatCurrency(1234.56, "zh-CN", "CNY");
      expect(result).toContain("1");
      expect(result).toContain("234");
    });

    it("should format currency in Arabic with USD", () => {
      const result = formatCurrency(1234.56, "ar", "USD");
      expect(result).toBeTruthy();
      expect(result.length).toBeGreaterThan(0);
    });

    it("should accept custom options", () => {
      const result = formatCurrency(1234.5, "en", "USD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toContain("1,234.50");
    });
  });

  describe("formatRelativeTime", () => {
    const mockT = vi.fn((key, options) => {
      const translations = {
        "time.justNow": "just now",
        "time.minutesAgo": `${options?.count} minute${options?.count !== 1 ? "s" : ""} ago`,
        "time.hoursAgo": `${options?.count} hour${options?.count !== 1 ? "s" : ""} ago`,
        "time.daysAgo": `${options?.count} day${options?.count !== 1 ? "s" : ""} ago`,
      };
      return translations[key] || key;
    });

    it("should return 'just now' for recent dates", () => {
      const now = new Date();
      const result = formatRelativeTime(now, mockT);
      expect(result).toBe("just now");
      expect(mockT).toHaveBeenCalledWith("time.justNow");
    });

    it("should return minutes ago for dates within an hour", () => {
      const date = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
      const result = formatRelativeTime(date, mockT);
      expect(result).toBe("5 minutes ago");
      expect(mockT).toHaveBeenCalledWith("time.minutesAgo", { count: 5 });
    });

    it("should return hours ago for dates within a day", () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours ago
      const result = formatRelativeTime(date, mockT);
      expect(result).toBe("3 hours ago");
      expect(mockT).toHaveBeenCalledWith("time.hoursAgo", { count: 3 });
    });

    it("should return days ago for older dates", () => {
      const date = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
      const result = formatRelativeTime(date, mockT);
      expect(result).toBe("5 days ago");
      expect(mockT).toHaveBeenCalledWith("time.daysAgo", { count: 5 });
    });

    it("should handle string dates", () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeTime(date, mockT);
      expect(result).toBe("2 hours ago");
    });

    it("should handle timestamp numbers", () => {
      const date = Date.now() - 10 * 60 * 1000; // 10 minutes ago
      const result = formatRelativeTime(date, mockT);
      expect(result).toBe("10 minutes ago");
    });
  });
});

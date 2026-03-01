import { describe, it, expect } from "vitest";
import { languages, getLanguageByCode, isRTL } from "../languages";

describe("RTL Language Support", () => {
  describe("Language configuration", () => {
    it("should have dir attribute for all languages", () => {
      languages.forEach((lang) => {
        expect(lang).toHaveProperty("dir");
        expect(["ltr", "rtl"]).toContain(lang.dir);
      });
    });

    it("should mark Arabic as RTL", () => {
      const arabic = languages.find((lang) => lang.code === "ar");
      expect(arabic).toBeDefined();
      expect(arabic.dir).toBe("rtl");
    });

    it("should mark English, Spanish, and Chinese as LTR", () => {
      const ltrLanguages = ["en", "es", "zh-CN"];
      ltrLanguages.forEach((code) => {
        const lang = languages.find((l) => l.code === code);
        expect(lang).toBeDefined();
        expect(lang.dir).toBe("ltr");
      });
    });
  });

  describe("isRTL helper function", () => {
    it("should return true for Arabic", () => {
      expect(isRTL("ar")).toBe(true);
    });

    it("should return false for English", () => {
      expect(isRTL("en")).toBe(false);
    });

    it("should return false for Spanish", () => {
      expect(isRTL("es")).toBe(false);
    });

    it("should return false for Chinese", () => {
      expect(isRTL("zh-CN")).toBe(false);
    });

    it("should return false for invalid language code (fallback to English)", () => {
      expect(isRTL("invalid")).toBe(false);
    });
  });

  describe("getLanguageByCode", () => {
    it("should return correct language object for valid code", () => {
      const arabic = getLanguageByCode("ar");
      expect(arabic.code).toBe("ar");
      expect(arabic.dir).toBe("rtl");
      expect(arabic.name).toBe("Arabic");
    });

    it("should return English as fallback for invalid code", () => {
      const fallback = getLanguageByCode("invalid");
      expect(fallback.code).toBe("en");
      expect(fallback.dir).toBe("ltr");
    });
  });

  describe("HTML attributes update", () => {
    it("should update dir attribute when switching to Arabic", () => {
      const arabic = getLanguageByCode("ar");
      document.documentElement.dir = arabic.dir;
      expect(document.documentElement.dir).toBe("rtl");
    });

    it("should update dir attribute when switching to English", () => {
      const english = getLanguageByCode("en");
      document.documentElement.dir = english.dir;
      expect(document.documentElement.dir).toBe("ltr");
    });

    it("should update dir attribute when switching from RTL to LTR", () => {
      // Start with Arabic (RTL)
      document.documentElement.dir = "rtl";
      expect(document.documentElement.dir).toBe("rtl");

      // Switch to English (LTR)
      const english = getLanguageByCode("en");
      document.documentElement.dir = english.dir;
      expect(document.documentElement.dir).toBe("ltr");
    });

    it("should update dir attribute when switching from LTR to RTL", () => {
      // Start with English (LTR)
      document.documentElement.dir = "ltr";
      expect(document.documentElement.dir).toBe("ltr");

      // Switch to Arabic (RTL)
      const arabic = getLanguageByCode("ar");
      document.documentElement.dir = arabic.dir;
      expect(document.documentElement.dir).toBe("rtl");
    });
  });
});

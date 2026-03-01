import { describe, it, expect, beforeAll, vi } from "vitest";
import i18n from "../i18n";

describe("i18n initialization", () => {
  beforeAll(async () => {
    // Wait for i18n to initialize
    if (!i18n.isInitialized) {
      await i18n.init();
    }
  });

  it("should initialize i18n instance successfully", () => {
    expect(i18n).toBeDefined();
    expect(i18n.isInitialized).toBe(true);
  });

  it("should set fallback language to English", () => {
    expect(i18n.options.fallbackLng).toEqual(["en"]);
  });

  it("should configure supported languages correctly", () => {
    const supportedLanguages = i18n.options.supportedLngs;

    expect(supportedLanguages).toContain("en");
    expect(supportedLanguages).toContain("es");
    expect(supportedLanguages).toContain("zh-CN");
    expect(supportedLanguages).toContain("ar");
    expect(supportedLanguages).toHaveLength(5); // 4 languages + 'cimode' (i18next default)
  });

  it("should configure language detection order correctly", () => {
    const detectionOrder = i18n.options.detection.order;

    expect(detectionOrder).toEqual(["localStorage", "navigator", "htmlTag"]);
  });

  it("should configure localStorage as cache mechanism", () => {
    const caches = i18n.options.detection.caches;

    expect(caches).toContain("localStorage");
  });

  it("should configure backend load path correctly", () => {
    const loadPath = i18n.options.backend.loadPath;

    expect(loadPath).toBe("/locales/{{lng}}/translation.json");
  });

  it("should disable React Suspense", () => {
    expect(i18n.options.react.useSuspense).toBe(false);
  });

  it("should configure interpolation to not escape values", () => {
    expect(i18n.options.interpolation.escapeValue).toBe(false);
  });
});

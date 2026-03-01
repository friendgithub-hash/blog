import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }) => <div>{children}</div>,
  SignedIn: ({ children }) => <div>{children}</div>,
  SignedOut: ({ children }) => <div>{children}</div>,
  UserButton: () => <div>User Button</div>,
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue("mock-token"),
  }),
}));

// Mock i18n instance for testing
const createMockI18n = (currentLanguage = "en", translations = {}) => {
  const defaultTranslations = {
    "nav.home": "Home",
    "nav.trending": "Trending",
    "nav.mostPopular": "Most Popular",
    "nav.contact": "Contact",
    "nav.login": "Login",
  };

  const mockI18n = {
    language: currentLanguage,
    languages: ["en", "es", "zh-CN", "ar"],
    changeLanguage: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
    options: {
      fallbackLng: ["en"],
      supportedLngs: ["en", "es", "zh-CN", "ar"],
    },
    t: vi.fn((key) => translations[key] || defaultTranslations[key] || key),
    getFixedT: vi.fn(
      () => (key) => translations[key] || defaultTranslations[key] || key,
    ),
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    off: vi.fn(),
    hasLoadedNamespace: vi.fn(() => true),
    loadNamespaces: vi.fn().mockResolvedValue(undefined),
    loadLanguages: vi.fn().mockResolvedValue(undefined),
    dir: vi.fn(() => "ltr"),
    format: vi.fn((value) => value),
    exists: vi.fn(() => true),
    getResource: vi.fn(),
    addResource: vi.fn(),
    addResources: vi.fn(),
    addResourceBundle: vi.fn(),
    hasResourceBundle: vi.fn(() => true),
    getResourceBundle: vi.fn(() => ({})),
    removeResourceBundle: vi.fn(),
    store: {
      on: vi.fn(),
      off: vi.fn(),
    },
  };
  return mockI18n;
};

const renderNavbar = (mockI18n) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={mockI18n}>
        <Navbar />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe("Navbar Component - i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering with correct translations", () => {
    it("should render all navigation links with English translations", () => {
      const mockI18n = createMockI18n("en");
      renderNavbar(mockI18n);

      expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Trending").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Most Popular").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    });

    it("should render all navigation links with Spanish translations", () => {
      const spanishTranslations = {
        "nav.home": "Inicio",
        "nav.trending": "Tendencias",
        "nav.mostPopular": "Más Popular",
        "nav.contact": "Contacto",
        "nav.login": "Iniciar Sesión",
      };
      const mockI18n = createMockI18n("es", spanishTranslations);
      renderNavbar(mockI18n);

      expect(screen.getAllByText("Inicio").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Tendencias").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Más Popular").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contacto").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Iniciar Sesión").length).toBeGreaterThan(0);
    });

    it("should render all navigation links with Chinese translations", () => {
      const chineseTranslations = {
        "nav.home": "首页",
        "nav.trending": "热门",
        "nav.mostPopular": "最受欢迎",
        "nav.contact": "联系我们",
        "nav.login": "登录",
      };
      const mockI18n = createMockI18n("zh-CN", chineseTranslations);
      renderNavbar(mockI18n);

      expect(screen.getAllByText("首页").length).toBeGreaterThan(0);
      expect(screen.getAllByText("热门").length).toBeGreaterThan(0);
      expect(screen.getAllByText("最受欢迎").length).toBeGreaterThan(0);
      expect(screen.getAllByText("联系我们").length).toBeGreaterThan(0);
      expect(screen.getAllByText("登录").length).toBeGreaterThan(0);
    });

    it("should render all navigation links with Arabic translations", () => {
      const arabicTranslations = {
        "nav.home": "الرئيسية",
        "nav.trending": "الشائع",
        "nav.mostPopular": "الأكثر شعبية",
        "nav.contact": "اتصل بنا",
        "nav.login": "تسجيل الدخول",
      };
      const mockI18n = createMockI18n("ar", arabicTranslations);
      renderNavbar(mockI18n);

      expect(screen.getAllByText("الرئيسية").length).toBeGreaterThan(0);
      expect(screen.getAllByText("الشائع").length).toBeGreaterThan(0);
      expect(screen.getAllByText("الأكثر شعبية").length).toBeGreaterThan(0);
      expect(screen.getAllByText("اتصل بنا").length).toBeGreaterThan(0);
      expect(screen.getAllByText("تسجيل الدخول").length).toBeGreaterThan(0);
    });
  });

  describe("Language switching updates component text", () => {
    it("should update navigation text when language changes from English to Spanish", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderNavbar(mockI18n);

      // Verify English text is present
      expect(screen.getAllByText("Home").length).toBeGreaterThan(0);

      // Simulate language change
      const spanishTranslations = {
        "nav.home": "Inicio",
        "nav.trending": "Tendencias",
        "nav.mostPopular": "Más Popular",
        "nav.contact": "Contacto",
        "nav.login": "Iniciar Sesión",
      };
      const spanishI18n = createMockI18n("es", spanishTranslations);

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={spanishI18n}>
            <Navbar />
          </I18nextProvider>
        </BrowserRouter>,
      );

      // Verify Spanish text is now present
      await waitFor(() => {
        expect(screen.getAllByText("Inicio").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Tendencias").length).toBeGreaterThan(0);
      });
    });

    it("should update navigation text when language changes from English to Chinese", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderNavbar(mockI18n);

      // Verify English text is present
      expect(screen.getAllByText("Home").length).toBeGreaterThan(0);

      // Simulate language change
      const chineseTranslations = {
        "nav.home": "首页",
        "nav.trending": "热门",
        "nav.mostPopular": "最受欢迎",
        "nav.contact": "联系我们",
        "nav.login": "登录",
      };
      const chineseI18n = createMockI18n("zh-CN", chineseTranslations);

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={chineseI18n}>
            <Navbar />
          </I18nextProvider>
        </BrowserRouter>,
      );

      // Verify Chinese text is now present
      await waitFor(() => {
        expect(screen.getAllByText("首页").length).toBeGreaterThan(0);
        expect(screen.getAllByText("热门").length).toBeGreaterThan(0);
      });
    });
  });

  describe("Missing keys show fallback text", () => {
    it("should use default translations when custom translations object is empty", () => {
      // When we pass an empty translations object, the mock still has default translations
      // This test verifies that the component works with the default English translations
      const mockI18n = createMockI18n("en", {});
      renderNavbar(mockI18n);

      // Should show default English translations from the mock
      expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Trending").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Most Popular").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    });

    it("should use available translations and fallback for missing ones", () => {
      const partialSpanishTranslations = {
        "nav.home": "Inicio",
        "nav.trending": "Tendencias",
        // Missing: nav.mostPopular, nav.contact, nav.login - will use default English
      };
      const mockI18n = createMockI18n("es", partialSpanishTranslations);
      renderNavbar(mockI18n);

      // Should show Spanish for available translations
      expect(screen.getAllByText("Inicio").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Tendencias").length).toBeGreaterThan(0);

      // Should show default English for missing translations
      expect(screen.getAllByText("Most Popular").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Login").length).toBeGreaterThan(0);
    });
  });
});

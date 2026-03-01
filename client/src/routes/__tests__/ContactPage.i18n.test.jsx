import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import ContactPage from "../ContactPage";

// Mock child components
vi.mock("../../components/AboutUs", () => ({
  default: () => <div data-testid="about-us">About Us Component</div>,
}));

vi.mock("../../components/ContactForm", () => ({
  default: () => <div data-testid="contact-form">Contact Form Component</div>,
}));

const createMockI18n = (currentLanguage = "en", translations) => {
  const defaultTranslations = {
    "breadcrumb.home": "Home",
    "breadcrumb.contact": "Contact",
  };

  // Use defaultTranslations only if translations is undefined (not provided)
  // If translations is explicitly provided (even if empty {}), don't use defaults
  const translationsToUse =
    translations !== undefined ? translations : defaultTranslations;

  const mockI18n = {
    language: currentLanguage,
    languages: ["en", "es", "zh-CN", "ar"],
    changeLanguage: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
    options: {
      fallbackLng: ["en"],
      supportedLngs: ["en", "es", "zh-CN", "ar"],
    },
    t: vi.fn((key) => translationsToUse[key] || key),
    getFixedT: vi.fn(() => (key) => translationsToUse[key] || key),
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

const renderContactPage = (mockI18n) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={mockI18n}>
        <ContactPage />
      </I18nextProvider>
    </BrowserRouter>,
  );
};

describe("ContactPage Component - i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering with correct translations", () => {
    it("should render breadcrumbs with English translations", () => {
      const mockI18n = createMockI18n("en");
      renderContactPage(mockI18n);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("should render breadcrumbs with Spanish translations", () => {
      const spanishTranslations = {
        "breadcrumb.home": "Inicio",
        "breadcrumb.contact": "Contacto",
      };
      const mockI18n = createMockI18n("es", spanishTranslations);
      renderContactPage(mockI18n);

      expect(screen.getByText("Inicio")).toBeInTheDocument();
      expect(screen.getByText("Contacto")).toBeInTheDocument();
    });

    it("should render breadcrumbs with Chinese translations", () => {
      const chineseTranslations = {
        "breadcrumb.home": "首页",
        "breadcrumb.contact": "联系我们",
      };
      const mockI18n = createMockI18n("zh-CN", chineseTranslations);
      renderContactPage(mockI18n);

      expect(screen.getByText("首页")).toBeInTheDocument();
      expect(screen.getByText("联系我们")).toBeInTheDocument();
    });

    it("should render breadcrumbs with Arabic translations", () => {
      const arabicTranslations = {
        "breadcrumb.home": "الرئيسية",
        "breadcrumb.contact": "اتصل بنا",
      };
      const mockI18n = createMockI18n("ar", arabicTranslations);
      renderContactPage(mockI18n);

      expect(screen.getByText("الرئيسية")).toBeInTheDocument();
      expect(screen.getByText("اتصل بنا")).toBeInTheDocument();
    });

    it("should render child components", () => {
      const mockI18n = createMockI18n("en");
      renderContactPage(mockI18n);

      expect(screen.getByTestId("about-us")).toBeInTheDocument();
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });
  });

  describe("Language switching updates component text", () => {
    it("should update breadcrumbs when language changes from English to Spanish", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderContactPage(mockI18n);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();

      const spanishTranslations = {
        "breadcrumb.home": "Inicio",
        "breadcrumb.contact": "Contacto",
      };
      const spanishI18n = createMockI18n("es", spanishTranslations);

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={spanishI18n}>
            <ContactPage />
          </I18nextProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("Inicio")).toBeInTheDocument();
        expect(screen.getByText("Contacto")).toBeInTheDocument();
      });
    });

    it("should update breadcrumbs when language changes from English to Chinese", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderContactPage(mockI18n);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();

      const chineseTranslations = {
        "breadcrumb.home": "首页",
        "breadcrumb.contact": "联系我们",
      };
      const chineseI18n = createMockI18n("zh-CN", chineseTranslations);

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={chineseI18n}>
            <ContactPage />
          </I18nextProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("首页")).toBeInTheDocument();
        expect(screen.getByText("联系我们")).toBeInTheDocument();
      });
    });

    it("should update breadcrumbs when language changes from English to Arabic", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderContactPage(mockI18n);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Contact")).toBeInTheDocument();

      const arabicTranslations = {
        "breadcrumb.home": "الرئيسية",
        "breadcrumb.contact": "اتصل بنا",
      };
      const arabicI18n = createMockI18n("ar", arabicTranslations);

      rerender(
        <BrowserRouter>
          <I18nextProvider i18n={arabicI18n}>
            <ContactPage />
          </I18nextProvider>
        </BrowserRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText("الرئيسية")).toBeInTheDocument();
        expect(screen.getByText("اتصل بنا")).toBeInTheDocument();
      });
    });
  });

  describe("Missing keys show fallback text", () => {
    it("should display translation key when translation is missing", () => {
      const mockI18n = createMockI18n("en", {});
      renderContactPage(mockI18n);

      expect(screen.getByText("breadcrumb.home")).toBeInTheDocument();
      expect(screen.getByText("breadcrumb.contact")).toBeInTheDocument();
    });

    it("should display fallback for partially missing Spanish translations", () => {
      const partialSpanishTranslations = {
        "breadcrumb.home": "Inicio",
        // Missing: breadcrumb.contact
      };
      const mockI18n = createMockI18n("es", partialSpanishTranslations);
      renderContactPage(mockI18n);

      expect(screen.getByText("Inicio")).toBeInTheDocument();
      expect(screen.getByText("breadcrumb.contact")).toBeInTheDocument();
    });

    it("should display fallback for partially missing Chinese translations", () => {
      const partialChineseTranslations = {
        "breadcrumb.contact": "联系我们",
        // Missing: breadcrumb.home
      };
      const mockI18n = createMockI18n("zh-CN", partialChineseTranslations);
      renderContactPage(mockI18n);

      expect(screen.getByText("breadcrumb.home")).toBeInTheDocument();
      expect(screen.getByText("联系我们")).toBeInTheDocument();
    });
  });

  describe("Layout structure", () => {
    it("should maintain proper layout structure with translations", () => {
      const mockI18n = createMockI18n("en");
      const { container } = renderContactPage(mockI18n);

      // Check that the grid layout is present
      const gridLayout = container.querySelector(".grid");
      expect(gridLayout).toBeInTheDocument();

      // Check that both child components are rendered
      expect(screen.getByTestId("about-us")).toBeInTheDocument();
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });
  });
});

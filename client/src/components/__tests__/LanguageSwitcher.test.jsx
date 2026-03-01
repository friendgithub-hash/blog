import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import LanguageSwitcher from "../LanguageSwitcher";
import { languages } from "../../config/languages";

// Mock i18n instance for testing
const createMockI18n = (currentLanguage = "en") => {
  const mockI18n = {
    language: currentLanguage,
    languages: ["en", "es", "zh-CN", "ar"],
    changeLanguage: vi.fn().mockResolvedValue(undefined),
    isInitialized: true,
    options: {
      fallbackLng: ["en"],
      supportedLngs: ["en", "es", "zh-CN", "ar"],
    },
    t: vi.fn((key) => key),
    getFixedT: vi.fn(() => (key) => key),
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

describe("LanguageSwitcher Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document attributes
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render all supported languages in dropdown", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Check all languages are present by checking menu items
      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(languages.length);

      // Verify each language appears in the dropdown
      languages.forEach((language) => {
        // Use getAllByText for languages that might appear multiple times (like "English")
        const nativeNameElements = screen.getAllByText(language.nativeName);
        expect(nativeNameElements.length).toBeGreaterThan(0);
      });
    });

    it("should display current language correctly", () => {
      const mockI18n = createMockI18n("es");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Check that Spanish is displayed as current language
      const button = screen.getByRole("button", { name: /select language/i });
      expect(button).toHaveTextContent("Español");
      expect(button).toHaveTextContent("🇪🇸");
    });

    it("should display English as default when language code is invalid", () => {
      const mockI18n = createMockI18n("invalid-code");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Should fall back to English
      const button = screen.getByRole("button", { name: /select language/i });
      expect(button).toHaveTextContent("English");
      expect(button).toHaveTextContent("🇺🇸");
    });

    it("should highlight currently selected language in dropdown", async () => {
      const mockI18n = createMockI18n("zh-CN");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        const chineseButton = screen.getByRole("menuitem", {
          name: /简体中文/i,
        });
        expect(chineseButton).toHaveClass("bg-blue-50");
      });
    });
  });

  describe("Dropdown Interaction", () => {
    it("should open dropdown on click", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      // Dropdown should not be visible initially
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      // Click to open
      fireEvent.click(button);

      // Dropdown should be visible
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should close dropdown on second click", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      // Open dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Close dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should close dropdown when clicking outside", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <div>
          <I18nextProvider i18n={mockI18n}>
            <LanguageSwitcher />
          </I18nextProvider>
          <div data-testid="outside">Outside element</div>
        </div>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      // Open dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click outside
      const outsideElement = screen.getByTestId("outside");
      fireEvent.mouseDown(outsideElement);

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Language Switching", () => {
    it("should call changeLanguage when selecting a different language", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      // Should call changeLanguage with 'es'
      await waitFor(() => {
        expect(mockI18n.changeLanguage).toHaveBeenCalledWith("es");
      });
    });

    it("should update HTML lang attribute when changing language", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Chinese
      const chineseButton = screen.getByRole("menuitem", { name: /简体中文/i });
      fireEvent.click(chineseButton);

      await waitFor(() => {
        expect(document.documentElement.lang).toBe("zh-CN");
      });
    });

    it("should update HTML dir attribute to rtl for Arabic", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Arabic
      const arabicButton = screen.getByRole("menuitem", { name: /العربية/i });
      fireEvent.click(arabicButton);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe("rtl");
      });
    });

    it("should update HTML dir attribute to ltr for non-RTL languages", async () => {
      // Start with Arabic (RTL)
      document.documentElement.dir = "rtl";
      const mockI18n = createMockI18n("ar");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on English
      const englishButton = screen.getByRole("menuitem", { name: /English/i });
      fireEvent.click(englishButton);

      await waitFor(() => {
        expect(document.documentElement.dir).toBe("ltr");
      });
    });

    it("should store language preference to localStorage", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      await waitFor(() => {
        expect(localStorage.getItem("i18nextLng")).toBe("es");
      });
    });

    it("should close dropdown after selecting a language", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      // Dropdown should close
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    it("should not call changeLanguage when selecting current language", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on English (current language)
      const englishButton = screen.getByRole("menuitem", { name: /English/i });
      fireEvent.click(englishButton);

      // Should not call changeLanguage
      expect(mockI18n.changeLanguage).not.toHaveBeenCalled();

      // Dropdown should still close
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("should show loading indicator during language switch", async () => {
      const mockI18n = createMockI18n("en");
      // Make changeLanguage take some time
      mockI18n.changeLanguage = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      // Loading indicator should appear
      await waitFor(() => {
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        },
        { timeout: 200 },
      );
    });

    it("should disable button during loading", async () => {
      const mockI18n = createMockI18n("en");
      mockI18n.changeLanguage = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100)),
        );

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      // Button should be disabled during loading
      await waitFor(() => {
        expect(button).toBeDisabled();
      });

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(button).not.toBeDisabled();
        },
        { timeout: 200 },
      );
    });

    it("should handle language change errors gracefully", async () => {
      const mockI18n = createMockI18n("en");
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockI18n.changeLanguage = vi
        .fn()
        .mockRejectedValue(new Error("Network error"));

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      // Open dropdown
      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Click on Spanish
      const spanishButton = screen.getByRole("menuitem", { name: /Español/i });
      fireEvent.click(spanishButton);

      // Should log error
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to change language:",
          expect.any(Error),
        );
      });

      // Should still close dropdown and re-enable button
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        expect(button).not.toBeDisabled();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should open dropdown on Enter key", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });
      button.focus();

      // Press Enter
      fireEvent.keyDown(button, { key: "Enter" });

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
    });

    it("should close dropdown on Escape key", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      // Open dropdown
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });

      // Press Escape
      fireEvent.keyDown(button, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      expect(button).toHaveAttribute("aria-label", "Select language");
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute("aria-haspopup", "true");
    });

    it("should update aria-expanded when dropdown opens", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });

      // Initially closed
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Open dropdown
      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("should have role='menu' on dropdown", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menu = screen.getByRole("menu");
        expect(menu).toBeInTheDocument();
        expect(menu).toHaveAttribute("aria-orientation", "vertical");
      });
    });

    it("should have role='menuitem' on language options", async () => {
      const mockI18n = createMockI18n("en");

      render(
        <I18nextProvider i18n={mockI18n}>
          <LanguageSwitcher />
        </I18nextProvider>,
      );

      const button = screen.getByRole("button", { name: /select language/i });
      fireEvent.click(button);

      await waitFor(() => {
        const menuItems = screen.getAllByRole("menuitem");
        expect(menuItems).toHaveLength(languages.length);
      });
    });
  });
});

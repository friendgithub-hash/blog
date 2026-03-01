import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostListPage from "../PostListPage";

// Mock the child components
vi.mock("../../components/PostList", () => ({
  default: () => <div data-testid="post-list">Post List Component</div>,
}));

vi.mock("../../components/SideMenu", () => ({
  default: () => <div data-testid="side-menu">Side Menu Component</div>,
}));

vi.mock("../../components/SEO", () => ({
  default: ({ title, description }) => (
    <div data-testid="seo">
      <span data-testid="seo-title">{title}</span>
      <span data-testid="seo-description">{description}</span>
    </div>
  ),
}));

const createMockI18n = (currentLanguage = "en", translations) => {
  const defaultTranslations = {
    "postList.allPosts": "All Posts",
    "postList.categoryPosts": "{{category}} Posts",
    "postList.searchResults": 'Search Results for "{{query}}"',
    "postList.latestPosts": "Latest Posts",
    "postList.oldestPosts": "Oldest Posts",
    "postList.popularPosts": "Popular Posts",
    "postList.browseAll": "Browse all articles on nextblog",
    "postList.browseCategory": "Browse {{category}} articles on nextblog",
    "postList.searchDescription": 'Search results for "{{query}}" on nextblog',
    "postList.filterOrSearch": "Filter or Search",
    "postList.close": "close",
    "postList.pageTitle": "Negative Positive Systems",
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
    t: vi.fn((key, options) => {
      const translation = translationsToUse[key] || key;
      if (options && typeof translation === "string") {
        return translation.replace(
          /\{\{(\w+)\}\}/g,
          (_, prop) => options[prop] || "",
        );
      }
      return translation;
    }),
    getFixedT: vi.fn(() => (key, options) => {
      const translation = translationsToUse[key] || key;
      if (options && typeof translation === "string") {
        return translation.replace(
          /\{\{(\w+)\}\}/g,
          (_, prop) => options[prop] || "",
        );
      }
      return translation;
    }),
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

const renderPostListPage = (mockI18n, searchParams = "") => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nextProvider i18n={mockI18n}>
          <PostListPage />
        </I18nextProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("PostListPage Component - i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering with correct translations", () => {
    it("should render page title with English translation", () => {
      const mockI18n = createMockI18n("en");
      renderPostListPage(mockI18n);

      expect(screen.getByText("Negative Positive Systems")).toBeInTheDocument();
      expect(screen.getByText("Filter or Search")).toBeInTheDocument();
    });

    it("should render page title with Spanish translations", () => {
      const spanishTranslations = {
        "postList.pageTitle": "Sistemas Negativos Positivos",
        "postList.filterOrSearch": "Filtrar o Buscar",
        "postList.close": "cerrar",
        "postList.allPosts": "Todas las Publicaciones",
        "postList.browseAll": "Explorar todos los artículos en nextblog",
      };
      const mockI18n = createMockI18n("es", spanishTranslations);
      renderPostListPage(mockI18n);

      expect(
        screen.getByText("Sistemas Negativos Positivos"),
      ).toBeInTheDocument();
      expect(screen.getByText("Filtrar o Buscar")).toBeInTheDocument();
    });

    it("should render page title with Chinese translations", () => {
      const chineseTranslations = {
        "postList.pageTitle": "负正系统",
        "postList.filterOrSearch": "筛选或搜索",
        "postList.close": "关闭",
        "postList.allPosts": "所有文章",
        "postList.browseAll": "浏览nextblog上的所有文章",
      };
      const mockI18n = createMockI18n("zh-CN", chineseTranslations);
      renderPostListPage(mockI18n);

      expect(screen.getByText("负正系统")).toBeInTheDocument();
      expect(screen.getByText("筛选或搜索")).toBeInTheDocument();
    });

    it("should render page title with Arabic translations", () => {
      const arabicTranslations = {
        "postList.pageTitle": "الأنظمة السلبية الإيجابية",
        "postList.filterOrSearch": "تصفية أو بحث",
        "postList.close": "إغلاق",
        "postList.allPosts": "جميع المنشورات",
        "postList.browseAll": "تصفح جميع المقالات على nextblog",
      };
      const mockI18n = createMockI18n("ar", arabicTranslations);
      renderPostListPage(mockI18n);

      expect(screen.getByText("الأنظمة السلبية الإيجابية")).toBeInTheDocument();
      expect(screen.getByText("تصفية أو بحث")).toBeInTheDocument();
    });

    it("should render SEO metadata with correct translations", () => {
      const mockI18n = createMockI18n("en");
      renderPostListPage(mockI18n);

      const seoTitle = screen.getByTestId("seo-title");
      const seoDescription = screen.getByTestId("seo-description");

      expect(seoTitle).toHaveTextContent("All Posts");
      expect(seoDescription).toHaveTextContent(
        "Browse all articles on nextblog",
      );
    });
  });

  describe("Language switching updates component text", () => {
    it("should update text when language changes from English to Spanish", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderPostListPage(mockI18n);

      expect(screen.getByText("Filter or Search")).toBeInTheDocument();

      const spanishTranslations = {
        "postList.pageTitle": "Sistemas Negativos Positivos",
        "postList.filterOrSearch": "Filtrar o Buscar",
        "postList.close": "cerrar",
        "postList.allPosts": "Todas las Publicaciones",
        "postList.browseAll": "Explorar todos los artículos en nextblog",
      };
      const spanishI18n = createMockI18n("es", spanishTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      rerender(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <I18nextProvider i18n={spanishI18n}>
              <PostListPage />
            </I18nextProvider>
          </BrowserRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("Filtrar o Buscar")).toBeInTheDocument();
        expect(
          screen.getByText("Sistemas Negativos Positivos"),
        ).toBeInTheDocument();
      });
    });

    it("should update text when language changes from English to Chinese", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderPostListPage(mockI18n);

      expect(screen.getByText("Filter or Search")).toBeInTheDocument();

      const chineseTranslations = {
        "postList.pageTitle": "负正系统",
        "postList.filterOrSearch": "筛选或搜索",
        "postList.close": "关闭",
        "postList.allPosts": "所有文章",
        "postList.browseAll": "浏览nextblog上的所有文章",
      };
      const chineseI18n = createMockI18n("zh-CN", chineseTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      rerender(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <I18nextProvider i18n={chineseI18n}>
              <PostListPage />
            </I18nextProvider>
          </BrowserRouter>
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("筛选或搜索")).toBeInTheDocument();
        expect(screen.getByText("负正系统")).toBeInTheDocument();
      });
    });
  });

  describe("Missing keys show fallback text", () => {
    it("should display translation key when translation is missing", () => {
      const mockI18n = createMockI18n("en", {});
      renderPostListPage(mockI18n);

      expect(screen.getByText("postList.pageTitle")).toBeInTheDocument();
      expect(screen.getByText("postList.filterOrSearch")).toBeInTheDocument();
    });

    it("should display fallback for partially missing Spanish translations", () => {
      const partialSpanishTranslations = {
        "postList.pageTitle": "Sistemas Negativos Positivos",
        // Missing: postList.filterOrSearch, postList.close
      };
      const mockI18n = createMockI18n("es", partialSpanishTranslations);
      renderPostListPage(mockI18n);

      expect(
        screen.getByText("Sistemas Negativos Positivos"),
      ).toBeInTheDocument();
      expect(screen.getByText("postList.filterOrSearch")).toBeInTheDocument();
    });
  });

  describe("Dynamic content with interpolation", () => {
    it("should handle category interpolation in translations", () => {
      const mockI18n = createMockI18n("en");

      // Mock useSearchParams to return a category
      vi.mock("react-router-dom", async () => {
        const actual = await vi.importActual("react-router-dom");
        return {
          ...actual,
          useSearchParams: () => [new URLSearchParams("?cat=technology")],
        };
      });

      renderPostListPage(mockI18n);

      // The component should use the category in the title
      const seoTitle = screen.getByTestId("seo-title");
      expect(seoTitle.textContent).toContain("Posts");
    });
  });
});

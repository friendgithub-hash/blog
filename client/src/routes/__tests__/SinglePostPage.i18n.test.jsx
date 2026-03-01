import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SinglePostPage from "../SinglePostPage";

// Mock axios
vi.mock("axios");

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }) => <div>{children}</div>,
  SignedIn: ({ children }) => <div>{children}</div>,
  SignedOut: ({ children }) => <div>{children}</div>,
  UserButton: () => <div>User Button</div>,
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue("mock-token"),
  }),
  useUser: () => ({
    user: { id: "user123" },
    isLoaded: true,
  }),
}));

// Mock child components
vi.mock("../../components/Image", () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="image" />,
}));

vi.mock("../../components/PostMenuActions", () => ({
  default: () => <div data-testid="post-menu-actions">Post Menu Actions</div>,
}));

vi.mock("../../components/Search", () => ({
  default: () => <div data-testid="search">Search Component</div>,
}));

vi.mock("../../components/Comments", () => ({
  default: () => <div data-testid="comments">Comments Component</div>,
}));

vi.mock("../../components/SEO", () => ({
  default: ({ title }) => <div data-testid="seo">{title}</div>,
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ slug: "test-post" }),
  };
});

const createMockI18n = (currentLanguage = "en", translations) => {
  const defaultTranslations = {
    "post.writtenBy": "Written by",
    "post.on": "on",
    "post.newPost": "New Post",
    "post.editPost": "Edit Post",
    "post.authorTitle": "Author",
    "categories.title": "Categories",
    "categories.all": "All",
    "categories.application": "Application",
    "categories.service": "Service",
    "categories.products": "Products",
    "categories.distributors": "Distributors",
    "categories.news": "News",
    "search.title": "Search",
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

const mockPostData = {
  _id: "123",
  title: "Test Post Title",
  slug: "test-post",
  desc: "Test post description",
  content: "<p>Test post content</p>",
  category: "application",
  img: "test-image.jpg",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  user: {
    _id: "user123",
    username: "testuser",
    clerkUserId: "clerk123",
    img: "user-image.jpg",
  },
};

const renderSinglePostPage = (mockI18n, postData = mockPostData) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  // Mock the query to return post data
  queryClient.setQueryData(["post", "test-post"], postData);

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nextProvider i18n={mockI18n}>
          <SinglePostPage />
        </I18nextProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("SinglePostPage Component - i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering with correct translations", () => {
    it("should render post metadata with English translations", async () => {
      const mockI18n = createMockI18n("en");
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Written by")).toBeInTheDocument();
        expect(screen.getByText("on")).toBeInTheDocument();
        expect(screen.getByText("New Post")).toBeInTheDocument();
        expect(screen.getByText("Author")).toBeInTheDocument();
        expect(screen.getByText("Categories")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
      });
    });

    it("should render post metadata with Spanish translations", async () => {
      const spanishTranslations = {
        "post.writtenBy": "Escrito por",
        "post.on": "en",
        "post.newPost": "Nueva Publicación",
        "post.editPost": "Editar Publicación",
        "post.authorTitle": "Autor",
        "categories.title": "Categorías",
        "categories.all": "Todas",
        "categories.application": "Aplicación",
        "categories.service": "Servicio",
        "categories.products": "Productos",
        "categories.distributors": "Distribuidores",
        "categories.news": "Noticias",
        "search.title": "Buscar",
      };
      const mockI18n = createMockI18n("es", spanishTranslations);
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Escrito por")).toBeInTheDocument();
        expect(screen.getByText("en")).toBeInTheDocument();
        expect(screen.getByText("Nueva Publicación")).toBeInTheDocument();
        expect(screen.getByText("Autor")).toBeInTheDocument();
        expect(screen.getByText("Categorías")).toBeInTheDocument();
        expect(screen.getByText("Buscar")).toBeInTheDocument();
      });
    });

    it("should render post metadata with Chinese translations", async () => {
      const chineseTranslations = {
        "post.writtenBy": "作者",
        "post.on": "于",
        "post.newPost": "新文章",
        "post.editPost": "编辑文章",
        "post.authorTitle": "作者",
        "categories.title": "分类",
        "categories.all": "全部",
        "categories.application": "应用",
        "categories.service": "服务",
        "categories.products": "产品",
        "categories.distributors": "经销商",
        "categories.news": "新闻",
        "search.title": "搜索",
      };
      const mockI18n = createMockI18n("zh-CN", chineseTranslations);
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("作者")).toBeInTheDocument();
        expect(screen.getByText("于")).toBeInTheDocument();
        expect(screen.getByText("新文章")).toBeInTheDocument();
        expect(screen.getByText("分类")).toBeInTheDocument();
        expect(screen.getByText("搜索")).toBeInTheDocument();
      });
    });

    it("should render post metadata with Arabic translations", async () => {
      const arabicTranslations = {
        "post.writtenBy": "كتبه",
        "post.on": "في",
        "post.newPost": "منشور جديد",
        "post.editPost": "تحرير المنشور",
        "post.authorTitle": "المؤلف",
        "categories.title": "الفئات",
        "categories.all": "الكل",
        "categories.application": "التطبيق",
        "categories.service": "الخدمة",
        "categories.products": "المنتجات",
        "categories.distributors": "الموزعون",
        "categories.news": "الأخبار",
        "search.title": "بحث",
      };
      const mockI18n = createMockI18n("ar", arabicTranslations);
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("كتبه")).toBeInTheDocument();
        expect(screen.getByText("في")).toBeInTheDocument();
        expect(screen.getByText("منشور جديد")).toBeInTheDocument();
        expect(screen.getByText("المؤلف")).toBeInTheDocument();
        expect(screen.getByText("الفئات")).toBeInTheDocument();
        expect(screen.getByText("بحث")).toBeInTheDocument();
      });
    });

    it("should render all category links with translations", async () => {
      const mockI18n = createMockI18n("en");
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Application")).toBeInTheDocument();
        expect(screen.getByText("Service")).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Distributors")).toBeInTheDocument();
        expect(screen.getByText("News")).toBeInTheDocument();
      });
    });
  });

  describe("Language switching updates component text", () => {
    it("should update text when language changes from English to Spanish", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Written by")).toBeInTheDocument();
      });

      const spanishTranslations = {
        "post.writtenBy": "Escrito por",
        "post.on": "en",
        "post.newPost": "Nueva Publicación",
        "post.editPost": "Editar Publicación",
        "post.authorTitle": "Autor",
        "categories.title": "Categorías",
        "categories.all": "Todas",
        "search.title": "Buscar",
      };
      const spanishI18n = createMockI18n("es", spanishTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
      queryClient.setQueryData(["post", "test-post"], mockPostData);

      rerender(
        <ClerkProvider publishableKey="test-key">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <I18nextProvider i18n={spanishI18n}>
                <SinglePostPage />
              </I18nextProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ClerkProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("Escrito por")).toBeInTheDocument();
        expect(screen.getByText("Nueva Publicación")).toBeInTheDocument();
        expect(screen.getByText("Autor")).toBeInTheDocument();
      });
    });

    it("should update text when language changes from English to Chinese", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Written by")).toBeInTheDocument();
      });

      const chineseTranslations = {
        "post.writtenBy": "作者",
        "post.on": "于",
        "post.newPost": "新文章",
        "post.editPost": "编辑文章",
        "post.authorTitle": "作者",
        "categories.title": "分类",
        "categories.all": "全部",
        "search.title": "搜索",
      };
      const chineseI18n = createMockI18n("zh-CN", chineseTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });
      queryClient.setQueryData(["post", "test-post"], mockPostData);

      rerender(
        <ClerkProvider publishableKey="test-key">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <I18nextProvider i18n={chineseI18n}>
                <SinglePostPage />
              </I18nextProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ClerkProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("作者")).toBeInTheDocument();
        expect(screen.getByText("新文章")).toBeInTheDocument();
        expect(screen.getByText("分类")).toBeInTheDocument();
      });
    });
  });

  describe("Missing keys show fallback text", () => {
    it("should display translation key when translation is missing", async () => {
      const mockI18n = createMockI18n("en", {});
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("post.writtenBy")).toBeInTheDocument();
        expect(screen.getByText("post.on")).toBeInTheDocument();
        expect(screen.getByText("post.newPost")).toBeInTheDocument();
        expect(screen.getByText("post.authorTitle")).toBeInTheDocument();
        expect(screen.getByText("categories.title")).toBeInTheDocument();
      });
    });

    it("should display fallback for partially missing Spanish translations", async () => {
      const partialSpanishTranslations = {
        "post.writtenBy": "Escrito por",
        "post.newPost": "Nueva Publicación",
        // Missing: post.on, post.authorTitle, categories.title, etc.
      };
      const mockI18n = createMockI18n("es", partialSpanishTranslations);
      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Escrito por")).toBeInTheDocument();
        expect(screen.getByText("Nueva Publicación")).toBeInTheDocument();
        expect(screen.getByText("post.on")).toBeInTheDocument();
        expect(screen.getByText("post.authorTitle")).toBeInTheDocument();
      });
    });
  });

  describe("Edit button visibility", () => {
    it("should show Edit Post button with correct translation for post owner", async () => {
      const mockI18n = createMockI18n("en");

      // Mock user to match post owner
      vi.mock("@clerk/clerk-react", async () => {
        const actual = await vi.importActual("@clerk/clerk-react");
        return {
          ...actual,
          useUser: () => ({
            user: {
              id: "clerk123",
              publicMetadata: {},
            },
          }),
        };
      });

      renderSinglePostPage(mockI18n);

      await waitFor(() => {
        expect(screen.getByText("Edit Post")).toBeInTheDocument();
      });
    });
  });
});

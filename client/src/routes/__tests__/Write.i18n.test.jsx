import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Write from "../Write";

// Mock ReactQuill
vi.mock("react-quill-new", () => ({
  default: ({ value, onChange }) => (
    <textarea
      data-testid="react-quill"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock Clerk
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }) => <div>{children}</div>,
  SignedIn: ({ children }) => <div>{children}</div>,
  SignedOut: () => null, // Don't render SignedOut content in tests
  UserButton: () => <div>User Button</div>,
  useAuth: () => ({
    getToken: vi.fn().mockResolvedValue("mock-token"),
    isSignedIn: true,
  }),
  useUser: () => ({
    user: { id: "user123" },
    isLoaded: true,
    isSignedIn: true,
  }),
}));

// Mock Upload component
vi.mock("../../components/upload", () => ({
  default: ({ children }) => <div data-testid="upload">{children}</div>,
}));

// Mock SEO component
vi.mock("../../components/SEO", () => ({
  default: ({ title, description }) => (
    <div data-testid="seo">
      <span data-testid="seo-title">{title}</span>
      <span data-testid="seo-description">{description}</span>
    </div>
  ),
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams()],
  };
});

const createMockI18n = (currentLanguage = "en", translations) => {
  const defaultTranslations = {
    "write.createPost": "Create a new post",
    "write.editPost": "Edit Post",
    "write.addCoverImage": "Add a cover image",
    "write.titlePlaceholder": "Title",
    "write.chooseCategory": "Choose a category",
    "write.descriptionPlaceholder": "A short description",
    "write.publish": "Publish",
    "write.update": "Update",
    "write.loading": "Loading...",
    "write.loadingState": "Loading...",
    "write.pleaseSignIn": "Please sign in",
    "write.loadingPostData": "Loading post data...",
    "write.failedToLoadPost": "Failed to load post data",
    "write.progress": "Progress: {{progress}}% uploaded",
    "categories.application": "Application",
    "categories.service": "Service",
    "categories.products": "Products",
    "categories.distributors": "Distributors",
    "categories.news": "News",
    "seoWrite.createTitle": "Create Post",
    "seoWrite.createDescription": "Create a new blog post",
    "seoWrite.editTitle": "Edit Post",
    "seoWrite.editDescription": "Edit your blog post",
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

const renderWrite = (mockI18n, isSignedIn = true) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nextProvider i18n={mockI18n}>
          <Write />
        </I18nextProvider>
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe("Write Component - i18n", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering with correct translations", () => {
    it("should render form labels with English translations", () => {
      const mockI18n = createMockI18n("en");
      renderWrite(mockI18n);

      expect(screen.getByText("Create a new post")).toBeInTheDocument();
      expect(screen.getByText("Add a cover image")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
      expect(screen.getByText("Choose a category")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("A short description"),
      ).toBeInTheDocument();
      expect(screen.getByText("Publish")).toBeInTheDocument();
    });

    it("should render form labels with Spanish translations", () => {
      const spanishTranslations = {
        "write.createPost": "Crear una nueva publicación",
        "write.addCoverImage": "Agregar imagen de portada",
        "write.titlePlaceholder": "Título",
        "write.chooseCategory": "Elegir una categoría",
        "write.descriptionPlaceholder": "Una breve descripción",
        "write.publish": "Publicar",
        "categories.application": "Aplicación",
        "categories.service": "Servicio",
        "categories.products": "Productos",
        "categories.distributors": "Distribuidores",
        "categories.news": "Noticias",
        "seoWrite.createTitle": "Crear Publicación",
        "seoWrite.createDescription": "Crear una nueva publicación de blog",
      };
      const mockI18n = createMockI18n("es", spanishTranslations);
      renderWrite(mockI18n);

      expect(
        screen.getByText("Crear una nueva publicación"),
      ).toBeInTheDocument();
      expect(screen.getByText("Agregar imagen de portada")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Título")).toBeInTheDocument();
      expect(screen.getByText("Elegir una categoría")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Una breve descripción"),
      ).toBeInTheDocument();
      expect(screen.getByText("Publicar")).toBeInTheDocument();
    });

    it("should render form labels with Chinese translations", () => {
      const chineseTranslations = {
        "write.createPost": "创建新文章",
        "write.addCoverImage": "添加封面图片",
        "write.titlePlaceholder": "标题",
        "write.chooseCategory": "选择分类",
        "write.descriptionPlaceholder": "简短描述",
        "write.publish": "发布",
        "categories.application": "应用",
        "categories.service": "服务",
        "categories.products": "产品",
        "categories.distributors": "经销商",
        "categories.news": "新闻",
        "seoWrite.createTitle": "创建文章",
        "seoWrite.createDescription": "创建新的博客文章",
      };
      const mockI18n = createMockI18n("zh-CN", chineseTranslations);
      renderWrite(mockI18n);

      expect(screen.getByText("创建新文章")).toBeInTheDocument();
      expect(screen.getByText("添加封面图片")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("标题")).toBeInTheDocument();
      expect(screen.getByText("选择分类")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("简短描述")).toBeInTheDocument();
      expect(screen.getByText("发布")).toBeInTheDocument();
    });

    it("should render form labels with Arabic translations", () => {
      const arabicTranslations = {
        "write.createPost": "إنشاء منشور جديد",
        "write.addCoverImage": "إضافة صورة الغلاف",
        "write.titlePlaceholder": "العنوان",
        "write.chooseCategory": "اختر فئة",
        "write.descriptionPlaceholder": "وصف قصير",
        "write.publish": "نشر",
        "categories.application": "التطبيق",
        "categories.service": "الخدمة",
        "categories.products": "المنتجات",
        "categories.distributors": "الموزعون",
        "categories.news": "الأخبار",
        "seoWrite.createTitle": "إنشاء منشور",
        "seoWrite.createDescription": "إنشاء منشور مدونة جديد",
      };
      const mockI18n = createMockI18n("ar", arabicTranslations);
      renderWrite(mockI18n);

      expect(screen.getByText("إنشاء منشور جديد")).toBeInTheDocument();
      expect(screen.getByText("إضافة صورة الغلاف")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("العنوان")).toBeInTheDocument();
      expect(screen.getByText("اختر فئة")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("وصف قصير")).toBeInTheDocument();
      expect(screen.getByText("نشر")).toBeInTheDocument();
    });

    it("should render all category options with translations", () => {
      const mockI18n = createMockI18n("en");
      renderWrite(mockI18n);

      expect(screen.getByText("Application")).toBeInTheDocument();
      expect(screen.getByText("Service")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Distributors")).toBeInTheDocument();
      expect(screen.getByText("News")).toBeInTheDocument();
    });

    it("should render SEO metadata with correct translations", () => {
      const mockI18n = createMockI18n("en");
      renderWrite(mockI18n);

      const seoTitle = screen.getByTestId("seo-title");
      const seoDescription = screen.getByTestId("seo-description");

      expect(seoTitle).toHaveTextContent("Create Post");
      expect(seoDescription).toHaveTextContent("Create a new blog post");
    });
  });

  describe("Language switching updates component text", () => {
    it("should update text when language changes from English to Spanish", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderWrite(mockI18n);

      expect(screen.getByText("Create a new post")).toBeInTheDocument();

      const spanishTranslations = {
        "write.createPost": "Crear una nueva publicación",
        "write.addCoverImage": "Agregar imagen de portada",
        "write.titlePlaceholder": "Título",
        "write.chooseCategory": "Elegir una categoría",
        "write.descriptionPlaceholder": "Una breve descripción",
        "write.publish": "Publicar",
        "categories.application": "Aplicación",
        "seoWrite.createTitle": "Crear Publicación",
        "seoWrite.createDescription": "Crear una nueva publicación de blog",
      };
      const spanishI18n = createMockI18n("es", spanishTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      rerender(
        <ClerkProvider publishableKey="test-key">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <I18nextProvider i18n={spanishI18n}>
                <Write />
              </I18nextProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ClerkProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByText("Crear una nueva publicación"),
        ).toBeInTheDocument();
        expect(
          screen.getByText("Agregar imagen de portada"),
        ).toBeInTheDocument();
        expect(screen.getByText("Publicar")).toBeInTheDocument();
      });
    });

    it("should update text when language changes from English to Chinese", async () => {
      const mockI18n = createMockI18n("en");
      const { rerender } = renderWrite(mockI18n);

      expect(screen.getByText("Create a new post")).toBeInTheDocument();

      const chineseTranslations = {
        "write.createPost": "创建新文章",
        "write.addCoverImage": "添加封面图片",
        "write.titlePlaceholder": "标题",
        "write.chooseCategory": "选择分类",
        "write.descriptionPlaceholder": "简短描述",
        "write.publish": "发布",
        "categories.application": "应用",
        "seoWrite.createTitle": "创建文章",
        "seoWrite.createDescription": "创建新的博客文章",
      };
      const chineseI18n = createMockI18n("zh-CN", chineseTranslations);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
        },
      });

      rerender(
        <ClerkProvider publishableKey="test-key">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <I18nextProvider i18n={chineseI18n}>
                <Write />
              </I18nextProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </ClerkProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText("创建新文章")).toBeInTheDocument();
        expect(screen.getByText("添加封面图片")).toBeInTheDocument();
        expect(screen.getByText("发布")).toBeInTheDocument();
      });
    });
  });

  describe("Missing keys show fallback text", () => {
    it("should display translation key when translation is missing", () => {
      const mockI18n = createMockI18n("en", {});
      renderWrite(mockI18n);

      expect(screen.getByText("write.createPost")).toBeInTheDocument();
      expect(screen.getByText("write.addCoverImage")).toBeInTheDocument();
      expect(screen.getByText("write.chooseCategory")).toBeInTheDocument();
      expect(screen.getByText("write.publish")).toBeInTheDocument();
    });

    it("should display fallback for partially missing Spanish translations", () => {
      const partialSpanishTranslations = {
        "write.createPost": "Crear una nueva publicación",
        "write.publish": "Publicar",
        // Missing: write.addCoverImage, write.chooseCategory, etc.
      };
      const mockI18n = createMockI18n("es", partialSpanishTranslations);
      renderWrite(mockI18n);

      expect(
        screen.getByText("Crear una nueva publicación"),
      ).toBeInTheDocument();
      expect(screen.getByText("Publicar")).toBeInTheDocument();
      expect(screen.getByText("write.addCoverImage")).toBeInTheDocument();
      expect(screen.getByText("write.chooseCategory")).toBeInTheDocument();
    });
  });

  describe("Dynamic content with interpolation", () => {
    it("should handle progress interpolation in translations", () => {
      const mockI18n = createMockI18n("en");
      renderWrite(mockI18n);

      // Progress should be displayed with interpolation
      expect(screen.getByText("Progress: 0% uploaded")).toBeInTheDocument();
    });
  });

  describe("Authentication states", () => {
    it("should show sign-in message when user is not signed in", () => {
      const mockI18n = createMockI18n("en");
      renderWrite(mockI18n, false);

      expect(screen.getByText("Please sign in")).toBeInTheDocument();
    });
  });
});

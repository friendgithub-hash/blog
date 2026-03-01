import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import SEO from "../SEO";

// Helper to create a mock i18n instance
const createMockI18n = (currentLanguage = "en", translations = {}) => {
  const mockI18n = i18n.createInstance();
  mockI18n.init({
    lng: currentLanguage,
    fallbackLng: "en",
    resources: {
      en: {
        translation: {
          "seo.homepage.title": "Advanced Negative Pressure Ink Supply Systems",
          "seo.homepage.description":
            "Negative pressure systems are critical components in UV printing, designed to stabilize ink delivery by creating a vacuum that balances gravitational forces. This technology ensures a stable ink meniscus at the nozzle, preventing dripping and enabling high-speed, continuous production across various orientations.",
          "seo.posts.title": "All Posts",
          "seo.posts.description": "Browse all blog posts",
          "seo.contact.title": "Contact Us",
          "seo.contact.description": "Get in touch with us",
          ...translations.en,
        },
      },
      es: {
        translation: {
          "seo.homepage.title":
            "Sistemas Avanzados de Suministro de Tinta con Presión Negativa",
          "seo.homepage.description":
            "Los sistemas de presión negativa son componentes críticos en la impresión UV, diseñados para estabilizar el suministro de tinta mediante la creación de un vacío que equilibra las fuerzas gravitacionales. Esta tecnología garantiza un menisco de tinta estable en la boquilla, evitando goteos y permitiendo una producción continua de alta velocidad en diversas orientaciones.",
          "seo.posts.title": "Todas las Publicaciones",
          "seo.posts.description": "Explorar todas las publicaciones del blog",
          "seo.contact.title": "Contáctanos",
          "seo.contact.description": "Ponte en contacto con nosotros",
          ...translations.es,
        },
      },
      "zh-CN": {
        translation: {
          "seo.homepage.title": "先进的负压供墨系统",
          "seo.homepage.description":
            "负压系统是UV印刷中的关键组件，通过创建平衡重力的真空来稳定墨水输送。该技术确保喷嘴处墨水弯月面的稳定，防止滴漏，并能够在各种方向上实现高速连续生产。",
          "seo.posts.title": "所有文章",
          "seo.posts.description": "浏览所有博客文章",
          "seo.contact.title": "联系我们",
          "seo.contact.description": "与我们取得联系",
          ...translations["zh-CN"],
        },
      },
      ar: {
        translation: {
          "seo.homepage.title": "أنظمة متقدمة لتوريد الحبر بالضغط السلبي",
          "seo.homepage.description":
            "تعتبر أنظمة الضغط السلبي مكونات حاسمة في الطباعة بالأشعة فوق البنفسجية، مصممة لتثبيت توصيل الحبر من خلال إنشاء فراغ يوازن قوى الجاذبية. تضمن هذه التقنية استقرار سطح الحبر عند الفوهة، مما يمنع التنقيط ويتيح إنتاجاً مستمراً عالي السرعة في مختلف الاتجاهات.",
          "seo.posts.title": "جميع المنشورات",
          "seo.posts.description": "تصفح جميع منشورات المدونة",
          "seo.contact.title": "اتصل بنا",
          "seo.contact.description": "تواصل معنا",
          ...translations.ar,
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
  return mockI18n;
};

// Helper to render SEO component with i18n
const renderSEO = (mockI18n, props = {}) => {
  return render(
    <I18nextProvider i18n={mockI18n}>
      <div data-testid="seo-wrapper">
        <SEO {...props} />
        {/* Add test elements to verify metadata */}
        <span data-testid="seo-title">{document.title}</span>
        <span data-testid="seo-description">
          {document.querySelector('meta[name="description"]')?.content}
        </span>
      </div>
    </I18nextProvider>,
  );
};

describe("SEO Component - i18n", () => {
  beforeEach(() => {
    // Clear document metadata before each test
    document.title = "";
    const existingMeta = document.querySelector('meta[name="description"]');
    if (existingMeta) {
      existingMeta.remove();
    }
  });

  describe("Property Test: SEO metadata translation", () => {
    const routes = [
      {
        titleKey: "seo.homepage.title",
        descriptionKey: "seo.homepage.description",
        url: "/",
      },
      {
        titleKey: "seo.posts.title",
        descriptionKey: "seo.posts.description",
        url: "/posts",
      },
      {
        titleKey: "seo.contact.title",
        descriptionKey: "seo.contact.description",
        url: "/contact",
      },
    ];

    const languages = ["en", "es", "zh-CN", "ar"];

    const expectedTranslations = {
      en: {
        "seo.homepage.title": "Advanced Negative Pressure Ink Supply Systems",
        "seo.homepage.description":
          "Negative pressure systems are critical components in UV printing, designed to stabilize ink delivery by creating a vacuum that balances gravitational forces. This technology ensures a stable ink meniscus at the nozzle, preventing dripping and enabling high-speed, continuous production across various orientations.",
        "seo.posts.title": "All Posts",
        "seo.posts.description": "Browse all blog posts",
        "seo.contact.title": "Contact Us",
        "seo.contact.description": "Get in touch with us",
      },
      es: {
        "seo.homepage.title":
          "Sistemas Avanzados de Suministro de Tinta con Presión Negativa",
        "seo.homepage.description":
          "Los sistemas de presión negativa son componentes críticos en la impresión UV, diseñados para estabilizar el suministro de tinta mediante la creación de un vacío que equilibra las fuerzas gravitacionales. Esta tecnología garantiza un menisco de tinta estable en la boquilla, evitando goteos y permitiendo una producción continua de alta velocidad en diversas orientaciones.",
        "seo.posts.title": "Todas las Publicaciones",
        "seo.posts.description": "Explorar todas las publicaciones del blog",
        "seo.contact.title": "Contáctanos",
        "seo.contact.description": "Ponte en contacto con nosotros",
      },
      "zh-CN": {
        "seo.homepage.title": "先进的负压供墨系统",
        "seo.homepage.description":
          "负压系统是UV印刷中的关键组件，通过创建平衡重力的真空来稳定墨水输送。该技术确保喷嘴处墨水弯月面的稳定，防止滴漏，并能够在各种方向上实现高速连续生产。",
        "seo.posts.title": "所有文章",
        "seo.posts.description": "浏览所有博客文章",
        "seo.contact.title": "联系我们",
        "seo.contact.description": "与我们取得联系",
      },
      ar: {
        "seo.homepage.title": "أنظمة متقدمة لتوريد الحبر بالضغط السلبي",
        "seo.homepage.description":
          "تعتبر أنظمة الضغط السلبي مكونات حاسمة في الطباعة بالأشعة فوق البنفسجية، مصممة لتثبيت توصيل الحبر من خلال إنشاء فراغ يوازن قوى الجاذبية. تضمن هذه التقنية استقرار سطح الحبر عند الفوهة، مما يمنع التنقيط ويتيح إنتاجاً مستمراً عالي السرعة في مختلف الاتجاهات.",
        "seo.posts.title": "جميع المنشورات",
        "seo.posts.description": "تصفح جميع منشورات المدونة",
        "seo.contact.title": "اتصل بنا",
        "seo.contact.description": "تواصل معنا",
      },
    };

    routes.forEach((route) => {
      languages.forEach((lang) => {
        it(`should translate SEO metadata correctly for ${route.url} in ${lang}`, () => {
          const mockI18n = createMockI18n(lang);

          renderSEO(mockI18n, {
            titleKey: route.titleKey,
            descriptionKey: route.descriptionKey,
            url: route.url,
          });

          const expectedTitle = expectedTranslations[lang][route.titleKey];
          const expectedDescription =
            expectedTranslations[lang][route.descriptionKey];

          // Verify title includes the translated text
          expect(document.title).toContain(expectedTitle);

          // Verify description meta tag (note: SEO component truncates to 160 chars)
          const descriptionMeta = document.querySelector(
            'meta[name="description"]',
          );
          // For homepage, description is longer than 160 chars and gets truncated
          if (route.url === "/") {
            expect(descriptionMeta?.content).toContain(
              expectedDescription.substring(0, 100),
            );
          } else {
            expect(descriptionMeta?.content).toBe(expectedDescription);
          }
        });
      });
    });

    it("should fall back to direct props when translation keys are not provided", () => {
      const mockI18n = createMockI18n("en");

      renderSEO(mockI18n, {
        title: "Direct Title",
        description: "Direct description text",
        url: "/test",
      });

      expect(document.title).toContain("Direct Title");

      const descriptionMeta = document.querySelector(
        'meta[name="description"]',
      );
      expect(descriptionMeta?.content).toBe("Direct description text");
    });

    it("should update HTML lang attribute based on current language", () => {
      const languages = [
        { code: "en", expected: "en" },
        { code: "es", expected: "es" },
        { code: "zh-CN", expected: "zh-CN" },
        { code: "ar", expected: "ar" },
      ];

      languages.forEach(({ code, expected }) => {
        const mockI18n = createMockI18n(code);

        renderSEO(mockI18n, {
          titleKey: "seo.homepage.title",
          descriptionKey: "seo.homepage.description",
          url: "/",
        });

        expect(document.documentElement.lang).toBe(expected);
      });
    });
  });

  describe("Translation key priority", () => {
    it("should prioritize titleKey over title prop", () => {
      const mockI18n = createMockI18n("en");

      renderSEO(mockI18n, {
        title: "Direct Title",
        titleKey: "seo.homepage.title",
        url: "/",
      });

      expect(document.title).toContain(
        "Advanced Negative Pressure Ink Supply Systems",
      );
      expect(document.title).not.toContain("Direct Title");
    });

    it("should prioritize descriptionKey over description prop", () => {
      const mockI18n = createMockI18n("en");

      renderSEO(mockI18n, {
        description: "Direct description",
        descriptionKey: "seo.homepage.description",
        url: "/",
      });

      const descriptionMeta = document.querySelector(
        'meta[name="description"]',
      );
      expect(descriptionMeta?.content).toContain("Negative pressure systems");
      expect(descriptionMeta?.content).not.toContain("Direct description");
    });
  });
});

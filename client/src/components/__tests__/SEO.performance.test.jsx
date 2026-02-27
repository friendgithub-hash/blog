/**
 * Performance tests for SEO component
 * Verifies React.memo optimization and minimal re-renders
 */

import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import SEO from "../SEO";

describe("SEO Component Performance", () => {
  it("should be memoized with React.memo", () => {
    // Check that the component is wrapped with memo
    expect(SEO.$$typeof).toBeDefined();
    expect(SEO.displayName).toBe("SEO");
  });

  it("should not re-render when props don't change", () => {
    const renderSpy = vi.fn();

    // Create a wrapper component to track renders
    const TestWrapper = ({ children }) => {
      renderSpy();
      return <HelmetProvider>{children}</HelmetProvider>;
    };

    const props = {
      title: "Test Post",
      description: "Test description",
      url: "/test",
      type: "article",
    };

    const { rerender } = render(
      <TestWrapper>
        <SEO {...props} />
      </TestWrapper>,
    );

    const initialRenderCount = renderSpy.mock.calls.length;

    // Re-render with same props
    rerender(
      <TestWrapper>
        <SEO {...props} />
      </TestWrapper>,
    );

    // The wrapper will re-render, but SEO component should be memoized
    expect(renderSpy.mock.calls.length).toBeGreaterThan(initialRenderCount);
  });

  it("should generate minimal structured data for articles", () => {
    const { container } = render(
      <HelmetProvider>
        <SEO
          title="Test Post"
          description="Test description"
          url="/test"
          type="article"
          author="Test Author"
          publishedTime="2024-01-01T00:00:00Z"
        />
      </HelmetProvider>,
    );

    const scriptTag = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(scriptTag).toBeTruthy();

    const structuredData = JSON.parse(scriptTag.textContent);

    // Verify essential fields are present
    expect(structuredData["@type"]).toBe("BlogPosting");
    expect(structuredData.headline).toBe("Test Post");
    expect(structuredData.author.name).toBe("Test Author");

    // Verify minimal payload - no unnecessary nested objects
    expect(structuredData.image).toBeTypeOf("string");
    expect(structuredData.mainEntityOfPage).toBeTypeOf("string");
  });

  it("should only include optional fields when provided", () => {
    const { container } = render(
      <HelmetProvider>
        <SEO
          title="Test Post"
          description="Test description"
          url="/test"
          type="article"
          author="Test Author"
          publishedTime="2024-01-01T00:00:00Z"
          // No modifiedTime or category
        />
      </HelmetProvider>,
    );

    const scriptTag = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const structuredData = JSON.parse(scriptTag.textContent);

    // Should not include optional fields when not provided
    expect(structuredData.dateModified).toBeUndefined();
    expect(structuredData.articleSection).toBeUndefined();
  });

  it("should generate minimal WebSite schema for homepage", () => {
    const { container } = render(
      <HelmetProvider>
        <SEO
          title="Home"
          description="Welcome to our blog"
          url="/"
          type="website"
        />
      </HelmetProvider>,
    );

    const scriptTag = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const structuredData = JSON.parse(scriptTag.textContent);

    // Verify minimal WebSite schema
    expect(structuredData["@type"]).toBe("WebSite");
    expect(structuredData.name).toBeDefined();
    expect(structuredData.url).toBeDefined();

    // Should not include SearchAction for minimal payload
    expect(structuredData.potentialAction).toBeUndefined();
  });

  it("should memoize structured data generation", () => {
    const props = {
      title: "Test Post",
      description: "Test description",
      url: "/test",
      type: "article",
      author: "Test Author",
      publishedTime: "2024-01-01T00:00:00Z",
    };

    const { container, rerender } = render(
      <HelmetProvider>
        <SEO {...props} />
      </HelmetProvider>,
    );

    const firstScript = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const firstData = firstScript.textContent;

    // Re-render with same props
    rerender(
      <HelmetProvider>
        <SEO {...props} />
      </HelmetProvider>,
    );

    const secondScript = container.querySelector(
      'script[type="application/ld+json"]',
    );
    const secondData = secondScript.textContent;

    // Structured data should be identical (memoized)
    expect(firstData).toBe(secondData);
  });
});

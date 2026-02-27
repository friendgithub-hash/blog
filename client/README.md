# React + Vite Blog Application

This is a MERN stack blog application built with React, Vite, and comprehensive SEO optimization.

## Tech Stack

- React 19 RC with Vite for fast development
- React Query for data fetching and caching
- React 19 Native Document Metadata for SEO meta tag management
- Clerk for authentication
- TailwindCSS for styling

## SEO Features

This application includes comprehensive SEO optimization for better search engine visibility and social media sharing:

### Dynamic Meta Tags

- Unique title and description for each page
- Automatic meta description generation from post content
- Keywords based on post categories
- Canonical URLs to prevent duplicate content issues
- Robots meta tags for crawler control

### Open Graph Tags

Full Open Graph support for rich Facebook previews:

- `og:title` - Post or page title
- `og:description` - Post description or excerpt
- `og:image` - Post cover image or default image (1200x630px)
- `og:url` - Canonical URL
- `og:type` - "article" for posts, "website" for other pages
- `og:site_name` - Blog name
- `article:published_time` - Publication date
- `article:modified_time` - Last update date
- `article:author` - Post author
- `article:section` - Post category

### Twitter Cards

Twitter Card support for rich tweet previews:

- `twitter:card` - "summary_large_image" for better visibility
- `twitter:title` - Post or page title
- `twitter:description` - Post description
- `twitter:image` - Post cover image or default image

### Structured Data (JSON-LD)

Schema.org structured data for rich search results:

- **BlogPosting** schema for individual posts with:
  - headline, description, image
  - datePublished, dateModified
  - author (Person schema)
  - publisher (Organization schema)
  - articleSection (category)
  - mainEntityOfPage
- **WebSite** schema for homepage with:
  - name, url
  - potentialAction (SearchAction)

### SEO Best Practices

- Semantic HTML structure (H1, H2, proper heading hierarchy)
- Optimized title length (under 60 characters)
- Meta descriptions (50-160 characters)
- Absolute URLs for all resources
- Image optimization for social sharing
- React Query caching for performance
- Dynamic SEO generation (no separate database storage)

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# SEO Configuration
VITE_SITE_URL=https://yourdomain.com
VITE_SITE_NAME=Your Blog Name

# API Configuration
VITE_API_URL=http://localhost:3000
VITE_IMG_URL=your_imagekit_url
```

### SEO Environment Variables

- **VITE_SITE_URL**: The production URL of your site (e.g., `https://yourblog.com`)
  - Used for generating absolute URLs for Open Graph and Twitter Cards
  - Required for social media previews to work correctly
  - Should NOT include trailing slash

- **VITE_SITE_NAME**: The name of your blog (e.g., "My Awesome Blog")
  - Used in page titles and structured data
  - Appears in social media previews
  - Used in the publisher field of structured data

## Testing SEO Implementation

### Facebook Sharing Debugger

Test how your posts appear when shared on Facebook:

1. Visit [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your post URL (e.g., `https://yourdomain.com/post/my-post-slug`)
3. Click "Debug" to see how Facebook sees your page
4. Verify:
   - Title displays correctly
   - Description is compelling and accurate
   - Image loads and displays (1200x630px recommended)
   - No errors or warnings
5. Click "Scrape Again" if you've made changes

### Twitter Card Validator

Test how your posts appear when shared on Twitter:

1. Visit [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your post URL
3. Click "Preview card" to see the Twitter Card
4. Verify:
   - Card type is "summary_large_image"
   - Title and description are correct
   - Image displays properly
   - No truncation issues

### Google Rich Results Test

Validate your structured data for Google search:

1. Visit [Google Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your post URL or paste your HTML
3. Click "Test URL" or "Test Code"
4. Verify:
   - No errors in structured data
   - BlogPosting schema is recognized
   - All required properties are present
   - Warnings are addressed (if any)

### Lighthouse SEO Audit

Run a comprehensive SEO audit:

1. Open your site in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Select "SEO" category
5. Click "Analyze page load"
6. Review the report and address any issues
7. Target score: 90+

## Content Creator Guidelines

### Writing SEO-Friendly Posts

1. **Title Optimization**
   - Keep titles under 60 characters
   - Include primary keywords naturally
   - Make titles compelling and descriptive
   - Avoid clickbait or misleading titles

2. **Description Best Practices**
   - Write descriptions between 50-160 characters
   - Include a call-to-action when appropriate
   - Summarize the post's main value
   - Use natural language, not keyword stuffing

3. **Image Guidelines**
   - Use high-quality cover images
   - Recommended size: 1200x630px for optimal social sharing
   - Ensure images are relevant to content
   - Use descriptive file names
   - Images should be under 1MB for performance

4. **Content Structure**
   - Use H2 headings for main sections
   - Break content into readable paragraphs
   - Use bold text for emphasis
   - Include relevant images throughout
   - Keep paragraphs short (3-4 sentences)

5. **Category Selection**
   - Choose the most relevant category
   - Categories become keywords for SEO
   - Be consistent with category usage

### SEO Checklist for Each Post

- [ ] Title is descriptive and under 60 characters
- [ ] Description is compelling and 50-160 characters
- [ ] Cover image is high-quality (1200x630px recommended)
- [ ] Content uses proper heading structure (H2 for sections)
- [ ] Category is selected appropriately
- [ ] Content is at least 300 words for better SEO
- [ ] Links to other posts or external resources are included
- [ ] Post is proofread for grammar and spelling

### Testing Your Posts

After publishing a post:

1. Test the post URL in Facebook Sharing Debugger
2. Test the post URL in Twitter Card Validator
3. Verify the post appears correctly in search results (may take time)
4. Check that images load properly in social previews
5. Ensure the post title and description are compelling

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Vite Plugins

Currently using:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Additional Resources

- [Open Graph Protocol](https://ogp.me/) - Official OG documentation
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards) - Twitter Card specs
- [Schema.org](https://schema.org/) - Structured data vocabulary
- [Google Search Central](https://developers.google.com/search) - SEO best practices
- [React 19 Document Metadata](https://react.dev/blog/2024/04/25/react-19) - Native meta tag management

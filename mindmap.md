# Blog App Project Mindmap

## Project Overview

- **Name**: lamadevblogapp
- **Type**: React + Vite Blog Application
- **Version**: 0.0.0

## Tech Stack

### Core

- React 19 (RC)
- Vite 5.4.10
- JavaScript/JSX

### Styling

- Tailwind CSS 3.4.14
- PostCSS 8.4.47
- Autoprefixer 10.4.20

### Development Tools

- ESLint 9.13.0
- Vite Plugin React 4.3.3

### External Services

- ImageKit.io (image optimization & CDN)

## Project Structure

### Root Files

- index.html
- package.json
- vite.config.js
- tailwind.config.js
- postcss.config.js
- eslint.config.js
- .gitignore
- README.md

### Source (`/src`)

- main.jsx (entry point)
- App.jsx (main component)
- index.css (global styles)
- `/components`
  - Navbar.jsx
  - Image.jsx

### Public Assets (`/public`)

- Images
  - logo.png
  - userImg.jpeg
  - postImg.jpeg
  - featured1-4.jpeg
- Icons
  - favicon.ico
  - delete.svg
  - facebook.svg
  - instagram.svg

## Application Features (Planned)

### Current Components

- Navbar (responsive navigation with mobile menu)
- Image (ImageKit integration for optimized images)

### Planned Sections (from App.jsx comments)

- Breadcrumbs
- Introduction
- Featured Posts
- Post List

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Responsive Design

- Mobile: px-4
- Tablet (md): px-8
- Desktop (lg): px-16
- Large (xl): px-32
- Extra Large (2xl): px-64

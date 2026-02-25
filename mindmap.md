# Blog App Project Mindmap

## Project Overview

- **Name**: lamadevblogapp
- **Type**: Full-Stack Blog Application (MERN Stack)
- **Version**: 0.0.0
- **Architecture**: Client-Server (Monorepo)

## Tech Stack

### Frontend (Client)

#### Core

- React 19 (RC)
- Vite 5.4.10
- JavaScript/JSX
- React Router DOM 7.13.0

#### Styling

- Tailwind CSS 3.4.14
- PostCSS 8.4.47
- Autoprefixer 10.4.20

#### Key Libraries

- Clerk React 5.61.1 (Authentication)
- ImageKit.io React 4.3.0 (Image optimization)
- React Quill New 3.8.3 (Rich text editor)
- TanStack React Query 5.90.21 (Data fetching & caching)
- Axios 1.13.5 (HTTP client)
- React Infinite Scroll Component 6.1.1 (Infinite scrolling)
- React Toastify 11.0.5 (Toast notifications)
- Timeago.js 4.0.2 (Relative time formatting)

#### Development Tools

- ESLint 9.13.0
- Vite Plugin React 4.3.3

### Backend (Server)

#### Core

- Node.js (ES Modules)
- Express 5.2.1
- MongoDB (via Mongoose 9.2.1)

#### Key Libraries

- Clerk Express 1.7.73 (Authentication middleware)
- ImageKit 6.0.0 (Image upload & management)
- CORS 2.8.6 (Cross-origin resource sharing)
- Svix 1.85.0 (Webhook verification)
- Body Parser 2.2.2 (Request body parsing)

#### Architecture

- RESTful API
- MVC Pattern (Models, Controllers, Routes)

## Project Structure

### Root

- `/client` - Frontend application
- `/backend` - Backend API server
- `mindmap.md` - Project documentation

### Client Structure (`/client`)

#### Root Files

- index.html
- package.json
- vite.config.js
- tailwind.config.js
- postcss.config.js
- eslint.config.js
- .gitignore
- .env (Clerk & ImageKit config)

#### Source (`/client/src`)

- main.jsx (entry point with routing)
- App.jsx (legacy, not used in routing)
- index.css (global styles)

#### Layouts (`/client/src/layouts`)

- MainLayout.jsx

#### Routes/Pages (`/client/src/routes`)

- Homepage.jsx
- PostListPage.jsx
- SinglePostPage.jsx
- Write.jsx
- LoginPage.jsx
- RegisterPage.jsx

#### Components (`/client/src/components`)

- Navbar.jsx (responsive navigation)
- Image.jsx (ImageKit integration)
- Upload.jsx (image upload component)
- FeaturedPosts.jsx
- PostList.jsx
- PostListItem.jsx
- PostMenuActions.jsx
- Comments.jsx
- comment.jsx
- Search.jsx
- SideMenu.jsx
- MainCategories.jsx

#### Public Assets (`/client/public`)

- Images: logo.png, userImg.jpeg, postImg.jpeg, featured1-4.jpeg
- Icons: favicon.ico, delete.svg, facebook.svg, instagram.svg

### Backend Structure (`/backend`)

#### Root Files

- index.js (Express server entry point)
- package.json
- .env (MongoDB connection string)

#### Models (`/backend/models`)

- user.model.js (User schema)
- post.model.js (Post schema)
- comment.model.js (Comment schema)

#### Controllers (`/backend/controllers`)

- post.controller.js (Post CRUD, pagination, feature, ImageKit auth)
- comment.controller.js (Comment CRUD logic)
- user.controller.js (User saved posts logic)
- webhook.controller.js (Clerk webhook handler)

#### Routes (`/backend/routes`)

- user.route.js (User saved posts endpoints)
- post.route.js (Post CRUD & feature endpoints)
- comment.route.js (Comment CRUD endpoints)
- webhook.route.js (Clerk webhook endpoint)

#### Library (`/backend/lib`)

- connectDB.js (MongoDB connection)

## Data Models

### User Model

- clerkUserId (String, unique, required)
- username (String, unique, required)
- email (String, unique, required)
- img (String, optional)
- savedPosts (Array of Strings)
- timestamps (createdAt, updatedAt)

### Post Model

- user (ObjectId ref User, required)
- img (String, optional)
- title (String, required)
- slug (String, unique, required)
- desc (String, optional)
- content (String, required)
- isFeatured (Boolean, default: false)
- visits (Number, default: 0)
- timestamps (createdAt, updatedAt)

### Comment Model

- user (ObjectId ref User, required)
- post (ObjectId ref Post, required)
- desc (String, required)
- timestamps (createdAt, updatedAt)

## API Endpoints

### Posts (`/posts`)

- GET `/upload-auth` - Get ImageKit authentication parameters
- GET `/` - Get all posts (with pagination: ?page=1&limit=2)
- GET `/:slug` - Get single post by slug (with user populated)
- POST `/` - Create new post (auth required, auto-generates unique slug)
- DELETE `/:id` - Delete post by ID (auth required, owner or admin only)
- PATCH `/feature` - Toggle post featured status (admin only)

### Users (`/users`)

- GET `/saved` - Get user's saved posts (auth required)
- PATCH `/save` - Save/unsave a post (auth required, toggle)

### Comments (`/comments`)

- GET `/:postId` - Get all comments for a post (sorted by newest)
- POST `/:postId` - Add comment to a post (auth required)
- DELETE `/:id` - Delete comment by ID (auth required, owner or admin only)

### Webhooks (`/webhooks`)

- POST `/clerk` - Clerk user creation webhook (creates user in MongoDB)

## Application Features

### Fully Implemented

- User authentication (Clerk with webhook sync)
- Fallback user creation (if webhook fails, users created on first post/comment)
- Responsive navigation with mobile menu
- Image optimization & upload (ImageKit)
- Rich text editor for writing posts (React Quill)
- Post CRUD operations (create, read, delete)
- Post pagination with infinite scroll
- Comment system (add, view, delete with user population)
- User saved posts (save/unsave toggle)
- Featured posts (admin can toggle, displayed on homepage)
- Role-based access control (admin vs user)
- Auto-generated unique post slugs
- Relative time formatting (timeago)
- Toast notifications for user feedback
- CORS enabled for client-server communication
- MongoDB data persistence with population
- Post filtering (by category, author, search, featured)
- Post sorting (newest, oldest, popular, trending)
- Error handling with try-catch wrappers
- Optional chaining for safe data access

### Bug Fixes Applied

- Fixed webhook signature verification (Buffer to string conversion)
- Fixed environment variable naming consistency (VITE_API_URL vs VITE_BASE_URL)
- Fixed comment model import path (case sensitivity)
- Fixed missing await in deleteComment
- Fixed featured post routing (added /post/ prefix)
- Fixed user data access with optional chaining
- Fixed fallback user creation with proper email extraction

### In Development

- Post search functionality (backend ready, frontend pending)
- Post categories/filtering UI
- User profile editing

## Key Features & Patterns

### Authentication Flow

1. User signs up via Clerk
2. Clerk webhook triggers user creation in MongoDB
3. clerkUserId links Clerk account to MongoDB user
4. Protected routes use Clerk middleware
5. Fallback: If webhook fails, user created on first post/comment action

### Post Creation Flow

1. User uploads image to ImageKit (via Upload component)
2. User writes content with React Quill editor
3. Backend auto-generates unique slug from title
4. Post saved with user reference
5. User data populated before response

### Comment Flow

1. User submits comment on post
2. Backend checks for user in MongoDB
3. If user missing, creates fallback user from Clerk session
4. Comment saved with user and post references
5. Comment returned with populated user data (username, img)

### Pagination & Infinite Scroll

- Backend returns posts with hasMore flag
- Frontend uses react-infinite-scroll-component
- Default limit: 2 posts per page
- Supports filtering and sorting

### Authorization Levels

- **User**: Can create/delete own posts & comments, save posts
- **Admin**: Can delete any post/comment, feature posts

### Error Handling

- Try-catch wrappers in all async functions
- Optional chaining for safe property access
- Graceful fallbacks for missing data
- Toast notifications for user-facing errors
- Detailed console logging for debugging

## Backend Configuration

- Server runs on port 3000
- MongoDB connection on startup
- Global error handler middleware
- JSON body parsing enabled (except webhooks)
- Clerk middleware for authentication
- CORS configured for client URL
- Webhook endpoint with raw body parsing (before JSON middleware)
- Role-based authorization (admin/user)
- ImageKit server-side authentication
- Comprehensive logging for debugging

## Client Scripts

- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Backend Scripts

- `node index.js` - Start Express server (port 3000)
- No test script configured yet

## Responsive Design Breakpoints

- Mobile: px-4
- Tablet (md): px-8
- Desktop (lg): px-16
- Large (xl): px-32
- Extra Large (2xl): px-64
- Large (xl): px-32
- Extra Large (2xl): px-64

## Development Workflow

### Local Development Setup

1. Start MongoDB (local or Atlas)
2. Start backend: `cd backend && node index.js`
3. Start ngrok: `ngrok http 3000` (for webhook testing)
4. Configure Clerk webhook with ngrok URL
5. Start frontend: `cd client && npm run dev`

### Testing Webhooks

- Use ngrok to expose localhost
- Configure webhook URL in Clerk: `https://[ngrok-url]/webhooks/clerk`
- Subscribe to `user.created` event
- Check backend console for webhook logs

### Common Commands

- Backend: `node index.js` (port 3000)
- Frontend: `npm run dev` (port 5173)
- Lint: `npm run lint`
- Build: `npm run build`

## Environment Variables

### Backend (`/backend/.env`)

- `MONGO_URI` - MongoDB connection string
- `CLERK_WEBHOOK_SECRET` - Clerk webhook signing secret
- `IK_URL_ENDPOINT` - ImageKit URL endpoint
- `IK_PUBLIC_KEY` - ImageKit public key
- `IK_PRIVATE_KEY` - ImageKit private key
- `CLIENT_URL` - Frontend URL for CORS

### Client (`/client/.env`)

- `VITE_API_URL` - Backend API URL (http://localhost:3000)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `VITE_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
- `VITE_IMAGEKIT_PUBLIC_KEY` - ImageKit public key

## Known Issues & Solutions

### Webhook 502 Errors

- **Cause**: Buffer not converted to string for Svix verification
- **Solution**: Convert req.body to string before verification
- **Prevention**: Use try-catch wrapper around webhook handler

### User Not Found Errors

- **Cause**: Webhook failed, user not in MongoDB
- **Solution**: Fallback user creation in createPost and addComment
- **Prevention**: Ensure webhook endpoint is publicly accessible (use ngrok for local dev)

### Featured Post Routing Errors

- **Cause**: Links missing /post/ prefix
- **Solution**: All post links use `/post/${slug}` format
- **Prevention**: Consistent route path usage across components

### Environment Variable Mismatches

- **Cause**: Mixed use of VITE_BASE_URL and VITE_API_URL
- **Solution**: Standardized on VITE_API_URL throughout client
- **Prevention**: Use single env var name consistently

## Key Features & Patterns

### Authentication Flow

1. User signs up via Clerk
2. Clerk webhook triggers user creation in MongoDB
3. clerkUserId links Clerk account to MongoDB user
4. Protected routes use Clerk middleware

### Post Creation Flow

1. User uploads image to ImageKit (via Upload component)
2. User writes content with React Quill editor
3. Backend auto-generates unique slug from title
4. Post saved with user reference

### Pagination & Infinite Scroll

- Backend returns posts with hasMore flag
- Frontend uses react-infinite-scroll-component
- Default limit: 2 posts per page

### Authorization Levels

- **User**: Can create/delete own posts & comments, save posts
- **Admin**: Can delete any post/comment, feature posts

## External Services

- **Clerk**: User authentication, authorization & webhook sync
- **ImageKit.io**: Image upload, optimization, transformation & CDN
- **MongoDB**: Database (connection via Mongoose with population)
- **ngrok**: Local development tunnel for webhook testing

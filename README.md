# Quill Base

A full-stack blog and content management system built with React, Node.js, Express and MongoDB.

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [npm Packages and Why Each One Is Needed](#npm-packages-and-why-each-one-is-needed)
5. [Folder and File Structure](#folder-and-file-structure)
6. [Installation and Setup](#installation-and-setup)
7. [Environment Variables](#environment-variables)
8. [Running the Project](#running-the-project)
9. [Database and Models](#database-and-models)
10. [API Overview](#api-overview)
11. [How Everything Works (Workflows)](#how-everything-works-workflows)
12. [Deployment](#deployment)
13. [Scripts](#scripts)
14. [Assumptions](#assumptions)
15. [Known Limitations](#known-limitations)
16. [Free Third-Party Services Required](#free-third-party-services-required)

---

## About the Project

**Quill Base** is a blogging platform where visitors can read articles, browse them by category,
search for topics, and (once logged in) like posts and join the discussion in the comments.
Administrators get a separate dashboard where they write posts in a rich text editor, upload cover
images, organise everything into categories, and moderate the comments people leave.

### Purpose

I built this as a complete college project to practise the full MERN workflow end to end: designing a
database, writing a REST API with proper validation and authorisation, and then consuming that API
from a React single page application. The goal was a project where every feature actually works
against a real database, not a mock-up.

### The three layers

```
React frontend  ---HTTP/JSON--->  Express backend  ---Mongoose--->  MongoDB
```

The React app never touches the database directly. It only calls the API. The API is the only thing
that talks to MongoDB.

---

## Features

**For everyone (no login needed)**

- Browse all published blog posts on the home page
- Sort posts by newest, oldest or most liked
- Filter posts by category
- Search posts by title or excerpt
- Browse a categories page showing how many posts each category has
- Read a full post with formatted rich text, cover image, author and publish date
- See related posts from the same category
- Pagination everywhere a list can get long

**For logged-in readers**

- Register an account and log in
- Stay logged in after refreshing the page
- Like and unlike posts (you can only like a post once)
- Post comments on any published post
- Edit and delete your own comments

**For administrators**

- A protected admin dashboard with counts of posts, drafts, categories, comments and users
- Create posts with a rich text editor (headings, bold, italic, lists, quotes, code, links, images)
- Upload a cover image for each post
- Save posts as drafts and publish them when they are ready
- Edit and delete posts
- Create, rename and delete categories
- View every comment on the site and delete inappropriate ones

**Throughout the app**

- Loading spinners and skeletons while data is being fetched
- Friendly error messages with a "Try again" button when something fails
- Empty states when a list has nothing in it
- Works on phones, tablets, laptops and desktops

---

## Technologies Used

### Programming languages

- **JavaScript** — used for both the frontend and the backend
- **JSX** — React's syntax for writing components
- **CSS** — custom styling on top of Bootstrap
- **HTML** — the single `index.html` that hosts the React app

### Frontend

| Technology | What it does here |
|---|---|
| React 19 | The UI library the whole frontend is built with |
| Vite | Development server and production build tool |
| React Router v7 | Handles all page navigation in the single page app |
| Redux Toolkit | Stores the logged-in user in one place the whole app can read |
| RTK Query | Fetches data from the API, caches it, and refreshes it after changes |
| Bootstrap 5 | Grid, cards, forms, navbar and the responsive layout |
| Material UI (MUI) | Dialogs, snackbars, pagination, skeletons and the mobile admin drawer |
| Font Awesome | Icons across the site |
| React Quill (`react-quill-new`) | The rich text editor in the admin post form |
| DOMPurify | Cleans post HTML one more time in the browser before it is displayed |

### Backend

| Technology | What it does here |
|---|---|
| Node.js | The JavaScript runtime the server runs on |
| Express 5 | The web framework that defines all the API routes |
| Mongoose | Talks to MongoDB and defines the data models |
| Joi | Validates every piece of data a user sends |
| JSON Web Tokens | How the server knows who is logged in |
| bcryptjs | Hashes passwords so they are never stored as plain text |
| Multer | Reads the uploaded image file out of the request |
| Cloudinary | Stores the uploaded images permanently in the cloud |
| sanitize-html | Strips dangerous HTML out of blog content before saving it |

### Database

**MongoDB** with **Mongoose** as the modelling layer. Five collections: users, categories, posts,
comments and likes.

### Authentication approach

The project uses **JSON Web Tokens (JWT)**.

1. When you register or log in, the server checks your details and signs a token containing your user
   id and role.
2. The React app saves that token in `localStorage` and puts it in the `Authorization: Bearer <token>`
   header of every request that needs a login.
3. The `protect` middleware on the server verifies the token and loads your user account onto the
   request before the controller runs.

I chose JWT over sessions because the frontend and backend are deployed on two different domains, and
JWT avoids all the cross-site cookie configuration that a session would need.

Passwords are hashed with bcrypt (10 salt rounds) inside a Mongoose `pre("save")` hook, so a plain
password never reaches the database. The password field is also marked `select: false`, so it is left
out of query results unless it is explicitly asked for.

### Authorization and roles

There are two roles:

- **`user`** — the default for anyone who registers. Can read, like and comment.
- **`admin`** — can do everything a user can, plus manage all content.

Authorisation is enforced **on the server**, by two middleware functions:

- `protect` — rejects the request with 401 if there is no valid token.
- `adminOnly` — rejects the request with 403 if the logged-in user is not an admin.

The React app also hides admin links and guards admin routes, but that is only for convenience. Even
if someone types `/admin` into the address bar or calls the API directly with a tool like Postman,
the server still refuses them.

The register endpoint always creates users with the `user` role, and it ignores a `role` field if
someone tries to send one. The first admin is created by a seed script (see below).

### Rich text editor

I used **React Quill** (the `react-quill-new` package, which is the maintained fork that supports
React 19). Quill produces plain HTML, which is easy to store in MongoDB and easy to render back out.
It is free, open source, and small enough to understand.

### Image storage approach

Images are stored on **Cloudinary's free tier**, not on the server's disk.

This matters because free hosting platforms like Render use an *ephemeral* filesystem — anything
written to disk disappears when the app restarts or redeploys. If cover images were saved locally
they would vanish. So the flow is:

1. Multer reads the uploaded file into memory (never to disk).
2. The server streams that buffer to Cloudinary into a folder called `quill-base`.
3. Cloudinary returns a permanent HTTPS URL and a `public_id`.
4. Only the URL and the `public_id` are saved in MongoDB.

The `public_id` is what lets the app delete the old image from Cloudinary when a cover image is
replaced, or when a post is deleted.

---

## npm Packages and Why Each One Is Needed

### Backend dependencies

| Package | Why it is needed |
|---|---|
| `express` | The web framework used to build the whole REST API |
| `mongoose` | Connects to MongoDB and gives the schemas, validation and population used by every model |
| `dotenv` | Loads the secrets in `.env` into `process.env` so nothing is hardcoded |
| `cors` | Lets the React app, which runs on a different origin, call the API |
| `bcryptjs` | Hashes and compares passwords; the pure-JavaScript version so no build tools are needed on the host |
| `jsonwebtoken` | Signs and verifies the login tokens |
| `joi` | Validates request bodies, URL parameters and query strings before controllers run |
| `multer` | Parses `multipart/form-data` so the image upload endpoint can read the file |
| `cloudinary` | The official SDK used to upload and delete images |
| `sanitize-html` | Removes scripts and dangerous attributes from post content before saving it |
| `slugify` | Turns post and category names into clean, URL-friendly slugs |

### Backend dev dependencies

| Package | Why it is needed |
|---|---|
| `nodemon` | Restarts the server automatically while developing. Not used in production |

### Frontend dependencies

| Package | Why it is needed |
|---|---|
| `react`, `react-dom` | The UI library itself |
| `react-router-dom` | Client-side routing between all the pages |
| `@reduxjs/toolkit` | Provides the auth slice and the RTK Query API layer |
| `react-redux` | Connects React components to the Redux store |
| `bootstrap` | The responsive grid and all the base UI styling |
| `@mui/material` | Dialogs, snackbars, pagination, skeletons and the mobile drawer |
| `@emotion/react`, `@emotion/styled` | Required peer dependencies that MUI uses for its styling |
| `@fortawesome/react-fontawesome` | The React component used to render icons |
| `@fortawesome/fontawesome-svg-core` | The icon engine that the React component requires |
| `@fortawesome/free-solid-svg-icons` | The solid icon set used in the navbar, dashboard and buttons |
| `@fortawesome/free-regular-svg-icons` | The outline icon set used for the like/comment counters and empty states |
| `react-quill-new` | The rich text editor (it installs `quill` itself) |
| `dompurify` | Sanitises post HTML in the browser right before it is rendered |

### Frontend dev dependencies

| Package | Why it is needed |
|---|---|
| `vite` | Runs the dev server and builds the production bundle |
| `@vitejs/plugin-react` | Adds React fast refresh and JSX support to Vite |
| `eslint`, `@eslint/js` | Catches unused variables, mistakes and bad patterns |
| `eslint-plugin-react-hooks` | Enforces the rules of hooks |
| `eslint-plugin-react-refresh` | Warns when a file breaks fast refresh |
| `globals` | Supplies the list of browser globals to ESLint |

---

## Folder and File Structure

```
complete QB/
├── .gitignore
├── README.md
├── backend/
│   ├── .env                  (not committed - your real secrets)
│   ├── .env.example          (committed - the list of keys you must fill in)
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── middleware/
│       ├── validations/
│       └── utils/
└── frontend/
    ├── .env                  (not committed)
    ├── .env.example          (committed)
    ├── index.html
    ├── vite.config.js
    ├── vercel.json
    ├── eslint.config.js
    ├── package.json
    ├── public/
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── app/
        ├── features/
        ├── components/
        ├── pages/
        ├── routes/
        ├── hooks/
        ├── utils/
        ├── styles/
        └── assets/
```

### Backend folders explained

| Folder | What lives in it |
|---|---|
| `src/config/` | Setting up outside services: the database connection and the Cloudinary SDK |
| `src/models/` | The five Mongoose schemas that define what the data looks like |
| `src/controllers/` | The actual logic for each request: read the input, use the models, send a response |
| `src/routes/` | Maps URLs and HTTP methods to controllers, and attaches the auth and validation middleware |
| `src/middleware/` | Reusable functions that run before controllers: auth, validation, uploads, error handling |
| `src/validations/` | Joi schemas describing exactly what shape valid input has |
| `src/utils/` | Small shared helpers used in several places |

### Backend files explained

| File | What it does |
|---|---|
| `src/server.js` | The entry point. Loads `.env`, connects to MongoDB, starts listening on the port |
| `src/app.js` | Builds the Express app: CORS, JSON parsing, the health route, all route mounts, error handling |
| `src/config/db.js` | Connects to MongoDB and exits with a clear message if it cannot |
| `src/config/cloudinary.js` | Configures the Cloudinary SDK from the three environment variables |
| `src/models/User.js` | Name, email, hashed password, role. Hashes the password on save and compares it on login |
| `src/models/Category.js` | Name, slug, description. Builds the slug automatically from the name |
| `src/models/Post.js` | Title, slug, excerpt, content, cover image, category, author, status, counters and indexes |
| `src/models/Comment.js` | Links a piece of text to one post and one user |
| `src/models/Like.js` | Links one user to one post. Has the unique index that makes double-liking impossible |
| `src/controllers/authController.js` | Register, login and "who am I" |
| `src/controllers/categoryController.js` | Category listing (with post counts) and admin category CRUD |
| `src/controllers/postController.js` | Public post listing/reading and all admin post management plus dashboard stats |
| `src/controllers/commentController.js` | Adding, listing, editing, deleting and moderating comments |
| `src/controllers/likeController.js` | Liking and unliking posts |
| `src/controllers/uploadController.js` | Uploading an image to Cloudinary and deleting one |
| `src/middleware/authMiddleware.js` | `protect`, `adminOnly` and `optionalAuth` |
| `src/middleware/validateMiddleware.js` | Runs a Joi schema against the request and returns clean field errors |
| `src/middleware/uploadMiddleware.js` | Multer set up for memory storage, a 2MB limit and image-only files |
| `src/middleware/errorMiddleware.js` | Turns every kind of error into the same tidy JSON response |
| `src/validations/authValidation.js` | Rules for register and login |
| `src/validations/categoryValidation.js` | Rules for creating and updating categories |
| `src/validations/postValidation.js` | Rules for posts, status changes and all the list query parameters |
| `src/validations/commentValidation.js` | Rules for comments and the comment lists |
| `src/validations/commonValidation.js` | The shared "is this a valid MongoDB id" rule |
| `src/utils/ApiError.js` | A custom Error that carries an HTTP status code |
| `src/utils/asyncHandler.js` | Wraps async controllers so errors reach the error handler without try/catch everywhere |
| `src/utils/sendResponse.js` | Writes the standard success response shape |
| `src/utils/generateToken.js` | Signs a JWT for a user |
| `src/utils/generateSlug.js` | The shared slug settings used by posts and categories |
| `src/utils/sanitizeContent.js` | The allow-list that decides which HTML tags a post may contain |
| `src/utils/escapeRegex.js` | Escapes user search text so it cannot break the search query |
| `src/utils/findPublishedPost.js` | Shared "find this published post or throw a 404" lookup |
| `src/utils/cloudinaryService.js` | Upload and delete helpers for Cloudinary |
| `src/utils/seedAdmin.js` | One-off script that creates the very first admin account |

### Frontend folders explained

| Folder | What lives in it |
|---|---|
| `src/app/` | The Redux store and the RTK Query base API that every feature plugs into |
| `src/features/` | One folder per feature (auth, posts, categories, comments, likes, admin) holding its API endpoints and Redux state |
| `src/components/` | Reusable UI pieces, grouped by area (`common`, `layout`, `posts`, `comments`, `categories`, `admin`, `auth`) |
| `src/pages/` | One component per route. `pages/admin/` holds the admin screens |
| `src/routes/` | The route table and the two route guards |
| `src/hooks/` | Small custom hooks used by more than one component |
| `src/utils/` | Tiny shared helper functions |
| `src/styles/` | The single global stylesheet |
| `src/assets/` | Images bundled into the app |
| `public/` | Files served as-is, such as the favicon |

### Frontend files explained

| File | What it does |
|---|---|
| `index.html` | The single HTML page. React mounts into the `#root` div |
| `vite.config.js` | Vite configuration (the React plugin and the dev port) |
| `vercel.json` | Tells Vercel to send every URL to `index.html` so deep links work |
| `eslint.config.js` | The linting rules |
| `src/main.jsx` | Mounts React and wraps it in the Redux Provider and the Router. Imports Bootstrap and the global CSS |
| `src/App.jsx` | Wraps the app in the error boundary, the auth initializer and the layout |
| `src/app/store.js` | Creates the Redux store from the auth reducer and the API reducer |
| `src/app/baseApi.js` | The RTK Query base: the API URL, the auth header, and the cache tag names |
| `src/features/auth/authSlice.js` | Holds the current user and token, and reads/writes the token in `localStorage` |
| `src/features/auth/authApi.js` | The register, login and "who am I" endpoints |
| `src/features/posts/postsApi.js` | The public post list and single post endpoints |
| `src/features/categories/categoriesApi.js` | Category listing plus the admin category create/update/delete |
| `src/features/comments/commentsApi.js` | Listing, adding, editing and deleting comments |
| `src/features/likes/likesApi.js` | Like and unlike, with an instant optimistic update in the UI |
| `src/features/admin/adminApi.js` | Everything the dashboard needs: stats, admin post lists, post CRUD, image upload |
| `src/components/layout/Layout.jsx` | Page shell: header on top, page in the middle, footer at the bottom |
| `src/components/layout/Header.jsx` | The responsive navbar with search and the login/logout controls |
| `src/components/layout/Footer.jsx` | The site footer |
| `src/components/auth/AuthInitializer.jsx` | On startup, restores the session from the saved token before anything renders |
| `src/components/common/Loader.jsx` | The centred spinner |
| `src/components/common/ErrorMessage.jsx` | The red alert with an optional "Try again" button |
| `src/components/common/EmptyState.jsx` | The icon + message shown when a list is empty |
| `src/components/common/ConfirmDialog.jsx` | The "are you sure?" dialog used before anything is deleted |
| `src/components/common/Pagination.jsx` | The page number control |
| `src/components/common/SearchBar.jsx` | The navbar search box |
| `src/components/common/Toast.jsx` | The little success/error message that pops up at the bottom |
| `src/components/common/ErrorBoundary.jsx` | Catches unexpected crashes and shows a recovery screen instead of a blank page |
| `src/components/posts/PostCard.jsx` | One post preview card |
| `src/components/posts/PostGrid.jsx` | The responsive grid of cards, including its loading, error and empty states |
| `src/components/posts/PostCardSkeleton.jsx` | The grey placeholder card shown while posts load |
| `src/components/posts/RichTextContent.jsx` | Sanitises and renders a post's HTML |
| `src/components/posts/LikeButton.jsx` | The heart button with the like count |
| `src/components/posts/RelatedPosts.jsx` | Up to three other posts from the same category |
| `src/components/comments/CommentForm.jsx` | The comment box, reused for both writing and editing |
| `src/components/comments/CommentItem.jsx` | One comment with its edit and delete controls |
| `src/components/comments/CommentList.jsx` | The whole comment section |
| `src/components/categories/CategoryList.jsx` | The row of category filter buttons on the home page |
| `src/components/admin/AdminLayout.jsx` | The admin two-column layout, with a drawer on mobile |
| `src/components/admin/AdminSidebar.jsx` | The admin navigation links |
| `src/components/admin/StatCard.jsx` | One number tile on the dashboard |
| `src/components/admin/ImageUploader.jsx` | Picks, checks, uploads and previews a cover image |
| `src/components/admin/RichTextEditor.jsx` | The Quill editor, including uploading images pasted into the toolbar |
| `src/components/admin/CategoryFormDialog.jsx` | The add/edit category dialog |
| `src/pages/Home.jsx` | The main post feed with sorting, category filtering and pagination |
| `src/pages/PostDetails.jsx` | The full article page with likes and comments |
| `src/pages/Categories.jsx` | All categories as cards |
| `src/pages/CategoryPosts.jsx` | The posts inside one category |
| `src/pages/Search.jsx` | Search results |
| `src/pages/Login.jsx` / `Register.jsx` | The authentication forms |
| `src/pages/NotFound.jsx` | The 404 page |
| `src/pages/admin/Dashboard.jsx` | The counts and recent posts |
| `src/pages/admin/ManagePosts.jsx` | The post table with filter, search, publish toggle and delete |
| `src/pages/admin/PostForm.jsx` | The create/edit post screen |
| `src/pages/admin/ManageCategories.jsx` | The category table |
| `src/pages/admin/ManageComments.jsx` | The comment moderation table |
| `src/routes/AppRoutes.jsx` | Every route in the app |
| `src/routes/ProtectedRoute.jsx` | Sends logged-out visitors to the login page |
| `src/routes/AdminRoute.jsx` | Sends non-admins back to the home page |
| `src/hooks/useNotify.js` | Small helper for showing a toast |
| `src/hooks/useDocumentTitle.js` | Sets the browser tab title per page |
| `src/utils/formatDate.js` | One date format used everywhere |
| `src/utils/getErrorMessage.js` | Turns any API error into a readable sentence |
| `src/utils/buildImageFormData.js` | Builds the `FormData` for an image upload |
| `src/styles/index.css` | Colour variables, typography, cards, article styling and admin styling |

---

## Installation and Setup

### What you need first

- **Node.js 18 or newer** and npm
- **MongoDB** — either installed locally, or a free MongoDB Atlas account
- A free **Cloudinary** account (needed for image uploads)

### Step 1 — Get the code

```bash
cd "complete QB"
```

### Step 2 — Install the backend

```bash
cd backend
npm install
```

### Step 3 — Install the frontend

```bash
cd ../frontend
npm install
```

### Step 4 — Set up MongoDB

**Option A — local MongoDB**

Install MongoDB Community Server, make sure the service is running, and use:

```
MONGO_URI=mongodb://127.0.0.1:27017/quillbase
```

**Option B — MongoDB Atlas (also what production uses)**

1. Create a free account at <https://www.mongodb.com/atlas>.
2. Create a new project and then a **free M0 cluster**.
3. Under **Database Access**, add a database user with a username and password. Write them down.
4. Under **Network Access**, add an IP address. For local development you can add your own IP; for
   Render you need `0.0.0.0/0` because Render does not give you a fixed IP.
5. Click **Connect → Drivers** and copy the connection string. It looks like this:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/quillbase?retryWrites=true&w=majority
   ```

6. Replace `<username>` and `<password>` with the database user you created and put the whole string
   into `MONGO_URI`.

### Step 5 — Set up Cloudinary

1. Sign up free at <https://cloudinary.com>.
2. Open the dashboard. At the top you will see **Cloud Name**, **API Key** and **API Secret**.
3. Copy those three values into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and
   `CLOUDINARY_API_SECRET` in `backend/.env`.

You do not need to create the folder — the app puts everything in a `quill-base` folder by itself.

> Without these three values the app runs perfectly well, but any attempt to upload an image will
> fail with an error message.

### Step 6 — Create the environment files

Copy each example file and fill in your own values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Step 7 — Create the first admin

The register page always creates ordinary users, so the first administrator is made by a script that
reads `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `backend/.env`:

```bash
cd backend
npm run seed:admin
```

You can run it as many times as you like — if the admin already exists it just says so and stops.

### Rich text setup

Nothing to configure. The editor is installed with `npm install` and works out of the box.

---

## Environment Variables

### `backend/.env`

| Variable | What it is for |
|---|---|
| `PORT` | The port the API listens on. Use `5000` locally. In production the host sets this itself |
| `NODE_ENV` | `development` or `production`. In production, error responses hide stack traces |
| `MONGO_URI` | The full MongoDB connection string |
| `JWT_SECRET` | A long random string used to sign login tokens. Keep it secret and use a different one in production |
| `JWT_EXPIRES_IN` | How long a login lasts, for example `7d` |
| `CLIENT_URL` | Which website addresses may call the API. Several can be given, separated by commas |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `ADMIN_NAME` | The display name for the seeded administrator |
| `ADMIN_EMAIL` | The login email for the seeded administrator |
| `ADMIN_PASSWORD` | The password for the seeded administrator. Change this before deploying |

### `frontend/.env`

| Variable | What it is for |
|---|---|
| `VITE_API_URL` | The base address of the API, for example `http://localhost:5000/api` locally, or `https://your-app.onrender.com/api` in production |

Vite only exposes variables that start with `VITE_` to the browser, which is why the name has that
prefix.

**Never commit the real `.env` files.** They are already listed in `.gitignore`. Only the
`.env.example` files, which contain placeholder values, are committed.

---

## Running the Project

You need two terminals, because the frontend and the backend are two separate applications.

**Terminal 1 — the backend**

```bash
cd backend
npm run dev
```

It prints `Server running on port 5000` and `MongoDB connected: ...`.

**Terminal 2 — the frontend**

```bash
cd frontend
npm run dev
```

Then open <http://localhost:5173>.

To check the API by itself, visit <http://localhost:5000/api/health>. It should return:

```json
{ "success": true, "data": { "status": "ok" } }
```

---

## Database and Models

### User

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, 2–50 characters |
| `email` | String | Required, unique, stored lowercase |
| `password` | String | Required, minimum 6 characters, stored hashed, hidden from queries |
| `role` | String | `user` or `admin`, defaults to `user` |
| `createdAt` / `updatedAt` | Date | Added automatically |

### Category

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, unique, 2–50 characters |
| `slug` | String | Unique, generated from the name |
| `description` | String | Optional, up to 200 characters |

### Post

| Field | Type | Notes |
|---|---|---|
| `title` | String | Required, 3–150 characters |
| `slug` | String | Unique, generated from the title (with a short random suffix if that slug is taken) |
| `excerpt` | String | Up to 300 characters. Generated from the content if left blank |
| `content` | String | The sanitised rich text HTML |
| `coverImage` | Object | `{ url, publicId }` from Cloudinary |
| `category` | ObjectId | Required, references a Category |
| `author` | ObjectId | Required, references a User |
| `status` | String | `draft` or `published`, defaults to `draft` |
| `publishedAt` | Date | Set the first time the post is published |
| `likeCount` | Number | Kept in step with the Like collection |
| `commentCount` | Number | Kept in step with the Comment collection |

Indexes: a text index on `title` and `excerpt`, a compound index on `status` + `publishedAt` for the
public listing, and an index on `category` for filtering.

### Comment

| Field | Type | Notes |
|---|---|---|
| `post` | ObjectId | Required, references a Post, indexed |
| `user` | ObjectId | Required, references a User |
| `content` | String | Required, 1–1000 characters, stored as plain text |

### Like

| Field | Type | Notes |
|---|---|---|
| `post` | ObjectId | Required, references a Post |
| `user` | ObjectId | Required, references a User |

`Like` has a **compound unique index on `{ post, user }`**. This is the thing that makes duplicate
likes impossible — even if two requests arrive at exactly the same moment, MongoDB will reject the
second one, and the controller quietly treats that as "already liked" instead of showing an error.

### How they relate

```
User  1 ────< Post        (author)
Category 1 ─< Post        (category)
Post  1 ────< Comment >──── 1 User
Post  1 ────< Like    >──── 1 User   (unique per pair)
```

A category that still has posts cannot be deleted — the API refuses with a message saying how many
posts still use it. Deleting a post deletes its comments, its likes and its cover image.

---

## API Overview

All routes start with `/api`. Every response has the same shape.

Success:

```json
{ "success": true, "data": {}, "meta": {} }
```

Error:

```json
{ "success": false, "message": "Something readable", "errors": [] }
```

`meta` only appears on paginated lists and contains `page`, `limit`, `total` and `totalPages`.
`errors` only appears on validation failures and lists `{ field, message }` pairs.

| Method | Route | Who can use it | What it does |
|---|---|---|---|
| GET | `/api/health` | anyone | Uptime check |
| POST | `/api/auth/register` | anyone | Create an account, returns a token |
| POST | `/api/auth/login` | anyone | Log in, returns a token |
| GET | `/api/auth/me` | logged in | Return the current user |
| GET | `/api/categories` | anyone | All categories with published post counts |
| GET | `/api/categories/:slug` | anyone | One category |
| POST | `/api/categories` | admin | Create a category |
| PUT | `/api/categories/:id` | admin | Rename or edit a category |
| DELETE | `/api/categories/:id` | admin | Delete a category (refused if posts still use it) |
| GET | `/api/posts` | anyone | Published posts. Supports `page`, `limit`, `category`, `search`, `sort` |
| GET | `/api/posts/:slug` | anyone | One published post, plus `isLiked` if you send a token |
| POST | `/api/posts` | admin | Create a post |
| PUT | `/api/posts/:id` | admin | Edit a post |
| PATCH | `/api/posts/:id/status` | admin | Publish or unpublish |
| DELETE | `/api/posts/:id` | admin | Delete a post and everything attached to it |
| GET | `/api/posts/:postId/comments` | anyone | Comments on a post, newest first |
| POST | `/api/posts/:postId/comments` | logged in | Add a comment |
| PUT | `/api/comments/:id` | the author | Edit your own comment |
| DELETE | `/api/comments/:id` | author or admin | Delete a comment |
| POST | `/api/posts/:postId/like` | logged in | Like a post |
| DELETE | `/api/posts/:postId/like` | logged in | Remove your like |
| POST | `/api/uploads/image` | admin | Upload an image, returns `{ url, publicId }` |
| DELETE | `/api/uploads/image` | admin | Delete an image by `publicId` |
| GET | `/api/admin/stats` | admin | Dashboard counts and recent posts |
| GET | `/api/admin/posts` | admin | All posts including drafts. Supports `page`, `limit`, `status`, `search` |
| GET | `/api/admin/posts/:id` | admin | One post of any status, for the edit form |
| GET | `/api/admin/comments` | admin | Every comment on the site. Supports `page`, `limit`, `search` |

### Error responses used

| Status | When |
|---|---|
| 400 | Validation failed, an id is not a valid MongoDB id, the JSON body is malformed, or a category still has posts |
| 401 | No token, or a token that is invalid, expired, or belongs to a deleted account |
| 403 | Logged in but not allowed (a normal user trying an admin action, or editing someone else's comment) |
| 404 | The post, category, comment or route does not exist |
| 409 | Duplicate email or duplicate category name |
| 413 | The request body is too large |
| 500 | An unexpected server problem. The message is always generic so nothing internal leaks |

---

## How Everything Works (Workflows)

### Authentication workflow

1. You fill in the register or login form. React checks the basics first so you get instant feedback.
2. The form posts to `/api/auth/register` or `/api/auth/login`.
3. Joi validates the body. For register, the email must be unused; for login, the email and password
   must match. A wrong email and a wrong password give the same message so nobody can find out which
   emails are registered.
4. The server signs a JWT and sends it back with your user details.
5. React saves the token in `localStorage` and puts your user in the Redux store.
6. Every later request automatically carries `Authorization: Bearer <token>`.
7. When you reload the page, `AuthInitializer` sees the saved token, calls `/api/auth/me`, and
   restores your session. If the token is bad or expired it quietly logs you out.
8. Logging out clears the token, the Redux store and the cached API data.

### Authorization workflow

1. `protect` reads the token, verifies it, and loads the user onto the request.
2. `adminOnly` then checks `req.user.role === "admin"`.
3. Routes such as `POST /api/posts` list both, so a normal user gets 403 and an anonymous visitor
   gets 401.
4. In the browser, `ProtectedRoute` sends logged-out visitors to the login page (and back again
   afterwards), and `AdminRoute` sends non-admins home. This is only for convenience — the server
   makes the real decision.

### User workflow

Browse the home page → filter by category or search → open a post → read it → register or log in →
like the post → leave a comment → edit or delete your own comment.

### Administrator workflow

Log in as admin → open the dashboard → check the counts → create a post → save it as a draft → come
back later, edit it and publish it → manage categories → moderate comments.

### Post workflow

1. The admin opens **New Post** and fills in the title, category, optional excerpt, cover image and
   the rich text body.
2. **Save Draft** stores it with `status: "draft"`. Drafts are invisible on the public site and even
   the public API will not return them.
3. **Publish** sets `status: "published"` and stamps `publishedAt` the first time.
4. The slug is built from the title. If that slug already exists, a short random suffix is added.
5. If the excerpt was left empty, the server builds one from the first 150 characters of the content.
6. Unpublishing hides the post again, but keeps the original `publishedAt`.
7. Deleting a post also deletes its comments, its likes, and its cover image on Cloudinary.

### Category workflow

1. The admin adds a category with a name and an optional description.
2. The slug is generated automatically and is what appears in the URL, for example
   `/categories/web-development`.
3. Renaming a category regenerates the slug.
4. A category can only be deleted when no posts use it. Otherwise the API replies with
   "Cannot delete: N post(s) still use this category" and the dashboard shows that message.

### Comment workflow

1. Logged-out visitors see a "Log in to join the discussion" message instead of the comment box.
2. A logged-in reader types a comment (up to 1000 characters, with a live counter) and posts it.
3. The server checks that the post exists and is published, saves the comment as plain text, and
   increases the post's `commentCount`.
4. The new comment appears immediately with the correct name and date.
5. Only the author sees **Edit**. The author and any admin see **Delete**.
6. Administrators moderate by deleting, not by rewriting what other people said — the API refuses an
   admin's attempt to edit someone else's comment.
7. Deleting decreases `commentCount`, and it can never go below zero.

### Like workflow

1. If you are not logged in, clicking the heart takes you to the login page and brings you back to
   the post afterwards.
2. When you click it, the UI updates instantly (an optimistic update) so it feels immediate.
3. The server tries to create a Like document. The unique index means a second one can never exist.
4. If it really was new, `likeCount` goes up by one. If you had already liked it, the server treats
   that as success and changes nothing.
5. Unliking removes the Like and decreases the counter, never below zero.
6. If the request fails, the optimistic change is rolled back automatically.

### Image upload workflow

1. Only admins can reach the upload endpoint.
2. The browser checks the type and size first, so obvious mistakes never leave your machine.
3. Multer reads the file into memory. It rejects anything that is not JPG, PNG or WEBP, or anything
   over 2MB.
4. The file is streamed to Cloudinary and the returned URL and `public_id` are stored on the post.
5. Replacing a cover image deletes the old one from Cloudinary after the post saves successfully.
6. Deleting a post deletes its cover image too.
7. If a cleanup fails, it is logged but never breaks the save or delete you asked for.

### Rich text workflow

1. The admin types into the Quill editor, which produces HTML.
2. That HTML is sent to the server as the post's `content`.
3. Joi checks it is a string, is not too long, and actually contains something (an empty editor is
   rejected, even though the browser sends `<p></p>`).
4. `sanitize-html` strips everything not on the allow-list: `<script>`, `<iframe>`, `<style>`, `on*`
   handlers and `javascript:` links are all removed. Only safe formatting survives.
5. **The sanitised version is what gets stored**, so the database never holds dangerous markup.
6. When a post is displayed, `RichTextContent` runs DOMPurify over it one more time before rendering.
   That second pass protects against anything that might have reached the database another way.

---

## Deployment

Everything below runs on free tiers.

### Deployment architecture

```
        Browser
           |
           v
  Vercel (React static site)          <-- frontend/, built with `npm run build`
           |
           |  HTTPS requests to VITE_API_URL
           v
  Render (Node + Express web service) <-- backend/, started with `npm start`
           |                    \
           |                     \--> Cloudinary  (cover images and in-post images)
           v
  MongoDB Atlas (M0 free cluster)
```

### 1. MongoDB Atlas

Follow **Step 4, Option B** in the setup section. Because Render does not provide a fixed outbound IP
address, Network Access has to allow `0.0.0.0/0`. That is a simplification acceptable for a student
project; a production system would use a private network or an IP allow-list.

### 2. Cloudinary

Use the same three credentials from **Step 5**. Nothing extra is needed — the same `quill-base`
folder is used in production.

### 3. Deploy the backend to Render

1. Push the project to GitHub.
2. On <https://render.com>, create a **New Web Service** and connect the repository.
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add all the environment variables under **Environment**:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (different from your local one) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | your Vercel URL, for example `https://quill-base.vercel.app` |
   | `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
   | `CLOUDINARY_API_KEY` | from Cloudinary |
   | `CLOUDINARY_API_SECRET` | from Cloudinary |
   | `ADMIN_NAME` | your admin display name |
   | `ADMIN_EMAIL` | your admin email |
   | `ADMIN_PASSWORD` | a strong password |

   Do **not** set `PORT` — Render provides it, and the code already reads `process.env.PORT`.

5. Deploy. When it is live, check `https://your-app.onrender.com/api/health`. Use that same URL as
   the **health check path** (`/api/health`) in the Render settings.
6. Create the production admin once, using Render's **Shell** tab:

   ```bash
   npm run seed:admin
   ```

### 4. Deploy the frontend to Vercel

1. On <https://vercel.com>, import the same repository.
2. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add one environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-app.onrender.com/api` |

4. Deploy.

`vercel.json` already contains the rewrite that sends every path to `index.html`, so refreshing a
page such as `/posts/my-first-post` works instead of returning a 404.

### 5. Connect the two

Once you know your Vercel URL, go back to Render and make sure `CLIENT_URL` matches it exactly
(including `https://` and with no trailing slash), then redeploy the backend. `CLIENT_URL` accepts a
comma-separated list, so you can allow both your deployed site and `http://localhost:5173` while you
are still setting things up:

```
CLIENT_URL=https://quill-base.vercel.app,http://localhost:5173
```

Any other origin is rejected with a 403.

### 6. Check it works

Open the Vercel URL and go through: register, log in, browse, search, filter, read a post, like it,
comment on it, then log in as the admin and create a post with a cover image.

### A note about the Render free tier

A free Render service goes to sleep after about 15 minutes without traffic. The next request wakes it
up, which can take 30–60 seconds. While that happens the frontend simply shows its normal loading
spinners, and if the wake-up takes too long you get the usual "Cannot reach the server" message with
a **Try again** button. Nothing breaks — the first visit after a quiet period is just slow.

---

## Scripts

### `backend/package.json`

| Script | Command | What it does |
|---|---|---|
| `dev` | `nodemon src/server.js` | Runs the server and restarts it whenever a file changes |
| `start` | `node src/server.js` | Runs the server normally. This is what production uses |
| `seed:admin` | `node src/utils/seedAdmin.js` | Creates the first admin account. Safe to run more than once |

### `frontend/package.json`

| Script | Command | What it does |
|---|---|---|
| `dev` | `vite` | Starts the development server on port 5173 |
| `build` | `vite build` | Builds the production files into `dist/` |
| `preview` | `vite preview` | Serves the built files locally so you can check the production build |
| `lint` | `eslint .` | Checks the code for problems |

---

## Assumptions

- There is only one level of administrator. Admins can manage all content; there is no idea of
  "my posts only".
- The first admin is created by the seed script. New admins are made by changing a user's `role`
  directly in the database, because user management screens were out of scope.
- Every post belongs to exactly one category.
- Comments are plain text, not rich text, which keeps the comment section simple and safe.
- The excerpt is optional. If it is left blank the server writes one from the start of the content.
- A category with posts in it should not be deletable by accident, so the API refuses instead of
  silently orphaning or deleting posts.
- Deleting a post is meant to remove everything about it, so its comments, likes and cover image go
  with it.

## Known Limitations

- **Comments are single level.** There are no replies to replies, and no comment likes.
- **No email verification and no password reset.** Adding either needs an email service, which was
  beyond the scope of this project.
- **Images placed inside the post body are not tracked individually.** They are uploaded to
  Cloudinary correctly, but if you delete them from the text the file stays in Cloudinary. Only the
  cover image is cleaned up automatically.
- **Render's free tier sleeps**, so the first request after a quiet period is slow (see the note
  above).
- **Admins can only be created by the seed script** or by editing the database.
- **Atlas network access is open to `0.0.0.0/0`** in this setup, because Render has no fixed IP.
- **Search is a simple case-insensitive match** on the title and excerpt. It does not search the body
  of the post and it has no fuzzy matching.
- **No automated test suite.** Everything was tested by hand and with throwaway scripts against a
  real database.
- **The production JavaScript bundle is fairly large** (roughly 950 kB before gzip) because Bootstrap,
  MUI and Quill are all included. It could be reduced with code splitting.

## Free Third-Party Services Required

| Service | Free tier | What it is used for |
|---|---|---|
| [MongoDB Atlas](https://www.mongodb.com/atlas) | M0 cluster, 512 MB | The database |
| [Cloudinary](https://cloudinary.com) | 25 credits/month | Storing uploaded images |
| [Render](https://render.com) | Free web service | Hosting the Express API |
| [Vercel](https://vercel.com) | Hobby plan | Hosting the React frontend |

None of them need a payment method for this project.

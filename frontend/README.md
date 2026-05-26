# Pinvault — Pinterest-Inspired Full Stack App

A full-stack image-sharing platform built with React, Node.js, Express, and PostgreSQL.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| HTTP Client | Axios |

---

## Project Structure

```
pinterest-app/
├── server/                    # Backend
│   ├── config/
│   │   ├── db.js              # PostgreSQL connection pool
│   │   └── schema.sql         # Database schema
│   ├── controllers/           # Route logic
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── userController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT middleware
│   │   ├── upload.js          # Multer config
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   └── comments.js
│   ├── uploads/               # Stored images (auto-created)
│   ├── index.js
│   └── .env.example
│
└── frontend/                  # React app
    └── src/
        ├── components/
        │   ├── common/        # Navbar, Spinner, ProtectedRoute
        │   └── posts/         # PostCard, PostGrid, CategoryFilter
        ├── pages/             # Home, Login, Register, PostDetail, Profile, etc.
        ├── context/           # AuthContext (JWT state)
        ├── hooks/             # useFetch
        ├── services/          # API calls (Axios)
        └── layouts/           # MainLayout
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

---

### 1. Clone & Install

```bash
git clone <repo-url>
cd pinterest-app

# Install backend deps
cd server && npm install

# Install frontend deps
cd ../frontend && npm install
```

---

### 2. PostgreSQL Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE pinterestdb;
\q

# Run schema
psql -U postgres -d pinterestdb -f server/config/schema.sql
```

---

### 3. Environment Variables

**Backend** — copy and edit `server/.env.example` to `server/.env`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/pinterestdb
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

### 4. Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | ✓ | Get current user |

### Posts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/posts` | Optional | Feed (search, category, page) |
| GET | `/api/posts/:id` | Optional | Single post |
| POST | `/api/posts` | ✓ | Create post (multipart) |
| PUT | `/api/posts/:id` | ✓ | Update post |
| DELETE | `/api/posts/:id` | ✓ | Delete post |
| POST | `/api/posts/:id/like` | ✓ | Toggle like |
| POST | `/api/posts/:id/save` | ✓ | Toggle save |
| GET | `/api/posts/saved` | ✓ | Get saved posts |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/:username` | — | Get profile + posts |
| PUT | `/api/users/me/profile` | ✓ | Update bio/avatar |

### Comments
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/comments/post/:postId` | — | Get comments |
| POST | `/api/comments/post/:postId` | ✓ | Add comment |
| DELETE | `/api/comments/:id` | ✓ | Delete own comment |

---

## Features

- **Auth**: Register, login, JWT auth, protected routes
- **Feed**: Masonry grid, pagination, category filter, search
- **Posts**: Create with image upload, like, save, delete
- **Post Detail**: Full view, comments, like/save actions
- **Profile**: Avatar upload, bio editing, user's pins
- **Saved**: View all saved pins
- **Responsive**: Mobile-first design

---

## Database Schema

```sql
users       — id, username, email, password, avatar, bio
posts       — id, user_id, title, description, image_url, category
comments    — id, post_id, user_id, content
likes       — id, post_id, user_id (unique pair)
saved_posts — id, post_id, user_id (unique pair)
```

---

## Production Deployment

1. Set `NODE_ENV=production` in server `.env`
2. Use a managed PostgreSQL instance (Supabase, Railway, Neon)
3. Deploy backend to Railway, Render, or Fly.io
4. Deploy frontend to Vercel or Netlify
5. Set `CLIENT_URL` in backend to your frontend domain
6. Update Vite proxy or use full API URL in production

---

## License

MIT

# Abhiram Tekulapalli — Portfolio

<p align="center">
  <img src="assets/readme_assets/header.svg" alt="Abhiram Tekulapalli — Portfolio" width="100%" />
</p>

<p align="center">
  <a href="https://abhiram-tekulapalli.dev/"><img src="https://img.shields.io/badge/Live%20Demo-https://abhiram-tekulapalli.dev/-00D9FF?style=for-the-badge&logo=render&logoColor=white" alt="Live Demo"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-7.4-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge" alt="License"></a>
</p>

---

## 🎯 Overview

A production-grade, full-stack portfolio website with an integrated **CMS**, **blog system**, and **real-time GitHub/LeetCode stats**. Built with React 19, TypeScript, Tailwind CSS v4, and Express + MongoDB.

---

## ✨ Features

### 🎨 Frontend (React 19 + Tailwind v4)

| Feature | Description |
|---------|-------------|
| **Hero & About** | Animated hero with particle background, typewriter effect, dynamic social links |
| **Projects Showcase** | Filterable project cards with tech stacks, GitHub/demo links, image galleries |
| **Skills Matrix** | Categorized skills with proficiency bars, animated on scroll |
| **Experience Timeline** | Vertical timeline with company logos, roles, achievements |
| **Education & Certifications** | Degree cards + certification badges with verification links |
| **Blog System** | Markdown rendering, syntax highlighting, reading time, related posts |
| **Custom Cursor** | Magnetic cursor with ripple/trail effects |
| **Stardust Background** | 150-particle 3D canvas with mouse parallax drift |
| **Skeleton Loaders** | Per-component loading states (no layout shift) |
| **Dark/Light Theme** | CSS-variable based, persists to localStorage |

### 🛠️ Admin CMS (Password-Protected)

| Module | Capabilities |
|--------|--------------|
| **Dashboard** | Live stats: projects, certs, published/draft posts, skills count |
| **Hero & About** | Inline editors for headline, subtext, bio, social links, resume URL |
| **Projects CRUD** | Modal forms: title, description, tech stack (chips), images, links, featured toggle |
| **Skills Manager** | Category grouping, proficiency sliders, icon picker (Lucide) |
| **Experience/Education** | Timeline entries with date ranges, bullets, company/institution logos |
| **Certifications** | Issuer, date, credential ID, verification URL, badge image upload |
| **Blog Editor** | Full markdown editor, slug auto-generation, cover image, tags, draft/publish |
| **Integrations** | GitHub (repo stars, commit graph), LeetCode (rating, solved stats), SMTP config |
| **Settings** | Site title, SEO meta, favicon, custom CSS injection, analytics ID |
| **Auth** | JWT in HttpOnly cookies, rate-limited login, lockout after failed attempts |

### ⚙️ Backend (Express + MongoDB)

- **REST API** (`/api/v1/*`) with JWT auth middleware
- **MongoDB** collections: `projects`, `skills`, `experience`, `education`, `certifications`, `blogs`, `settings`, `hero`, `about`
- **Real-time Aggregators**: GitHub GraphQL + LeetCode GraphQL cached hydration endpoint
- **AI Integration**: Google GenAI (`@google/genai`) for content suggestions
- **Email**: Nodemailer + SMTP for contact form & notifications
- **Security**: Helmet headers, CORS allowlist, cookie hardening (Secure/SameSite), CSP ready

---

## 🏗️ Architecture

```
portfolio/
├── public/                 # Static assets (favicon, images)
├── src/
│   ├── components/         # Reusable UI (Navbar, Footer, CustomCursor, Skeleton)
│   ├── pages/              # Route-level components
│   │   ├── Portfolio.tsx   # Main showcase — hero, about, projects, skills, exp, edu, certs, footer
│   │   ├── Blog.tsx        # Blog listing with pagination, search, tag filter
│   │   ├── BlogPost.tsx    # Markdown rendering, TOC, share buttons, related posts
│   │   └── Admin.tsx       # Full CMS — 11 tabs, modal forms, image upload
│   ├── server/             # Express route handlers (API v1)
│   ├── types.ts            # Shared TypeScript interfaces (Project, Skill, Blog, etc.)
│   ├── App.tsx             # Router + lazy-loaded pages + Suspense
│   └── main.tsx            # Entry point, Tailwind v4 import
├── server.ts               # Express + Vite middleware (dev) / static serve (prod)
├── vite.config.ts          # Vite + React + Tailwind v4 + path aliases
├── tsconfig.json           # Strict TS, ESNext, moduleResolution bundler
├── render.yaml             # Render.com Blueprint (Web Service + MongoDB)
├── vercel.json             # Vercel deployment config
└── package.json            # Scripts: dev, build, start, lint
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js ≥ 18** (tested on 20+)
- **MongoDB** (local or Atlas URI)
- **GitHub Personal Access Token** (for stats integration)
- **Google Gemini API Key** (optional, for AI content suggestions)

### Installation

```bash
# 1. Clone
git clone https://github.com/abhiram-tekulapalli/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your values (see below)

# 4. Start development (Vite + Express with HMR)
npm run dev
# → http://localhost:3000
```

### Environment Variables (`.env.local`)

```bash
# ──────────────────────────────────────────────
# Server
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-32-char-min
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000

# ──────────────────────────────────────────────
# Database
MONGODB_URI=mongodb://localhost:27017/portfolio
# Or Atlas: mongodb+srv://user:pass@cluster.mongodb.net/portfolio

# ──────────────────────────────────────────────
# Integrations
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
LEETCODE_SESSION=leetcode_session_cookie_value

# ──────────────────────────────────────────────
# AI (Optional)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX

# ──────────────────────────────────────────────
# Email (Optional - for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
```

### Production Build

```bash
# Build client (Vite) + server (esbuild)
npm run build

# Start production server
npm start
# → Serves dist/ on PORT
```

---

## 📦 Deployment

### Render.com (Recommended)

1. Push to GitHub
2. Connect repo in Render Dashboard → **New → Blueprint**
3. `render.yaml` provisions:
   - **Web Service** (Node.js, auto-deploys on push)
   - **MongoDB** (managed, free tier)
4. Add env vars in Render Dashboard → **Environment**

### Vercel

```bash
npm i -g vercel
vercel --prod
```
Configure env vars in Vercel Dashboard.

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite + Express with HMR (port 3000) |
| `npm run build` | Production build: `vite build` + `esbuild server.ts` |
| `npm run start` | Run production build (`node dist/server.cjs`) |
| `npm run clean` | Remove `dist/` and `server.js` |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |

---

## 📁 Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Health check |
| `GET` | `/api/v1/hydrate` | ❌ | Single payload: hero, about, projects, skills, exp, edu, certs, blogs, stats |
| `GET` | `/api/v1/projects` | ❌ | List projects (query: `featured`, `limit`) |
| `GET` | `/api/v1/blogs` | ❌ | List blogs (query: `page`, `limit`, `tag`, `search`) |
| `GET` | `/api/v1/blogs/:slug` | ❌ | Single blog post |
| `POST` | `/api/v1/auth/login` | ❌ | Admin login → sets HttpOnly JWT cookie |
| `POST` | `/api/v1/auth/logout` | ✅ | Clears cookie |
| `GET` | `/api/v1/admin/stats` | ✅ | Dashboard metrics |
| `GET/POST/PUT/DELETE` | `/api/v1/admin/*` | ✅ | CRUD for all content types |
| `POST` | `/api/v1/contact` | ❌ | Contact form → email via Nodemailer |
| `GET` | `/api/v1/github/stats` | ❌ | Cached GitHub profile + repo stats |
| `GET` | `/api/v1/leetcode/stats` | ❌ | Cached LeetCode profile + solved stats |

---

## 🎯 Resume Highlights

- **Full-Stack Portfolio CMS** — React 19, Express, MongoDB, JWT auth, deployed on Render
- **Real-time Data Aggregation** — GitHub GraphQL + LeetCode GraphQL with server-side caching
- **Admin Dashboard** — 11-module CMS with modal forms, image upload, markdown editor, draft/publish workflow
- **Performance** — Lazy-loaded routes, skeleton screens, cached hydration endpoint (<200ms), code-split bundles
- **Design System** — Tailwind v4 CSS variables, dark/light themes, Framer Motion animations, custom cursor
- **DevOps** — Blueprint deployments (Render + Vercel), Dockerfile, env-driven config, health checks

---

## 📸 Screenshots

| Portfolio Home | Admin Dashboard | Blog Post |
|:---:|:---:|:---:|
| ![Portfolio Home](public/screenshots/home.png) | ![Admin Dashboard](public/screenshots/admin.png) | ![Blog Post](public/screenshots/blog.png) |

---

## 🤝 Contributing

This is a personal portfolio, but PRs for bug fixes or dependency updates are welcome.

```bash
git checkout -b fix/your-fix
# make changes
npm run lint && npm run build
git commit -m "fix: describe your fix"
git push origin fix/your-fix
# Open PR
```

---

## 📄 License

Apache-2.0 — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

**Tekulapalli Abhiram**  
AI/ML Engineer • Full-Stack Developer

- 🌐 **Portfolio**: [abhiram-tekulapalli.dev](https://abhiram-tekulapalli.dev/)
- 💼 **LinkedIn**: [abhiram-tekulapalli](https://linkedin.com/in/abhiram-tekulapalli)
- 🐙 **GitHub**: [abhiram-tekulapalli](https://github.com/abhiram-tekulapalli)
- 📧 **Email**: abhiramtekulapalli@gmail.com

---

> Built with ☕, 🎵, and way too many `console.log`s.

<p align="center">
  <img src="assets/readme_assets/footer.svg" alt="Footer" width="100%" />
</p>
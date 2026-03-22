# ERP System (React + TypeScript + Tailwind)

**Repository:** [github.com/tanjiroakainu1/AI-ERP-SYSTEM](https://github.com/tanjiroakainu1/AI-ERP-SYSTEM)

ERP frontend starter with an MVC-style structure and two portals:

- **Public home** for visitors (marketing overview, Login / Register CTAs)
- Admin portal: CRUD for products, customers, orders
- Client portal: module navigation with catalog views and personal activity tracking where applicable
- Unified authentication for all roles
- Client-only registration flow
- Local persistence: uses `localStorage` through a store model
- Unified floating **Ask AI** (OpenRouter): ask anything—general questions, coding, writing, or ERP module help; no access to your live app data

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- ESLint + strict TypeScript config
- Futuristic dark UI with animated lightning backdrop (see `LightningBackdrop`, `index.css`)

## Project Structure

- `src/models`: data layer (`ErpStore`)
- `src/controllers`: business logic and CRUD controllers
- `src/views`: UI views and reusable CRUD section component
- `src/types`: ERP entities (`Product`, `Customer`, `Order`)

## Git: push to GitHub

If this folder is already a git repo with `origin` set to the URL above, push from your machine:

```bash
git push -u origin main
```

**Authentication (HTTPS):** GitHub no longer accepts account passwords for Git. Use a **Personal Access Token** (classic) with `repo` scope, or use **SSH**, or run `gh auth login` ([GitHub CLI](https://cli.github.com/)).

Never commit tokens or add them to the remote URL in tracked files.

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run lint
npm run build
```

## Deploy (Vercel)

This app is a **Vite + React SPA**. The repo includes `vercel.json` with:

- `npm run build` → static output in `dist/`
- SPA fallback: all routes rewrite to `index.html` (client-side navigation)
- Long cache headers for hashed `/assets/*` files

**Steps:** Import the Git repo in [Vercel](https://vercel.com), keep defaults (Node 18+), and deploy. No server is required.

Optional: add environment variables in the Vercel project for the AI chatbot (`VITE_OPENROUTER_*` as in [AI Chatbot Setup](#ai-chatbot-setup-openrouter)).

## Default Accounts

- Admin: `admin@gmail.com` / `admin123`
- Client: `client@gmail.com` / `client123`

## Authentication Rules

- Unified login handles both admin and client roles.
- Registration creates **client** accounts only.
- Admin manages master data; client workflows use dedicated activity records (sample seed data included).

## AI Chatbot Setup (OpenRouter)

1. Create `.env.local` in project root:

```bash
VITE_OPENROUTER_API_KEY=your_openrouter_key
VITE_OPENROUTER_MODEL=openrouter/auto
```

2. Start app:

```bash
npm run dev
```

3. Use the floating **Ask anything** button (bottom-right) to open the assistant.
4. If you receive `402`, add OpenRouter credits or switch to an available free model in `VITE_OPENROUTER_MODEL`.
5. The assistant is **general-purpose** (any topic) and can explain ERP concepts; it does **not** read your database—describe your screen or paste IDs if needed.

Reference: [OpenRouter Keys](https://openrouter.ai/workspaces/default/keys)

## Credits

- **Developer:** Raminder Jangao
- App name and credits are centralized in `src/constants/siteMeta.ts`.

# LESEKESE Instant Killer

Official website for **LESEKESE Instant Killer** — a Nigerian bedbug & cockroach insecticide brand. Includes a product showcase, distributor locator, pest calculator, WhatsApp ordering, an inquiry form, and legal pages.

---

## Table of Contents

- [About](#about)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Conventions](#conventions)
- [Build & Deployment](#build--deployment)
- [License](#license)

---

## About

LESEKESE Instant Killer is a single-page application (SPA) for a Nigerian insecticide brand. It showcases the product lineup, helps customers find nearby distributors via a map locator, and lets them estimate how much product they need with the pest calculator. Orders are placed directly through WhatsApp, and the inquiry form is handled via Formspree — there is no backend; all content lives in static data files under `src/data/`.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build tool | [Vite 6](https://vitejs.dev) (dev server on port **3000**) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) (`@import "tailwindcss"`, no config file) |
| Routing | Browser-router style (History API / `pushState`) in `src/App.tsx` |
| Animation | [motion](https://motion.dev) (Framer Motion) |
| Charts | [recharts](https://recharts.org) (admin analytics) |
| Celebration | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| Icons | [lucide-react](https://lucide.dev) |
| Forms | Formspree (endpoint overridable via `VITE_FORMSPREE_ENDPOINT`) |
| Package manager | [bun](https://bun.sh) (npm also works) |

## Prerequisites

- [Node.js](https://nodejs.org) (16+; LTS recommended)
- [bun](https://bun.sh) or [npm](https://www.npmjs.com)

## Getting Started

```sh
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd lesekese-instant-killer

# 2. Install dependencies
bun install

# 3. Start the dev server (http://localhost:3000)
bun run dev
```

The dev server runs with hot module replacement (HMR) for an instant preview.

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server on port 3000 |
| `bun run build` | Build the production bundle into `dist/` |
| `bun run lint` | Type-check the project with TypeScript (`tsc --noEmit`) |
| `bun run preview` | Preview the production build locally |
| `bun run test:e2e` | Run the Playwright end-to-end tests |

## Project Structure

```
lesekese-instant-killer/
├── public/                    # Static assets (.htaccess ships into dist/, favicons)
├── src/
│   ├── App.tsx                # Browser-router routing (add new routes here)
│   ├── main.tsx               # App entry point
│   ├── index.css              # Tailwind + shared glassmorphism helpers (.glass-card, etc.)
│   ├── pages/                 # One component per page (e.g. HomePage.tsx)
│   ├── components/            # Navbar, Footer, ProductCard, OrderModal, PestCalculator, ...
│   ├── data/                  # Static content (mockData.ts: products, locations, FAQs)
│   ├── assets/                # Local images (distributor station photos)
│   └── types.ts               # Shared TypeScript types
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Conventions

- **Path alias**: `@/` resolves to the **project root** (e.g. `@/src/data/mockData`, `@/src/types`) — see `vite.config.ts`.
- **Routing**: no router library. `currentPath` state is synced with `window.location.pathname` via `popstate` + `pushState`. `navigateTo(path)` pushes the path and scrolls to top. Legacy `#/products` hashes auto-migrate to clean `/products` URLs. Unknown paths fall back to Home.
- **Design system**: glassmorphism aesthetic on a dark slate-950 background. Shared classes live in `src/index.css`: `.glass-card`, `.glass-card-hover`, `.glass-pill`, `.glass-input`, `.fire-glow`. Fonts: Bebas Neue (display), Syne (accent), DM Sans (body). Accent colors are red-500/600 + amber-500 gradient glows.
- **Micro-interactions**: `whileTap={{ scale: 0.98 }}`, `whileHover={{ y: -6 }}`, staggered entrances via motion.
- **Data**: all content lives in `src/data/mockData.ts` — keep it centralized there.
- **No code comments** unless explicitly requested.

## Build & Deployment

```sh
bun run build
```

The production build is output to `dist/`. Deploy to a cPanel `public_html/` folder by uploading the contents of `dist/` (including `.htaccess`, which ships automatically) to the domain root. The SPA fallback in `.htaccess` ensures deep links like `/products` resolve correctly on hard refresh — deploy to the domain root, not a subfolder, so absolute routes work.

Suggested hosts: cPanel shared hosting, Netlify, Vercel, or any CDN-backed static file server (with SPA fallback to `index.html`).

## License

All rights reserved. This project and its content belong to LESEKESE Instant Killer. Unauthorised reproduction or redistribution is not permitted without written consent.

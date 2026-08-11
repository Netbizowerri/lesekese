# AGENTS.md

Guide for AI agents working in this repository.

## Project Overview

LESEKESE Instant Killer — a single-page React app for a Nigerian bedbug & cockroach insecticide brand. Includes product showcase, distributor locator, pest calculator, ordering (via WhatsApp), inquiry form, and legal pages.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 6** (build/typecheck via `tsc --noEmit`)
- **Tailwind CSS 4** (`@import "tailwindcss"` in `src/index.css`, no config file)
- **motion** (Framer Motion) for animations, **lucide-react** for icons, **canvas-confetti** for celebrations
- **recharts** for analytics charts
- Package manager: **bun** (`bun.lock`). npm also works.
- `@/` import alias resolves to the **project root** (e.g. `@/src/data/mockData`, `@/src/types`)

## Commands

- `bun run dev` (or `npm run dev`) — dev server on port 3000
- `bun run build` — production build
- `bun run preview` — preview the build
- `bun run lint` — TypeScript typecheck (`tsc --noEmit`); run after any change

## Routing

No router library. Routing is **browser-router style** (History API / `pushState`) in `src/App.tsx`:
- `currentPath` state synced with `window.location.pathname` via `popstate` + `pushState` (no hash)
- `navigateTo(path)` pushes the path + scrolls to top
- Legacy `#/products` hashes auto-migrate to clean `/products` URLs once on load
- Pages are switched via a `switch` in `renderCurrentPage()`; unknown paths fall back to Home
- Paths: `/` (home), `/products`, `/how-it-works`, `/locations`, `/contact`, `/admin`, `/privacy`, `/terms`, `/safety`, `/refunds`

Pages live in `src/pages`, shared components in `src/components`.

## Deployment (cPanel)

Browser-router paths require an SPA fallback so hard refreshes don't 404. The file `public/.htaccess` ships into `dist/` automatically — upload the contents of `dist/` (including `.htaccess`) into `public_html/`. Deploy to the domain root (not a subfolder) so absolute routes like `/products` resolve.

## Data

All content lives in `src/data/mockData.ts`:
- `PRODUCTS`, `LOCATIONS`, `FAQS`, `SAMPLE_LEADS`, `DISTRIBUTOR_INVENTORY`, plus image URL exports
- Types are defined in `src/types.ts` (Product, DistributorLocation, FAQItem, ContactFormData, LeadSubmission, InventoryItem)

## Form Submissions & Ordering

- Inquiry form (`src/components/ContactForm.tsx`) POSTs JSON to Formspree (endpoint overridable via `VITE_FORMSPREE_ENDPOINT`), with optional Privyr webhook via `VITE_PRIVYR_WEBHOOK_URL`. Failures still show a friendly success state (demo behavior).
- Fast checkout (`src/components/OrderModal.tsx`) opens WhatsApp and tel links — no backend.
- Also fetches photoUrl for distributor stations from local `src/assets/images`.

## Design System (important — keep consistent)

- **Glassmorphism** aesthetic (dark slate-950 background, frosted glass). Shared CSS classes in `src/index.css`: `.glass-card`, `.glass-card-hover`, `.glass-pill`, `.glass-input`, `.fire-glow`.
- **Fonts**: Bebas Neue (display/headings), Syne (accent), DM Sans (body) — loaded via Google Fonts in `index.html`. `font-display` and `font-accent` utility classes.
- **Accent colors**: red-500/600 + amber-500 gradient glow accents on slate-950 base.
- Micro-interactions: `whileTap={{ scale: 0.98 }}`, `whileHover={{ y: -6 }}`, staggered entrances (motion).
- Design guidance also captured in `.ai-skills/` (impeccable, taste-skill, agent-skills). Follow these when adding UI.

## Environment

- `GEMINI_API_KEY` and `APP_URL` documented in `.env.example` (AI Studio injects at runtime). No server.js exists yet — `@google/genai` and `express` deps are reserved for a future server.
- `.env` values like `VITE_FORMSPREE_ENDPOINT` / `VITE_PRIVYR_WEBHOOK_URL` read via `import.meta.env`.

## Notes

- Do not modify `vite.config.ts` HMR/watch settings (AI Studio relies on `DISABLE_HMR`).
- Keep responses WCAG AA compliant (high contrast) and mobile-first from 375px.
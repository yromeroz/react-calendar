# React Calendar - Rooms & Courses Reservation Scheduler

## Overview

A Google-Calendar-like web application built with **Next.js 15** (App Router) for visualizing and managing room (salon) reservations in an educational institution (likely a university in Uruguay). It integrates with an external legacy system (GeneXus-based) via **JWT authentication** and **iframes** for detailed reservation views.

---

## Main Features

- **Multiple Calendar Views**: Day, Week, and Month views with animated transitions.
- **Real-time Updates**: Adaptive polling (`useReservasPolling`) with exponential backoff for live event updates.
- **Filters**: Sidebar filters by room (salon), subject (materia/curso), and reservation type.
- **Color Legend**: Floating button showing a legend of reservation type colors and career (carrera) colors.
- **JWT Authentication**: Token received via `postMessage` from a parent window (legacy system), stored in `localStorage`, and forwarded to iframes.
- **Reservation Requests**: Form with date/time pickers, subject/type selects, Zod validation, and server actions.
- **Event Details**: Popover summary + authenticated iframe to external system for detailed view.
- **Responsive Design**: Toggleable sidebar, floating mobile menu, floating "+" button for reservation creation.
- **Career (Carrera) Data**: Fetched via API and displayed in the legend.
- **Spanish Locale**: Full UI in Spanish with dayjs locale.

---

## Technologies

| Category | Stack |
|---|---|
| **Framework** | Next.js 15.5.15 (App Router) |
| **UI Library** | React 18.3.1 |
| **Language** | TypeScript 5.x |
| **Styling** | TailwindCSS 3.4.19, shadcn/ui 2.10.0, Radix UI primitives, framer-motion |
| **State** | Zustand 4.5.7 (devtools + persist) |
| **ORM** | Drizzle ORM 0.45.2 + MySQL2 3.22.1 |
| **Migrations** | Drizzle Kit 0.31.10 |
| **Database** | MySQL (dev) / MariaDB SkySQL (prod) |
| **Forms** | react-hook-form + @hookform/resolvers + Zod |
| **Auth** | jsonwebtoken + bcryptjs (client-side token decode, postMessage) |
| **Dates** | dayjs 1.11.20 |
| **HTTP** | Native fetch (polling), SWR 2.4.1 |
| **Notifications** | sonner 2.0.7 |
| **Testing** | Vitest + @testing-library/react |
| **Dev Tools** | ESLint, Prettier + prettier-plugin-tailwindcss |

---

## Infrastructure

### Docker

- **Dockerfile**: Two-stage build with `node:18-alpine`. Exposes port 3000.
- **docker-compose.yml**: Builds from Dockerfile, loads `.env.test`, connects to external `localstack-net` network.
- **deploy.sh**: Simple start/stop script using `nohup`/`pkill`.

### Netlify

- **netlify.toml**: Publishes `.next`, build command `pnpm run build`, uses `@netlify/plugin-nextjs`.

### CI/CD

- **GitHub Actions** (`.github/workflows/update-version.yml`): On tag push (`vX.Y.Z`), bumps version and builds. Deployment steps are placeholders.

### Environments

| File | Purpose |
|---|---|
| `.env.local` | Dev: MySQL via `host.docker.internal:3306`, JWT config |
| `.env.production` | Production: MariaDB SkySQL with SSL |
| `.env.test` | Docker: MySQL via `172.21.0.3:3306` |

---

## Project Structure

```
app/                          # Next.js App Router
├── actions/                  # Server Actions (createEvent)
├── api/
│   ├── carreras/             # GET /api/carreras
│   └── reservas/             # GET /api/reservas, GET /api/reservas/version
├── layout.tsx                # Root layout + AuthProvider
└── page.tsx                  # Home page

components/
├── auth/                     # PostMessageAuth
├── footer/                   # Footer, ReservationLegend
├── header/                   # Header, navigation, view selector
├── sidebar/                  # Sidebar, filters, mini-calendar, floating sidebar
├── ui/                       # shadcn/ui primitives
├── day-view.tsx              # Room x Hour grid
├── week-view.tsx             # 7-column week time grid
├── month-view.tsx            # Month grid
├── event-renderer.tsx        # Event chips for all views
├── event-popover.tsx         # Reservation creation form
├── event-summary-popover.tsx # Event details + iframe
├── event-list-popover.tsx    # "+N más" event list
└── MainView.tsx              # Orchestrator component

db/
├── schema.ts                 # Drizzle ORM schema (7 tables)
├── drizzle.ts                # Drizzle client
├── seed.ts                   # Test data seed
└── migrations/               # Migration files

hooks/
├── useReservasPolling.ts     # Adaptive real-time polling
└── usePostMessageAuth.ts     # JWT postMessage listener

lib/
├── data.ts                   # DB queries
├── store.ts                  # Zustand stores
├── utils.ts                  # cn(), color utilities, contrast
└── getTime.ts                # Date grid utilities

tests/                        # Vitest test files
```

---

## Opportunities for Improvement

### High Priority

*(No high priority items remain — all 3 original findings have been resolved.)*

### Medium Priority

1. **Hardcoded Values**: Three hardcoded calendars ("Work/Personal/Fitness") in sidebar, dummy users array, placeholder search component, hardcoded scroll offsets (`hoursOffset = 7`, `startIndex = 8`).

2. **Dead Code**: `lib/axios.ts` fully commented out, `components/header/UserProfile.tsx` is a duplicate of `FloatingSideBar.tsx` and never imported, `add-user.tsx` is empty.

3. **Missing Loading/Error States**: No `Suspense` boundaries, no loading spinner for initial event load, no global toast system (sonner installed but unused).

4. **Fragile DOM Queries**: `day-view.tsx` uses `querySelector('.rooms-column')` for event positioning — breaks if DOM structure changes.

5. **Minimal Test Coverage**: Only 2 test files. No tests for API routes, DB queries, filtering logic, or the polling hook.

6. **No Auth on API Routes**: `/api/reservas`, `/api/reservas/version`, `/api/carreras` have no authentication checks.

### Low Priority

7. **Polling Version Cursor**: Uses `lastCreatedAt` timestamp — events with the same timestamp could be missed. A monotonically increasing ID would be more reliable.

8. **Auth Fragility**: Client-side token decode with `atob()`, no server-side signature verification, full page reload on token receipt.

9. **No Data Refresh After Creation**: After submitting a reservation request, the calendar doesn't reflect the change until the legacy system processes it.

10. **Docker Compose External Network**: Requires pre-existing `localstack-net` network — not documented, cannot run standalone.

11. **Netlify vs Docker Build Command**: Netlify uses `pnpm run build` but Docker uses `npm install`/`npm run build`. No `pnpm` in Docker image.

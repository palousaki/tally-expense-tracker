# Tally — Claude Code Context

## What this is
A personal expense tracker web app. Single authenticated user tracks expenses, sets category budgets, and views spending charts. Built mobile-first but fully responsive.

## Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | Supabase PostgreSQL via Prisma ORM |
| Auth | Supabase Auth (email + Google OAuth) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | Zustand (`store/useExpenseStore.ts`) |
| Icons | Lucide React |

## Project structure
```
app/
  (auth)/login, (auth)/signup   ← public auth pages
  (app)/                        ← protected, has Sidebar + BottomNav shell
    page.tsx + DashboardClient.tsx
    transactions/
    budgets/
    stats/
    profile/
  api/expenses, categories, budgets, profile, auth/setup
  auth/callback/                ← OAuth callback
lib/
  supabase/client.ts            ← browser client (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  supabase/server.ts            ← server client (SUPABASE_SECRET_KEY)
  prisma.ts                     ← singleton PrismaClient
  categories.ts                 ← COLOR_MAP, DEFAULT_CATEGORIES, getCategoryColor()
  utils.ts                      ← cn(), formatCurrency(), formatDate()
components/
  layout/Sidebar.tsx            ← desktop nav (hidden md:flex, w-56)
  layout/BottomNav.tsx          ← mobile nav (md:hidden via layout wrapper)
  ui/Modal.tsx                  ← bottom sheet on mobile, centered dialog on desktop
  dashboard/, transactions/, budgets/, stats/
store/useExpenseStore.ts
types/index.ts
prisma/schema.prisma
```

## Key conventions

### Category color system
**Always use `getCategoryColor(category.colorKey)`** from `lib/categories.ts`. Never hardcode colors per category anywhere. Returns `{ bg, text, bar, border, hex }` Tailwind classes + hex for Recharts.

### Responsive layout
- **Mobile (< md):** `max-w-md mx-auto`, bottom nav, FAB at `bottom-20 right-4`
- **Desktop (≥ md):** `ml-56` content beside fixed sidebar, no max-width cap, FAB at `md:bottom-6 md:right-6`
- Dashboard: 2-column grid on desktop (`md:grid md:grid-cols-2`)
- Modal: bottom sheet on mobile, centered dialog (`md:items-center md:rounded-2xl`) on desktop

### Data flow
Server components fetch from Prisma, pass serialized data as props to `*Client.tsx` client components. Client components hydrate Zustand store on mount. Optimistic updates go through the store; re-fetches happen on month change.

### Auth / user setup
On first load of `/` or `/profile`, if no Prisma `User` row exists for the Supabase auth user, one is created with `DEFAULT_CATEGORIES` seeded. This handles the case where email confirmation delayed the `/api/auth/setup` call at signup.

### API routes
All routes in `app/api/` check `supabase.auth.getUser()` server-side before touching Prisma. Use `userId` from the session — never trust a userId from the request body.

### Amounts
Stored as `Float` in EUR. Display with `formatCurrency(amount)` from `lib/utils.ts`. Use `tabular-nums` class on monetary text.

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   ← replaces old ANON_KEY
SUPABASE_SECRET_KEY                    ← replaces old SERVICE_ROLE_KEY
DATABASE_URL                           ← Supabase session pooler URL (IPv4 compatible)
```
DATABASE_URL uses the **session pooler** (not direct connection) because the direct connection uses IPv6 which the local network doesn't support. Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres`

## Database
Run `npx prisma db push` after schema changes (uses `.env` for DATABASE_URL, not `.env.local`).
Run `npx prisma generate` after any schema change to regenerate the client.

## Font
Using `Inter` from `next/font/google`. Geist is Next.js 15+ only, not available in 14.

## Common pitfalls
- `next build` fails with EPERM if `next dev` is still running — kill node.exe first
- `npx prisma db push` reads `.env`, not `.env.local` — keep DATABASE_URL in both files
- Supabase `setAll` cookies setter must be typed as `{ name: string; value: string; options: CookieOptions }[]` — import `CookieOptions` from `@supabase/ssr`
- `next.config.ts` is not supported in Next.js 14 — use `next.config.mjs`

# Tally

A personal expense tracker built with Next.js 14, Supabase, and Tailwind CSS. Track spending by category, set monthly budgets, and visualize trends — on both mobile and desktop.

## Features

- **Dashboard** — monthly budget overview, spending by category, recent transactions
- **Transactions** — full list with month picker, category filter, and sort; inline edit and delete
- **Budgets** — per-category budget cards with progress bars; inline edit; copy last month
- **Stats** — pie chart by category and 6-month bar chart
- **Profile** — display name, category list, CSV export, sign out
- **Auth** — email/password and Google OAuth via Supabase
- **Responsive** — bottom nav on mobile, sidebar on desktop

## Tech stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth |
| Styling | Tailwind CSS |
| Charts | Recharts |
| State | Zustand |
| Icons | Lucide React |

## Getting started

### 1. Clone and install

```bash
git clone <repo-url>
cd tally
npm install
```

### 2. Set up environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

Create `.env` with just the `DATABASE_URL` (used by Prisma CLI):

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
```

> **Note:** Use the **Session pooler** URL from Supabase (Project Settings → Database → Connect → Session pooler), not the direct connection. The direct connection requires IPv6 which most networks don't support.

### 3. Push the database schema

```bash
npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  (auth)/          # Login and signup pages
  (app)/           # Protected pages — dashboard, transactions, budgets, stats, profile
  api/             # API routes (expenses, categories, budgets, profile, auth)
  auth/callback/   # OAuth redirect handler
components/
  layout/          # Sidebar (desktop) and BottomNav (mobile)
  ui/              # Modal, ProgressBar, Skeleton primitives
  dashboard/       # BudgetSummaryCard, CategoryBreakdown, RecentTransactions
  transactions/    # TransactionItem, AddExpenseModal, EditExpenseModal
  budgets/         # BudgetCard
  stats/           # SpendingPieChart, MonthlyBarChart
lib/
  supabase/        # Browser and server Supabase clients
  prisma.ts        # Singleton PrismaClient
  categories.ts    # Color system — COLOR_MAP, DEFAULT_CATEGORIES, getCategoryColor()
  utils.ts         # cn(), formatCurrency(), formatDate()
store/
  useExpenseStore.ts  # Zustand store
types/index.ts
prisma/schema.prisma
```

## Category color system

Every category has a `colorKey` (e.g. `"purple"`, `"teal"`) that maps to a consistent set of Tailwind classes and a hex value for charts. Always use `getCategoryColor(colorKey)` from `lib/categories.ts` — never hardcode colors per category.

## Supabase setup notes

- Enable **Email Auth** under Authentication → Providers
- Optionally enable **Google OAuth** and add the callback URL: `https://<your-domain>/auth/callback`
- Row Level Security (RLS) can be configured per table in the Supabase dashboard

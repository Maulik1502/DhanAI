# DhanAI — CODEX MEGA PROMPT
# (Copy everything below into Codex, Claude Code, or your AI coding tool)

---

## PREAMBLE

You are a **senior full-stack Next.js engineer** building the **production-ready version** of **DhanAI**, an AI-powered personal finance platform for Indian retail investors.

**Critical Instructions:**
- Do NOT regenerate files that already exist (auth.ts, db/index.ts, calculators, types, middleware)
- DO extend and wire everything together
- DO follow the design system exactly
- DO implement logging in every cron job
- DO NOT deviate from the tech stack
- ALL code must be TypeScript strict mode, no `any` except existing auth callbacks

**Success Criteria:**
- Every endpoint validated with Zod
- Every page is 100% mobile-responsive
- Every cron job logs start/success/error
- All amounts formatted via `formatINR()`
- All financial calculations via `@/lib/calculators`
- All data fetches cached via `cached()` helper

---

## 1. PROJECT CONTEXT & PHILOSOPHY

### Product: DhanAI
**Tagline:** "Manage every rupee intelligently — from salary to corpus"

**Users:** Indian salaried employees, freelancers, retail investors (age 22-55)

**Currency:** ₹ INR only, everywhere. Use `formatINR()` for all display.

**Core AI Money Priority Order (IMMUTABLE — encode into every suggestion, every prompt):**
```
1. Fixed Expenses + EMIs     (non-negotiable, always first)
2. Insurance Premiums        (protect before investing)
3. Tax Saving Investments    (80C, 80D, NPS)
4. Emergency Fund            (AI-managed, NEVER a user goal)
5. User-Defined Goals        (100% user created)
6. Corpus Building           (everything remaining)
```

Never violate this order in any AI suggestion, alert, or recommendation.

---

## 2. TECH STACK (LOCKED — DO NOT CHANGE)

```
Frontend Framework  : Next.js 15 (App Router, React 18)
Language           : TypeScript (strict mode)
Styling            : Tailwind CSS + shadcn/ui
Forms              : React Hook Form + Zod (validation)
State Management   : Zustand (global), React Query (server state)
Charts             : Recharts (bar, line, area, pie)
Icons              : lucide-react (18px default)
Animations         : Framer Motion + Tailwind animations
Database ORM       : Prisma (multi-DB: PostgreSQL/MySQL/Oracle via env)
Auth               : NextAuth v5 (Google OAuth2 only, JWT sessions)
Cache              : Upstash Redis (REST, not Socket.io)
AI                 : Anthropic Claude SDK, model: claude-sonnet-4-6
Logging            : Winston (console + file)
Notifications      : Resend (email), Firebase FCM (push)
Market Data        : NewsAPI (news), stubs for MF/Stock/FD APIs (wire later)
Deployment         : Vercel (serverless)
Path Alias         : @/* resolves to src/*
```

Environment: Node.js 18+, npm or pnpm

---

## 3. EXISTING FILES (DO NOT REGENERATE — IMPORT & EXTEND)

**Core Libraries Already Built:**

```
prisma/schema.prisma
  → 11 models: User, Account, Session, Income, Expense, Goal, Investment,
    EmergencyFund, Insurance, TaxProfile, Corpus, Alert, ChatMessage, MarketData, AuditLog
  → All enums: RiskLevel, TaxRegime, UserPlan, Frequency, ExpenseCategory,
    GoalStatus, InvestmentType, InvestmentStatus, FundStatus, InsuranceType,
    InsurancePriority, InsuranceStatus, AlertType

src/lib/db/index.ts
  → export const db (Prisma singleton)
  → export const dbRead (read replica support)
  → checkDatabaseHealth()
  → Connection pooling + multi-DB support built-in

src/lib/redis.ts
  → export const redis (Upstash client)
  → export const TTL (cache durations)
  → export const CacheKey (builder functions)
  → cached<T>(key, fetcher, ttl) — use this for all data fetches
  → invalidateUser(userId)
  → checkRateLimit(userId, action, limit)
  → checkAILimit(userId, plan) — FREE: 5/day, PRO: 100/day, ELITE: unlimited

src/lib/auth.ts
  → export const { handlers, auth, signIn, signOut }
  → export getCurrentUser() — get current user with all fields
  → export requireAuth() — throw if not authenticated
  → NextAuth v5 with Google OAuth2 + JWT
  → On user creation: auto-create TaxProfile + Corpus records

src/lib/calculators/index.ts
  → sipFutureValue(monthly, annualPct, months)
  → sipRequired(target, annualPct, months)
  → lumpsumFV(principal, annualPct, years)
  → getGoalInstrument(months, risk) → returns instrument + expectedReturn
  → taxNewRegime(grossIncome) → TaxCalculationResult with 87A rebate logic
  → taxOldRegime(grossIncome, deductions) → TaxCalculationResult with all slabs
  → compareTaxRegimes(grossIncome, deductions) → recommended regime + savings
  → calcEmergencyFund(monthlyExpenses, occupation) → target + monthlyAlloc
  → calcCorpusProjections(monthly, current, annualReturn) → 5/10/15/20/30 year projections
  → CORPUS_RETURNS: Record<RiskLevel, { equity, debt, gold, expectedReturn }>
  → toMonthly(amount, frequency)
  → formatINR(amount) → "₹1.00 L" or "₹5.00 Cr"

src/types/index.ts
  → All TypeScript types: RiskLevel, TaxRegime, UserPlan, GoalStatus, etc.
  → ApiResponse<T> = { success, data?, error?, message? }
  → TaxCalculationResult, HealthScore, GoalAISuggestion, CorpusProjections
  → Never redefine — extend only if new types needed

src/middleware.ts
  → Route protection (redirects unauth to /login)
  → Auth context available in all pages

src/app/layout.tsx
  → Root layout with Providers + metadata

src/app/globals.css
  → Tailwind theme with CSS variables
  → Color palette for DhanAI brand
  → .bg-dhan-gradient, .amount-positive, .amount-negative, .card-hover utilities

src/components/shared/providers.tsx
  → SessionProvider + QueryClientProvider wrapper

src/app/(auth)/login/page.tsx
  → Google sign-in page (done, don't change)

src/app/(dashboard)/layout.tsx
  → Dashboard shell with top nav + sidebar (already started, enhance it)

src/app/(dashboard)/dashboard/page.tsx
  → Basic dashboard with placeholder cards (fully replace with real data)
```

**Key Principle:** Import from these files, don't redefine. If you need a new calculation, add it to calculators. New types? Extend types/index.ts.

---

## 4. DESIGN SYSTEM (REFERENCE: DHANAI_UI_UX_DESIGN_SYSTEM.md)

### Color Usage
```
Primary: #1F2937 (deep slate for titles)
Accent:  #3B82F6 (bright blue for CTAs)
Success: #10B981 (emerald for gains/income)
Alert:   #EF4444 (red for expenses/losses)
Gold:    #F59E0B (milestones)
Gray:    #6B7280 (secondary text)
```

### Typography
```
h1: Inter 700, 32px (page titles)
h2: Inter 600, 24px (section headers)
h3: Inter 600, 20px (card titles)
Body: Inter 400, 16px (default text)
Small: Inter 400, 14px (secondary)
Tiny: Inter 400, 12px (captions)
Monospace: JetBrains Mono for amounts
```

### Components
```
Cards      : bg-white, border border-gray-200, rounded-lg, card-hover utility
Buttons    : px-4 py-2.5, rounded-lg, transitions 200ms
Inputs     : border-gray-300, focus:border-blue-500 focus:ring-blue-100
Progress   : height-8 rounded-full (linear) OR 120px SVG (circular)
Empty State: centered icon + message + CTA
Loading    : Skeleton loaders OR spinner, never blank
Modals     : max-w-md, bg-white, shadow-2xl, rounded-xl
Toast      : bottom-right, auto-dismiss 4s
Badges     : inline-flex, px-2 py-1, rounded-full
```

### Layout
```
Desktop (1200px+) : 3-column grids, fixed 256px sidebar
Tablet (768px)    : 2-column grids, collapsible sidebar
Mobile (375px)    : 1-column stacks, bottom tab bar or slide menu
Gaps              : 1.5rem between sections
Touch targets     : minimum 48px × 48px
Font size mobile  : minimum 16px (prevents auto-zoom)
```

### Micro-interactions
```
Hover    : shadow +4px, -2px translateY, 200ms ease-out
Loading  : pulsing skeleton OR rotating spinner
Submit   : button → spinner, disable inputs, prevent scroll
Success  : green checkmark badge + toast 4s
Error    : red X badge + inline error message
```

---

## 5. DATABASE SCHEMA (REFERENCE: prisma/schema.prisma)

### Key Models
```
User
  → Core identity: email, name, avatar, googleId
  → Preferences: riskLevel, taxRegime, occupation, age, dependents, plan (FREE/PRO/ELITE)
  → Status: onboarded (bool), plan (FREE/PRO/ELITE), createdAt, updatedAt
  → Relations: all financial data linked via userId

Income
  → userId, type (SALARY/FREELANCE/BUSINESS/RENTAL/CAPITAL_GAINS/DIVIDEND/OTHER)
  → amount, frequency (MONTHLY/QUARTERLY/YEARLY/ONE_TIME)
  → isActive (soft delete)

Expense
  → userId, category (RENT/FOOD/TRANSPORT/EMI_*/INSURANCE/SUBSCRIPTION/etc.)
  → amount, frequency
  → isEMI (bool), emiMonthsLeft, emiStartDate, loanType, bankName
  → isActive (soft delete)

Goal
  → userId, name (user-created), emoji
  → targetAmount, currentAmount, deadline
  → monthlySIP, instrument (e.g., "Large Cap Mutual Fund"), schemeCode, schemeName
  → expectedReturn, priority
  → status (ACTIVE/COMPLETED/PAUSED/CANCELLED)
  → aiSuggestion (JSON as text), completedAt
  → Uses getGoalInstrument() + sipRequired() to compute monthlySIP

Investment
  → userId, type (MUTUAL_FUND/STOCK/FD/BOND/PPF/NPS/SGB/ELSS/RD/OTHER)
  → amount, units, buyPrice, currentValue, returns
  → startDate, maturityDate, status (ACTIVE/MATURED/SOLD)
  → goalId (optional, links to a goal), isCorpus (bool)

EmergencyFund
  → userId (unique), targetAmount, currentAmount
  → instrument, schemeCode, schemeName
  → status (BUILDING/COMPLETE/USED), monthsCovered, monthlyAlloc
  → Created automatically on first onboarding

Insurance
  → userId, type (TERM/HEALTH/MOTOR/HOME/LOAN_PROTECTION/CRITICAL_ILLNESS)
  → coverAmount, premium, frequency, priority (CRITICAL/RECOMMENDED/OPTIONAL)
  → status (SUGGESTED/ACTIVE/LAPSED), reason (AI-generated), nextDueDate, policyNo
  → Suggestions auto-generated by AI on first onboarding

TaxProfile
  → userId (unique), regime (OLD/NEW), financialYear (e.g., "2025-26")
  → grossIncome, taxableIncome, taxLiability
  → All deductions: 80C, 80D, NPS, HRA, homeLoanInterest, otherDeductions
  → taxSaved, remainingLimit80C
  → Recomputed whenever deductions change

Corpus
  → userId (unique), targetAmount (default 10Cr), currentValue, monthlyInvestment
  → expectedReturn (from CORPUS_RETURNS based on riskLevel)
  → timelineYears (default 20)
  → projections (JSON: 5/10/15/20/30 year values)
  → allocation (JSON: equity/debt/gold %)

Alert
  → userId, type (12 types: GOAL_COMPLETED, GOAL_AT_RISK, EMI_COMPLETED, etc.)
  → title, message, data (JSON with deepLink), read (bool)
  → Idempotent: don't create duplicates within 24h

ChatMessage
  → userId, role ("user" or "assistant"), content (can be long)
  → createdAt, indexed by (userId, createdAt)

AuditLog
  → userId, action, entity, entityId, data (JSON)
  → createdAt, indexed by (userId, createdAt)

Report
  → userId, type ("MONTHLY_SUMMARY" | "ANNUAL_TAX" | "PORTFOLIO" | "NET_WORTH")
  → title, data (JSON), createdAt
  → Used for storing generated report content before Vercel Blob is configured

MarketData
  → type ("MF", "STOCK", "FD", "BOND"), code, name, data (JSON as text)
  → Upserted by cron jobs, cached in Redis
```

---

## 6. API ROUTES TO BUILD

### Pattern for Every Route
```typescript
// src/app/api/[section]/route.ts

import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse } from '@/types';

// 1. Validate input
const CreateSchema = z.object({
  name: z.string().min(1).max(100),
  // ... fields
});

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    
    // 2. Query with db (Prisma)
    const data = await db.yourModel.findMany({ where: { userId: user.id } });
    
    // 3. Return typed ApiResponse
    return NextResponse.json<ApiResponse>({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    
    // 4. Validate with Zod
    const parsed = CreateSchema.parse(body);
    
    // 5. Persist
    const created = await db.yourModel.create({
      data: { ...parsed, userId: user.id },
    });
    
    // 6. Invalidate cache
    await invalidateUser(user.id);
    
    return NextResponse.json<ApiResponse>(
      { success: true, data: created },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Routes to Build

**src/app/api/finances/route.ts**
- GET  → list incomes + expenses + computed surplus
- POST → create income or expense (discriminator: kind: "income"|"expense")
- PATCH → update
- DELETE → soft delete (isActive = false)

**src/app/api/goals/route.ts**
- GET  → list active goals with progress %
- POST → create goal: validate affordability against surplus, compute monthlySIP + instrument
- PATCH → update currentAmount (manual top-up)
- DELETE → mark CANCELLED

**src/app/api/goals/[id]/route.ts**
- GET → single goal with projection chart data

**src/app/api/investments/route.ts**
- GET → list grouped by type with allocation %
- POST → add investment
- PATCH → update currentValue/units
- DELETE → mark SOLD

**src/app/api/tax/route.ts**
- GET → return TaxProfile + live compareTaxRegimes() result
- POST → update tax deductions + regime choice

**src/app/api/emergency/route.ts**
- GET → return EmergencyFund; create if none exists via calcEmergencyFund()
- PATCH → update currentAmount, auto-set status to COMPLETE when >=target

**src/app/api/insurance/route.ts**
- GET → list; if empty, generate SUGGESTED records using insurance suggestion logic
- POST → user confirms suggestion → status ACTIVE
- PATCH → update policy details

**src/app/api/corpus/route.ts**
- GET → return Corpus with calcCorpusProjections()
- PATCH → update monthlyInvestment + riskLevel

**src/app/api/alerts/route.ts**
- GET → paginated list (unread first), ?unread=true filter
- PATCH → mark read (single id or "markAllRead": true)

**src/app/api/user/route.ts**
- GET → current user profile
- PATCH → update profile (age, occupation, dependents, riskLevel, taxRegime)

**src/app/api/onboarding/route.ts**
- POST → accepts OnboardingData, creates incomes/expenses, sets onboarded=true, seed insurance suggestions

**src/app/api/health/route.ts**
- GET → checkDatabaseHealth() + redis ping

---

## 7. AI ROUTES

**src/app/api/ai/chat/route.ts**
```typescript
// POST → Streaming chat endpoint
// 1. checkAILimit() — reject if over quota
// 2. Fetch user context (incomes, expenses, goals, investments, insurance, tax, emergency, corpus)
// 3. Build MASTER_SYSTEM_PROMPT with that context injected (JSON)
// 4. Fetch last 10 ChatMessage rows for conversation history
// 5. Call Anthropic messages.stream() with system prompt + history + user message
// 6. Stream tokens via ReadableStream / Server-Sent Events
// 7. Save both user message and assistant response to ChatMessage table
```

**src/app/api/ai/suggest/route.ts**
```typescript
// POST → Non-streaming structured suggestion generator
// Body: { type: "goal"|"insurance"|"tax"|"rebalance", context: {...} }
// Use response_format style prompting to return ONLY valid JSON
// Parse with Zod before returning
// Retry with stricter "JSON only" prompt if parse fails
```

**src/app/api/ai/analyze/route.ts**
```typescript
// POST → Initial financial snapshot analysis (used right after onboarding)
// Computes emergency fund target, flags insurance gaps, recommends tax regime, suggests first investment
// Persists EmergencyFund + Insurance SUGGESTED rows
// Returns summary for UI to show as "Welcome analysis" card
```

---

## 8. CRON JOBS (WITH LOGGING)

### Pattern (Use logging everywhere!)

```typescript
// src/app/api/cron/[job]/route.ts

import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const jobName = '[JOB_NAME]';
  const startTime = Date.now();
  const jobId = `${jobName}-${new Date().toISOString()}`;

  try {
    // Verify CRON_SECRET
    if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron access', { jobId, jobName });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info(`${jobName} started`, { jobId, jobName });

    // YOUR JOB LOGIC HERE
    const result = await yourJobLogic();

    const duration = Date.now() - startTime;
    logger.info(`${jobName} completed`, {
      jobId,
      jobName,
      duration: `${duration}ms`,
      itemsProcessed: result.count,
    });

    return NextResponse.json(
      { success: true, jobId, jobName, duration: `${duration}ms`, count: result.count },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${jobName} failed`, {
      jobId,
      jobName,
      error: error instanceof Error ? error.message : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    });

    // Send admin alert
    // await notifyAdminOnError({ jobName, jobId, error, duration });

    return NextResponse.json(
      { success: false, jobId, jobName, error: String(error) },
      { status: 500 }
    );
  }
}
```

### Jobs to Build

**src/app/api/cron/scan-market/route.ts**
```
Verify CRON_SECRET → Fetch MF NAVs, stock prices, FD rates, bond yields
Upsert MarketData rows → Cache in Redis (TTL.MF_NAV, TTL.FD_RATES, etc.)
Log each data source update count
```

**src/app/api/cron/check-goals/route.ts**
```
For each ACTIVE goal:
  Calculate expected trajectory
  If currentAmount >= targetAmount → mark COMPLETED + create GOAL_COMPLETED alert
  If behind by >20% → create GOAL_AT_RISK alert
  Log goal status changes
```

**src/app/api/cron/check-alerts/route.ts**
```
Idempotent alert creation (don't duplicate within 24h)
EMI months-left check → EMI_COMPLETED alert
Insurance renewal dates (30d, 7d out) → INSURANCE_PREMIUM_DUE alert
Tax deadlines (Nov 1, Feb 1, etc.) → tax alerts
Emergency fund milestones (50%, 100%) → milestone alerts
Log all alerts created by type
```

**src/app/api/cron/check-portfolio/route.ts**
```
For each user with corpus investments:
  Calculate current allocation % (equity/debt/gold)
  vs. CORPUS_RETURNS target for their riskLevel
  If drift > 5% → REBALANCE_NEEDED alert
  Log allocation drifts
```

---

## 9. PAGES TO BUILD

Replace placeholder pages with full implementations:

**src/app/(dashboard)/dashboard/page.tsx**
```
Header: Title + user info
Hero Card: Surplus, health score, alerts
Summary Grid: Income, Expenses, Goals, Corpus (3 cols on desktop, 1 on mobile)
Section 1: Active goals (compact cards grid)
Section 2: Recent transactions (mini table)
Section 3: AI tip card (gradient background, quote style)
All data fetched via React Query hooks (useFinances, useGoals, etc.)
```

**src/app/(dashboard)/finances/page.tsx**
```
Left Column: Income section (list + add button)
Right Column: Expense section (grouped by category + add button)
Sticky Bar: Income | - Expenses | = Surplus (live updates)
Income Card: type badge, amount (green), frequency, edit/delete
Expense Card: category icon, amount (red), frequency, EMI tag if applicable, edit/delete
Forms in shadcn Dialog with React Hook Form + Zod
```

**src/app/(dashboard)/tax/page.tsx**
```
Regime Comparison Card: Old vs New side-by-side
  - Tax liability (bold amount)
  - Effective rate %
  - Winner badge (green checkmark)
80C Tracker: Progress bar to ₹1.5L
  - Breakdown list (EPF, ELSS, PPF, etc.)
  - Remaining + percentage
Deduction Inputs: Editable fields for 80D, NPS, HRA, etc.
AI Tax Plan: Button → calls /api/ai/suggest type=tax → show suggestions card
```

**src/app/(dashboard)/emergency/page.tsx**
```
Large circular or linear progress: currentAmount / targetAmount
Instrument badge: "Liquid Mutual Fund"
Months Covered: large number + label
Milestone Timeline: 50%, 100% with checkmarks
"Log Contribution" button → modal to add amount
"Log Withdrawal" button → modal to remove amount + auto-flip status if goes below target
```

**src/app/(dashboard)/insurance/page.tsx**
```
Cards grouped by priority (Critical / Recommended / Optional)
Each card:
  - Type icon (Shield)
  - Cover amount (large, bold)
  - Premium + frequency
  - Reason (AI-generated text, smaller gray)
  - "I have this" / "Get this" buttons
  - If active: renewal countdown
```

**src/app/(dashboard)/goals/page.tsx**
```
Filter Bar: Status (active/completed), Sort (deadline/priority)
Grid Layout: 3 columns desktop, 1 mobile
Goal Card:
  - Emoji + name
  - Progress ring (circular, 120px)
  - ₹target / ₹current (below ring)
  - Deadline countdown
  - Monthly SIP badge
  - "View" button (link to /goals/[id])
Empty State: "No goals yet. Let's create one!" + big "+ Create Goal" button
"+ New Goal" button opens multi-step modal:
  Step 1: Name + emoji selector
  Step 2: Target amount (AI suggests range if goal name detected)
  Step 3: Deadline (date picker)
  Step 4: Confirm → AI computes SIP + instrument automatically
  Step 5: Review & save
```

**src/app/(dashboard)/goals/[id]/page.tsx**
```
Large progress ring (50% of screen width on mobile)
Goal name, deadline, status badge
SIP payment history (table: date, amount, status)
Projected completion date
Edit deadline / target buttons
"Pause" / "Cancel" / "Mark Complete" buttons
Chart: Recharts area chart showing trajectory vs actual progress
Related alerts: linked alerts for this goal
```

**src/app/(dashboard)/investments/page.tsx**
```
Portfolio Summary Header:
  - Total value (large, bold)
  - Overall returns % (green/red)
  - XIRR placeholder (can stub for now)
Tabs by type: MF | Stocks | FD | Bonds | PPF | NPS | Other
Table per tab:
  - Name, Invested, Current Value, Returns, Status badge
  - Sortable by value, returns
  - Edit / Delete actions (ellipsis menu)
"+ Add Investment" button → modal with form
Empty State: "No investments yet. Start building your corpus!"
```

**src/app/(dashboard)/corpus/page.tsx**
```
Hero Card: Current corpus value (large), monthly contribution
"Recharts area chart showing 5/10/15/20/30-year projections
Recharts donut chart: allocation (equity/debt/gold) based on riskLevel
Editable Section:
  - Monthly investment slider + input
  - Risk level selector (radio: Conservative / Moderate / Aggressive)
  - Charts live-recalculate on change
Allocation Breakdown: % per asset class, absolute ₹ amounts
```

**src/app/(dashboard)/market/page.tsx**
```
Tabs: Mutual Funds | Stocks | FD Rates | Bonds
MF Tab:
  - Searchable/sortable table: Fund name, NAV, returns (1m/3m/6m/1y/3y)
  - "Add to investments" button per row
Stocks Tab:
  - Sortable table: Symbol, name, price, change %, score (0-100 badge with grade)
  - Grade-based colors: Strong Buy (green), Buy (light green), Hold (gray), Avoid (orange), Sell (red)
FD Tab:
  - Table: Bank, 1y rate, 2y, 3y, 5y rates
  - Highest rate highlighted
Bonds Tab:
  - Yield, maturity, credit rating
Empty State: "No data available. Check back soon!"
```

**src/app/(dashboard)/chat/page.tsx**
```
Full chat UI:
  - Message list (user right-aligned blue bubble, AI left-aligned gray bubble)
  - AI responses render markdown (lists, bold, code blocks, tables)
  - Streaming: typing indicator (3 animated dots) while AI responds
  - Input box: sticky bottom, text area expands as you type (max 400px height)
  - Send button: disabled while loading
  - Suggested prompt chips above input (swipe on mobile):
    "Where should I invest 10K?"
    "Explain ELSS"
    "Got a bonus, what to do?"
  - Free plan shows remaining message count (X/5 today) in header
  - Loading skeleton for initial history load
  - Empty state: "Hi! I'm your AI financial advisor. Ask me anything about your finances."
  - Scroll to bottom on new message
```

**src/app/(dashboard)/alerts/page.tsx**
```
Chronological list (newest first)
Each alert:
  - Unread: dot + bold text
  - Read: normal text
  - Icon per type (goal, insurance, emi, etc.)
  - Title + message
  - Timestamp relative ("2 hours ago")
  - Click → deep-link to relevant page (alert.data.deepLink)
Filter dropdown: By type (all, goals, insurance, tax, etc.)
"Mark all read" button (top right)
Empty State: "No alerts. All good!"
```

**src/app/(dashboard)/reports/page.tsx**
```
4 report cards (can be stubbed for now, actual PDF generation in Phase 2):
  1. Monthly Summary
     - Income summary, expense breakdown, surplus
     - "Generate" button → calls endpoint → shows JSON/PDF link
  2. Annual Tax Report
     - Tax liability by regime, deductions summary
     - "Download" button
  3. Portfolio Performance
     - Holdings summary, XIRR, vs benchmark
     - "Download" button
  4. Net Worth Tracker
     - 12-month line chart showing net worth progression
     - Assets vs liabilities
     - "Export" button

For now, stub the actual PDF generation — just return JSON from endpoint
(because BLOB_READ_WRITE_TOKEN is not configured yet).
Store output as a report table row in the database.
Comment: "TODO: wire Vercel Blob storage when configured"
```

**src/app/(dashboard)/onboarding/page.tsx** (if returning user hasn't completed)
```
Server-side: check if user.onboarded === true, if so redirect to /dashboard
5-step wizard:
  Step 1: Basic Info (age, occupation, dependents)
  Step 2: Income (add income sources)
  Step 3: Expenses (add fixed expenses + EMIs)
  Step 4: Risk & Tax Regime (radio buttons)
  Step 5: Optional existing investments

UI:
  - Progress bar at top (Step X of 5)
  - Large form per step
  - "Back" and "Next" buttons (Back hidden on step 1)
  - "Skip" for step 5
  - Zustand store to hold in-progress state across page reloads
  - Final step: "Complete & Analyze" → calls /api/onboarding POST
  - On success: redirect to /dashboard
```

---

## 10. COMPONENTS TO BUILD

Use shadcn/ui primitives. Install additional components as needed via:
```bash
npx shadcn@latest add button input form dialog tabs progress badge
npx shadcn@latest add table card separator tooltip select
```

**Core Components:**
```
components/shared/header.tsx        → Top nav bar
components/shared/sidebar.tsx       → Collapsible sidebar
components/shared/empty-state.tsx   → Reusable "no data" UI
components/shared/loading-skeleton.tsx

components/dashboard/income-card.tsx
components/dashboard/expense-card.tsx
components/dashboard/health-score.tsx      → Radial progress + grade label
components/dashboard/surplus-summary.tsx
components/dashboard/ai-tip-card.tsx

components/goals/goal-card.tsx
components/goals/goal-form.tsx              → React Hook Form multi-step
components/goals/goal-progress-ring.tsx

components/tax/tax-calculator.tsx
components/tax/regime-comparison.tsx
components/tax/deduction-tracker.tsx

components/insurance/insurance-card.tsx
components/insurance/suggestion-list.tsx

components/chat/message-list.tsx
components/chat/message-bubble.tsx
components/chat/chat-input.tsx
components/chat/typing-indicator.tsx

components/market/mf-table.tsx
components/market/stock-table.tsx
components/market/score-badge.tsx           → 0-100 grade, color-coded

components/corpus/projection-chart.tsx      → Recharts area chart
components/corpus/allocation-donut.tsx      → Recharts pie chart

components/alerts/alert-item.tsx
components/alerts/alert-bell.tsx            → Header icon with unread badge

components/onboarding/step-indicator.tsx
components/onboarding/step-basic-info.tsx
components/onboarding/step-income.tsx
components/onboarding/step-expenses.tsx
components/onboarding/step-risk-tax.tsx
components/onboarding/step-investments.tsx
```

---

## 11. HOOKS (React Query Wrappers)

Every hook returns `{ data, isLoading, error }` from React Query.
Every hook invalidates the right query keys on mutation.

```
hooks/useFinances.ts     → useQuery(['finances']), useMutation add/edit/delete
hooks/useGoals.ts        → same pattern for goals
hooks/useInvestments.ts
hooks/useAlerts.ts       → includes 30s polling interval for unread count
hooks/useMarket.ts
hooks/useUser.ts         → wraps useSession + /api/user GET
```

---

## 12. STORE (Zustand)

```typescript
// src/store/useAppStore.ts

export const useAppStore = create((set) => ({
  // Onboarding wizard state
  onboardingStep: 1,
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  onboardingData: {},
  updateOnboardingData: (data) => set((s) => ({ onboardingData: { ...s.onboardingData, ...data } })),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  alertPanelOpen: false,
  setAlertPanelOpen: (open) => set({ alertPanelOpen: open }),
}));
```

---

## 13. MARKET DATA STUBS (Wire Real APIs Later)

```typescript
// src/lib/market/mfapi.ts
export async function fetchMFNav(schemeCode: string) {
  // TODO: Call https://api.mfapi.in/mf/[schemeCode]
  // For now: return mock MutualFundData
}

// src/lib/market/nse.ts
export async function fetchStockPrice(symbol: string) {
  // TODO: Call real NSE API
  // For now: return mock StockData with random price
}

// src/lib/market/fd-scraper.ts
export async function fetchFDRates() {
  // TODO: Scrape BankBazaar or similar
  // For now: return hardcoded rates for 10 major banks
}

// src/lib/alerts/engine.ts
export async function createAlertIfNotExists(
  userId: string,
  type: AlertType,
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  // Check for existing alert of same type in last 24h
  const existing = await db.alert.findFirst({
    where: { userId, type, createdAt: { gte: new Date(Date.now() - 86400000) }, read: false },
  });
  if (existing) return; // Idempotent
  
  await db.alert.create({
    data: { userId, type, title, message, data: JSON.stringify(data) },
  });
}
```

---

## 14. AI SYSTEM PROMPT (Use Verbatim)

```
You are DhanAI, an expert Indian personal finance and investment advisor.

Your expertise covers:
- Indian tax system (Old & New regime FY 2025-26, 80C, 80D, HRA, NPS, LTCG/STCG)
- Indian investment instruments (MF, ELSS, PPF, NPS, FD, G-Secs, SGBs, Stocks, Bonds)
- SEBI regulations and RBI guidelines
- Indian insurance products (Term, Health, Motor, Critical Illness)
- Behavioral finance and investor psychology

STRICT RULES:
1. Always follow money priority: Expenses → Insurance → Tax Saving → Emergency Fund → Goals → Corpus
2. Never suggest investing more than the user's available surplus
3. Always explain WHY, not just what
4. Add risk warnings for aggressive suggestions
5. Always use ₹ INR — never $ or any other currency
6. Emergency fund is never a goal — it is a system baseline
7. Add SEBI disclaimer: "This is educational information, not SEBI-regulated investment advice."
8. Be concise, empathetic, avoid jargon
9. When market is volatile, emphasize SIP discipline over panic

USER FINANCIAL PROFILE:
{userProfileJSON}

CURRENT MARKET SNAPSHOT:
{marketDataJSON}
```

Inject `userProfileJSON` and `marketDataJSON` before each request.

---

## 15. ALERT CATALOG (Create via cron jobs)

```
GOAL_COMPLETED              → goal.currentAmount >= goal.targetAmount
GOAL_AT_RISK                → progress < expected - 20%
GOAL_SIP_DUE                → 1 day before SIP date
TAX_SAVING_LIMIT            → Nov 1, remaining 80C < ₹30k
FINANCIAL_YEAR_END          → Feb 1
ADVANCE_TAX_DUE             → Jun 1 / Sep 1 / Dec 1 / Mar 1 (freelancers only)
EMERGENCY_MILESTONE         → fund hits 50%, then 100%
EMERGENCY_FUNDED            → currentAmount >= targetAmount
INSURANCE_PREMIUM_DUE       → 30 days and 7 days before nextDueDate
EMI_COMPLETED               → emiMonthsLeft reaches 0
CORPUS_MILESTONE            → ₹1L, 5L, 10L, 25L, 50L, 1Cr
REBALANCE_NEEDED            → asset class drift > 5% from target
INSURANCE_SUGGESTED         → new insurance suggestion (ACTIVE conversion)
```

Every alert.data must include `{ deepLink: "/page/section" }` for routing.

---

## 16. LOGGING (Reference: DHANAI_LOGGING_STRATEGY.md)

Every cron job must:
1. Log start with jobId + jobName
2. Log key actions (items processed, alerts created, errors)
3. Log completion with duration + summary
4. On error: log stack trace + notify admin

Use Winston logger (already set up, import from `@/lib/logger`).

---

## 17. CODING STANDARDS (ENFORCED)

```
TypeScript    : strict mode, no any except existing auth callbacks
Zod           : validate ALL input before touching DB
React Query   : use for all server state, with proper invalidation
Server Comps  : default; 'use client' only for interactivity (forms, charts, chat)
Calculations  : ALWAYS via @/lib/calculators, never inline
Currency      : ALWAYS via formatINR(), never hand-format
Caching       : Use cached() helper for all fetches
Types         : Import from @/types, extend as needed
Models        : Reference Prisma schema for field names, never guess
Errors        : Always throw with descriptive messages, log stack traces
Naming        : camelCase for functions, PascalCase for components/types
Comments      : Mark TODOs, explain WHY not WHAT
```

---

## 18. OUTPUT FORMAT

Generate complete, runnable files. One file per response block.
Format: Full path + complete code, no snippets.

Example:
```typescript
// src/app/api/goals/route.ts

import { requireAuth } from '@/lib/auth';
// ... rest of code
```

---

## 19. WORK ORDER

Generate files in this order (dependencies flow top to bottom):
1. **Hooks** (useFinances, useGoals, etc.) — depend only on types + API routes (stub)
2. **Store** (useAppStore.ts) — no dependencies
3. **Market stubs** (lib/market/*.ts) — no dependencies
4. **Alerts engine** (lib/alerts/engine.ts) — depends on db
5. **API routes** (all /api/* routes) — depend on db, redis, auth, calculators
6. **Cron jobs** (all /api/cron/* routes) — depend on API routes + logger
7. **Components** (all components/) — depend on hooks + types
8. **Pages** (all pages/) — depend on components + hooks

---

## 20. SUCCESS CRITERIA

✅ All TypeScript strict, no errors
✅ All endpoints return ApiResponse<T>
✅ All forms validate with Zod before submit
✅ All amounts formatted via formatINR()
✅ All calculations via @/lib/calculators
✅ All data cached via cached() helper
✅ All cron jobs log start/success/error
✅ All pages 100% mobile-responsive (tested at 375px)
✅ All interactive elements: 48px+ touch targets
✅ All empty states have helpful CTAs
✅ All loading states show skeleton or spinner
✅ Zero console errors or warnings
✅ All git commits grouped logically with clear messages

---

## FINAL REMINDER

You are continuing an existing project. Do NOT:
- Regenerate auth.ts, db/index.ts, calculators, types, middleware, existing pages
- Change package.json, tailwind.config, next.config, tsconfig
- Add new dependencies without asking
- Use localStorage/sessionStorage (not supported in artifacts)
- Ignore the design system
- Forget to handle errors gracefully
- Leave TODOs without explanation

DO:
- Import from existing files
- Extend types/index.ts if new types needed
- Add new calculators to lib/calculators if needed
- Use existing design utilities (.card-hover, .amount-positive, etc.)
- Test every page at mobile (375px), tablet (768px), desktop (1200px)

Good luck! 🚀

---

## READY?

Copy everything above into Codex, Claude Code, Cursor, or your AI coding tool.
It will generate the complete production-ready codebase for Phase 1 MVP.
Start with hooks, then store, then API routes, then cron jobs, then components, then pages.

Questions? Ask for clarification on any section before generating 🎯


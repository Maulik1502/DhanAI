# 🏦 DhanAI — Master Reference Document
> Version: 2.0.0 | Last Updated: June 2026
> Single source of truth for DhanAI — architecture, tech stack, database, AI prompts, market data, use cases, data flows, calculators, alerts, revenue model, and build roadmap.

---

## 📋 TABLE OF CONTENTS

### Part A — Product & Architecture
1. [Product Overview](#1-product-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Database Schema (Prisma)](#4-database-schema-prisma)
5. [Environment Variables](#5-environment-variables)

### Part B — Market Data & Scanning
6. [Market Data Sources](#6-market-data-sources)
7. [Stock Fundamental Scanner](#7-stock-fundamental-scanner)
8. [Cron Job Schedule](#8-cron-job-schedule)

### Part C — Features, Use Cases & Data Flows
9. [Onboarding & Profile Setup](#9-onboarding--profile-setup)
10. [Financial Dashboard](#10-financial-dashboard)
11. [Income Manager](#11-income-manager)
12. [Expense & EMI Manager](#12-expense--emi-manager)
13. [Tax Manager](#13-tax-manager)
14. [Emergency Fund](#14-emergency-fund)
15. [Insurance Advisor](#15-insurance-advisor)
16. [Goals Manager](#16-goals-manager)
17. [Investment Portfolio Tracker](#17-investment-portfolio-tracker)
18. [Corpus Builder](#18-corpus-builder)
19. [AI Chat Advisor](#19-ai-chat-advisor)
20. [Alert Engine](#20-alert-engine)
21. [Reports & Analytics](#21-reports--analytics)

### Part D — AI System
22. [AI System Prompts](#22-ai-system-prompts)
23. [AI Context Injection Strategy](#23-ai-context-injection-strategy)

### Part E — Financial Calculators
24. [Financial Calculators Reference](#24-financial-calculators-reference)

### Part F — System Data Flows
25. [Master System Data Flows](#25-master-system-data-flows)

### Part G — Business
26. [Revenue Model](#26-revenue-model)
27. [Legal & Compliance](#27-legal--compliance)
28. [Build Roadmap](#28-build-roadmap)
29. [Feature Priority Matrix](#29-feature-priority-matrix)

---

## PART A — PRODUCT & ARCHITECTURE

---

## 1. Product Overview

**DhanAI** is an AI-powered personal finance and investment management platform for Indian users.

| Property | Value |
|----------|-------|
| Currency | ₹ INR |
| Tax System | Indian (Old & New Regime FY 2025-26) |
| AI Brain | Claude Sonnet 4.6 (Anthropic) |
| Target Users | Salaried individuals, freelancers, retail investors |
| Auth | Google OAuth2 only |
| Platform | Web (Next.js) → Mobile (React Native, Phase 3) |

### Core Philosophy
> "Manage every rupee intelligently — from salary to corpus"

### AI Money Priority Order (ALWAYS follow this strictly)
```
1. 💸 Fixed Expenses + EMIs            → Non-negotiable, always first
2. 🛡️ Insurance Premiums (Critical)    → Protect before investing
3. 🧾 Tax Saving Investments           → 80C, 80D, NPS before other investing
4. 🚨 Emergency Fund                   → 6 months expenses, AI-suggested only
5. 🎯 User-Defined Goals               → Parallel, user-created only
6. 🏛️ Corpus Building                  → Everything remaining goes here
```

> ⚠️ Emergency Fund is NOT a goal. It is a system-mandated baseline calculated and managed by AI automatically.

---

## 2. Tech Stack

### Frontend + Backend
```
Framework     : Next.js 15 (App Router) — single codebase for UI + API
Language      : TypeScript
Styling       : Tailwind CSS + shadcn/ui
Charts        : Recharts
Forms         : React Hook Form + Zod validation
Animations    : Framer Motion
State         : Zustand (global) + React Query (server state)
```

### AI Layer
```
Model         : Claude Sonnet 4.6 (Anthropic)
SDK           : Anthropic Node.js SDK
Memory        : PostgreSQL JSON context (injected per request — no vector DB at startup)
API Calls     : Next.js API Routes (server-side only, API key never exposed)
Strategy      : Full user financial profile + live market data injected into every Claude call
```

### Database
```
Primary DB    : PostgreSQL — Neon DB (Free Tier: 512MB)
ORM           : Prisma (type-safe queries)
Cache         : Upstash Redis (Free Tier: 10K req/day)
Vector DB     : pgvector extension in Neon (future AI memory use)
File Storage  : Vercel Blob (PDF reports)
```

### Auth
```
Method        : Google OAuth2 only (no passwords)
Library       : NextAuth.js (Auth.js v5)
Session       : JWT (stored in httpOnly cookie)
```

### Hosting & Infrastructure
```
Web + API     : Vercel (Free Tier)
Database      : Neon DB (Free Tier)
Cache         : Upstash Redis (Free Tier)
Cron Jobs     : Vercel Cron (Free)
Email         : Resend (Free: 3,000 emails/month)
Push Alerts   : Firebase FCM (Free)
Domain        : Namecheap (~₹800/year)
```

### Monthly Cost by User Scale
```
0–500 users   : ~₹1,500–2,000/month  (Anthropic API only)
500–2,000     : ~₹4,000–6,000/month
2,000–10,000  : ~₹12,000–18,000/month
```

### Mobile (Phase 3)
```
Framework     : React Native (Expo)
Auth          : Same Google OAuth2
API           : Same Next.js API Routes
Push          : Firebase FCM (biometric login via Expo LocalAuth)
```

---

## 3. Project Folder Structure

```
dhanai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx              → Google OAuth login page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx                  → Dashboard shell + nav
│   │   │   ├── dashboard/page.tsx          → Main overview
│   │   │   ├── finances/page.tsx           → Income & expenses
│   │   │   ├── tax/page.tsx                → Tax manager
│   │   │   ├── emergency/page.tsx          → Emergency fund
│   │   │   ├── insurance/page.tsx          → AI insurance suggestions
│   │   │   ├── goals/
│   │   │   │   ├── page.tsx                → Goals list
│   │   │   │   └── [id]/page.tsx           → Single goal detail + tracker
│   │   │   ├── investments/page.tsx        → Portfolio tracker
│   │   │   ├── market/page.tsx             → Market scanner (MF, FD, bonds, stocks)
│   │   │   ├── corpus/page.tsx             → Corpus builder
│   │   │   └── chat/page.tsx               → AI advisor chat
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts → NextAuth Google OAuth
│   │       ├── ai/
│   │       │   ├── chat/route.ts           → AI chat endpoint (streams)
│   │       │   ├── suggest/route.ts        → AI suggestion generation
│   │       │   └── analyze/route.ts        → Stock + MF analysis
│   │       ├── finances/route.ts           → CRUD income & expenses
│   │       ├── goals/route.ts              → CRUD goals + progress
│   │       ├── investments/route.ts        → CRUD investments
│   │       ├── insurance/route.ts          → Insurance CRUD + suggestions
│   │       ├── tax/route.ts                → Tax calculations
│   │       ├── emergency/route.ts          → Emergency fund management
│   │       ├── corpus/route.ts             → Corpus management
│   │       ├── market/
│   │       │   ├── mf/route.ts             → Mutual fund NAV + returns
│   │       │   ├── stocks/route.ts         → Stock price + fundamentals
│   │       │   ├── fd/route.ts             → FD rates
│   │       │   └── bonds/route.ts          → Bond yields
│   │       ├── alerts/route.ts             → Alert CRUD
│   │       └── cron/
│   │           ├── scan-market/route.ts    → Market data refresh
│   │           ├── check-goals/route.ts    → Goal progress checker
│   │           ├── check-alerts/route.ts   → Alert condition checker
│   │           └── check-portfolio/route.ts → Rebalancing checker
│   ├── components/
│   │   ├── ui/                             → shadcn/ui base components
│   │   ├── dashboard/                      → Dashboard widgets
│   │   ├── goals/                          → Goal cards + progress
│   │   ├── charts/                         → Recharts wrappers
│   │   ├── alerts/                         → Alert list + notification bell
│   │   ├── chat/                           → Chat UI + message bubbles
│   │   └── market/                         → Market data cards
│   ├── lib/
│   │   ├── auth.ts                         → NextAuth config + Google provider
│   │   ├── db.ts                           → Prisma client singleton
│   │   ├── ai.ts                           → Claude client + master prompt builder
│   │   ├── redis.ts                        → Upstash Redis client
│   │   ├── market/
│   │   │   ├── mfapi.ts                    → MFAPI.in client
│   │   │   ├── nse.ts                      → NSE stock data client
│   │   │   ├── fd-scraper.ts               → FD rate scraper
│   │   │   └── fundamentals.ts             → Stock fundamentals fetcher
│   │   ├── calculators/
│   │   │   ├── tax.ts                      → Old + New regime tax engine
│   │   │   ├── sip.ts                      → SIP future value + reverse SIP
│   │   │   ├── emergency.ts                → Emergency fund calculator
│   │   │   ├── corpus.ts                   → Corpus projection engine
│   │   │   ├── health-score.ts             → Financial health score (0–100)
│   │   │   └── insurance.ts                → Insurance cover calculator
│   │   └── alerts/
│   │       └── engine.ts                   → Alert condition evaluator
│   ├── types/
│   │   └── index.ts                        → All TypeScript interfaces
│   ├── hooks/
│   │   ├── useFinances.ts
│   │   ├── useGoals.ts
│   │   ├── useAlerts.ts
│   │   ├── useMarket.ts
│   │   └── usePortfolio.ts
│   └── store/
│       └── useAppStore.ts                  → Zustand global store
├── prisma/
│   ├── schema.prisma                   → Full DB schema
│   └── seed.ts                         → Dev seed data
├── vercel.json                         → Cron job definitions
├── .env.local                          → All environment variables
└── package.json
```

---

## 4. Database Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USER ────────────────────────────────────────────────────────
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatar        String?
  googleId      String?   @unique
  riskLevel     RiskLevel @default(MODERATE)
  taxRegime     TaxRegime @default(NEW)
  occupation    String?
  age           Int?
  dependents    Int       @default(0)
  onboarded     Boolean   @default(false)
  plan          UserPlan  @default(FREE)

  incomes       Income[]
  expenses      Expense[]
  goals         Goal[]
  investments   Investment[]
  insurances    Insurance[]
  alerts        Alert[]
  emergencyFund EmergencyFund?
  corpus        Corpus?
  chatMessages  ChatMessage[]
  auditLogs     AuditLog[]
  taxProfile    TaxProfile?

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// ─── INCOME ──────────────────────────────────────────────────────
model Income {
  id        String     @id @default(cuid())
  userId    String
  user      User       @relation(fields: [userId], references: [id])
  type      IncomeType
  name      String
  amount    Float
  frequency Frequency  @default(MONTHLY)
  isActive  Boolean    @default(true)
  createdAt DateTime   @default(now())
}

// ─── EXPENSE ─────────────────────────────────────────────────────
model Expense {
  id            String          @id @default(cuid())
  userId        String
  user          User            @relation(fields: [userId], references: [id])
  category      ExpenseCategory
  name          String
  amount        Float
  frequency     Frequency       @default(MONTHLY)
  isEMI         Boolean         @default(false)
  emiMonthsLeft Int?
  loanType      String?
  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
}

// ─── GOAL ────────────────────────────────────────────────────────
model Goal {
  id            String     @id @default(cuid())
  userId        String
  user          User       @relation(fields: [userId], references: [id])
  name          String
  targetAmount  Float
  currentAmount Float      @default(0)
  deadline      DateTime
  monthlySIP    Float
  instrument    String
  schemeCode    String?
  priority      Int        @default(1)
  status        GoalStatus @default(ACTIVE)
  aiSuggestion  Json?
  completedAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

// ─── INVESTMENT ──────────────────────────────────────────────────
model Investment {
  id            String           @id @default(cuid())
  userId        String
  user          User             @relation(fields: [userId], references: [id])
  type          InvestmentType
  name          String
  schemeCode    String?
  symbol        String?
  amount        Float
  units         Float?
  buyPrice      Float?
  currentValue  Float?
  returns       Float?
  startDate     DateTime
  maturityDate  DateTime?
  status        InvestmentStatus @default(ACTIVE)
  goalId        String?
  isCorpus      Boolean          @default(false)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

// ─── EMERGENCY FUND ──────────────────────────────────────────────
model EmergencyFund {
  id            String     @id @default(cuid())
  userId        String     @unique
  user          User       @relation(fields: [userId], references: [id])
  targetAmount  Float
  currentAmount Float      @default(0)
  instrument    String
  schemeCode    String?
  schemeName    String?
  status        FundStatus @default(BUILDING)
  monthsCovered Float      @default(0)
  monthlyAlloc  Float         @default(0)
  updatedAt     DateTime   @updatedAt
}

// ─── INSURANCE ───────────────────────────────────────────────────
model Insurance {
  id            String            @id @default(cuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id])
  type          InsuranceType
  provider      String?
  coverAmount   Float
  premium       Float
  frequency     Frequency
  priority      InsurancePriority
  status        InsuranceStatus   @default(SUGGESTED)
  reason        String
  nextDueDate   DateTime?
  policyNo      String?
  createdAt     DateTime          @default(now())
}

// ─── TAX PROFILE ─────────────────────────────────────────────────
model TaxProfile {
  id                String    @id @default(cuid())
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id])
  regime            TaxRegime
  grossIncome       Float
  taxableIncome     Float
  taxLiability      Float
  deductions80C     Float     @default(0)
  deductions80D     Float     @default(0)
  npsAdditional     Float     @default(0)
  hraDeduction      Float     @default(0)
  homeLoanInterest  Float     @default(0)
  otherDeductions   Float     @default(0)
  taxSaved          Float     @default(0)
  remainingLimit80C Float     @default(150000)
  financialYear     String
  updatedAt         DateTime  @updatedAt
}

// ─── CORPUS ──────────────────────────────────────────────────────
model Corpus {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])
  targetAmount      Float
  currentValue      Float    @default(0)
  monthlyInvestment Float
  expectedReturn    Float
  timelineYears     Int
  projections       Json
  allocation        Json
  updatedAt         DateTime @updatedAt
}

// ─── ALERT ───────────────────────────────────────────────────────
model Alert {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  type      AlertType
  title     String
  message   String
  data      Json?
  read      Boolean   @default(false)
  createdAt DateTime  @default(now())
}

// ─── CHAT MESSAGE ────────────────────────────────────────────
model ChatMessage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      String   // "user" or "assistant"
  content   String
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

// ─── AUDIT LOG ───────────────────────────────────────────────
model AuditLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  entity    String
  entityId  String?
  data      Json?
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

// ─── REPORT ──────────────────────────────────────────────────
model Report {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "MONTHLY_SUMMARY" | "ANNUAL_TAX" | "PORTFOLIO" | "NET_WORTH"
  title     String
  data      Json
  createdAt DateTime @default(now())

  @@index([userId, createdAt])
}

// ─── MARKET DATA (shared cache) ──────────────────────────────────
model MarketData {
  id        String   @id @default(cuid())
  type      String   // "MF" | "STOCK" | "FD" | "BOND"
  code      String   // scheme code or symbol
  name      String
  data      Json
  updatedAt DateTime @updatedAt

  @@unique([type, code])
}

// ─── ENUMS ───────────────────────────────────────────────────────
enum RiskLevel        { CONSERVATIVE MODERATE AGGRESSIVE }
enum TaxRegime        { OLD NEW }
enum IncomeType       { SALARY FREELANCE BUSINESS RENTAL CAPITAL_GAINS DIVIDEND OTHER }
enum Frequency        { MONTHLY QUARTERLY YEARLY ONE_TIME }
enum ExpenseCategory  { RENT FOOD TRANSPORT EMI_HOME EMI_CAR EMI_PERSONAL INSURANCE SUBSCRIPTION EDUCATION MEDICAL UTILITIES OTHER }
enum GoalStatus       { ACTIVE COMPLETED PAUSED CANCELLED }
enum InvestmentType   { MUTUAL_FUND STOCK FD BOND PPF NPS SGB ELSS RD OTHER }
enum InvestmentStatus { ACTIVE MATURED SOLD }
enum FundStatus       { BUILDING COMPLETE USED }
enum InsuranceType    { TERM HEALTH MOTOR HOME LOAN_PROTECTION CRITICAL_ILLNESS }
enum InsurancePriority{ CRITICAL RECOMMENDED OPTIONAL }
enum InsuranceStatus  { SUGGESTED ACTIVE LAPSED }
enum UserPlan         { FREE PRO ELITE }
enum AlertType {
  GOAL_COMPLETED GOAL_AT_RISK GOAL_SIP_DUE
  STOCK_TARGET_HIT STOCK_STOP_LOSS MF_NAV_DROP MF_UNDERPERFORMING
  FD_MATURITY BOND_MATURITY BETTER_FD_AVAILABLE
  TAX_SAVING_LIMIT ADVANCE_TAX_DUE FINANCIAL_YEAR_END
  REBALANCE_NEEDED HIGH_RISK_DETECTED BETTER_OPTION_FOUND
  EMERGENCY_FUNDED EMERGENCY_USED EMERGENCY_MILESTONE
  INSURANCE_PREMIUM_DUE INSURANCE_SUGGESTED
  CORPUS_MILESTONE EMI_COMPLETED
}
```

---

## 5. Environment Variables

```env
# ── Auth ──────────────────────────────────────────
NEXTAUTH_URL=https://dhanai.com
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── Database ──────────────────────────────────────
DATABASE_URL=                    # Neon PostgreSQL connection string

# ── Cache ─────────────────────────────────────────
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── AI ────────────────────────────────────────────
ANTHROPIC_API_KEY=

# ── Storage ───────────────────────────────────────
BLOB_READ_WRITE_TOKEN=           # Vercel Blob for PDFs

# ── Notifications ─────────────────────────────────
RESEND_API_KEY=
FIREBASE_SERVER_KEY=             # FCM Push notifications

# ── Market Data ───────────────────────────────────
NEWS_API_KEY=                    # NewsAPI.org (free tier)

# ── App ───────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://dhanai.com
NEXT_PUBLIC_APP_NAME=DhanAI
CRON_SECRET=                     # Secret to protect cron endpoints
```

---

## PART B — MARKET DATA & SCANNING

---

## 6. Market Data Sources

> ⚡ CRITICAL: AI cannot give real suggestions without live market data. All sources below are FREE.

### 🏦 Mutual Funds — MFAPI.in
```
Base URL      : https://api.mfapi.in
All funds     : GET /mf
Fund detail   : GET /mf/{schemeCode}
Fund NAV hist : GET /mf/{schemeCode}?from=01-01-2024&to=01-06-2026
Cost          : FREE
Update freq   : Daily after 9 PM IST
Data returned : NAV, scheme name, fund house, category, historical returns
```

### 📈 Stocks — NSE India
```
Primary API   : https://www.nseindia.com/api (unofficial, free)
Backup        : Yahoo Finance (yfinance npm package)
Data          : Price, PE, PB, 52W High/Low, Volume, Market Cap
Fundamentals  : EPS, D/E ratio, ROE, ROCE, Promoter Holding, Pledge %
Update freq   : Every 15 min during market hours (9:15 AM – 3:30 PM, Mon–Fri)
Rate limiting : Max 1 req/sec, rotate user-agents
```

### 🏛️ Fixed Deposits — Scraped Weekly
```
Source        : BankBazaar.com / Paisabazaar.com
Banks tracked : SBI, HDFC, ICICI, Axis, Kotak, Yes Bank,
                Jana SFB, AU SFB, ESAF SFB, Ujjivan SFB
Data          : Rates by tenure (7d/30d/90d/180d/1yr/2yr/3yr/5yr)
Senior rates  : Tracked separately (+0.25–0.50%)
Update freq   : Weekly (Sunday midnight)
Cache         : Redis TTL 7 days
```

### 📜 Bonds & Government Securities
```
RBI Bonds     : https://rbiretaildirect.org.in
SGBs          : RBI press releases + NSE SGB series
G-Secs        : https://www.rbi.org.in
Corporate     : NSE Bond Platform API
Data          : Yield, tenure, rating (AAA/AA+/AA), issuer
Update freq   : Daily 8 AM
```

### 🪙 PPF / NPS / ELSS / EPF
```
PPF Rate      : RBI API — changes quarterly (hardcode + update)
NPS Returns   : https://www.npscra.nsdl.co.in
ELSS Funds    : MFAPI.in filtered by category = "ELSS"
EPF Rate      : EPFO announcement (yearly, hardcode)
```

### 📰 News & Market Sentiment
```
Sources       : NewsAPI.org (100 req/day free)
              : MoneyControl RSS
              : Economic Times RSS
Usage         : AI reads to contextualize suggestions
              : Alert users about market events affecting portfolio
```

---

## 7. Stock Fundamental Scanner

### Data Interface
```typescript
interface StockFundamentals {
  symbol: string;
  name: string;
  price: number;
  
  // Valuation
  pe_ratio: number;           // < 25 = good, < 15 = excellent
  pb_ratio: number;           // < 3 = good, < 1.5 = excellent
  ev_ebitda: number;
  market_cap: number;         // in Crores
  
  // Profitability
  roe: number;                // > 15% = good, > 20% = excellent
  roce: number;               // > 15% = good, > 20% = excellent
  net_profit_margin: number;  // > 10% = good, > 20% = excellent
  
  // Growth (3yr CAGR)
  revenue_growth_3yr: number; // > 12% = good, > 20% = excellent
  profit_growth_3yr: number;
  eps_growth: number;
  
  // Financial Health
  debt_to_equity: number;     // < 1 = good, < 0.3 = excellent
  current_ratio: number;      // > 1.5 = good
  interest_coverage: number;  // > 3 = good
  
  // Ownership (Safety signals)
  promoter_holding: number;   // > 50% = good, > 60% = excellent
  promoter_pledge: number;    // < 10% = good, 0% = excellent, > 25% = RED FLAG
  fii_holding: number;
  dii_holding: number;
  
  // Price Action
  week_52_high: number;
  week_52_low: number;
  day_change_pct: number;
  volume: number;
  avg_volume_30d: number;
}
```

### AI Scoring System (0–100)
```
Component         Weight   Criteria
─────────────────────────────────────────────
Valuation Score   25 pts   PE, PB, EV/EBITDA
Profitability     25 pts   ROE, ROCE, margin
Growth            25 pts   Revenue + profit CAGR, EPS
Safety            25 pts   D/E, promoter hold, pledge
─────────────────────────────────────────────
Total             100 pts

Grade:
80–100 : ⭐ Strong Buy
60–79  : ✅ Buy
40–59  : ⚠️ Hold / Watch
20–39  : 🔴 Avoid
0–19   : ❌ Sell
```

---

## 8. Cron Job Schedule

```typescript
// vercel.json cron configuration
const SCAN_SCHEDULE = {
  // Stocks: every 15 min during market hours (Mon-Fri 9:15–15:30)
  stock_prices:      "*/15 9-15 * * 1-5",

  // MF NAV: daily after 9 PM (AMFI publishes after 8 PM)
  mf_nav:            "0 21 * * *",

  // FD rates: weekly Sunday midnight
  fd_rates:          "0 0 * * 0",

  // Bond yields: daily 8 AM
  bond_yields:       "0 8 * * *",

  // Market news: every 2 hours
  news_scan:         "0 */2 * * *",

  // User portfolio check: daily 8 AM
  portfolio_check:   "0 8 * * *",

  // Goal progress check: daily 9 AM
  goal_check:        "0 9 * * *",

  // Tax saving check: monthly 1st
  tax_check:         "0 10 1 * *",

  // Emergency fund check: weekly Monday
  emergency_check:   "0 10 * * 1",

  // Rebalancing suggestion: monthly 1st
  rebalance_check:   "0 11 1 * *",

  // Monthly report generation: 1st of month 7 AM
  monthly_report:    "0 7 1 * *",
}
```

---

## PART C — FEATURES, USE CASES & DATA FLOWS

---

## 9. Onboarding & Profile Setup

### Why It Exists
Without knowing income, expenses, risk tolerance and age, AI cannot give meaningful advice. Onboarding collects minimum viable financial profile to power every feature. Progress bar shown to increase completion rate by 20%.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-01 | New user signs in with Google | Account created, redirected to onboarding |
| UC-02 | User completes all 5 steps | Profile stored, dashboard unlocked |
| UC-03 | User skips optional fields | AI works with available data, asks for rest later |
| UC-04 | Returning user updates profile | All AI suggestions recalculated |
| UC-05 | User changes tax regime | Tax + suggestions updated immediately |

### Data Flow
```
[Google OAuth2 Login]
        ↓
[NextAuth creates session + user record in PostgreSQL]
        ↓
[Is profile complete? (onboarded = true?)]
    ↙ NO                        ↘ YES
[5-Step Onboarding]           [Dashboard]
        ↓
Step 1: Basic Info
  → Name (auto from Google), Age, Occupation, Dependents
Step 2: Income
  → Source type, amount, frequency
Step 3: Expenses
  → Category, amount, mark EMIs with months remaining
Step 4: Financial Profile
  → Tax regime (Old/New), Risk tolerance, Primary objective
Step 5: Existing Investments (Optional)
  → Current MF/SIP, FD, stocks → feeds portfolio tracker
        ↓
[Save all to PostgreSQL]
        ↓
[Trigger AI: Generate initial financial snapshot]
  → Surplus calculation
  → Emergency fund target + instrument suggestion
  → Insurance gap identification (CRITICAL flags)
  → Tax regime recommendation
  → First investment suggestion
        ↓
[Set onboarded = true → Redirect to Dashboard]
```

---

## 10. Financial Dashboard

### Why It Exists
Single-screen financial cockpit. Answers: "How am I doing right now?" without navigating multiple pages.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-06 | User opens app daily | Sees latest surplus, alerts, goal progress |
| UC-07 | User wants quick health check | Financial health score with grade and explanation |
| UC-08 | Alert appears | User taps to take action deep-linked to relevant screen |
| UC-09 | Surplus changes after adding expense | Recalculated and shown instantly |

### Dashboard Layout
```
┌─────────────────────────────────────────────────┐
│  💰 Monthly Surplus: ₹18,500                    │
│  Income: ₹65,000 | Expenses: ₹46,500            │
├─────────────────────────────────────────────────┤
│  🏥 Financial Health Score: 72/100 [GOOD]       │
│  ████████████░░░░░                              │
├─────────────────────────────────────────────────┤
│  🚨 Emergency Fund: ██████░░░░ 62% (₹1.2L/₹2L) │
├─────────────────────────────────────────────────┤
│  🎯 Active Goals                                │
│  🚗 Car Fund     ████░░ 45%  ₹90K / ₹2L        │
│  🏠 House Down   ██░░░░ 20%  ₹1L / ₹5L         │
├─────────────────────────────────────────────────┤
│  📈 Portfolio Value: ₹3,45,000                 │
│  Returns: +12.4% ↑ vs 8.2% benchmark           │
├─────────────────────────────────────────────────┤
│  🔔 3 Alerts                                    │
│  ⚠️ SIP due tomorrow for Car Fund               │
│  ✅ Emergency Fund 60% complete                 │
│  💡 Tax saving: ₹42,000 limit remaining         │
├─────────────────────────────────────────────────┤
│  🤖 AI Tip of the Day                           │
│  "Your FD matures in 15 days. Reinvesting in   │
│   Debt MF gives ~1.2% better annual return"    │
└─────────────────────────────────────────────────┘
```

### Financial Health Score Formula (0–100)
```
Factor                  Weight   Scoring
──────────────────────────────────────────────────────
Emergency Fund          20 pts   0=none, 10=3mo, 20=6mo+
Insurance Coverage      20 pts   0=none, 10=health only, 20=term+health
Savings Rate            20 pts   <10%=0, 10–20%=10, >20%=20
Debt/Income Ratio       20 pts   >50%=0, 30–50%=10, <30%=20
Investment Diversity    10 pts   1type=3, 2-3=7, 4+=10
Goal Progress           10 pts   all OK=10, 1 at risk=5, none=0
──────────────────────────────────────────────────────
Grade: 90+=Excellent | 70-89=Good | 50-69=Average | 30-49=Needs Attention | <30=Critical
```

### Data Flow
```
[User opens Dashboard]
        ↓
[Parallel API calls (all cached in Redis)]
  GET /api/finances/summary    → Surplus
  GET /api/emergency-fund      → Fund status
  GET /api/goals/summary       → Goal progress
  GET /api/investments/summary → Portfolio value
  GET /api/alerts/unread       → Pending alerts
  GET /api/market/snapshot     → Nifty, gold price
        ↓
[Redis Cache Check: data < 15 min old?]
  YES → Serve cached | NO → Fetch fresh + update cache
        ↓
[Calculate Financial Health Score]
        ↓
[Trigger AI daily tip if not yet generated today]
        ↓
[Render all dashboard widgets]
```

---

## 11. Income Manager

### Why It Exists
All calculations (tax, surplus, emergency fund, SIP capacity) start with accurate income. Multiple sources must be tracked separately for correct tax treatment.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-10 | User adds salary | Monthly income updated, tax recalculated |
| UC-11 | Freelancer adds variable income | AI uses 3-month average |
| UC-12 | User adds rental income | 30% standard deduction noted |
| UC-13 | Salary hike | AI recalculates everything |
| UC-14 | Freelance client lost | Alert if surplus drops below safe level |

### Income Types & Tax Treatment
```
Type          | Tax Treatment                    | AI Handling
──────────────|──────────────────────────────────|──────────────────────────
Salary        | TDS by employer                  | ₹75K standard deduction (new) / ₹50K (old)
Freelance     | Advance tax required             | Quarterly advance tax alerts
Rental        | 30% standard deduction           | Added to other income
Business      | Presumptive (44AD / 44ADA)       | Suggest presumptive taxation
Capital Gains | STCG 20% / LTCG 12.5% (equity)  | Separate calculation
Dividend      | Taxable as per slab              | Tracked separately
```

### Data Flow
```
[User adds income]
        ↓
[Validate → Save to incomes table]
        ↓
[Recalculate chain:]
  Total Monthly Income
  → Annual Gross Income
  → Tax Liability (Old + New, pick better)
  → Net Take-home (post tax / 12)
  → Monthly Surplus (net income - expenses)
        ↓
[Update Redis cache]
        ↓
[If surplus changed > ₹5,000 → Trigger AI re-analysis]
        ↓
[Update Dashboard]
```

---

## 12. Expense & EMI Manager

### Why It Exists
Expenses define investable surplus. EMIs are fixed obligations with deadlines — when they end, money is freed. AI tracks this to auto-redirect freed funds.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-15 | User adds rent | Surplus reduced, tracked monthly |
| UC-16 | User adds home loan EMI | Marked as EMI, 80C principal credit tracked |
| UC-17 | User adds insurance premium | Linked to insurance module, 80D tracked |
| UC-18 | EMI completes (months = 0) | Alert: "EMI done! ₹X free to invest" |
| UC-19 | Expense increases | AI alerts if surplus drops below safe threshold |

### Expense Categories & AI Flags
```
Category       | EMI? | 80C/80D Link       | AI Watch
───────────────|──────|────────────────────|──────────────────────────
Rent           | No   | HRA (old regime)   | % of income benchmark
Home Loan      | Yes  | 80C principal      | Interest vs principal split
Car Loan       | Yes  | No                 | Months left countdown
Personal Loan  | Yes  | No                 | Flag if > 20% income
Education Loan | Yes  | 80E interest       | 8-year deduction track
Health Ins     | No   | 80D premium        | Coverage adequacy check
Life Ins (Term)| No   | 80C premium        | Term vs ULIP check
ELSS SIP       | No   | 80C contribution   | Return tracking
```

### EMI Completion Data Flow
```
[Daily Cron 8 AM]
        ↓
[Fetch all active EMIs]
        ↓
[monthsLeft <= 0 for any EMI?]
        ↓
[YES:]
  Mark expense INACTIVE
  Calculate freed amount
  Create EMI_COMPLETED alert:
    "🎉 Car loan done! ₹12,000/month is now free"
  Trigger AI suggestion:
    "Redirect freed ₹12,000 to corpus SIP for 20yr wealth"
        ↓
[Notify: Push + Email + In-app]
```

---

## 13. Tax Manager

### Why It Exists
Most Indians overpay tax by ₹50,000–₹1,00,000 yearly due to poor planning. AI identifies the correct regime, fills deduction limits, and generates an actionable tax-saving plan. Highest-value feature for salaried users.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-21 | "Which tax regime is better for me?" | AI compares both with exact savings |
| UC-22 | "How much tax will I pay?" | Breakdown with slabs shown |
| UC-23 | 80C limit not fully used | AI: "₹70K remaining → invest in ELSS, save ₹21,840" |
| UC-24 | March approaching | Last-minute tax-saving plan generated |
| UC-25 | Freelancer advance tax | Alerts: June 15, Sep 15, Dec 15, Mar 15 |
| UC-26 | User switches regimes | All deduction tracking resets |

### Tax Calculation — New Regime (FY 2025-26)
```
Gross Income
  Less: Standard Deduction ₹75,000
  Less: Employer NPS 80CCD(2) (if applicable)
= Taxable Income

Slabs:
₹0 – ₹3,00,000         : 0%
₹3,00,001 – ₹6,00,000  : 5%
₹6,00,001 – ₹9,00,000  : 10%
₹9,00,001 – ₹12,00,000 : 15%
₹12,00,001 – ₹15,00,000: 20%
Above ₹15,00,000        : 30%

Rebate 87A : Income ≤ ₹7,00,000 → tax = 0
Surcharge  : 10% (>₹50L), 15% (>₹1Cr), 25% (>₹2Cr)
Cess       : 4% on (tax + surcharge)
```

### Tax Calculation — Old Regime (FY 2025-26)
```
Gross Income
  Less: Standard Deduction ₹50,000
  Less: 80C up to ₹1,50,000 (ELSS/PPF/EPF/LIC/NSC/Home loan principal)
  Less: 80D up to ₹25,000 self + ₹25,000/₹50,000 parents
  Less: 80CCD(1B) NPS additional ₹50,000
  Less: HRA (actual or formula)
  Less: Home loan interest up to ₹2,00,000
  Less: Education loan interest (80E, no limit)
= Taxable Income

Slabs:
₹0 – ₹2,50,000         : 0%
₹2,50,001 – ₹5,00,000  : 5%
₹5,00,001 – ₹10,00,000 : 20%
Above ₹10,00,000        : 30%

Rebate 87A : Income ≤ ₹5,00,000 → tax = 0
Cess       : 4%

Old regime wins when total deductions > ₹3.75 lakh
```

### 80C Deduction Tracker
```typescript
interface TaxDeductionTracker {
  section80C: {                    // MAX ₹1,50,000
    epf: number;                   // Auto from salary
    ppf: number;
    elss: number;                  // From investments module
    lifeInsurance: number;         // From insurance module
    homeLoanPrincipal: number;     // From EMI module
    taxSaverFD: number;
    nsc: number;
    childTuitionFees: number;
    total: number;
    remaining: number;             // 150000 - total
  };
  section80D: {                    // MAX ₹25K self + ₹25K/₹50K parents
    selfHealthInsurance: number;
    parentHealthInsurance: number;
    preventiveCheckup: number;     // Max ₹5,000
    total: number;
    remaining: number;
  };
  npsAdditional: {                 // 80CCD(1B) extra ₹50,000
    amount: number;
    remaining: number;
  };
  hra: number;
  homeLoanInterest: number;        // Max ₹2,00,000
  educationLoanInterest: number;
}
```

### Data Flow
```
[User opens Tax Manager]
        ↓
[Auto-fetch + populate deduction tracker:]
  EPF → from income data
  ELSS/PPF → from investments
  Insurance premium → from insurance module
  Home loan principal → from EMI module
        ↓
[Calculate tax under BOTH regimes]
        ↓
[AI recommends regime + shows savings]
        ↓
[Show 80C Action Plan:]
  "₹70K remaining → ELSS SIP (12-15% returns, 3yr lock)"
        ↓
[Show advance tax schedule if freelancer]
```

---

## 14. Emergency Fund

### Why It Exists
Without emergency fund, any financial shock forces debt. This is system-mandated (not a user goal) — AI calculates and manages it automatically before any investment begins.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-28 | User completes onboarding | AI auto-calculates target = 6× monthly expenses |
| UC-29 | "Where to keep emergency fund?" | AI: Liquid MF (T+1 withdrawal, 7% returns) |
| UC-30 | Fund hits 50% | Encouragement notification |
| UC-31 | Fund fully funded | Alert: "Complete! Now let's invest the surplus" |
| UC-32 | User withdraws for emergency | Alert: "Fund depleted. Rebuilding plan created" |
| UC-33 | Expenses increase | Target recalculates automatically |

### Formula & Instruments
```
Target = Monthly Fixed Expenses × 6
Minimum = Monthly Fixed Expenses × 3
(Freelancers/business owners → × 9 recommended)

Instrument Ranking (AI picks best):
1. Liquid Mutual Fund   → 6–7% returns, T+1 withdrawal ✅ DEFAULT
2. Arbitrage Fund       → 6–7% returns, equity tax treatment
3. High-Interest FD     → 6.5–7.5%, penalty on early withdrawal
4. Savings Account      → 3–4%, instant withdrawal (last resort)

RULE: Emergency fund NEVER goes into equity or stocks
```

### Data Flow
```
[Onboarding complete]
        ↓
[Sum all fixed expenses → target = expenses × 6]
        ↓
[AI selects instrument (Liquid MF by default)]
        ↓
[Show fund card: target / current / monthly allocation / ETA]
        ↓
[Monthly cron: Check fund balance]
  50% → Encouragement alert
  100% → Completion alert + AI redirects ₹X to corpus
        ↓
[Any withdrawal detected → Rebuild plan + alert]
```

---

## 15. Insurance Advisor

### Why It Exists
Uninsured risks destroy wealth in one event. Most Indians have wrong insurance (ULIPs, endowments) or insufficient coverage. AI identifies gaps before investments begin. Revenue stream: referral commissions.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-34 | No insurance at all | AI flags CRITICAL: term + health first |
| UC-35 | Has endowment plan | AI explains term is better, shows numbers |
| UC-36 | Car goal added | Motor insurance added to suggestions |
| UC-37 | Home loan EMI present | Loan protection insurance suggested |
| UC-38 | User confirms insurance | Premium added to monthly expenses |
| UC-39 | Renewal approaching | 30-day + 7-day alerts |

### Suggestion Engine Logic
```typescript
const InsuranceSuggestions = {
  termLife: {
    required: dependents > 0,
    cover: annualIncome × 15,        // minimum 10x, recommended 15x
    priority: "CRITICAL",
    reason: "Income replacement for dependents",
    bestFor: ["LIC", "HDFC Life", "ICICI Pru", "Max Life"]
  },
  health: {
    required: true,                   // always
    minCover: {
      individual: 500000,             // ₹5L min
      family: 1000000,                // ₹10L family floater
      metro: 2000000                  // ₹20L for metro cities
    },
    priority: "CRITICAL",
    bestFor: ["Niva Bupa", "Star Health", "Care Health", "HDFC Ergo"]
  },
  motor: {
    required: hasCarGoal,
    type: "Comprehensive",
    priority: "REQUIRED_FOR_GOAL"
  },
  loanProtection: {
    required: totalEMI > 10000,
    cover: outstandingLoanAmount,
    priority: "RECOMMENDED"
  },
  criticalIllness: {
    required: age > 40,
    cover: 1000000,
    priority: "OPTIONAL"
  }
};
```

### Data Flow
```
[Trigger: Onboarding done OR user opens Insurance tab]
        ↓
[Read: age, income, dependents, goals, loans, existing insurance]
        ↓
[Run suggestion engine → Rank by priority]
        ↓
[AI generates personalized explanation per suggestion]
        ↓
[User: "I have this" → Enter details → Track renewal]
[User: "Get this" → Referral link → Commission earned]
        ↓
[Premium added to monthly expenses when confirmed]
        ↓
[Renewal alerts: 30 days + 7 days before due date]
```

---

## 16. Goals Manager

### Why It Exists
Vague saving fails. Goal-based investing works. Every goal gets a concrete monthly SIP, instrument, and deadline. Goals are 100% user-defined — no pre-sets. Emergency fund is NOT a goal.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-41 | "I want to buy a car" | AI suggests ₹6-8L range, ₹36K/month SIP, Debt MF |
| UC-42 | User doesn't know budget | AI suggests range based on income |
| UC-43 | Unrealistic timeline | AI recalculates: "Try 24 months instead of 12" |
| UC-44 | Goal on track | Monthly progress update |
| UC-45 | 2 SIPs missed | Alert + catch-up calculation |
| UC-46 | Goal completed | 🎉 Alert + redirect freed SIP to corpus |
| UC-47 | Goal paused | Monthly SIP redirected to corpus |

### Goal Instrument Selection Matrix
```
Timeline    | Instrument                       | Expected Return | Risk
────────────|──────────────────────────────────|─────────────────|──────────
< 1 year    | Liquid MF / RD / FD              | 6.5%            | Low
1–3 years   | Debt MF / Short Term FD          | 7.5%            | Low-Med
3–5 years   | Hybrid MF (Balanced Advantage)   | 10%             | Medium
5–10 years  | Large Cap MF / Nifty Index Fund  | 12%             | Med-High
> 10 years  | Mid Cap / Small Cap / ELSS       | 14%             | High
```

### SIP Calculation (Reverse Future Value)
```
Required: FV (target), r (monthly return = annual/12), n (months)
Monthly SIP P = FV × r / [((1 + r)^n - 1) × (1 + r)]

Affordability check:
  IF P > availableSurplus:
    AI suggests extending deadline until P ≤ surplus
```

### Data Flow — Add Goal
```
[User: "Add Goal: Buy Car"]
        ↓
[AI Call 1: Suggest price range]
  "With ₹65K income: ₹6L–₹8L is comfortable"
        ↓
[User confirms: ₹7L in 18 months]
        ↓
[System calculates:]
  Monthly SIP = ₹36,500
  Instrument = Debt MF (18 months)
  Affordable? → ₹36,500 > ₹18,500 surplus
        ↓
[AI Call 2: Adjust recommendation]
  "Extend to 24 months: ₹27,200/month — feasible"
        ↓
[User confirms → Save to goals table]
        ↓
[Set monthly SIP reminder alert]
[Update available surplus = old surplus - new SIP]
[Goal card appears on dashboard]
```

### Data Flow — Goal Completion
```
[Monthly Cron: Check all goals]
        ↓
[current >= target?]
        ↓
[YES → Mark COMPLETED → Create alert]
  "🎉 Car Fund done! ₹7L saved in 22 months.
   ₹27,200/month is now free.
   Suggest: ₹20,000 to corpus + ₹7,200 to next goal"
        ↓
[Freed SIP auto-flows to corpus]
```

---

## 17. Investment Portfolio Tracker

### Why It Exists
Users invest across Groww, Zerodha, bank FDs — no single view. DhanAI unifies all investments, tracks real returns, and fires AI buy/hold/sell signals.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-49 | User adds existing SIP | NAV fetched daily, returns tracked |
| UC-50 | "Show total returns" | Unified XIRR across all investments |
| UC-51 | MF underperforms 6+ months | Alert: "Consider switching to better fund" |
| UC-52 | FD matures | Alert: "₹X matured. Reinvest options shown" |
| UC-53 | Portfolio too equity-heavy | AI: "Sell 10% equity → Buy Debt MF" |

### Investment Types & Data Sources
```
Type           | Source        | Freq        | AI Tracks
───────────────|───────────────|─────────────|──────────────────────────
Mutual Fund    | MFAPI.in      | Daily 9PM   | NAV, returns, category avg
SIP            | MFAPI.in      | Daily       | XIRR, vs benchmark
Stocks         | NSE API       | Every 15min | Price, fundamentals, P&L
Fixed Deposit  | Manual        | On maturity | Interest, maturity date
PPF            | Manual/yearly | Yearly      | Balance, withdrawal eligibility
NPS            | NSDL API      | Monthly     | Corpus, fund allocation
Sovereign Gold | NSE/RBI       | Daily       | NAV, gold price link
Bonds          | NSE Bond API  | Daily       | Yield, maturity, price
ELSS           | MFAPI.in      | Daily       | Lock-in expiry tracking
```

### Portfolio Analytics
```
XIRR        : Annualized return considering all cash flows + dates
Benchmark   : Equity MF vs Nifty 50 TRI | Debt MF vs CRISIL Bond Index

Target Allocation by Risk:
  Conservative : 30% Equity | 60% Debt | 10% Gold
  Moderate     : 50% Equity | 40% Debt | 10% Gold
  Aggressive   : 70% Equity | 20% Debt | 10% Gold

Rebalance trigger: Any asset class drifts > 5% from target
```

---

## 18. Corpus Builder

### Why It Exists
The "main mission" of DhanAI. After all immediate needs are met, remaining surplus builds a corpus for passive income and retirement. This is what makes users wealthy over time.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-65 | "Retire at 50" | AI calculates corpus needed + monthly SIP |
| UC-66 | "₹1L/month passive income" | AI: need ₹3 Crore corpus (4% withdrawal rule) |
| UC-67 | Only ₹5K surplus | AI shows 20yr projection — inspires action |
| UC-68 | Salary hike later | Extra surplus auto-flows to corpus |
| UC-69 | Corpus hits ₹10L milestone | Celebration alert + next milestone |

### Corpus Calculations
```
Passive Income Needed / (4% × 1/12) = Corpus Target
Example: ₹1,00,000/month → ₹3,00,00,000 (₹3 Crore)

Projections (Moderate risk, 11% annual):
  5 years  : FV = P × [((1.11/12)^60 - 1) / (0.11/12)] × (1 + 0.11/12)
  10 years : Same formula with n=120
  20 years : n=240

Default Allocation (Moderate):
  40% → Nifty 50 Index Fund (passive, 0.1% expense ratio)
  20% → Nifty Next 50 Index Fund
  10% → Mid Cap Index Fund
  20% → Short Term Debt Fund
  10% → Sovereign Gold Bond

Step-up SIP: Increase by 10% every April 1
Tax Harvesting: Book LTCG under ₹1.25L annually (tax-free threshold)
```

### Expected Returns by Risk
```
Conservative : 30% equity + 60% debt + 10% gold → ~9% annual
Moderate     : 50% equity + 40% debt + 10% gold → ~11% annual
Aggressive   : 70% equity + 20% debt + 10% gold → ~13% annual
```

---

## 19. AI Chat Advisor

### Why It Exists
Dashboards can't answer unique questions. "Should I prepay my home loan?" or "I got ₹1L bonus, what to do?" need context-aware AI conversation with the user's real financial data.

### Use Cases
| # | User Story | AI Response Type |
|---|-----------|-----------------|
| UC-70 | "Where should I invest ₹10,000?" | Personalized suggestion with amounts |
| UC-71 | "Is my portfolio too risky?" | Analysis of current allocation |
| UC-72 | "Buy or rent a house?" | Multi-factor analysis with numbers |
| UC-73 | "Got ₹1L bonus, what to do?" | Priority-based action plan |
| UC-74 | "FD matures tomorrow" | Comparison with current best rates |
| UC-75 | "How to save more tax?" | Gaps in user's specific situation |
| UC-76 | "Explain ELSS simply" | Financial education |
| UC-77 | "Market crashing, stop SIP?" | Behavioral coaching + data |

### Data Flow
```
[User types message]
        ↓
[Build AI context from DB + Redis cache]
  (Full financial profile + live market snapshot)
        ↓
[Send to Claude Sonnet 4.6:]
  system  : Master DhanAI prompt + full context
  messages: Last 10 chat messages (history)
  user    : Current message
        ↓
[Stream response (real-time typing effect)]
        ↓
[Parse response for actionable items:]
  AI suggests a goal → "Add this goal" button shown
  AI suggests instrument → "Learn more" button shown
  AI suggests tax action → Deep link to Tax Manager
        ↓
[Save conversation to DB]
```

---

## 20. Alert Engine

### Why It Exists
Users don't log in daily. Proactive alerts make DhanAI feel like a personal financial advisor who never sleeps — always watching your money.

### Complete Alert Catalog
```typescript
const ALERTS = {
  // 🎯 GOAL ALERTS
  GOAL_SIP_DUE: {
    trigger: "1 day before monthly SIP date",
    message: "Car Fund SIP of ₹8,000 due tomorrow",
    channel: ["push", "email"]
  },
  GOAL_AT_RISK: {
    trigger: "2+ SIPs missed OR value < 80% of expected trajectory",
    message: "Car Fund behind schedule. Need ₹2,000 extra to catch up",
    channel: ["push", "email"], priority: "HIGH"
  },
  GOAL_COMPLETED: {
    trigger: "current amount >= target amount",
    message: "🎉 Car Fund done! Time to buy! ₹27K/month now free",
    channel: ["push", "email", "in-app"], priority: "HIGH"
  },

  // 🧾 TAX ALERTS
  TAX_80C_RUNNING_LOW: {
    trigger: "80C remaining < ₹30,000 AND month = November",
    message: "₹28K of 80C left. ELSS investment can save ₹8,736 tax",
    channel: ["push", "email"]
  },
  TAX_YEAR_END: {
    trigger: "February 1",
    message: "⏰ 2 months left in FY. Check tax-saving investments",
    channel: ["push", "email"]
  },
  ADVANCE_TAX_DUE: {
    trigger: "June 1, Sep 1, Dec 1, Mar 1 (freelancers only)",
    message: "Advance tax due June 15. Estimated: ₹12,500",
    channel: ["push", "email"]
  },

  // 💰 INVESTMENT ALERTS
  FD_MATURITY: {
    trigger: "7 days and 1 day before FD maturity",
    message: "₹1.5L FD matures June 30. Best rate now: 7.5% (AU SFB)",
    channel: ["push", "email"]
  },
  MF_UNDERPERFORMING: {
    trigger: "Fund below category avg > 2% for 6 consecutive months",
    message: "Fund underperforming category by 3.2%. Consider switching",
    channel: ["push"]
  },
  BETTER_FD_AVAILABLE: {
    trigger: "Weekly: Better FD rate found vs user's current FD (+0.5%+)",
    message: "AU SFB offering 8.1% for 1yr. You're earning 7.2%",
    channel: ["push"]
  },
  PORTFOLIO_REBALANCE: {
    trigger: "Monthly: Asset class drifts > 5% from target",
    message: "Equity at 72% (target 60%). Rebalancing plan ready",
    channel: ["push", "email"]
  },

  // 🚨 EMERGENCY FUND ALERTS
  EMERGENCY_MILESTONE: {
    trigger: "Fund hits 50% of target",
    message: "Emergency fund 50% complete! ₹1.2L / ₹2.4L",
    channel: ["in-app"]
  },
  EMERGENCY_FUNDED: {
    trigger: "Fund hits 100% of target",
    message: "✅ Emergency fund complete! Ready to invest full surplus",
    channel: ["push", "email", "in-app"], priority: "HIGH"
  },

  // 🛡️ INSURANCE ALERTS
  INSURANCE_PREMIUM_DUE: {
    trigger: "30 days and 7 days before renewal",
    message: "Health insurance renewal in 7 days. Premium: ₹18,500",
    channel: ["push", "email"]
  },

  // 💸 EMI ALERTS
  EMI_COMPLETED: {
    trigger: "monthsLeft = 0",
    message: "🎉 Loan paid off! ₹12,000/month freed. Redirect to corpus?",
    channel: ["push", "email", "in-app"], priority: "HIGH"
  },

  // 🏛️ CORPUS ALERTS
  CORPUS_MILESTONE: {
    trigger: "Corpus crosses ₹1L / ₹5L / ₹10L / ₹25L / ₹50L / ₹1Cr",
    message: "🎊 Corpus hits ₹10 Lakh! At this pace → ₹1Cr in 12 years",
    channel: ["push", "email", "in-app"]
  }
};
```

### Alert Delivery Flow
```
[Cron jobs fire daily / weekly / monthly]
        ↓
[For each active user: Evaluate all alert conditions]
        ↓
[Condition met → Create alert record in DB]
        ↓
[Delivery pipeline (parallel):]
  In-App → Stored in alerts table, badge count updated
  Push   → Firebase FCM API call
  Email  → Resend API (HTML template with branding)
  SMS    → MSG91 (future Phase 3, critical alerts only)
        ↓
[User taps alert → Deep link to relevant screen]
        ↓
[Mark alert as read]
        ↓
[AI may generate follow-up message in chat]
```

---

## 21. Reports & Analytics

### Why It Exists
Users need to look back (tax filing, performance review) and forward (projection, motivation). Reports also serve as CA-ready documents.

### Use Cases
| # | User Story | Outcome |
|---|-----------|---------|
| UC-78 | Needs capital gains for ITR | Statement auto-generated |
| UC-79 | Annual financial review | AI summary: what improved, what to fix |
| UC-80 | CA needs investment summary | PDF download |
| UC-81 | Spending trend analysis | 12-month category chart |

### Report Types
```
1. Monthly Financial Summary (Auto, 1st of month)
   → Income vs Expenses vs Invested
   → Goal progress + net worth change
   → AI: What went well, what to improve

2. Annual Tax Report (March / April)
   → All investments with 80C/80D amounts
   → Capital gains statement (STCG/LTCG)
   → Regime comparison + recommendation
   → Advance tax history

3. Portfolio Performance Report (Quarterly)
   → Each holding: cost vs current value vs XIRR
   → Benchmark comparison
   → Rebalancing recommendation

4. Net Worth Tracker (Monthly)
   → Assets: investments + emergency fund + corpus
   → Liabilities: outstanding loans
   → Net Worth trend: 12-month chart
```

---

## PART D — AI SYSTEM

---

## 22. AI System Prompts

### Master Financial Profile Prompt
```
SYSTEM:
You are DhanAI, an expert Indian personal finance and investment advisor.

Your expertise covers:
- Indian tax system (Old & New regime, 80C, 80D, HRA, NPS, LTCG/STCG)
- Indian investment instruments (MF, ELSS, PPF, NPS, FD, G-Secs, SGBs, Stocks, Bonds)
- SEBI regulations and RBI guidelines (FY 2025-26)
- Indian insurance products (Term, Health, Motor, Critical Illness)
- Indian market dynamics (Nifty, Sensex, AMFI data)
- Behavioral finance and investor psychology

STRICT RULES:
1. Always follow money priority: Expenses → Insurance → Tax Saving → Emergency Fund → Goals → Corpus
2. Never suggest investing more than the user's available surplus
3. Always explain WHY you suggest something (not just what)
4. Add risk warnings for aggressive suggestions
5. Always use ₹ INR — never $ or any other currency
6. Suggest specific scheme names and codes when recommending MFs
7. Emergency fund is never a goal — it is a system baseline
8. Add SEBI disclaimer: "This is educational information, not SEBI-regulated investment advice"
9. Be concise, empathetic, and use simple language (avoid jargon without explanation)
10. When market is volatile, focus on SIP discipline and long-term thinking

USER FINANCIAL PROFILE:
{userProfileJSON}

CURRENT MARKET SNAPSHOT:
{marketDataJSON}
```

### Goal Suggestion Prompt
```
User goal: {goalName}
User's investable surplus (after all priorities): ₹{surplus}
Timeline: {months} months | Risk level: {riskLevel}

Respond in JSON:
{
  "priceRange": { "min": X, "recommended": Y, "max": Z, "basis": "..." },
  "monthlySIP": X,
  "instrument": "...",
  "schemeName": "...",
  "schemeCode": "...",
  "expectedReturn": X,
  "riskFactors": ["...", "..."],
  "alternative": { "instrument": "...", "monthlySIP": X, "timeline": X }
}
```

### Stock Fundamental Analysis Prompt
```
Analyze for a {riskLevel} investor:
Symbol: {symbol} | Price: ₹{price}
Fundamentals: {fundamentalsJSON}

Respond in JSON:
{
  "score": 0-100,
  "grade": "Strong Buy|Buy|Hold|Avoid|Sell",
  "strengths": ["...", "...", "..."],
  "risks": ["...", "...", "..."],
  "portfolioAllocation": "Max X% of portfolio",
  "targetPrice12m": X,
  "verdict": "One paragraph plain English explanation"
}
```

---

## 23. AI Context Injection Strategy

```typescript
// Built and injected into EVERY Claude API call
const buildAIContext = async (userId: string) => {
  
  // From PostgreSQL (user data)
  const [user, incomes, expenses, goals, investments,
         insurance, tax, emergency, corpus] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.income.findMany({ where: { userId, isActive: true } }),
    db.expense.findMany({ where: { userId, isActive: true } }),
    db.goal.findMany({ where: { userId, status: "ACTIVE" } }),
    db.investment.findMany({ where: { userId, status: "ACTIVE" } }),
    db.insurance.findMany({ where: { userId } }),
    db.taxProfile.findUnique({ where: { userId } }),
    db.emergencyFund.findUnique({ where: { userId } }),
    db.corpus.findUnique({ where: { userId } }),
  ]);

  // From Redis (market data, TTL 1 hour)
  const marketSnapshot = await redis.get('market:snapshot');

  return {
    userProfile: { age: user.age, occupation: user.occupation, 
                   riskLevel: user.riskLevel, dependents: user.dependents },
    
    financials: {
      monthlyIncome: sum(incomes.map(i => i.amount)),
      monthlyExpenses: sum(expenses.map(e => e.amount)),
      monthlySurplus: income - expenses,
      annualIncome: income * 12,
      taxLiability: tax?.taxLiability,
      netTakeHome: income - (tax?.taxLiability / 12),
    },
    
    emergencyFund: {
      target: emergency?.targetAmount,
      current: emergency?.currentAmount,
      status: emergency?.status,
      instrument: emergency?.instrument,
    },
    
    activeGoals: goals.map(g => ({
      name: g.name, target: g.targetAmount,
      current: g.currentAmount, sip: g.monthlySIP,
      deadline: g.deadline, onTrack: checkOnTrack(g)
    })),
    
    portfolio: {
      totalValue: sum(investments.map(i => i.currentValue)),
      allocation: calculateAllocation(investments),
      topHoldings: investments.slice(0, 5),
    },
    
    insurance: {
      active: insurance.filter(i => i.status === 'ACTIVE'),
      gaps: insurance.filter(i => i.status === 'SUGGESTED' && i.priority === 'CRITICAL'),
    },
    
    tax: {
      regime: tax?.regime, used80C: tax?.deductions80C,
      remaining80C: tax?.remainingLimit80C,
      estimatedTax: tax?.taxLiability,
    },
    
    corpus: {
      currentValue: corpus?.currentValue,
      monthlyContribution: corpus?.monthlyInvestment,
      projections: corpus?.projections,
    },
    
    market: JSON.parse(marketSnapshot || '{}'),
  };
};
```

---

## PART E — FINANCIAL CALCULATORS

---

## 24. Financial Calculators Reference

### SIP Future Value
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
P = monthly SIP | r = annual rate / 12 | n = months

Reverse (find P for target FV):
P = FV × r / [((1 + r)^n - 1) × (1 + r)]
```

### Emergency Fund
```
Target = Monthly Fixed Expenses × 6
Minimum = Monthly Fixed Expenses × 3
Freelancers / Business = Monthly Expenses × 9
Instrument: Liquid MF (T+1 withdrawal, ~7% return)
```

### Tax (New Regime FY 2025-26)
```
Slabs: 0–3L=0% | 3–6L=5% | 6–9L=10% | 9–12L=15% | 12–15L=20% | >15L=30%
Standard Deduction: ₹75,000
87A Rebate: Full tax exemption if income ≤ ₹7,00,000
Cess: 4%
```

### Tax (Old Regime FY 2025-26)
```
Slabs: 0–2.5L=0% | 2.5–5L=5% | 5–10L=20% | >10L=30%
Deductions: 80C=₹1.5L | 80D=₹25K self+₹25K parents | 80CCD(1B)=₹50K NPS
Standard Deduction: ₹50,000
87A Rebate: Full tax exemption if income ≤ ₹5,00,000
Old regime wins when deductions > ₹3.75 lakh
```

### Insurance Cover
```
Term Life       = Annual Income × 15 (min 10x)
Health          = ₹5L individual min | ₹10L family | ₹20L metro
Critical Illness= ₹10L minimum (age 40+)
Motor           = IDV-based comprehensive
Loan Protection = Outstanding loan amount
```

### Corpus for Retirement (4% Safe Withdrawal Rule)
```
Corpus Needed = Desired Monthly Income × 12 / 4%
             = Desired Monthly Income × 300

Example: ₹1,00,000/month → ₹3,00,00,000 corpus needed
```

### XIRR (Portfolio Returns)
```
XIRR solves for r in:
Σ [Cash Flow(t) / (1 + r)^(days(t)/365)] = 0

Used because SIP has irregular cash flows + dates
More accurate than simple return % for SIP portfolios
```

### Financial Health Score
```
Emergency Fund (20 pts): 0=none | 10=3mo | 20=6mo+
Insurance (20 pts): 0=none | 10=health only | 20=term+health
Savings Rate (20 pts): <10%=0 | 10-20%=10 | >20%=20
Debt Ratio (20 pts): >50%=0 | 30-50%=10 | <30%=20
Diversification (10 pts): 1 type=3 | 2-3=7 | 4+=10
Goal Progress (10 pts): all OK=10 | 1 at risk=5 | none=0
```

---

## PART F — SYSTEM DATA FLOWS

---

## 25. Master System Data Flows

### New User Journey (Day-by-Day)
```
Day 0: Signup & Onboarding
  Google Login → Account created
  5-step onboarding → Profile stored
  AI first analysis → Emergency fund target, insurance gaps, tax recommendation
  Dashboard loads with initial state

Days 1–30: Foundation Building
  User adds goals → SIPs calculated
  Emergency fund allocation starts
  Insurance gaps being addressed
  Tax saving investments tracked
  AI chat available for any questions

Ongoing Daily:
  Cron: Market scanner → NAV, prices, FD rates updated in Redis
  Cron: Alert engine → All conditions checked for all users
  Cron: AI daily tip generated for dashboard

Ongoing Monthly (1st of month):
  SIP due reminders fired
  Goal progress evaluated
  Portfolio rebalancing checked
  Monthly financial summary report generated
  Surplus recalculated (expenses / income changes)

Ongoing Yearly:
  Annual tax report generated (March/April)
  AI annual financial review
  Step-up SIP suggestion (+10%)
  Portfolio annual performance vs benchmarks
```

### AI Suggestion Pipeline
```
Trigger (User action OR cron job)
        ↓
Fetch user data from PostgreSQL
  + Fetch market data from Redis cache
  (If cache stale → fetch fresh → update Redis)
        ↓
Build AI context JSON
  (Full financial profile + market snapshot)
        ↓
Send to Claude Sonnet 4.6 (Anthropic API)
  system: Master prompt + context
  messages: History (last 10)
  user: Current request
        ↓
Parse Claude response
  Extract: suggestions, amounts, action items
        ↓
Save relevant results to PostgreSQL
  (Alerts, suggestions, logs)
        ↓
Deliver to user
  In-app | Push (FCM) | Email (Resend)
```

### Tech Layer to Feature Mapping
```
Feature                    → Technology
───────────────────────────|──────────────────────────────
Auth                       → NextAuth.js + Google OAuth2
User financial data        → Neon PostgreSQL + Prisma ORM
Session + market cache     → Upstash Redis
AI suggestions + chat      → Anthropic Claude Sonnet 4.6
MF NAV + history           → MFAPI.in (free)
Stock prices + fundamentals→ NSE API (free)
FD rates                   → BankBazaar scraper
Bond yields                → RBI + NSE Bond API
Scheduled jobs             → Vercel Cron (free)
Email alerts               → Resend (3,000/month free)
Push notifications         → Firebase FCM (free)
PDF reports                → Vercel Blob
Web + API hosting          → Vercel (free tier)
```

---

## PART G — BUSINESS

---

## 26. Revenue Model

### Subscription Plans
| Feature | 🆓 Free | 💎 Pro ₹199/mo | 👑 Elite ₹499/mo |
|---------|---------|----------------|------------------|
| Goals | 2 | Unlimited | Unlimited |
| AI Chat/day | 5 msgs | Unlimited | Unlimited |
| Tax Manager | Basic | Full Old + New | Full + advance tax |
| Emergency Fund | ✅ | ✅ | ✅ |
| Insurance Suggestions | ✅ | ✅ | ✅ |
| Corpus Builder | ❌ | ✅ | ✅ |
| Investment Alerts | ❌ | ✅ | ✅ |
| Portfolio Tracker | ❌ | ✅ | ✅ |
| Stock Fundamentals | ❌ | ✅ | ✅ |
| AI Rebalancing | ❌ | ❌ | ✅ |
| Family Accounts | ❌ | ❌ | 3 members |
| PDF Reports | ❌ | Monthly | Weekly |
| Human Advisor Call | ❌ | ❌ | 1/month |

### Annual Plans (25% discount)
```
Pro   : ₹1,799/year (save ₹589)
Elite : ₹4,499/year (save ₹1,489)
```

### Revenue Streams
```
1. Subscriptions (Primary)
   Pro + Elite monthly/annual payments via Razorpay

2. Referral Commissions (Passive)
   Mutual Funds (Groww/Zerodha)   → 0.5–1% AUM trail
   Term Insurance (PolicyBazaar)  → ₹500–2,000 per policy
   Health Insurance (Coverfox)    → ₹300–1,500 per policy
   FD referrals                   → Flat fee per booking
   NPS referrals                  → Flat fee

3. Premium PDF Reports (One-time)
   Annual Tax Report → ₹99
   Financial Health Report → ₹149

4. B2B Corporate Wellness (Phase 4)
   ₹100–200 per employee/month
   100 employees = ₹10,000–20,000/month per company

5. Financial Courses (Phase 4)
   ₹499–1,999 one-time per course
```

### Unit Economics (1,000 Users)
```
700 Free | 250 Pro (₹199) | 50 Elite (₹499)

Subscriptions : ₹74,700/month
Referrals     : ₹25,000–50,000/month
──────────────────────────────────
Total         : ~₹1,00,000–1,25,000/month
Platform cost : ~₹3,000–5,000/month
Net           : ~₹95,000–1,20,000/month profit
```

### Breakeven
```
200–300 paid users = platform costs covered
500+ paid users    = profitable
```

---

## 27. Legal & Compliance

```
SEBI Disclaimer (on all AI suggestions):
"This is educational information, not SEBI-regulated investment advice.
 Please consult a SEBI-registered investment advisor before making decisions."

Data Privacy:
  → DPDP Act (India) compliance
  → No storing of bank credentials or card numbers
  → AES-256 encryption for financial data
  → User can delete all data anytime (right to erasure)

Future:
  → SEBI RIA (Registered Investment Advisor) license for full advisory
  → At startup: AI provides "educational suggestions" only
```

---

## 28. Build Roadmap

### Phase 1 — MVP (Month 1–3) [CURRENT FOCUS]
- [x] Next.js 15 project setup with TypeScript
- [x] Google OAuth2 login (NextAuth.js)
- [x] Prisma schema + Neon DB setup
- [x] 5-step onboarding flow
- [x] Income & expense manager
- [x] Tax calculator (Old & New regime)
- [x] Emergency fund tracker (AI-suggested)
- [x] Basic AI chat (Claude Sonnet 4.6)
- [x] Goals manager (add/track/SIP calculation)
- [x] Financial dashboard with health score
- [x] Basic alerts (SIP due, goal complete)
- [x] MFAPI.in integration (MF NAV data)

### Phase 2 — Core Product (Month 3–5)
- [ ] Insurance suggestion engine
- [ ] Corpus builder with projections
- [ ] Portfolio tracker (XIRR calculation)
- [ ] Stock fundamentals scanner (NSE API)
- [ ] FD rates scraper (weekly)
- [ ] Bond data integration
- [ ] Cron jobs (market scan, goal check, alerts)
- [ ] Email alerts (Resend)
- [ ] Push notifications (Firebase FCM)
- [ ] Portfolio rebalancing engine
- [ ] Monthly PDF reports (Vercel Blob)

### Phase 3 — Growth (Month 5–7)
- [ ] Pro/Elite subscription (Razorpay)
- [ ] Referral commission links (MF, insurance)
- [ ] Premium PDF reports (one-time purchase)
- [ ] Market news feed (NewsAPI.org)
- [ ] Net worth tracker
- [ ] Mobile app (React Native + Expo)
- [ ] Step-up SIP reminders

### Phase 4 — Scale (Month 7–12)
- [ ] B2B corporate wellness dashboard
- [ ] Family account management (Elite plan)
- [ ] SEBI RIA license application
- [ ] Advanced AI rebalancing engine
- [ ] Financial courses marketplace
- [ ] API for third-party integrations
- [ ] Multi-language support (Hindi, Gujarati)

---

## 29. Feature Priority Matrix

| Feature | User Value | Revenue | Build Effort | Phase |
|---------|-----------|---------|-------------|-------|
| Onboarding | 🔴 Critical | High | Low | 1 |
| Income/Expense | 🔴 Critical | High | Low | 1 |
| Tax Calculator | 🔴 Critical | High | Medium | 1 |
| Emergency Fund | 🔴 Critical | Medium | Low | 1 |
| AI Chat | 🔴 Critical | High | Medium | 1 |
| Goals Manager | 🔴 Critical | High | Medium | 1 |
| Financial Dashboard | 🔴 Critical | High | Medium | 1 |
| Basic Alerts | 🔴 Critical | High | Low | 1 |
| Insurance Advisor | 🟡 High | High (commission) | Medium | 2 |
| MF Scanner | 🟡 High | High | Medium | 2 |
| Portfolio Tracker | 🟡 High | High | Medium | 2 |
| Corpus Builder | 🟡 High | High | Medium | 2 |
| FD Scanner | 🟡 High | Medium | Low | 2 |
| Email Alerts | 🟡 High | High | Low | 2 |
| Subscriptions | 🟡 High | Critical | Medium | 2 |
| Stock Fundamentals | 🟢 Medium | Medium | High | 3 |
| Bond Scanner | 🟢 Medium | Medium | Medium | 3 |
| PDF Reports | 🟢 Medium | Medium | Medium | 3 |
| Net Worth Tracker | 🟢 Medium | Low | Low | 3 |
| Rebalancing Engine | 🟢 Medium | High (Elite) | High | 3 |
| Mobile App | 🟢 Medium | High | High | 3 |
| B2B Dashboard | 🟡 High | Very High | High | 4 |
| Multi-language | 🟢 Medium | High | Medium | 4 |

---

*DhanAI Master Reference v2.0.0 — Single source of truth. Update after every phase completion.*
*Previous files: DHANAI_AGENT.md (v1.0) + DHANAI_FUNCTIONALITY.md (v1.0) — MERGED INTO THIS FILE*

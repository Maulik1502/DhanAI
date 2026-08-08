# DhanAI — End-to-End Functional Use Cases & Acceptance Criteria

---

## 📌 Document Information
- **Project**: DhanAI (AI-Powered Personal Finance & Wealth Engine)
- **Version**: 1.0.0
- **Status**: Production Specification
- **Target Audience**: QA Engineers, Developers, Product Managers, & AI Agents

---

## 📋 Table of Use Cases

| ID | Category | Name | Primary Actor | Status |
|:---|:---|:---|:---|:---|
| **UC-01** | Authentication | Sign-In, Session Management & Security | User | ✅ Verified |
| **UC-02** | Onboarding | Interactive 5-Step Financial Onboarding | New User | ✅ Verified |
| **UC-03** | Dashboard | Financial Health Score & Command Center | Authenticated User | ✅ Verified |
| **UC-04** | Finances | Income & Expense Tracker | Authenticated User | ✅ Verified |
| **UC-05** | Goals | Goal-Based Wealth & SIP Planner | Authenticated User | ✅ Verified |
| **UC-06** | Tax Optimization | Old vs New Regime Tax Calculator (FY 2025-26) | Authenticated User | ✅ Verified |
| **UC-07** | Emergency Fund | 6-Month Liquid Safety Net Manager | Authenticated User | ✅ Verified |
| **UC-08** | Wealth Corpus | Long-term Wealth & Compound Projection | Authenticated User | ✅ Verified |
| **UC-09** | Market Intelligence | Mutual Fund, Stock & FD Scraper Engine | Authenticated User | ✅ Verified |
| **UC-10** | AI Copilot | Context-Aware AI Advisor Chat | Authenticated User | ✅ Verified |
| **UC-11** | Admin Portal | System Audit, Analytics & Cron Engine | Admin User | ✅ Verified |

---

## 🔐 UC-01: Authentication & Access Control (Starting Point)

### UC-01.1: Google OAuth 2.0 Sign-In
- **Description**: Users sign in securely using their Google account via NextAuth.js without needing a password.
- **Pre-conditions**: User is on `/login`.
- **Flow**:
  1. User clicks **"Sign in with Google"**.
  2. System redirects user to Google OAuth consent screen.
  3. Upon successful Google authentication, NextAuth creates or updates the user record in PostgreSQL via Prisma.
  4. System evaluates `user.onboarded` flag:
     - If `onboarded === true` ➔ Redirect to `/dashboard`.
     - If `onboarded === false` ➔ Redirect to `/onboarding`.
- **Acceptance Criteria**:
  - [x] JWT token is issued securely with `httpOnly` flags.
  - [x] Unauthenticated users trying to access protected routes (`/dashboard`, `/finances`, `/goals`) are automatically redirected to `/login`.

### UC-01.2: Demo Account Preview Mode
- **Description**: Guest users can test the application instantly without logging into Google.
- **Pre-conditions**: User is on `/login`.
- **Flow**:
  1. User clicks **"Preview Demo Account"**.
  2. System fetches `/api/user` (or initializes mock demo session).
  3. System redirects user directly to `/onboarding` or `/dashboard`.
- **Acceptance Criteria**:
  - [x] Allows seamless evaluation without requiring personal OAuth login.
  - [x] Demo data is loaded cleanly into Zustand state or memory.

### UC-01.3: Middleware Route Guarding & Session Guard
- **Description**: Next.js Middleware inspects every incoming request for a valid session token.
- **Pre-conditions**: HTTP request to any route.
- **Acceptance Criteria**:
  - [x] Public routes (`/login`, `/api/auth/*`) allow unauthenticated access.
  - [x] Protected routes (`/dashboard`, `/finances`, `/goals`, `/tax`, `/investments`, `/corpus`, `/chat`, `/admin`) require valid session token.
  - [x] Admin routes (`/admin/*`) require `user.role === "ADMIN"`.

---

## 🚀 UC-02: Interactive Financial Onboarding

### UC-02.1: 5-Step Guided Profile Creation
- **Step 1 — Basic Info**: Name, age, target retirement age, monthly take-home salary.
- **Step 2 — Monthly Expenses**: Rent, food, utilities, EMIs, entertainment, and discretionary spending.
- **Step 3 — Savings & Investments**: Current savings account balance, FD, Mutual Funds, Stocks, EPF/PPF.
- **Step 4 — Risk & Tax Regime**: Risk profile selection (Conservative, Moderate, Aggressive) and tax regime choice (Old vs New).
- **Step 5 — Confirmation & Baseline Calculation**: System calculates:
  - Emergency Fund Required = `Monthly Essential Expenses × 6`
  - Monthly Investable Surplus = `Monthly Income - Monthly Expenses`
  - Financial Health Score Baseline.
- **Acceptance Criteria**:
  - [x] Data validates with Zod schema on client and server.
  - [x] Completing onboarding sets `user.onboarded = true` in DB and redirects to `/dashboard`.

---

## 📊 UC-03: Dashboard & Financial Health Score

### UC-03.1: Health Score Engine
- **Description**: Calculates a dynamic score (0-100) based on 4 pillars:
  1. Emergency Fund Buffer Ratio (30% weight)
  2. Monthly Savings Rate (30% weight)
  3. Insurance Coverage (20% weight)
  4. Asset Allocation Diversification (20% weight)
- **Acceptance Criteria**:
  - [x] Score updates immediately when income, expenses, or assets are modified.
  - [x] Visual gauge widget displays color status: Red (<50), Amber (50-74), Green (75-100).

### UC-03.2: AI Insights & Priority Feed
- **Description**: Real-time actionable recommendations generated by AI based on user financial state.
- **Acceptance Criteria**:
  - [x] Displays top 3 prioritized financial tasks (e.g. "Build emergency fund before stock SIPs", "Switch to New Tax Regime to save ₹18,500").

---

## 💸 UC-04: Income & Expense Management

### UC-04.1: Transaction Entry & Categorization
- **Description**: Record income (Salary, Freelance, Dividends) and expenses (Housing, Food, Debt, Subscriptions).
- **Acceptance Criteria**:
  - [x] Real-time recalculation of remaining surplus.
  - [x] Full CRUD functionality (Add, Edit, Delete transactions).

---

## 🎯 UC-05: Goal-Based Wealth & SIP Planner

### UC-05.1: Financial Goal Setup
- **Description**: Users define financial goals (e.g. "Home Down Payment", "Emergency Fund", "Retirement Corpus").
- **Fields**: Target Amount, Target Date/Years, Current Saved Amount, Inflation Rate.
- **Acceptance Criteria**:
  - [x] SIP Calculator calculates exact monthly investment required at expected return (e.g., 12% p.a. for equity).
  - [x] Displays progress bar & remaining monthly gap.

---

## 📜 UC-06: Tax Optimization (FY 2025-26)

### UC-06.1: Live Old vs New Regime Comparison
- **Description**: Automatically compares tax liability under Old Tax Regime vs New Tax Regime for Indian Salaried Taxpayers.
- **Deductions Tracked**: Standard Deduction (₹75,000 for New Regime), Section 80C (up to ₹1.5L), Section 80D (Health Insurance up to ₹75k), Section 80CCD(1B) (NPS ₹50k), HRA Exemption.
- **Acceptance Criteria**:
  - [x] Displays side-by-side tax breakdown with exact rupees saved recommendation.

---

## 🛡️ UC-07: Emergency Safety Net Baseline

### UC-07.1: 6-Month Liquid Fund Manager
- **Description**: Enforces liquid safety buffer rule (6× essential monthly expenses) before allocating funds into volatile equity markets.
- **Acceptance Criteria**:
  - [x] Warns user if equity allocation > 50% while emergency fund is < 100% complete.

---

## 📈 UC-08: Wealth Corpus & Projections

### UC-08.1: Multi-Year Compound Wealth Growth
- **Description**: Simulates 5, 10, 15, 20-year net worth projections considering inflation, annual step-up SIP %, and expected rate of return.
- **Acceptance Criteria**:
  - [x] Interactive projection chart with dynamic sliders for annual step-up (e.g. +10% salary increment).

---

## 🔍 UC-09: Live Market Intelligence

### UC-09.1: Mutual Fund & Stock Scanner
- **Description**: Fetches live NAV data via MFAPI (Official Indian Mutual Funds API) and stock data.
- **Acceptance Criteria**:
  - [x] Provides DhanAI Fund Score based on CAGR, Sharpe Ratio, and Expense Ratio.

---

## 🤖 UC-10: AI Financial Copilot Chat

### UC-10.1: Context-Aware Advisory Chat
- **Description**: Users can ask natural language questions ("How much tax will I save if I invest ₹50k in NPS?", "Can I afford a ₹15 Lakh car next year?").
- **Acceptance Criteria**:
  - [x] Multi-provider fallback: Anthropic Claude / OpenAI / Local engine fallback.
  - [x] Injects user financial summary safely into system context for accurate, personalized answers.

---

## ⚙️ UC-11: Admin Portal & System Audit

### UC-11.1: System Health & Cron Job Auditing
- **Description**: Admin dashboard for monitoring user activity, database health, and automated cron background tasks (`/api/cron/check-alerts`, `/api/cron/scan-market`).
- **Acceptance Criteria**:
  - [x] Restricted to admin users (`user.role === 'ADMIN'`).

---

## 🧪 Verification Matrix & Test Strategy

| Test Suite | Target Module | Method | Standard |
|:---|:---|:---|:---|
| **Auth Tests** | `/login`, `/api/auth` | Unit + E2E | Pass OAuth & Demo login flows |
| **Onboarding Tests**| `/onboarding` | Integration | Validate Zod schemas & DB write |
| **Calculation Tests**| `calculators/index.ts` | Unit | Compare tax liability against IT Department formulas |
| **API Health Tests** | `/api/health` | Automated | HTTP 200 OK & Database ping < 50ms |

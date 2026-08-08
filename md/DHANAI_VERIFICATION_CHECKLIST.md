# DhanAI — Product Verification & Readiness Checklist

---

## 📌 Instructions
- This document acts as our **live verification checklist** to inspect, test, and finalize every use case in DhanAI.
- We will test use cases **one by one** starting with **Login / Auth**.
- When a use case is tested and confirmed working by both of us, it is marked as `[x] DONE & FINALIZED`.

---

## 🚦 Verification Progress Summary

- **Total Use Cases**: 11 Modules (35 Test Items)
- **Completed**: 0 / 35
- **Current Active Focus**: **Phase 1: Login & Phase 2: First-Time Onboarding**

---

## 🔑 Phase 1: Login & Authentication

- [ ] **UC-1.1: Login Page UI Rendering**
  - Open [http://localhost:3000/login](http://localhost:3000/login)
  - Verify hero title ("Manage every rupee intelligently"), SEBI badge, value proposition cards, Google Sign-In & Demo buttons render correctly.
- [ ] **UC-1.2: Demo Account Preview Mode**
  - Click **"Preview Demo Account"** button on `/login`.
  - Verify instant redirection to `/onboarding` (for new users) or `/dashboard` (for existing users).
- [ ] **UC-1.3: Google OAuth 2.0 Sign-In**
  - Click **"Sign in with Google"** button on `/login`.
  - Verify NextAuth Google sign-in prompt opens.
- [ ] **UC-1.4: Middleware Route Guarding**
  - Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) without a session token.
  - Verify middleware automatically redirects back to `/login`.

---

## 🚀 Phase 2: First-Time Login (Onboarding Flow)

- [ ] **UC-2.1: Step 1 — Product Tour & Core Capabilities**
  - On `/onboarding`, review 3 capability cards (Autonomous Money Engine, Multi-Account Networth Wallet, Reverse Goal SIP Engine).
  - Click **"Continue"**.
- [ ] **UC-2.2: Step 2 — Investor Profile Setup**
  - Enter Investor Name, Date of Birth, Occupation, and select Risk Profile (Conservative / Moderate / Aggressive).
  - Verify validation prevents continuing if Name is empty.
  - Click **"Continue"**.
- [ ] **UC-2.3: Step 3 — SEBI Disclaimer & Terms Compliance**
  - Review SEBI Educational Notice and Terms of Service.
  - Check both mandatory checkboxes (Terms Agreement & SEBI Disclaimer).
  - Verify **"Continue"** button is disabled until both checkboxes are checked.
  - Click **"Continue"**.
- [ ] **UC-2.4: Step 4 — Launch Portal & Database Save**
  - View completion confirmation screen.
  - Click **"Launch DhanAI Workspace"**.
  - Verify API PATCH to `/api/user` updates database (`onboarded = true`) and redirects to `/dashboard`.


---

## 📊 Phase 3: Core Dashboard & Health Score

- [ ] **UC-3.1: Financial Health Score Gauge (0-100)**
  - Verify health score calculation based on Emergency Fund + Savings Rate + Insurance + Asset Allocation.
- [ ] **UC-3.2: AI Recommendation Cards**
  - Verify top 3 personalized recommendations display dynamically.
- [ ] **UC-3.3: Income, Expense & Surplus Cards**
  - Verify Monthly Income, Total Expense, and Net Surplus numbers match profile.

---

## 💸 Phase 4: Income & Expense Management

- [ ] **UC-4.1: Add & Categorize Income**
  - Add new income source (Salary, Freelance, Dividend).
- [ ] **UC-4.2: Add & Categorize Expenses**
  - Add new expense transaction.
- [ ] **UC-4.3: Real-Time Surplus Recalculation**
  - Verify remaining investable surplus updates instantly upon adding/editing transactions.
- [ ] **UC-4.4: Delete & Edit Transactions**
  - Test editing and removing an existing transaction.

---

## 🎯 Phase 5: Goal-Based Wealth & SIP Planner

- [ ] **UC-5.1: Create New Financial Goal**
  - Add a goal (e.g., "Home Purchase", Target: ₹50,000,000 in 5 years).
- [ ] **UC-5.2: Target SIP Engine**
  - Verify required monthly SIP calculation at expected annual return %.
- [ ] **UC-5.3: Goal Progress Tracker**
  - Verify percentage completion ring and timeline projection.

---

## 📜 Phase 6: Tax Calculator & Optimizer (FY 2025-26)

- [ ] **UC-6.1: Old vs New Regime Comparison**
  - Compare calculated tax under Old Regime vs New Regime.
- [ ] **UC-6.2: Section 80C, 80D, 80CCD(1B), HRA Deductions**
  - Enter ELSS, EPF, Health Insurance, and NPS values to verify tax reduction.

---

## 🛡️ Phase 7: Emergency Fund & Safety Net

- [ ] **UC-7.1: 6-Month Liquid Safety Baseline**
  - Verify required emergency buffer = `6 × Essential Monthly Expenses`.
- [ ] **UC-7.2: Allocation Warning System**
  - Verify warning appears if equity investing is attempted before emergency buffer is met.

---

## 📈 Phase 8: Wealth Corpus Projections

- [ ] **UC-8.1: Multi-Year Net Worth Curve (5, 10, 20 Yrs)**
  - Test compound growth curve with sliders for annual step-up SIP %.
- [ ] **UC-8.2: Asset Allocation Breakdown**
  - Verify pie chart for Equity, Debt, Gold, Liquid assets.

---

## 🔍 Phase 9: Live Market Intelligence

- [ ] **UC-9.1: Mutual Fund NAV Scanner**
  - Search and view live NAV data & DhanAI Fund Score.
- [ ] **UC-9.2: Stock Market Ticker**
  - Verify market status & stock index ticker rendering.
- [ ] **UC-9.3: FD Rate Scraper**
  - Compare bank FD interest rates table.

---

## 🤖 Phase 10: AI Financial Copilot Chat

- [ ] **UC-10.1: Context-Aware Chat Questions**
  - Ask AI: *"How can I save more tax this year?"*
  - Verify answer references current user tax regime and income.
- [ ] **UC-10.2: LLM Provider Fallback**
  - Test AI response under API key availability or local fallback mode.

---

## ⚙️ Phase 11: Admin Portal & System Health

- [ ] **UC-11.1: System Health API (`/api/health`)**
  - Test `GET /api/health` response.
- [ ] **UC-11.2: Admin Audit & User Management**
  - Access `/admin/dashboard` as Admin user and verify analytics.

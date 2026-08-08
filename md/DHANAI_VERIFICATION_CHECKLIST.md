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
- **Current Focus**: **Phase 1: Login & Authentication**

---

## 🔑 Phase 1: Login & Authentication (CURRENT FOCUS)

- [ ] **UC-1.1: Login Page UI Rendering**
  - Navigate to [http://localhost:3000/login](http://localhost:3000/login)
  - Verify hero banner, features summary, SEBI badge, and buttons render cleanly.
- [ ] **UC-1.2: Demo Account Preview Mode**
  - Click **"Preview Demo Account"** button on `/login`.
  - Verify instant redirection to `/onboarding` or `/dashboard` with pre-filled demo context.
- [ ] **UC-1.3: Google OAuth Sign-In**
  - Click **"Sign in with Google"** on `/login`.
  - Verify Google login consent screen opens and authenticates properly.
- [ ] **UC-1.4: Middleware Route Guarding**
  - Try opening [http://localhost:3000/dashboard](http://localhost:3000/dashboard) without logging in.
  - Verify automatic redirect back to `/login`.
- [ ] **UC-1.5: Logout & Session Destruction**
  - Click **Logout** from user profile / header.
  - Verify session token is cleared and redirected back to `/login`.

---

## 🚀 Phase 2: User Onboarding Flow

- [ ] **UC-2.1: Step 1 — Basic Information & Salary Input**
  - Input Name, Age, Target Retirement, and Monthly Take-Home Salary.
- [ ] **UC-2.2: Step 2 — Expense Profiling**
  - Input Housing, Food, EMIs, Utilities, and Discretionary Expenses.
- [ ] **UC-2.3: Step 3 — Current Savings & Asset Mapping**
  - Input Savings Account Balance, FD, Mutual Funds, Stocks, EPF.
- [ ] **UC-2.4: Step 4 — Risk Tolerance & Tax Regime**
  - Select Risk Profile (Conservative / Moderate / Aggressive) and Old vs New Tax Regime.
- [ ] **UC-2.5: Step 5 — Baseline Calculation & DB Write**
  - Review summary and submit onboarding.
  - Verify `user.onboarded = true` flag set in DB and redirect to `/dashboard`.

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

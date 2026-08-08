# DhanAI — Pending Features & Roadmap

> Phase 1 (MVP) features marked [DONE]. Phases 2-4 and future suggestions listed below.

---

## Phase 1 — MVP (Current Build) ✅

### Core Features [DONE]
- [x] Google OAuth2 login
- [x] Financial onboarding (5 steps)
- [x] Income management (add, edit, delete)
- [x] Expense & EMI tracking
- [x] Tax calculator (Old + New regime)
- [x] Emergency fund tracking (AI-suggested)
- [x] Goals manager (create, track, SIP calculation)
- [x] Insurance suggestion engine
- [x] AI Chat advisor (streaming, context-injected)
- [x] Financial health score
- [x] Alerts engine (12 alert types)
- [x] Cron jobs (market scan, goal check, alert check, rebalance check)
- [x] PostgreSQL multi-DB support
- [x] Redis caching + rate limiting
- [x] Modern UI/UX design system

### API Routes [DONE]
- [x] /api/finances (income, expenses)
- [x] /api/goals
- [x] /api/investments
- [x] /api/tax
- [x] /api/emergency
- [x] /api/insurance
- [x] /api/corpus
- [x] /api/alerts
- [x] /api/ai/chat (streaming)
- [x] /api/ai/suggest
- [x] /api/ai/analyze
- [x] /api/cron/* (all jobs)

### Pages [DONE]
- [x] Login page
- [x] Dashboard
- [x] Finances
- [x] Tax Manager
- [x] Emergency Fund
- [x] Insurance
- [x] Goals
- [x] Investments
- [x] Corpus
- [x] AI Chat
- [x] Alerts
- [x] Market (stub)

---

## Phase 2 — Full Market Data (Month 3-5)

### Coming Soon
```
[ ] Real MFAPI.in integration (live MF NAVs + returns)
[ ] Real NSE API integration (stock prices + fundamentals)
[ ] FD rate scraper (BankBazaar/Paisabazaar)
[ ] Bond yields integration (RBI, NSE)
[ ] News feed widget (NewsAPI + sentiment)
[ ] Market overview dashboard (Nifty, Sensex, gold price)
[ ] Stock scoring engine (valuation, growth, safety)
[ ] MF fund finder (filter by category, returns, expense ratio)
```

### Investment Pages [COMING]
```
[ ] Market/MF Browser (search, filter, compare)
[ ] Stock Scanner (fundamental analysis, scoring)
[ ] FD Rates Comparison (bank, tenor, rate)
[ ] Bond Explorer
[ ] Portfolio Performance Dashboard (XIRR, vs benchmark)
[ ] Rebalancing Suggestions (+ one-click implementation)
```

### Reports & Analytics [COMING]
```
[ ] Monthly Financial Summary (auto-generated, email)
[ ] Annual Tax Report (exportable, CA-friendly)
[ ] Portfolio Performance Report (quarterly)
[ ] Net Worth Tracker (12-month chart)
[ ] PDF Export (Vercel Blob storage)
[ ] Excel Export (investments, transactions)
```

---

## Phase 3 — Mobile & Monetization (Month 5-7)

### Mobile App
```
[ ] React Native + Expo (iOS + Android)
[ ] Biometric login (Face ID / Touch ID)
[ ] Push notifications (Firebase FCM)
[ ] Offline-first sync (SQLite local DB)
[ ] Dark mode native
```

### Subscription & Payments
```
[ ] Razorpay integration
[ ] Pro Plan (₹199/month)
[ ] Elite Plan (₹499/month)
[ ] Annual billing (25% discount)
[ ] Payment receipts (email)
[ ] Subscription management page
[ ] Upgrade/downgrade flow
```

### Referral & Revenue
```
[ ] Referral program (₹100 bonus per user)
[ ] MF affiliate links (Groww, Zerodha)
[ ] Insurance referral (PolicyBazaar, Coverfox)
[ ] FD referral commissions
[ ] Referral dashboard (tracking, payouts)
```

---

## Phase 4 — Enterprise & B2B (Month 7-12)

### B2B Dashboard
```
[ ] Company admin panel
[ ] Employee financial health overview
[ ] Bulk user onboarding
[ ] Custom branding
[ ] Integration with payroll systems
[ ] Financial wellness reports
```

### Advanced Features
```
[ ] Multi-currency support (USD, EUR, GBP)
[ ] Forex rates integration
[ ] International investment tracking
[ ] SEBI RIA license application
[ ] API for third-party integrations
[ ] White-label solution
```

### Family & Shared Finance
```
[ ] Family accounts (Elite plan)
[ ] Shared goals
[ ] Shared expense splitting
[ ] Family financial health
```

---

## Future Suggestions (Beyond Phase 4)

### AI Enhancements
```
[ ] Predictive spending analysis (ML)
[ ] Automated investment recommendations (based on behavior)
[ ] Behavioral coaching (reduce overspending, increase savings)
[ ] Voice commands ("Add ₹500 rent expense")
[ ] Image recognition (upload bill photos, auto-categorize)
[ ] Natural language reports ("Tell me why I'm not on track")
```

### Market Intelligence
```
[ ] Real-time price alerts (email/SMS/push)
[ ] Portfolio watch alerts (stock drops X%, MF underperforms)
[ ] News sentiment analysis (buy/sell signals)
[ ] Earnings calendar (IND stocks)
[ ] Insider trading alerts
[ ] Market anomaly detection
```

### Social & Gamification
```
[ ] Leaderboard (savings rate, goal achievement)
[ ] Badges & milestones ("₹10L Corpus", "100% Emergency Fund")
[ ] Social sharing (achievement cards)
[ ] Community tips (user-submitted hacks)
[ ] Savings challenges (monthly competitions)
```

### Bank Integration
```
[ ] PSD2 / Open Banking (auto-sync transactions)
[ ] Direct bank connections (Plaid alternative for India)
[ ] Auto-categorization (ML learning user patterns)
[ ] Bill payment tracking
[ ] Credit score integration
```

### Investing Automation
```
[ ] Robo-advisor (automated portfolio management)
[ ] Automatic rebalancing (quarterly/annually)
[ ] Tax-loss harvesting automation
[ ] Smart SIP adjustment (increase by 5% on salary hike)
[ ] Automated goal completion (buy recommended fund)
```

### Compliance & Legal
```
[ ] Digital will planning
[ ] Nominee management
[ ] Legal document templates
[ ] Insurance claim assistance
[ ] Tax audit support
```

### Offline & Low-Connectivity
```
[ ] Progressive Web App (PWA)
[ ] Offline mode (cached data)
[ ] Sync-on-connect
[ ] SMS alerts (for low-data users)
```

---

## Roadmap Timeline

```
Now (Month 0)      : Phase 1 MVP complete, begin Phase 2
Month 3-5          : Phase 2 market data + reports ready
Month 5-6          : Phase 3 mobile app beta
Month 6-7          : Phase 3 subscriptions live
Month 7-12         : Phase 4 B2B, RIA licensing
Year 2+            : Future enhancements, expansion
```

---

## Quick Wins (Low Effort, High Value)

These can be done quickly in Phase 1 if time allows:

```
[ ] Email digest (weekly, free plan)
[ ] SMS alerts (9 paisa charges, critical alerts only)
[ ] Export to Google Sheets (auto-update via API)
[ ] Telegram bot (goal reminders, alerts)
[ ] Calendar view (see all upcoming deadlines)
[ ] Bulk import (CSV for existing investments)
[ ] Goal templates ("House Down Payment", "Car", "Wedding")
[ ] Recurring expense presets
[ ] Goal name suggestions (emoji + category)
[ ] Print portfolio statement
```

---

## Suggestions for Immediate Improvement (Phase 1.5)

### UX Enhancements
```
[ ] Onboarding tour (first-time user walkthrough)
[ ] Contextual help (hover icons explain terms)
[ ] Keyboard shortcuts (e.g., Cmd+Shift+M = new income)
[ ] Undo/Redo for deletions (30-second window)
[ ] Bulk edit expenses (select multiple, adjust frequency)
[ ] Drag-drop goal reordering (priority)
[ ] Comparison mode ("What if I save 10% more?")
```

### Data Quality
```
[ ] Income auto-detect (fetch from payslip photos)
[ ] Expense import from bank (CSV upload)
[ ] Duplicate transaction detection
[ ] Suspicious transaction flagging (unusual category/amount)
[ ] Historical data cleanup tool
```

### Performance
```
[ ] Lazy-load images (lazy loading LCP)
[ ] Code splitting by route
[ ] Service worker (offline cache)
[ ] Database query optimization (indexes for common queries)
[ ] Redis cache warming (pre-load popular goals)
```

### Security
```
[ ] Two-factor authentication (SMS/TOTP)
[ ] Login activity log (view devices, sessions)
[ ] Device fingerprinting (suspicious login detection)
[ ] Data encryption at rest (Prisma encryption)
[ ] Regular security audits (OWASP Top 10)
[ ] GDPR compliance (data export, deletion)
```

### Analytics (Without Being Creepy)
```
[ ] Funnel analysis (onboarding completion rate)
[ ] Feature usage (which features matter most)
[ ] Error tracking (bugs users face)
[ ] Session recordings (opt-in only, with consent)
[ ] Heatmaps (which page sections are clicked)
```

---

## Dependency Matrix (What Needs What)

```
AI Chat             → Needs: User context, market data (ready)
Goals Tracker       → Needs: Income/expenses (ready)
Tax Manager         → Needs: Income, expenses, investments (ready)
Emergency Fund      → Needs: Fixed expenses (ready)
Corpus Builder      → Needs: Goals, investments (ready)
Market Scanner      → Needs: Real MFAPI/NSE APIs (Phase 2)
Reports             → Needs: PDF storage (Phase 2)
Mobile App          → Needs: All Phase 1 APIs (Phase 3)
B2B Dashboard       → Needs: Subscriptions (Phase 3)
Family Accounts     → Needs: Subscriptions (Phase 3)
```

---

## Critical Path (Must-Have for Success)

1. Phase 1 API stability (all endpoints 99.9% uptime) ✅
2. Real market data (MF NAVs, stock prices) → Phase 2
3. Monetization (subscriptions) → Phase 3
4. Mobile app (60% of users on mobile) → Phase 3
5. Regulatory compliance (SEBI, DPDP Act) → Phase 4

---

## Beta Testing Strategy

For each phase:
```
Week 1-2   : Internal testing (team + close friends)
Week 3-4   : Beta group (50-100 power users, collect feedback)
Week 5-6   : Soft launch (gradual rollout to production)
Week 7+    : Public launch
```

---

## Feedback Channels (Post-Launch)

```
In-app feedback form (every page)
Email: feedback@dhanai.com
Discord community (discussion, feature requests)
Monthly feedback survey (NPS)
LinkedIn posts (community engagement)
```


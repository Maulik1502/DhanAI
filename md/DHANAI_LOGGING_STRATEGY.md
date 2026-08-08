# DhanAI — Logging Strategy for Background Jobs & Cron

> Production-ready logging for all scheduled tasks, error tracking, and monitoring

---

## Logging Architecture

### Stack
```
Logger  : Winston (enterprise-grade logging)
Storage : Console (dev) + File (production) + Upstash (future)
Level   : DEBUG, INFO, WARN, ERROR
Format  : JSON (machine-readable) + Human-readable timestamps
```

### Setup

```typescript
// src/lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'dhanai-background' },
  transports: [
    // Console in dev
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      )
    }),
    // File in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 10,
          }),
        ]
      : []),
  ],
});

export default logger;
```

---

## Cron Job Logging Pattern

### Template for Every Cron Endpoint

```typescript
// src/app/api/cron/[job]/route.ts

import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const jobName = '[JOB_NAME]';
  const startTime = Date.now();
  const jobId = `${jobName}-${new Date().toISOString()}`;

  try {
    // 1. Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      logger.warn('Unauthorized cron access attempt', {
        jobId,
        jobName,
        ip: req.headers.get('x-forwarded-for'),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info(`${jobName} started`, {
      jobId,
      jobName,
      timestamp: new Date().toISOString(),
    });

    // 2. MAIN LOGIC HERE
    const result = await yourJobLogic();

    const duration = Date.now() - startTime;
    logger.info(`${jobName} completed successfully`, {
      jobId,
      jobName,
      duration: `${duration}ms`,
      itemsProcessed: result.count,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        jobId,
        jobName,
        duration: `${duration}ms`,
        itemsProcessed: result.count,
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`${jobName} failed`, {
      jobId,
      jobName,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });

    // Send alert to admin (email or Slack)
    await notifyAdmin({
      jobName,
      jobId,
      error: error instanceof Error ? error.message : 'Unknown',
      duration,
    });

    return NextResponse.json(
      {
        success: false,
        jobId,
        jobName,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

---

## Individual Cron Jobs Logging

### 1. scan-market (Market Data Refresh)

```typescript
// src/app/api/cron/scan-market/route.ts

const jobName = 'scan-market';

logger.info(`${jobName} - fetching MF NAVs`, { jobId });
const mfCount = await fetchAndUpsertMutualFunds();
logger.debug(`${jobName} - MF NAV update complete`, {
  jobId,
  mfCount,
  nextUpdate: 'tomorrow 9 PM',
});

logger.info(`${jobName} - fetching stock prices`, { jobId });
const stockCount = await fetchAndUpsertStocks();
logger.debug(`${jobName} - stock price update complete`, {
  jobId,
  stockCount,
  nextUpdate: 'every 15 minutes',
});

logger.info(`${jobName} - fetching FD rates`, { jobId });
const fdCount = await fetchAndUpsertFDRates();
logger.debug(`${jobName} - FD rate update complete`, {
  jobId,
  fdCount,
  nextUpdate: 'weekly Sunday',
});
```

### 2. check-goals (Goal Progress Checker)

```typescript
// src/app/api/cron/check-goals/route.ts

const jobName = 'check-goals';
let alertsCreated = 0;
let goalsCompleted = 0;

const allUsers = await db.user.findMany();
logger.info(`${jobName} - checking ${allUsers.length} users`, { jobId });

for (const user of allUsers) {
  const goals = await db.goal.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
  });

  logger.debug(`${jobName} - user ${user.id} has ${goals.length} goals`, {
    jobId,
    userId: user.id,
  });

  for (const goal of goals) {
    const expectedValue = calculateExpectedValue(goal);
    const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / 86400000);
    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    if (progress >= 100) {
      // Mark complete
      await db.goal.update({ where: { id: goal.id }, data: { status: 'COMPLETED', completedAt: new Date() } });
      await createAlert({
        userId: user.id,
        type: 'GOAL_COMPLETED',
        title: `Goal Complete: ${goal.name}`,
        message: `You've reached ₹${formatINR(goal.targetAmount)} for ${goal.name}!`,
        data: { goalId: goal.id, deepLink: `/goals/${goal.id}` },
      });
      goalsCompleted++;
      logger.info(`${jobName} - goal completed`, {
        jobId,
        userId: user.id,
        goalId: goal.id,
        goalName: goal.name,
        amount: goal.targetAmount,
      });
    } else if (progress < expectedValue - 20) {
      // At risk
      await createAlert({
        userId: user.id,
        type: 'GOAL_AT_RISK',
        title: `Goal at Risk: ${goal.name}`,
        message: `Progress is behind schedule. Current: ${progress.toFixed(1)}%, Expected: ${expectedValue.toFixed(1)}%`,
        data: { goalId: goal.id, deepLink: `/goals/${goal.id}` },
      });
      alertsCreated++;
      logger.warn(`${jobName} - goal at risk`, {
        jobId,
        userId: user.id,
        goalId: goal.id,
        goalName: goal.name,
        progress: progress.toFixed(1),
        expected: expectedValue.toFixed(1),
        daysLeft,
      });
    } else {
      logger.debug(`${jobName} - goal on track`, {
        jobId,
        userId: user.id,
        goalId: goal.id,
        progress: progress.toFixed(1),
        daysLeft,
      });
    }
  }
}

logger.info(`${jobName} - check complete`, {
  jobId,
  usersChecked: allUsers.length,
  alertsCreated,
  goalsCompleted,
  duration: `${Date.now() - startTime}ms`,
});
```

### 3. check-alerts (Alert Condition Checker)

```typescript
// src/app/api/cron/check-alerts/route.ts

const jobName = 'check-alerts';
let alertsCreatedByType = {};

const allUsers = await db.user.findMany();
logger.info(`${jobName} - scanning ${allUsers.length} users`, { jobId });

for (const user of allUsers) {
  // EMI Completion Check
  const completedEmis = await db.expense.findMany({
    where: { userId: user.id, isEMI: true, emiMonthsLeft: 0 },
  });
  for (const emi of completedEmis) {
    const alert = await createAlert({
      userId: user.id,
      type: 'EMI_COMPLETED',
      title: `${emi.name} Paid Off!`,
      message: `₹${formatINR(emi.amount)}/month is now free. Redirect to corpus?`,
      data: { deepLink: '/finances', freedAmount: emi.amount },
    });
    alertsCreatedByType['EMI_COMPLETED'] = (alertsCreatedByType['EMI_COMPLETED'] || 0) + 1;
    logger.info(`${jobName} - EMI completed`, {
      jobId,
      userId: user.id,
      emiId: emi.id,
      amount: emi.amount,
    });
  }

  // Insurance Renewal Check
  const insurances = await db.insurance.findMany({
    where: { userId: user.id, status: 'ACTIVE' },
  });
  for (const ins of insurances) {
    if (!ins.nextDueDate) continue;
    const daysUntilRenewal = Math.ceil((ins.nextDueDate.getTime() - Date.now()) / 86400000);
    if (daysUntilRenewal === 30 || daysUntilRenewal === 7) {
      await createAlert({
        userId: user.id,
        type: 'INSURANCE_PREMIUM_DUE',
        title: `Insurance Renewal in ${daysUntilRenewal} days`,
        message: `${ins.type} premium ₹${formatINR(ins.premium)} due on ${ins.nextDueDate.toLocaleDateString()}`,
        data: { insuranceId: ins.id, deepLink: '/insurance' },
      });
      alertsCreatedByType['INSURANCE_PREMIUM_DUE'] = (alertsCreatedByType['INSURANCE_PREMIUM_DUE'] || 0) + 1;
      logger.info(`${jobName} - insurance renewal reminder`, {
        jobId,
        userId: user.id,
        insuranceId: ins.id,
        type: ins.type,
        daysLeft: daysUntilRenewal,
      });
    }
  }

  // Tax Deadline Check
  const today = new Date();
  if (today.getMonth() === 10 && today.getDate() === 1) { // Nov 1
    await createAlert({
      userId: user.id,
      type: 'TAX_SAVING_LIMIT',
      title: 'Last 2 Months for Tax Saving!',
      message: 'Invest in 80C to reduce tax liability before year-end',
      data: { deepLink: '/tax' },
    });
    alertsCreatedByType['TAX_SAVING_LIMIT'] = (alertsCreatedByType['TAX_SAVING_LIMIT'] || 0) + 1;
  }
}

logger.info(`${jobName} - check complete`, {
  jobId,
  usersScanned: allUsers.length,
  alertsByType: alertsCreatedByType,
  totalAlerts: Object.values(alertsCreatedByType).reduce((a, b) => a + b, 0),
  duration: `${Date.now() - startTime}ms`,
});
```

### 4. check-portfolio (Rebalancing Checker)

```typescript
// src/app/api/cron/check-portfolio/route.ts

const jobName = 'check-portfolio';
let rebalanceAlerts = 0;

const allUsers = await db.user.findMany();
logger.info(`${jobName} - checking allocation for ${allUsers.length} users`, { jobId });

for (const user of allUsers) {
  const corpus = await db.corpus.findUnique({ where: { userId: user.id } });
  if (!corpus) {
    logger.debug(`${jobName} - user has no corpus`, { jobId, userId: user.id });
    continue;
  }

  const investments = await db.investment.findMany({
    where: { userId: user.id, status: 'ACTIVE', isCorpus: true },
  });

  const allocation = calculateAllocation(investments);
  const targetAllocation = CORPUS_RETURNS[user.riskLevel];

  for (const assetClass of ['equity', 'debt', 'gold']) {
    const drift = Math.abs(allocation[assetClass] - targetAllocation[assetClass]);
    if (drift > 5) {
      await createAlert({
        userId: user.id,
        type: 'REBALANCE_NEEDED',
        title: `Portfolio Rebalancing Needed`,
        message: `${assetClass} is ${allocation[assetClass]}%, target is ${targetAllocation[assetClass]}%`,
        data: { deepLink: '/investments', drift, assetClass },
      });
      rebalanceAlerts++;
      logger.warn(`${jobName} - rebalancing alert`, {
        jobId,
        userId: user.id,
        assetClass,
        current: allocation[assetClass],
        target: targetAllocation[assetClass],
        drift,
      });
    }
  }
}

logger.info(`${jobName} - check complete`, {
  jobId,
  usersChecked: allUsers.length,
  rebalanceAlertsCreated: rebalanceAlerts,
  duration: `${Date.now() - startTime}ms`,
});
```

---

## Log Levels Guide

```
DEBUG  : Detailed info useful for developers (every item processed, calculations)
INFO   : Key events (job started, completed, items count)
WARN   : Expected errors (goal at risk, rebalance needed, rate limit approaching)
ERROR  : Unexpected errors (API failure, database connection error, crash)
```

---

## Monitoring & Alerting

### Alert on Critical Errors

```typescript
// src/lib/logger-alerts.ts

export async function notifyAdminOnError({
  jobName,
  jobId,
  error,
  duration,
}: {
  jobName: string;
  jobId: string;
  error: string;
  duration: number;
}) {
  // Send Slack notification
  await fetch('https://hooks.slack.com/services/YOUR/WEBHOOK', {
    method: 'POST',
    body: JSON.stringify({
      text: `🚨 Cron Job Failed: ${jobName}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Job:* ${jobName}\n*Error:* ${error}\n*Duration:* ${duration}ms\n*ID:* ${jobId}`,
          },
        },
      ],
    }),
  });

  // Log to error tracking service (e.g., Sentry)
  if (process.env.SENTRY_DSN) {
    // Sentry integration here
  }
}
```

### Log Retention Policy

```
Console Logs   : Live during execution
File Logs      : Keep 10 rotated files, 5MB each
Archive        : Move old logs to cold storage after 30 days
Retention      : 90 days for all logs
Cleanup        : Automated nightly job at 2 AM UTC
```

---

## Log Queries (for debugging)

```bash
# Tail all logs (dev)
tail -f logs/combined.log | grep "scan-market"

# Count alerts created by job
grep "GOAL_COMPLETED" logs/combined.log | wc -l

# Find slow jobs
grep "duration" logs/combined.log | awk -F'"' '{print $(NF-1)}' | sort -r | head -5

# Error analysis
grep "ERROR" logs/error.log | jq '.message'
```

---

## Environment Variables for Logging

```env
# .env.local
LOG_LEVEL=debug              # dev
LOG_LEVEL=info               # production
LOG_FORMAT=json              # machine-readable
LOG_RETENTION_DAYS=90
SENTRY_DSN=                  # Optional: error tracking
SLACK_WEBHOOK_URL=           # Optional: error notifications
```


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
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhookUrl) {
    try {
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: `Cron job failed: ${jobName}`,
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
    } catch {
      // best-effort notification only
    }
  }

  if (process.env.SENTRY_DSN) {
    console.error(`[Sentry placeholder] ${jobName}`, { jobId, error, duration });
  }
}
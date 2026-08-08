export const ADMIN_EMAILS: string[] = [
  'demo@dhanai.com',
  'user@dhanai.com',
  'admin@dhanai.com',
  ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) : []),
  ...(process.env.ADMIN_EMAIL_1 ? [process.env.ADMIN_EMAIL_1.trim().toLowerCase()] : []),
];

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

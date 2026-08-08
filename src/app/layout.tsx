import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/shared/providers';


export const metadata: Metadata = {
  title: { default: 'DhanAI', template: '%s | DhanAI' },
  description: 'AI-powered personal finance and investment advisor for India',
  keywords: ['investment', 'finance', 'India', 'SIP', 'mutual fund', 'tax', 'AI'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='font-sans'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


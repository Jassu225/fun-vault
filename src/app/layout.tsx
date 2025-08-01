import type { Metadata } from 'next';
import '@/styles/globals.css';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Fun-Vault - Neon Gaming Hub',
  description: 'A cyberpunk-themed digital arcade for classic strategy games',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="cyber-grid"></div>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

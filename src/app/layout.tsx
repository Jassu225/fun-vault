import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fun-Vault - Neon Gaming Hub',
  description: 'A cyberpunk-themed digital arcade for classic strategy games',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="cyber-grid"></div>
        {children}
      </body>
    </html>
  )
} 
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FestoWeb CRM',
  description: 'Agency CRM for FestoWeb',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#e8e8e8', border: '1px solid #2e2e2e' },
            duration: 3000,
          }}
        />
      </body>
    </html>
  )
}

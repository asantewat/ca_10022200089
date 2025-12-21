import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { CartProvider } from '../contexts/CartContext'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'T-Tech & Appliances - Reliable tech for Ghana',
  description: 'T-Tech & Appliances — cloud e-commerce for reliable tech, mobile devices and appliances for Ghanaian students and professionals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
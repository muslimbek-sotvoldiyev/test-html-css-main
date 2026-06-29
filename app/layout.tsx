import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'nice-next-app',
  description: 'Created with muslimbek',
  generator: 'muslimbek.fn1-fullstack.uz',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

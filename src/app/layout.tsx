import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VideoLang Pro - AI Video Language Converter',
  description: 'Professional AI-powered video language conversion with multi-speaker support. Convert videos to 20+ languages with perfect voice matching.',
  keywords: 'video translation, AI voice, language converter, video dubbing, multilingual content',
  authors: [{ name: 'VideoLang Pro Team' }],
  openGraph: {
    title: 'VideoLang Pro - AI Video Language Converter',
    description: 'Convert videos to different languages with AI-powered transcription and voice generation',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
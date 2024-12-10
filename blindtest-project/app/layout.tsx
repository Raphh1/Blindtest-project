// app/layout.tsx
import "./globals.css";
import { Inter } from 'next/font/google'
import { AuthProvider } from "./providers/AuthProvider";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blindtest App',
  description: 'Blindtest game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-zinc-900 text-zinc-200`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

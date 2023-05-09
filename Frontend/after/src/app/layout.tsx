'use client';
import { RecoilRoot } from 'recoil';
import './globals.css';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from './lib/registry';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'If I Die Tomorrow After',
  description: 'After page of If I Die Tomorrow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}><StyledComponentsRegistry><RecoilRoot>{children}</RecoilRoot></StyledComponentsRegistry></body>
      </html>
  )
}

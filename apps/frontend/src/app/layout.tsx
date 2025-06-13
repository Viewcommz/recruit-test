import React from 'react';
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'AI 개발 테스트 - VIEWCOMMZ',
    description: 'AI를 활용한 빠른 프로토타이핑 능력 평가',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    )
} 
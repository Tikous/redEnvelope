import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '红包系统 - 基于区块链的红包发送和抢夺',
  description: '使用区块链技术实现的去中心化红包系统，支持发送和抢夺红包',
  keywords: '红包,区块链,以太坊,Web3,DApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 
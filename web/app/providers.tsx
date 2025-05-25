'use client';

import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/lib/wagmi';

// 配置QueryClient，添加错误处理和重试机制
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5分钟
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          options={{
            hideBalance: false,
            hideTooltips: false,
            hideQuestionMarkCTA: true,
            hideNoWalletCTA: false,
            walletConnectCTA: 'link',
            enforceSupportedChains: false,
            embedGoogleFonts: true,
            truncateLongENSAddress: true,
            walletConnectName: '其他钱包',
            disclaimer: (
              <div style={{ padding: '12px', fontSize: '14px' }}>
                连接钱包即表示您同意使用本应用。请确保您连接的是正确的网络 (Localhost:7545)。
              </div>
            ),
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
import { getDefaultConfig } from 'connectkit';
import { createConfig } from 'wagmi';
import { mainnet, sepolia, localhost } from 'wagmi/chains';

const chains = [mainnet, sepolia, localhost] as const;

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains,
    
    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // Required App Info
    appName: '红包系统',
    appDescription: '基于区块链的红包发送和抢夺系统',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
} 
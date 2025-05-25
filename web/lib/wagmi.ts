import { getDefaultConfig } from 'connectkit';
import { createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

// 自定义localhost链配置，使用7545端口
const localhost = defineChain({
  id: 1337,
  name: 'Localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545'],
    },
    public: {
      http: ['http://127.0.0.1:7545'],
    },
  },
  testnet: true,
});

const chains = [localhost, sepolia, mainnet] as const;

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains,
    
    // Required API Keys - 设置为空字符串以禁用WalletConnect
    walletConnectProjectId: '',

    // Required App Info
    appName: '红包系统',
    appDescription: '基于区块链的红包发送和抢夺系统',
    appUrl: 'http://localhost:3000',
    appIcon: 'https://via.placeholder.com/512x512.png',
    
    // 添加传输配置
    transports: {
      [localhost.id]: http('http://127.0.0.1:7545', {
        timeout: 10000,
        retryCount: 3,
        retryDelay: 1000,
      }),
      [sepolia.id]: http('https://rpc.sepolia.org', {
        timeout: 10000,
        retryCount: 3,
        retryDelay: 1000,
      }),
      [mainnet.id]: http('https://cloudflare-eth.com', {
        timeout: 10000,
        retryCount: 3,
        retryDelay: 1000,
      }),
    },
  }),
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
} 
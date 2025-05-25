'use client';

import React from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Network } from 'lucide-react';

export function NetworkStatus() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // 目标网络ID (localhost)
  const targetChainId = 1337;

  if (!isConnected) {
    return null;
  }

  const isCorrectNetwork = chainId === targetChainId;

  const getNetworkName = (id: number) => {
    switch (id) {
      case 1: return 'Ethereum 主网';
      case 11155111: return 'Sepolia 测试网';
      case 1337: return 'Localhost (7545)';
      default: return `网络 ${id}`;
    }
  };

  if (isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
        <CheckCircle className="w-4 h-4" />
        <span>已连接到 {getNetworkName(chainId)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <AlertTriangle className="w-5 h-5 text-yellow-600" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-800">
          网络不匹配
        </p>
        <p className="text-xs text-yellow-600">
          当前: {getNetworkName(chainId)} | 需要: {getNetworkName(targetChainId)}
        </p>
      </div>
      <Button
        onClick={() => switchChain({ chainId: targetChainId })}
        className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 text-sm"
      >
        <Network className="w-4 h-4" />
        切换网络
      </Button>
    </div>
  );
} 
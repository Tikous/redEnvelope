'use client';

import React, { useState, useEffect } from 'react';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useDisconnect, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { LogOut, Wallet, ChevronDown, AlertCircle } from 'lucide-react';

export function WalletConnection() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await disconnect();
    } catch (err) {
      console.error('断开连接失败:', err);
      setError('断开连接失败，请刷新页面重试');
    }
  };

  // 清除错误状态
  useEffect(() => {
    if (isConnected) {
      setError(null);
    }
  }, [isConnected]);

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <span className="text-sm text-red-700">{error}</span>
        <Button
          onClick={() => setError(null)}
          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white"
        >
          关闭
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <div className="flex items-center gap-2">
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={show}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                    disabled={isConnecting || isReconnecting}
                  >
                    <Wallet className="w-4 h-4" />
                    <span>{ensName ?? formatAddress(address || '')}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1 text-red-600 border border-red-300 hover:bg-red-50 bg-white px-2 py-1 text-sm"
                    title="断开连接"
                    disabled={isConnecting || isReconnecting}
                  >
                    <LogOut className="w-4 h-4" />
                    断开
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={show}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                  disabled={isConnecting || isReconnecting}
                >
                  <Wallet className="w-4 h-4" />
                  {isConnecting || isReconnecting ? '连接中...' : '连接钱包'}
                </Button>
              )}
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
} 
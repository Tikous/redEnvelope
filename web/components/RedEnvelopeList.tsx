'use client';

import React, { useState } from 'react';
import { useReadContract } from 'wagmi';
import { RedEnvelopeCard } from './RedEnvelopeCard';
import { RED_ENVELOPE_FACTORY_ABI, RED_ENVELOPE_FACTORY_ADDRESS } from '@/lib/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Gift } from 'lucide-react';

interface RedEnvelopeListProps {
  onGrabSuccess?: (amount: string) => void;
}

export function RedEnvelopeList({ onGrabSuccess }: RedEnvelopeListProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // 获取所有红包地址
  const { data: envelopes, isLoading, refetch } = useReadContract({
    address: RED_ENVELOPE_FACTORY_ADDRESS,
    abi: RED_ENVELOPE_FACTORY_ABI,
    functionName: 'getAllRedEnvelopes',
    query: {
      refetchInterval: 10000, // 每10秒自动刷新
    },
  });

  const handleRefresh = () => {
    refetch();
    setRefreshKey(prev => prev + 1);
  };

  const handleGrabSuccess = (amount: string) => {
    onGrabSuccess?.(amount);
    // 延迟刷新，让交易有时间确认
    setTimeout(() => {
      refetch();
    }, 2000);
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-2 text-gray-600">加载红包中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-card border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Gift className="w-6 h-6" />
              可抢红包 ({envelopes?.length || 0})
            </CardTitle>
            <Button
              onClick={handleRefresh}
              className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        </CardHeader>
      </Card>

      {!envelopes || envelopes.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🧧</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              暂无红包
            </h3>
            <p className="text-gray-500">
              还没有人发红包，快来发第一个红包吧！
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {envelopes.map((address, index) => (
            <RedEnvelopeCard
              key={`${address}-${refreshKey}-${index}`}
              address={address as `0x${string}`}
              onGrabSuccess={handleGrabSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
} 
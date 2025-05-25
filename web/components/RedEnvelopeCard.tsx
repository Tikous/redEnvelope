'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RED_ENVELOPE_ABI } from '@/lib/contracts';
import { formatETH, shortenAddress, formatTime, getRandomEmoji } from '@/lib/utils';
import { Gift, Users, Clock, Wallet } from 'lucide-react';

interface RedEnvelopeCardProps {
  address: `0x${string}`;
  onGrabSuccess?: (amount: string) => void;
}

export function RedEnvelopeCard({ address, onGrabSuccess }: RedEnvelopeCardProps) {
  const { address: userAddress } = useAccount();
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [grabResult, setGrabResult] = useState<string | null>(null);

  // 读取红包信息
  const { data: envelopeInfo, refetch: refetchInfo } = useReadContract({
    address,
    abi: RED_ENVELOPE_ABI,
    functionName: 'getEnvelopeInfo',
  });

  // 检查用户是否已经抢过
  const { data: isGrabbed } = useReadContract({
    address,
    abi: RED_ENVELOPE_ABI,
    functionName: 'isGrabbed',
    args: userAddress ? [userAddress] : undefined,
  });

  // 获取用户抢到的金额
  const { data: grabbedAmount } = useReadContract({
    address,
    abi: RED_ENVELOPE_ABI,
    functionName: 'grabbedAmount',
    args: userAddress ? [userAddress] : undefined,
  });

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && grabbedAmount) {
      const amount = formatETH(grabbedAmount);
      setGrabResult(amount);
      setIsGrabbing(false);
      onGrabSuccess?.(amount);
      refetchInfo();
    }
  }, [isConfirmed, grabbedAmount, onGrabSuccess, refetchInfo]);

  if (!envelopeInfo) {
    return (
      <Card className="glass-card animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const [host, totalAmount, envelopeCount, remainingCount, theme, isEqual, isActive, createdAt] = envelopeInfo;

  const handleGrab = async () => {
    if (!userAddress) return;
    
    setIsGrabbing(true);
    try {
      writeContract({
        address,
        abi: RED_ENVELOPE_ABI,
        functionName: 'grabEnvelope',
      });
    } catch (error) {
      console.error('抢红包失败:', error);
      setIsGrabbing(false);
    }
  };

  const canGrab = userAddress && isActive && remainingCount > 0 && !isGrabbed;

  return (
    <Card className={`red-envelope text-white overflow-hidden ${!isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center gap-2">
            {getRandomEmoji()} {theme || '红包'}
          </span>
          <span className="text-sm opacity-80">
            {isEqual ? '平分' : '拼手气'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span>{formatETH(totalAmount)} ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{Number(remainingCount)}/{Number(envelopeCount)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            <span>{shortenAddress(host)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formatTime(Number(createdAt))}</span>
          </div>
        </div>

        {/* 抢红包结果显示 */}
        {isGrabbed && grabbedAmount && (
          <div className="bg-yellow-400 text-red-800 p-3 rounded-lg text-center font-bold">
            🎉 恭喜！你抢到了 {formatETH(grabbedAmount)} ETH
          </div>
        )}

        {/* 红包状态显示 */}
        {!isActive && (
          <div className="bg-gray-600 p-3 rounded-lg text-center">
            红包已被抢完
          </div>
        )}

        {/* 抢红包按钮 */}
        {canGrab && (
          <Button
            onClick={handleGrab}
            disabled={isGrabbing || isConfirming}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-red-800 font-bold py-3 text-lg h-12"
          >
            {isGrabbing || isConfirming ? '抢夺中...' : '抢红包 🧧'}
          </Button>
        )}

        {/* 未连接钱包提示 */}
        {!userAddress && isActive && (
          <div className="text-center text-yellow-200">
            请先连接钱包才能抢红包
          </div>
        )}

        {/* 已抢过提示 */}
        {userAddress && isGrabbed && (
          <div className="text-center text-yellow-200">
            你已经抢过这个红包了
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
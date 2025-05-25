'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RED_ENVELOPE_FACTORY_ABI, RED_ENVELOPE_FACTORY_ADDRESS } from '@/lib/contracts';
import { parseETH } from '@/lib/utils';
import { Send, Gift, Users, DollarSign } from 'lucide-react';

interface CreateEnvelopeFormProps {
  onSuccess?: (address: string) => void;
}

export function CreateEnvelopeForm({ onSuccess }: CreateEnvelopeFormProps) {
  const { address: userAddress } = useAccount();
  const [formData, setFormData] = useState({
    amount: '',
    count: '',
    theme: '',
    isEqual: true,
  });
  const [isCreating, setIsCreating] = useState(false);

  const { writeContract, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isConfirmed) {
      setIsCreating(false);
      setFormData({ amount: '', count: '', theme: '', isEqual: true });
      onSuccess?.('红包创建成功！');
    }
  }, [isConfirmed, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userAddress) {
      alert('请先连接钱包');
      return;
    }

    if (!formData.amount || !formData.count || !formData.theme) {
      alert('请填写完整信息');
      return;
    }

    const amount = parseFloat(formData.amount);
    const count = parseInt(formData.count);

    if (amount <= 0 || count <= 0) {
      alert('金额和数量必须大于0');
      return;
    }

    setIsCreating(true);

    try {
      writeContract({
        address: RED_ENVELOPE_FACTORY_ADDRESS,
        abi: RED_ENVELOPE_FACTORY_ABI,
        functionName: 'createRedEnvelope',
        args: [BigInt(count), formData.isEqual, formData.theme],
        value: parseETH(formData.amount),
      });
    } catch (error) {
      console.error('创建红包失败:', error);
      setIsCreating(false);
      alert('创建红包失败，请重试');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="glass-card border-2 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <Send className="w-6 h-6" />
          发送红包
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 红包金额 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4" />
              红包总金额 (ETH)
            </label>
            <Input
              type="number"
              step="0.001"
              placeholder="0.1"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className="text-lg"
            />
          </div>

          {/* 红包数量 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="w-4 h-4" />
              红包数量
            </label>
            <Input
              type="number"
              min="1"
              placeholder="5"
              value={formData.count}
              onChange={(e) => handleInputChange('count', e.target.value)}
              className="text-lg"
            />
          </div>

          {/* 红包主题 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Gift className="w-4 h-4" />
              红包主题
            </label>
            <Input
              type="text"
              placeholder="新年快乐！"
              value={formData.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="text-lg"
            />
          </div>

          {/* 分配方式 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">分配方式</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="distribution"
                  checked={formData.isEqual}
                  onChange={() => handleInputChange('isEqual', true)}
                  className="text-red-600"
                />
                <span className="text-sm">平分红包</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="distribution"
                  checked={!formData.isEqual}
                  onChange={() => handleInputChange('isEqual', false)}
                  className="text-red-600"
                />
                <span className="text-sm">拼手气红包</span>
              </label>
            </div>
          </div>

          {/* 预览信息 */}
          {formData.amount && formData.count && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">红包预览</h4>
              <div className="text-sm text-red-700 space-y-1">
                <p>总金额: {formData.amount} ETH</p>
                <p>红包数量: {formData.count} 个</p>
                {formData.isEqual && (
                  <p>每个红包: {(parseFloat(formData.amount) / parseInt(formData.count)).toFixed(4)} ETH</p>
                )}
                <p>分配方式: {formData.isEqual ? '平分' : '拼手气'}</p>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <Button
            type="submit"
            disabled={isCreating || isConfirming || !userAddress}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg h-12"
          >
            {isCreating || isConfirming ? '创建中...' : '发送红包 🧧'}
          </Button>

          {!userAddress && (
            <p className="text-center text-gray-500 text-sm">
              请先连接钱包才能发送红包
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 
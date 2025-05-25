'use client';

import React, { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { NetworkStatus } from '@/components/NetworkStatus';
import { CreateEnvelopeForm } from '@/components/CreateEnvelopeForm';
import { RedEnvelopeList } from '@/components/RedEnvelopeList';
import { Notification } from '@/components/Notification';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Plus, List } from 'lucide-react';

type NotificationType = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCreateSuccess = (message: string) => {
    addNotification(message, 'success');
    setActiveTab('list');
  };

  const handleGrabSuccess = (amount: string) => {
    addNotification(`🎉 恭喜！你抢到了 ${amount} ETH`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <header className="bg-white/80 backdrop-blur-sm border-b border-red-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🧧</div>
              <div>
                <h1 className="text-2xl font-bold text-red-700">红包系统</h1>
                <p className="text-sm text-red-600">基于区块链的红包发送和抢夺</p>
              </div>
            </div>
            <WalletConnection />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <NetworkStatus />
        </div>
        
        <Card className="glass-card mb-8">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <Button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-6 py-3 ${
                  activeTab === 'list'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                }`}
              >
                <List className="w-4 h-4" />
                抢红包
              </Button>
              <Button
                onClick={() => setActiveTab('create')}
                className={`flex items-center gap-2 px-6 py-3 ${
                  activeTab === 'create'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-red-600 border border-red-300 hover:bg-red-50'
                }`}
              >
                <Plus className="w-4 h-4" />
                发红包
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {activeTab === 'list' ? (
            <RedEnvelopeList onGrabSuccess={handleGrabSuccess} />
          ) : (
            <div className="max-w-md mx-auto">
              <CreateEnvelopeForm onSuccess={handleCreateSuccess} />
            </div>
          )}
        </div>

        <Card className="glass-card mt-12">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              使用说明
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">发红包</h4>
                <ul className="space-y-1">
                  <li>• 连接你的钱包</li>
                  <li>• 填写红包金额、数量和主题</li>
                  <li>• 选择平分或拼手气模式</li>
                  <li>• 确认交易发送红包</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">抢红包</h4>
                <ul className="space-y-1">
                  <li>• 连接你的钱包</li>
                  <li>• 在红包列表中选择红包</li>
                  <li>• 点击"抢红包"按钮</li>
                  <li>• 确认交易即可获得红包</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-red-200 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>基于区块链技术的去中心化红包系统</p>
        </div>
      </footer>
    </div>
  );
} 
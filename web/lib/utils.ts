import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatEther, parseEther } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatETH(value: bigint, decimals: number = 4): string {
  const formatted = formatEther(value);
  return parseFloat(formatted).toFixed(decimals);
}

export function parseETH(value: string): bigint {
  return parseEther(value);
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('zh-CN');
}

export function getRandomEmoji(): string {
  const emojis = ['🧧', '💰', '🎉', '🎊', '✨', '🌟', '💎', '🎁'];
  return emojis[Math.floor(Math.random() * emojis.length)];
} 
// hooks/useWallet.ts
import { useCallback, useState } from 'react';

interface WalletData {
  walletId: number;
  currentBalance: number;
  currency: string;
  status: string;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);

  const setWalletData = useCallback((walletData: WalletData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletData', JSON.stringify(walletData));
      setWallet(walletData);
    }
  }, []);

  const getWalletData = useCallback((): WalletData | null => {
    if (typeof window !== 'undefined') {
      const walletData = localStorage.getItem('walletData');
      return walletData ? (JSON.parse(walletData) as WalletData) : null;
    }
    return null;
  }, []);

  const clearWalletData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletData');
      setWallet(null);
    }
  }, []);

  return {
    setWalletData,
    getWalletData,
    clearWalletData,
    wallet,
  };
};

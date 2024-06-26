"use client";

import { useEffect, useCallback, useState } from 'react';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Overview } from '@/components/overview';
import { RecentSales } from '@/components/recent-sales';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreditCard from '@/components/wallet/dashboard/creditcard';
import WalletBalanceCard from '@/components/wallet/dashboard/balance';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { getAllWallets } from '@/services/wallet';
import QrCard from '@/components/wallet/dashboard/QrCard';
import KYCIncomplete from '@/components/wallet/dashboard/KycIncomplete'; 

const WalletSkeleton = () => (
  <Card className="w-full h-full">
    <CardHeader>
      <Skeleton className="h-6 w-1/2" />
    </CardHeader>
    <CardContent className="grid gap-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { getToken, getUserData } = useAuth();
  const { setWalletData, getWalletData } = useWallet();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const userData = getUserData();

  const fetchWalletData = useCallback(async () => {
    try {
      const token = getToken();
      if (token) {
        const wallets = await getAllWallets(token);
        if (wallets.length > 0) {
          setWalletData(wallets[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wallets', error);
    }
  }, [getToken, setWalletData]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  useEffect(() => {
    if (paymentSuccess) {
      fetchWalletData();
      setPaymentSuccess(false);
    }
  }, [paymentSuccess, fetchWalletData]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  const wallet = getWalletData();

  if (!userData || (!userData.kycCompleted && !userData.kybCompleted)) {
    return <KYCIncomplete />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-6 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
            <CreditCard />
            {wallet ? (
              <WalletBalanceCard walletData={wallet} onPaymentSuccess={handlePaymentSuccess} />
            ) : (
              <WalletSkeleton />
            )}
            {/* <QrCard /> */}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}


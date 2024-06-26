"use client";

import BreadCrumb from '@/components/breadcrumb';
import { TransactionTable } from '@/components/wallet/transactions/table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import React from 'react';

const breadcrumbItems = [{ title: 'Transactions', link: '/dashboard/transactions' }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page({ searchParams }: ParamsProps) {
  const { getUserData } = useAuth();
  const { getWalletData } = useWallet();

  const userData = getUserData();
  const walletData = getWalletData();

  if (!userData || !walletData) {
    return <div>Loading...</div>; 
  }

  const userId = userData._id;
  const walletId = walletData.walletId;

  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title="Transactions" description="Manage transactions" />
        </div>
        <Separator />
        <TransactionTable
          userId={userId}
          walletId={walletId}
          searchKey="transactionId"
        />
      </div>
    </>
  );
}

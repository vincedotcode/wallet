// components/WalletBalanceCard.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopUpDialog from '@/components/modal/topup-modal';
import CreditCardModal from '@/components/modal/creditcard-modal';

interface WalletBalanceCardProps {
  walletData: {
    walletId: number;
    currentBalance: number;
    currency: string;
    status: string;
  };
  onPaymentSuccess: () => void; // Callback function to notify parent of payment success
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ walletData, onPaymentSuccess }) => {
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false);
  const [isCreditCardModalOpen, setIsCreditCardModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleTopUpClick = () => {
    setIsTopUpDialogOpen(true);
  };

  const handleTopUpDialogClose = () => {
    setIsTopUpDialogOpen(false);
  };

  const handleTopUpConfirm = (amount: number) => {
    setSelectedAmount(amount);
    setIsTopUpDialogOpen(false);
    setIsCreditCardModalOpen(true);
  };

  const handleCreditCardModalClose = () => {
    setIsCreditCardModalOpen(false);
  };

  const handleTopUpSuccess = (amount: number) => {
    onPaymentSuccess(); // Notify parent of payment success
    setIsCreditCardModalOpen(false);
  };

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>E-Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Wallet Balance</span>
              <span className="font-medium">{walletData.currency} {walletData.currentBalance || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Credit Balance</span>
              <span className="font-medium">{walletData.currency} 0.00</span>
            </div>
          </div>
          <div className="grid gap-4 sm:flex sm:items-center sm:gap-2">
            <Button className="w-full sm:w-auto" onClick={handleTopUpClick}>Deposit</Button>
            <Button className="w-full sm:w-auto" variant="outline" disabled>
              Change PIN
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" disabled>
              Replace
            </Button>
            <Button className="w-full sm:w-auto" variant="outline" disabled>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
      <TopUpDialog open={isTopUpDialogOpen} onConfirm={handleTopUpConfirm} onClose={handleTopUpDialogClose} />
      {selectedAmount !== null && (
        <CreditCardModal open={isCreditCardModalOpen} onClose={handleCreditCardModalClose} amount={selectedAmount} walletId={walletData.walletId} onSuccess={handleTopUpSuccess} />
      )}
    </>
  );
};

export default WalletBalanceCard;

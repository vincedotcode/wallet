import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TopUpDialogProps {
  onConfirm: (amount: number) => void;
  open: boolean;
  onClose: () => void;
}

const TopUpDialog: React.FC<TopUpDialogProps> = ({ onConfirm, open, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const amounts = [500, 250, 1000, 500, 200, 150, 100, 50, 30, 20, 10, 5, 1];

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleConfirm = () => {
    if (selectedAmount !== null) {
      onConfirm(selectedAmount);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Top Up Account</DialogTitle>
          <DialogDescription>Select an amount to add funds to your account.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 py-6">
          {amounts.map(amount => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              className="w-full"
              onClick={() => handleAmountClick(amount)}
            >
              ${amount}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

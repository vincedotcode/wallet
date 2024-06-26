import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScannedQRData } from "@/services/qrcode";
import { walletToWalletTransfer, WalletToWalletTransferRequest } from "@/services/wallet";
import { useAuth } from "@/hooks/useAuth"; // Assuming you have a custom hook for authentication
import { useWallet } from '@/hooks/useWallet';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
interface PaymentDetailsComponentProps {
  qrCodeData: ScannedQRData;
}

const PaymentDetailsComponent: React.FC<PaymentDetailsComponentProps> = ({ qrCodeData }) => {
  const [amount, setAmount] = useState(qrCodeData.amount ? qrCodeData.amount.toString() : '');
  const [description, setDescription] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { getUserData } = useAuth();
  const { getWalletData } = useWallet();
  const wallet = getWalletData();
  const user = getUserData();
  const router = useRouter();

  useEffect(() => {
    // Sanitize and parse metadata
    try {
      const metaData = JSON.parse(qrCodeData.metaData);
      setWebsiteName(metaData.websiteName || '');
    } catch (error) {
      console.error("Error parsing metadata:", error);
      setWebsiteName('');
    }
  }, [qrCodeData.metaData]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!wallet?.walletId || !user?._id) {
      setError('Wallet or User data is missing');
      setLoading(false);
      return;
    }

    const transferData: WalletToWalletTransferRequest = {
      walletFrom: wallet.walletId,
      walletTo: qrCodeData.walletId,
      amount: parseFloat(amount),
      userId: user._id,
      description,
      encodedQrCode: qrCodeData.qrCode,
    };

    try {
      await walletToWalletTransfer( transferData);
      setSuccess(true);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center bg-background h-full w-full">
        <div className="bg-card p-8 rounded-lg shadow-lg animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-green-500 text-green-50 rounded-full p-4 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Payment Successful</h2>
            <p className="text-muted-foreground">Your payment has been processed successfully.</p>
            <Button type="button" onClick={() => router.push('/wallet/dashboard')}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-background h-full w-full">
      <Card className="w-full h-full space-y-4">
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="payment-to">Payment To</Label>
            <Input id="payment-to" placeholder="John Doe" value={websiteName} readOnly />
          </div>
          {qrCodeData.qrType === 'STATIC' && (
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                placeholder="$99.99" 
                value={amount}
                disabled={qrCodeData.amount !== null}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter payment details" 
              rows={3} 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Confirming Payment...' : 'Confirm'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default PaymentDetailsComponent;

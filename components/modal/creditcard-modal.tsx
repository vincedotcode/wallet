// components/CreditCardModal.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/hooks/useAuth';
import { topUpWallet } from '@/services/wallet';
import confetti from "canvas-confetti";

interface CreditCardModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  walletId: number;
  onSuccess: (amount: number) => void; 
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ open, onClose, amount, walletId, onSuccess }) => {
  const { getToken } = useAuth();
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = getToken();
      if (token) {
        const [month, year] = expiryDate.split('/');
        const formattedExpiryDate = `20${year}-${month}-01T00:00:00`;

        const topUpData = {
          amount,
          walletId,
          topupType: "CARD",
          cardholder,
          cardNumber,
          cvv: parseInt(cvv, 10),
          expiryDate: formattedExpiryDate,
          description: 'Top up via credit card',
          billPhone: '59101883',
          billEmail: 'yogesh@zapproach.com',
          billCountry: 'USA',
          billCity: 'San Francisco',
          billState: 'San Francisco',
          billAddress: '123, Main St San Francisco CA 66801',
          billZip: '66801'
        };

        const response = await topUpWallet(token, topUpData);
        if (response.succeeded) {
          console.log('Top-up successful:', response.message);
          triggerConfetti();
          onSuccess(amount); // Pass the amount to the parent component
          onClose();
        } else {
          console.error('Top-up failed:', response.message);
        }
      }
    } catch (error) {
      console.error('Top-up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <div className="flex flex-col items-center gap-6 p-6 sm:p-8">
          <div className="flex flex-col items-center gap-1">
            <img src={"https://zakwallet.netlify.app/assets/media/svg/card-logos/subLogo.png"} alt="Service Provider" className="h-8 w-auto" />
            <h3 className="text-2xl font-semibold">Credit Card</h3>
            <p className="text-muted-foreground">Enter your payment details</p>
          </div>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Card Number</Label>
              <Input id="number" placeholder="4111 1111 1111 1111" type="tel" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" type="tel" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" type="tel" value={cvv} onChange={(e) => setCvv(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardModal;

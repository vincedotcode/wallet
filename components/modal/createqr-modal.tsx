'use client';

import React, { useState } from 'react';
import { createQRCode, CreateQRCodeRequest } from '@/services/qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Cross } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CreateQRCodeComponentProps {
  walletId: number;
  onSuccess: () => void;  // Callback function
}

const CreateQRCodeComponent: React.FC<CreateQRCodeComponentProps> = ({ walletId, onSuccess }) => {
  const [qrType, setQrType] = useState<string>('STATIC');
  const [amount, setAmount] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('');
  const [metadata, setMetadata] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const metadataKeys = ["websiteName", "LogoURL", "ColorCode", "ProductName", "ProductVariance"];

  const handleAddMetadata = () => {
    setMetadata([...metadata, { key: '', value: '' }]);
  };

  const handleRemoveMetadata = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };

  const handleMetadataChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedMetadata = metadata.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setMetadata(updatedMetadata);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const metaDataString = JSON.stringify(metadata.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}));

    const createQRCodeRequest: CreateQRCodeRequest = {
      qrType,
      amount: amount || 0,
      walletId,
      isTenant: true,
      description,
      metaData: metaDataString,
    };

    try {
      const response = await createQRCode(createQRCodeRequest);
      console.log('QR Code created:', response);
      toast({
        title: 'QR Code Created',
        variant: 'default',
        description: 'The QR code has been successfully created.',
      });
      onSuccess();  // Call the onSuccess callback function
    } catch (error) {
    
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'There was an error creating the QR code.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create QR Code</DialogTitle>
        <DialogDescription>Generate a static or dynamic QR code for your business.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-6 py-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select value={qrType} onValueChange={(value) => setQrType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STATIC">Static</SelectItem>
                <SelectItem value="DYNAMIC">Dynamic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {qrType === 'STATIC' && (
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" value={amount ?? ''} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Metadata</h3>
            <Button type="button" size="sm" variant="outline" onClick={handleAddMetadata}>
              <Plus className="h-4 w-4 mr-2" />
              Add Metadata
            </Button>
          </div>
          <div className="grid gap-4">
            {metadata.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4">
                <Select value={item.key} onValueChange={(value) => handleMetadataChange(index, 'key', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    {metadataKeys.map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input placeholder="Value" value={item.value} onChange={(e) => handleMetadataChange(index, 'value', e.target.value)} />
                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveMetadata(index)}>
                  <Cross className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Generate QR Code'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreateQRCodeComponent;

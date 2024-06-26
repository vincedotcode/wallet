'use client';

import React, { useState, useEffect } from 'react';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { getTenantCurrencyConfigurations, ConfigurationData } from '@/services/configurations';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import QRCodeTable from '@/components/cobrand/qrcode/qr-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateQRCodeComponent from '@/components/modal/createqr-modal';
import {
  Dialog,
  DialogTrigger,
  DialogContent
} from "@/components/ui/dialog"; // Import the Dialog components

const breadcrumbItems = [{ title: 'My QR Codes', link: '/cobrand/clients/qrcodes' }];

export default function MyQrCodes() {
    const [data, setData] = useState<ConfigurationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage the dialog open/close

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await getTenantCurrencyConfigurations();
            setData(response || []); // Ensure data is an array
        } catch (error) {
            console.error("Failed to fetch configurations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleQRCodeSuccess = () => {
        setIsDialogOpen(false); // Close the dialog
        fetchData(); // Refresh the data
    };

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading
                        title="My QR Codes"
                        description="Manage Your QR Codes"
                    />
                </div>

                <Separator />

                {loading ? (
                    <div>Loading...</div>
                ) : (
                    data.map(wallet => (
                        <div key={wallet.walletId} className="space-y-4">
                            <div className="flex items-start justify-between">
                                <Heading
                                    title={`QR for Currency ${wallet.currencyCode} Wallet`}
                                    description={`Wallet ID: ${wallet.walletId} - Current Balance: ${wallet.currentBalance}`}
                                />
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className={cn(buttonVariants({ variant: 'default' }))}
                                            onClick={() => {
                                                setSelectedWalletId(wallet.walletId);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add New
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        {selectedWalletId !== null && <CreateQRCodeComponent walletId={selectedWalletId} onSuccess={handleQRCodeSuccess} />}
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <QRCodeTable walletId={wallet.walletId} />
                            <Separator />
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
    );
}

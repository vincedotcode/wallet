'use client';

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';
import { retrieveQRCodeFromScannedCode, ScannedQRData } from '@/services/qrcode';
import PaymentDetailsComponent from './PaymentDetailsComponent'; // Import the payment details component

const QRCodeScannerComponent = () => {
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const qrBoxEl = useRef<HTMLDivElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const [scannedResult, setScannedResult] = useState<string | undefined>("");
    const [qrCodeData, setQrCodeData] = useState<ScannedQRData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const startScanner = () => {
        if (videoEl.current) {
            scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
                onDecodeError: onScanFail,
                preferredCamera: "environment",
                highlightScanRegion: true,
                highlightCodeOutline: true,
                overlay: qrBoxEl.current || undefined,
            });

            scanner.current.start()
                .then(() => setQrOn(true))
                .catch((err) => {
                    console.error(err);
                    setQrOn(false);
                });
        }
    };

    const stopScanner = () => {
        if (scanner.current) {
            scanner.current.stop();
            scanner.current = undefined;
        }
    };

    useEffect(() => {
        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const onScanSuccess = async (result: QrScanner.ScanResult) => {
        console.log(result);
        setScannedResult(result?.data);
        setLoading(true);
        try {
            const response = await retrieveQRCodeFromScannedCode(result?.data);
            setQrCodeData(response.data);
        } catch (error) {
            console.error('Error retrieving QR code details:', error);
        } finally {
            setLoading(false);
            stopScanner();
            setQrOn(false);
        }
    };

    const onScanFail = (err: string | Error) => {
        console.log(err);
    };

    const handleScanAgain = () => {
        window.location.reload(); // Reload the page
    };

    return (
        <div className="flex flex-col bg-background my-3">
            {loading ? (
                <p className="flex-1 flex items-center justify-center">Loading...</p>
            ) : (
                <>
                    {!qrCodeData ? (
                        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                            <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md">
                                <div className="flex flex-col items-center justify-center space-y-6">
                                    <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                                        {qrOn ? (
                                            <video ref={videoEl} className="w-full h-full object-cover"></video>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <QrCode className="w-20 h-20 text-muted-foreground" />
                                                <span className="sr-only">QR Code Scanner</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <h2 className="text-2xl font-bold">Scan a QR Code</h2>
                                        <p className="text-muted-foreground">Point your camera at a QR code to view its contents.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <PaymentDetailsComponent qrCodeData={qrCodeData} />
                            <div className="flex justify-center mt-4">
                                <Button onClick={handleScanAgain}>Scan Again</Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default QRCodeScannerComponent;

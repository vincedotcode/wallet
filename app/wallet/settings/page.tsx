"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import KYCDrivingLicense from "@/components/wallet/settings/KYC";
import { getOnboardingConfigurations, OnboardingConfiguration, getOnboardingDocuments, OnboardingDocument } from '@/services/onboarding';
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
    const [kycData, setKycData] = useState<OnboardingConfiguration[]>([]);
    const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
    const { getUserData } = useAuth();
    const userData = getUserData();
    const clientId = userData?._id;

    const fetchData = async () => {
        try {
            const data = await getOnboardingConfigurations();
            setKycData(data);
            if (clientId) {
                const onboardingDocs = await getOnboardingDocuments(clientId);
                setDocuments(onboardingDocs);
            }
        } catch (error) {
            console.error('Error fetching KYC data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [clientId]);

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <Tabs defaultValue="kyc" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="kyc">KYC</TabsTrigger>
                        <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                    </TabsList>
                    <TabsContent value="kyc">
                        <Card>
                            <CardHeader>
                                <CardTitle>KYC Details</CardTitle>
                                <CardDescription>
                                    Update your KYC details. Click save when you're done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {kycData.map((kyc, index) => {
                                        const matchedDocument = documents.find(doc => doc.documentType === kyc.documentType);
                                        return (
                                            <KYCDrivingLicense
                                                key={index}
                                                onboardingConfigurationsId={kyc.id}
                                                documentType={kyc.documentType}
                                                tenantId={kyc.tenantID}
                                                required={kyc.isRequired}
                                                verificationType={kyc.verificationType}
                                                active={kyc.isActive}
                                                submissionDate={matchedDocument ? matchedDocument.submissionDate : 'not submitted'}
                                                documentBase64={matchedDocument ? matchedDocument.documentBase64 : ''}
                                                onUploadSuccess={fetchData} 
                                                onDownload={() => console.log('Download clicked')}
                                                onSave={() => console.log('Save clicked')}
                                            />
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="onboarding">
                        <Card>
                            <CardHeader>
                                <CardTitle>Onboarding Details</CardTitle>
                                <CardDescription>
                                    View and manage your onboarding details.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="onboarding-tenant-id">Tenant ID</Label>
                                    <Input id="onboarding-tenant-id" defaultValue="COBRAND" disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="onboarding-verification-type">Verification Type</Label>
                                    <Input id="onboarding-verification-type" defaultValue="KYC" disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="onboarding-status">Status</Label>
                                    <Input id="onboarding-status" defaultValue="Active" disabled />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="onboarding-description">Description</Label>
                                    <Input id="onboarding-description" defaultValue="N/A" disabled />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Download Onboarding Details</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById, UserData } from '@/services/users';
import UserProfile from '@/components/cobrand/walletusers/profile';
import BreadCrumb from '@/components/breadcrumb';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import OnboardingDocumentTable from '@/components/cobrand/walletusers/document-table';
import { ScrollArea } from '@/components/ui/scroll-area';

const breadcrumbItems = [{ title: 'User Profile', link: '/cobrand/client' }];

const UserDetail: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const userData = await getUserById(id as string);
            setUser(userData);
        } catch (err) {
            setError("Test");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleKYCApproved = () => {
        fetchUser(); // Refetch the user data
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
                <BreadCrumb items={breadcrumbItems} />
                <div className="flex items-start justify-between">
                    <Heading
                        title={`User Profile ${user?.firstName}`}
                        description="User Personal Details"
                    />
                </div>
                <Separator />
                {user ? <UserProfile user={user} onKYCApproved={handleKYCApproved} /> : <div>User not found</div>}
                <Separator />
                <OnboardingDocumentTable clientId={id as string} />
            </div>
        </ScrollArea>
    );
};

export default UserDetail;

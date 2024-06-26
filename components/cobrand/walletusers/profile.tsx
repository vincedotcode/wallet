'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { approveAttestation } from '@/services/attestation';
import { useState } from 'react';
import { MultiStepLoaderDemo } from '@/components/MultiStepLoaderDemo';
import { useParams } from 'next/navigation';

export type UserData = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  imageUrl: string | null;
  kycCompleted: boolean;
  kybCompleted: boolean;
  userType: number;
};

interface UserProfileProps {
  user: UserData;
  onKYCApproved: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onKYCApproved }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const handleApproveKYC = async () => {
    setIsLoading(true);
    try {
      await approveAttestation(id as string); // Assuming user.id is used as documentID
      toast({
        title: 'KYC/KYB Approved',
        variant: 'default',
        description: 'The user\'s KYC/KYB has been successfully approved.'
      });
      onKYCApproved(); // Notify the parent component
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Failed to approve KYC/KYB'
      });
    } finally {
      setTimeout(() => setIsLoading(false), 3500);
    }
  };

  return (
    <div className="w-full max-screen mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {isLoading && <MultiStepLoaderDemo />}
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="bg-primary px-6 py-8 flex items-center">
          <div className="flex-shrink-0 mr-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.imageUrl || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} />
              <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">{user.firstName} {user.lastName}</h1>
            <p className="text-sm text-primary-foreground">{user.email}</p>
          </div>
        </div>
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Basic Information</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">First Name</span>
                  <span>{user.firstName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Name</span>
                  <span>{user.lastName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span>{user.phoneNumber || "N/A"}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Account Status</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`px-2 py-1 rounded-full font-medium ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email Confirmed</span>
                  <span className={`px-2 py-1 rounded-full font-medium ${user.emailConfirmed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.emailConfirmed ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">KYC/KYB</span>
                  <span className={`px-2 py-1 rounded-full font-medium ${user.kycCompleted && user.kybCompleted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.kycCompleted && user.kybCompleted ? 'Completed' : 'Partially Completed'}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">User Type</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">{user.userType === 1 ? 'Wallet User' : 'Back Office User'}</span>
                </div>
              </div>
            </div>
          </div>
          {(!user.kycCompleted && !user.kybCompleted) && (
            <>
              <hr className="my-6" />
              <div>
                <h2 className="text-lg font-medium mb-2">Actions</h2>
                <Button onClick={handleApproveKYC} className="mt-4">Approve KYC</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

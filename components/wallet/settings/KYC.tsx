import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadOnboardingDocument, updateOnboardingDocument } from "@/services/onboarding";
import { useAuth } from "@/hooks/useAuth";
import UploadFileDialog from "@/components/modal/fileupload-modal";
import { useToast } from "@/components/ui/use-toast";

interface KYCDrivingLicenseProps {
  tenantId: string;
  required: boolean;
  documentType: string;
  verificationType: string;
  active: boolean;
  submissionDate?: string;
  documentBase64?: string | null;
  onboardingConfigurationsId?: number;
  onUploadSuccess: () => void;  // New prop for notifying parent component
  onDownload: () => void;
  onSave: () => void;
}

export default function KYCDrivingLicense({
  tenantId,
  required,
  documentType,
  verificationType,
  active,
  submissionDate,
  documentBase64,
  onboardingConfigurationsId,
  onUploadSuccess,
  onDownload,
  onSave,
}: KYCDrivingLicenseProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getUserData } = useAuth();
  const { toast } = useToast();
  const userData = getUserData();
  const clientId = userData?._id;

  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSave = async () => {
    if (!file) {
        toast({
            title: "Error",
            description: "Please select a file to upload"
          });
      return;
    }

    setLoading(true);
    try {
      await uploadOnboardingDocument(documentType, file, clientId);
      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
      setFile(null);
      onUploadSuccess(); // Notify parent component to refresh data
    } catch (error) {
      alert('Failed to upload document');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      await updateOnboardingDocument(documentType, file, onboardingConfigurationsId);
      alert('Document updated successfully');
      toast({
        title: "Success",
        description: "Document updated successfully"
      });
      setFile(null);
      onUploadSuccess(); // Notify parent component to refresh data
    } catch (error) {
      alert('Failed to update document');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (documentBase64) {
      const link = document.createElement('a');
      link.href = documentBase64;
      link.download = `${documentType}.png`; // You can update the extension based on the file type
      link.click();
    } else {
      alert('No file available for download');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{documentType}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col gap-1">
            <Label>Tenant ID</Label>
            <p>{tenantId}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Required</Label>
            <p>{required ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          <div className="flex flex-col gap-1">
            <Label>Verification Type</Label>
            <p>{verificationType}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Active</Label>
            <p>{active ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Submission Date</Label>
          <p>{submissionDate}</p>
        </div>
        <div className="grid gap-4">
          {file ? (
            <div className="flex items-center justify-between">
              <p>{file.name}</p>
              <Button variant="outline" onClick={handleRemoveFile}>
                Remove
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Select File
            </Button>
          )}
        </div>
        <div className={`grid ${documentBase64 ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
          {documentBase64 && (
            <Button variant="outline" onClick={handleDownload}>
              Download
            </Button>
          )}
          {documentBase64 ? (
            <Button onClick={handleEdit} disabled={!file || loading}>
              {loading ? 'Updating...' : 'Edit'}
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
      </CardContent>
      <UploadFileDialog
        open={isDialogOpen}
        documentType={documentType}
        onClose={() => setIsDialogOpen(false)}
        onFileSelect={handleFileSelect}
      />
    </Card>
  );
}

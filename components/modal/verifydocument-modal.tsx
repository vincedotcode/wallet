'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { postAttestation } from "@/services/attestation";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

import { useParams } from 'next/navigation';

const statusOptions = [
  "PENDING",
  "UNDERREVIEW",
  "COMPLETED",
  "FAILED",
  "ONHOLD",
  "PROCESSINGERROR",
  "VALIDATIONERROR",
  "ESCALATED",
  "REJECTED",
  "FLAGGED",
  "AWAITINGINFORMATION",
  "PARTIALLYCOMPLETED",
  "SCHEDULEDFORRETRY"
];

type SliderProps = React.ComponentProps<typeof Slider>;

interface VerifyDocumentDialogProps {
  document: {
    documentBase64?: string | null;
    submissionDate?: string;
    id: number;
  };
}

export function ScoreSlider({ className, ...props }: SliderProps) {
  return (
    <Slider
      defaultValue={[50]}
      max={100}
      step={1}
      className={cn("w-full", className)}
      {...props}
    />
  );
}

export const VerifyDocumentDialog: React.FC<VerifyDocumentDialogProps> = ({ document }) => {
  const [score, setScore] = useState(50);
  const [rationale, setRationale] = useState('');
  const [status, setStatus] = useState('');
  const [verifierName, setVerifierName] = useState('');
  const { toast } = useToast();
  const { getToken, getUserData } = useAuth();
  const user = getUserData();
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'User not authenticated'
      });
      return;
    }
    setIsSaving(true);
    const attestationData = {
      score,
      rationale,
      documentID: document.id,
      method: "MANUAL",
      status,
      verifierID: user._id,
      verifierName
    };

    try {
      await postAttestation(id as string, attestationData);
      toast({
        title: 'Success',
        variant: 'default',
        description: 'Attestation submitted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: 'Failed to submit attestation'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Verify Document</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Document</DialogTitle>
          <DialogDescription>
            Verify the details of the document. Make changes as necessary and save.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {document.documentBase64 && (
            <div className="border p-2 rounded">
              <Label>Document Image</Label>
              <img src={`${document.documentBase64}`} alt="Document" className="w-full h-auto mt-2" />
              <Label className="mt-2">Submitted Date: {document.submissionDate}</Label>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="score">Score</Label>
            <ScoreSlider
              className="mt-2"
              value={[score]}
              onValueChange={(value) => setScore(value[0])}
            />
            <div className="text-sm text-gray-500">{score}</div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rationale">Rationale</Label>
            <Input
              id="rationale"
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="verifier-name">Verifier Name</Label>
            <Input
              id="verifier-name"
              value={verifierName}
              onChange={(e) => setVerifierName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving attestation...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

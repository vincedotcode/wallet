// services/attestation.ts
import axios from 'axios';
import { AxiosError } from 'axios';
import api from '@/utils/api';

interface ApiResponse {
    message: string[];
    error: string;
}

interface AttestationRequest {
    score: number;
    rationale: string;
    documentID: number;
    method: string;
    status: string;
    verifierID: string;
    verifierName: string;
}

export const postAttestation = async (
    clientId: string,
    attestationData: AttestationRequest
): Promise<void> => {
    const url = `/api/v1/onboarding/onboardingverificationandscore?ClientId=${clientId}`;

    try {
        const response = await api.post(url, attestationData);

        if (response.data.succeeded) {
            console.log('Attestation submitted successfully');
        } else {
            throw new Error(response.data.message || 'Failed to submit attestation');
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request'
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error'
            }));
        }
    }
};

export const approveAttestation = async (
    clientId: string,
): Promise<void> => {
    const url = `/api/v1/onboarding/approvedocument?ClientId=${clientId}`;

    try {
        const response = await api.post(url);

        if (response.data.succeeded) {
            console.log('Document approved successfully');
        } else {
            throw new Error(response.data.message || 'Failed to approve document');
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response) {
            throw new Error(JSON.stringify({
                statusCode: axiosError.response.status,
                message: axiosError.response.data.message || ['An unexpected error occurred'],
                error: axiosError.response.data.error || 'Bad Request'
            }));
        } else {
            throw new Error(JSON.stringify({
                statusCode: 500,
                message: ['Network Error or Internal Server Error'],
                error: 'Server Error'
            }));
        }
    }
};

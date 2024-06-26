// services/onboarding.ts
import api from '@/utils/api';
import axios from 'axios';
import {  AxiosError } from 'axios';

export interface OnboardingConfiguration {
    id: number;
    tenantID: string;
    documentType: string;
    isRequired: boolean;
    verificationType: string;
    description: string;
    isActive: boolean;
}

interface OnboardingConfigurationResponse {
    succeeded: boolean;
    message: string | null;
    totalRecord: number;
    data: OnboardingConfiguration[];
}

interface ApiResponse {
    message: string[];
    error: string;
}

export interface OnboardingDocument {
    id: number;
    tenantID: string;
    clientID: string;
    documentType: string;
    documentPath: string;
    documentBase64?: string | null;
    submissionDate?: string;
    isActive: boolean;
    errorMessage: string;
    successfullyRetrieved: boolean;
    includeFile: boolean;
}


interface OnboardingDocumentResponse {
    succeeded: boolean;
    message: string | null;
    data: OnboardingDocument[];
}

export const getOnboardingDocuments = async (clientId: string): Promise<OnboardingDocument[]> => {
    const url = `/api/v1/onboarding/getonboardingdocuments?PageSize=10000&Skip=0&clientId=${clientId}&includeFile=true`;

    try {
        const response = await api.get<OnboardingDocumentResponse>(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.data.succeeded) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch onboarding documents');
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


export const getOnboardingConfigurations = async (): Promise<OnboardingConfiguration[]> => {
    const url = '/api/v1/onboarding/getonboardingconfigurations';

    try {
        const response = await api.get<OnboardingConfigurationResponse>(url, {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.data.succeeded) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch onboarding configurations');
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

export const uploadOnboardingDocument = async (
    documentType: string,
    documentFile: File,
    clientId?: string
  ): Promise<void> => {
    const url = `/api/v1/onboarding/onboardingdocument?ClientId=${clientId}`;
  
    const formData = new FormData();
    formData.append('DocumentType', documentType);
    formData.append('DocumentData', documentFile);
  
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.succeeded) {
        console.log('Document uploaded successfully');
      } else {
        throw new Error(response.data.message || 'Failed to upload document');
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
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

  export const updateOnboardingDocument = async (
    documentType: string,
    documentFile: File,
    onboardingConfigurationsId?: number 
  ): Promise<void> => {
    if (onboardingConfigurationsId === undefined) {
      throw new Error('onboardingConfigurationsId is required');
    }
  
    const url = `/api/v1/onboarding/onboardingdocument`;
  
    const formData = new FormData();
    formData.append('OnboardingConfigurationsId', `${onboardingConfigurationsId}`);
    formData.append('IsActive', 'true');
    formData.append('DocumentType', documentType);
    formData.append('DocumentFileData', documentFile);
  
    try {
      const response = await axios.put(process.env.NEXT_PUBLIC_API_URL + url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.data.succeeded) {
        console.log('Document updated successfully');
      } else {
        throw new Error(response.data.message || 'Failed to update document');
      }
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response) {
        throw new Error(JSON.stringify({
          statusCode: axiosError.response.status,
          message: axiosError.response.data.message || ['An unexpected error occurred'],
          error: axiosError.response.data.error || 'Bad Request',
        }));
      } else {
        throw new Error(JSON.stringify({
          statusCode: 500,
          message: ['Network Error or Internal Server Error'],
          error: 'Server Error',
        }));
      }
    }
  };
  
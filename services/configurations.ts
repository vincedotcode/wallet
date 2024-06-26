// services/configuration.ts
import api from '@/utils/api';
import { AxiosError } from 'axios';

export interface ConfigurationData {
  tenantId: string;
  currencyCode: string;
  allowTransactions: boolean;
  walletId: number;
  currentBalance: number;
  id: number;
  isActive: boolean;
  createdDate: string;
  isDefaultForWalletCreation?: boolean;
  generateDynamicQrOnClientSetup?: boolean;
}

interface ConfigurationResponse {
  succeeded: boolean;
  message: string | null;
  totalRecord: number;
  data: ConfigurationData[];
}

interface ApiResponse {
  message: string[];
  error: string;
}

export const getTenantCurrencyConfigurations = async (): Promise<ConfigurationData[]> => {
  const url = '/api/v1/ewallet/gettenantcurrencyconfigurations';

  try {
    const response = await api.get<ConfigurationResponse>(url);

    if (response.data.succeeded) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch configurations');
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

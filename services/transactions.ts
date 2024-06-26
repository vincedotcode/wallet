import api from '@/utils/api';
import { AxiosError } from 'axios';

export interface TransactionData {
  transactionId: number;
  userId: string;
  amount: number;
  transactionDateTime: string;
  paymentType: string;
  tenantId: string;
  remarks: string;
  info: string;
  currency: string;
  pointsEarned: number;
  isRedeemed: boolean;
  bankId: number;
  walletId: number;
  isActive: boolean;
}

interface TransactionResponse {
  succeeded: boolean;
  message: string | null;
  totalRecord: number;
  data: TransactionData[];
}

interface ApiResponse {
  message: string[];
  error: string;
}

interface TransactionRequestParams {
  walletId: number;
  transactionStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  searchValue?: string;
  sortColumn?: string;
  sortColumnDirection?: string;
  pageSize?: number;
  skip?: number;
  userId?: string;
}

export const getWalletTransaction = async (token: string, params: TransactionRequestParams): Promise<TransactionResponse> => {
  const url = '/api/v1/ewallet/getwallettransactions';

  try {
    const response = await api.get<TransactionResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params,
    });

    if (response.data.succeeded) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch transactions');
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

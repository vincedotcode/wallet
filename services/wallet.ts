// services/wallet.ts
import api from '@/utils/api';
import { AxiosError } from 'axios';

interface WalletData {
  walletId: number;
  currentBalance: number;
  currency: string;
  status: string;
}

interface WalletResponse {
  succeeded: boolean;
  message: string | null;
  totalRecord: number;
  data: WalletData[];
}

interface ApiResponse {
  message: string[];
  error: string;
}

interface TopUpRequest {
  amount: number;
  walletId: number;
  topupType: string;
  bankId?: string;
  cardholder: string;
  cardNumber: string;
  cvv: number;
  expiryDate: string;
  description: string;
  billPhone: string;
  billEmail: string;
  billCountry: string;
  billCity: string;
  billState: string;
  billAddress: string;
  billZip: string;
}

interface TopUpResponse {
  succeeded: boolean;
  message: string;
}

export interface WalletToWalletTransferRequest {
  walletFrom: number;
  walletTo: number;
  amount: number;
  userId: string;
  description: string;
  encodedQrCode: string;
}

interface WalletToWalletTransferResponse {
  succeeded: boolean;
  message: string | null;
  data: {
    walletFrom: number;
    walletTo: number;
    amount: number;
    userId: string;
    description: string;
    encodedQrCode: string;
    transactionId: number;
  };
}


export const getAllWallets = async (token: string): Promise<WalletData[]> => {
  const url = '/api/v1/ewallet/getallwallet';

  try {
    const response = await api.get<WalletResponse>(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.data.succeeded) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch wallets');
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

export const topUpWallet = async (token: string, topUpData: TopUpRequest): Promise<TopUpResponse> => {
  const url = '/api/v1/ewallet/topupwallet';

  try {
    const response = await api.post<TopUpResponse>(url, topUpData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
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


export const walletToWalletTransfer = async (transferData: WalletToWalletTransferRequest): Promise<WalletToWalletTransferResponse> => {
  const url = '/api/v1/ewallet/wallettowallettransfer';

  try {
    const response = await api.post<WalletToWalletTransferResponse>(url, transferData);

    return response.data;
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
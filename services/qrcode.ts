import { AxiosResponse } from 'axios';
import api from '@/utils/api';

export interface QRCodeData {
  walletId: number;
  qrCodeId: number;
  currencyCode: string;
  qrType: string;
  qrCode: string;
  qrCodeBase64: string;
}


export interface ScannedQRData {
    qrCode: string;
    walletId: number;
    qrType: string;
    amount: number;
    qrCodeBase64: string;
    metaData: string;
    currencyCode: string;
    }


interface QRCodeResponse {
  succeeded: boolean;
  message: string | null;
  totalRecord?: number; // optional, as it might not be present in this response
  data: QRCodeData;
}

interface ScannedQRResponse {
    succeeded: boolean;
    message: string | null;
    data: ScannedQRData;
    }


export interface CreateQRCodeRequest {
  qrType: string;
  amount: number;
  walletId: number;
  isTenant: boolean;
  description: string;
  metaData: string; 
}

export interface CreateQRCodeResponse {
  succeeded: boolean;
  message: string | null;
  data: QRCodeData | null;
}

export const getAllQRCodes = async (walletId: number, isTenant: boolean): Promise<QRCodeResponse> => {
  try {
    const response: AxiosResponse<QRCodeResponse> = await api.get(`/api/v1/ewallet/getallqr`, {
      params: {
        WalletId: walletId,
        IsTenant: isTenant,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching QR codes', error);
    throw error;
  }
};

export const createQRCode = async (createQRCodeRequest: CreateQRCodeRequest): Promise<CreateQRCodeResponse> => {
  try {
    const response: AxiosResponse<CreateQRCodeResponse> = await api.post(`/api/v1/ewallet/createqr`, createQRCodeRequest);
    return response.data;
  } catch (error) {
    console.error('Error creating QR code', error);
    throw error;
  }
};

export const retrieveQRCodeFromScannedCode = async (scannedQrCode: string): Promise<ScannedQRResponse> => {
  try {
    const response: AxiosResponse<ScannedQRResponse> = await api.get(`/api/v1/ewallet/retrieveqrfromscannedcode`, {
      params: {
        ScannedQrCode: scannedQrCode,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error retrieving QR code from scanned code', error);
    throw error;
  }
};

// services/auth.ts
import api from '@/utils/api';
import axios, { AxiosError } from 'axios';
import { parseJwt } from '@/utils/jwt'; 

interface UserData {
    _id: string;
    username: string;
    email: string;
    role: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    userType: string;
    kycCompleted: boolean;
    kybCompleted: boolean;
    isCurrencySuffix: boolean;
}

interface LoginResponse {
    token: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
    userType: string;
    kycCompleted: boolean;
    kybCompleted: boolean;
    isCurrencySuffix: boolean;
}


interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
}


interface LoginCredentials {
    email: string;
    password: string;
}

interface ApiResponse {
    message: string[];
    error: string;
}

export const login = async (
    credentials: LoginCredentials, 
    tenant: string, 
    setUserData: (loginResponse: any, decodedToken: any) => void
): Promise<LoginResponse> => {
    const url = '/api/tokens';

    try {
        const response = await api.post<LoginResponse>(url, credentials, {
            headers: {
                'tenant': tenant,
            }
        });
        const decodedToken = parseJwt(response.data.token);
        setUserData({
            message: 'Login successful',
            user: {
                _id: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
                username: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                role: decodedToken["UserType"],
                name: decodedToken["fullName"],
                createdAt: '',
                updatedAt: '',
                userType: decodedToken["UserType"],
                kycCompleted: decodedToken["KYCCompleted"] === 'True',
                kybCompleted: decodedToken["KYBCompleted"] === 'True',
                isCurrencySuffix: decodedToken["IsCurrencySuffix"] === 'True',
            },
            token: response.data.token
        }, decodedToken);
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

export const register = async (credentials: RegisterCredentials,  tenant: string ): Promise<void> => {
    const url = '/api/users/self-register';

    try {
        const response = await api.post(url, credentials, {
            headers: {
                'tenant': tenant,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log(`User ${credentials.userName} Registered.`);
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


export const logout = async (clearUserData: () => void): Promise<void> => {
    clearUserData();
    console.log("User logged out");
};

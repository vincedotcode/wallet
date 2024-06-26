import api from '@/utils/api';
import { AxiosError } from 'axios';

export interface UserData {
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
}

export interface UserResponse {
    data: UserData[];
}

interface ApiResponse {
    message: string[];
    error: string;
}

interface UserRequestParams {
    userType: number;
}

export const getUsers = async (params: UserRequestParams): Promise<UserData[]> => {
    const url = '/api/users';

    try {
        const response = await api.get(url, {
            params,
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


export const getUserById = async (id: string): Promise<UserData> => {
    const url = `/api/users/${id}`;

    try {
        const response = await api.get<UserData>(url);
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
// hooks/useAuth.ts
"use client";


import { useCallback } from 'react';

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
    message: string;
    user: UserData;
    token: string;
}

export const useAuth = () => {
    const setUserData = useCallback((loginResponse: LoginResponse, decodedToken: any) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userData', JSON.stringify(loginResponse.user));
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('decodedToken', JSON.stringify(decodedToken));
        }
    }, []);

    const getUserData = useCallback((): UserData | null => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('userData');
            return userData ? (JSON.parse(userData) as UserData) : null;
        }
        return null;
    }, []);

    const getToken = useCallback((): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }, []);

    const getDecodedToken = useCallback((): any => {
        if (typeof window !== 'undefined') {
            const decodedToken = localStorage.getItem('decodedToken');
            return decodedToken ? JSON.parse(decodedToken) : null;
        }
        return null;
    }, []);

    const clearUserData = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            localStorage.removeItem('decodedToken');
        }
    }, []);

    return {
        setUserData,
        getUserData,
        getToken,
        getDecodedToken,
        clearUserData,
    };
};

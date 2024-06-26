// hooks/useAuthToken.ts
"use client";
import { useEffect, useState } from 'react';

interface TokenData {
    exp: number;
    iat: number;
    [key: string]: any;
}

export const useAuthToken = (): TokenData | null => {
    const [tokenData, setTokenData] = useState<TokenData | null>(null);

    function parseJwt(token: string) {
        if (!token) { return null; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = parseJwt(token);
                setTokenData(decoded);
            } catch (error) {
                console.error("Failed to decode token:", error);
                setTokenData(null);
            }
        }
    }, []);

    return tokenData;
};

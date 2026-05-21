'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AniListUser {
    id: number;
    name: string;
    avatar: { large: string; medium: string };
    bannerImage?: string | null;
}

interface AuthContextType {
    user: AniListUser | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: async () => {},
    refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AniListUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/anilist/me');
            const data = await res.json();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const login = useCallback(() => {
        window.location.href = '/api/auth/anilist/login';
    }, []);

    const logout = useCallback(async () => {
        await fetch('/api/auth/anilist/logout');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

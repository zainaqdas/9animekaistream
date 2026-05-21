'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Viewer {
    id: number;
    name: string;
    avatar: { large: string; medium: string };
}

interface AuthContextType {
    user: Viewer | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: () => {},
    logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Viewer | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch('/api/auth/anilist/me');
            const data = await res.json();
            setUser(data.user || null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = useCallback(() => {
        window.location.href = '/api/auth/anilist/login';
    }, []);

    const logout = useCallback(async () => {
        await fetch('/api/auth/anilist/logout');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

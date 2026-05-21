'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogIn, User, LogOut, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
    const { user, loading, login, logout } = useAuth();

    if (loading) {
        return (
            <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <button
                onClick={login}
                className="flex items-center gap-2 bg-accent/10 hover:bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-bold transition-all hover:scale-105"
            >
                <LogIn size={14} />
                Login
            </button>
        );
    }

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img
                    src={user.avatar?.medium || user.avatar?.large}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-accent/50"
                />
            </button>

            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <Link href="/profile" className="text-xs text-muted-foreground hover:text-accent transition-colors mt-1 block">
                        View Profile
                    </Link>
                </div>

                <div className="p-2 space-y-1">
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <BookOpen size={16} className="text-muted-foreground" />
                        My List
                    </Link>
                    <Link
                        href={`https://anilist.co/user/${user.name}/animelist`}
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <User size={16} className="text-muted-foreground" />
                        AniList Profile
                    </Link>
                </div>

                <div className="p-2 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-sm font-medium w-full"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

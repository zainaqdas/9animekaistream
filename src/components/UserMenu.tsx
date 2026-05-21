'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogOut, List, User, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
    const { user, loading, login, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    if (loading) {
        return (
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 animate-pulse" />
        );
    }

    if (!user) {
        return (
            <button
                onClick={login}
                className="bg-accent hover:bg-accent/90 text-white text-xs font-bold px-4 py-2 rounded-full transition-all hover:scale-105 shadow-lg shadow-accent/20 uppercase tracking-wider"
            >
                Sign In
            </button>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-1 pr-3 py-1 transition-all"
            >
                <img
                    src={user.avatar?.medium || ''}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-muted-foreground hidden sm:block">{user.name}</span>
            </button>

            {open && (
                <div className="absolute right-0 top-12 w-56 bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/5 flex items-center gap-3">
                        <img
                            src={user.avatar?.medium || ''}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <p className="font-bold text-sm">{user.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">AniList</p>
                        </div>
                    </div>
                    <div className="p-2 space-y-1">
                        <Link
                            href="/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            <UserCircle size={16} />
                            Profile
                        </Link>
                        <a
                            href={`https://anilist.co/user/${user.name}/animelist`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            <List size={16} />
                            AniList List
                        </a>
                    </div>
                    <div className="p-2 pt-0">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-red-400 hover:text-red-300 w-full"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

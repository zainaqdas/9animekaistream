'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { AniListEntry, AniListCollection } from '@/lib/anilist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import {
    BookOpen, Film, Clock, CheckCircle, PlayCircle,
    ListFilter, Loader2, LogIn, Star, Eye, TrendingUp,
    Trophy, Calendar,
} from 'lucide-react';

const TAB_ICONS: Record<string, React.ReactNode> = {
    'CURRENT': <PlayCircle size={16} />,
    'PLANNING': <Clock size={16} />,
    'COMPLETED': <CheckCircle size={16} />,
    'DROPPED': <Film size={16} />,
    'PAUSED': <Clock size={16} />,
    'REPEATING': <TrendingUp size={16} />,
};

const STATUS_COLORS: Record<string, string> = {
    'CURRENT': 'text-green-400',
    'PLANNING': 'text-blue-400',
    'COMPLETED': 'text-purple-400',
    'DROPPED': 'text-red-400',
    'PAUSED': 'text-yellow-400',
    'REPEATING': 'text-pink-400',
};

export default function ProfilePage() {
    const { user, loading: authLoading, login } = useAuth();
    const [collections, setCollections] = useState<AniListCollection | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalAnime: 0,
        totalEpisodes: 0,
        completed: 0,
        watching: 0,
        planning: 0,
    });

    const fetchList = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch('/api/anilist/list');
            if (res.ok) {
                const data = await res.json();
                setCollections(data);

                // Calculate stats
                let totalEps = 0;
                let completed = 0;
                let watching = 0;
                let planning = 0;
                let totalAnime = 0;

                for (const list of data.lists || []) {
                    for (const entry of list.entries || []) {
                        totalAnime++;
                        totalEps += entry.progress || 0;
                        if (entry.status === 'COMPLETED') completed++;
                        if (entry.status === 'CURRENT') watching++;
                        if (entry.status === 'PLANNING') planning++;
                    }
                }

                setStats({ totalAnime, totalEpisodes: totalEps, completed, watching, planning });

                // Set initial tab to first non-empty list or CURRENT
                if (data.lists?.length > 0) {
                    const firstNonEmpty = data.lists.find((l: { entries: unknown[] }) => l.entries.length > 0);
                    setActiveTab(firstNonEmpty?.name || data.lists[0]?.name || 'CURRENT');
                }
            }
        } catch {}
        setLoading(false);
    }, [user]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 px-4">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                        <LogIn size={36} className="text-accent" />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center">Connect AniList</h1>
                    <p className="text-muted-foreground text-center max-w-md font-medium">
                        Sign in with AniList to sync your watch progress, track what you&apos;ve watched, and keep your list up to date.
                    </p>
                    <button
                        onClick={login}
                        className="bg-accent hover:bg-accent/90 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-accent/20"
                    >
                        <LogIn size={20} />
                        SIGN IN WITH ANILIST
                    </button>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Header / Banner */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
                {user.bannerImage && (
                    <Image
                        src={user.bannerImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                )}
                <div className={`absolute inset-0 ${user.bannerImage ? 'bg-gradient-to-t from-background via-background/60 to-transparent' : 'bg-gradient-to-b from-accent/10 to-background'}`} />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-20 md:-mt-32 relative z-10">
                {/* User Info */}
                <div className="flex items-end gap-6 mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-4 ring-background shadow-2xl shrink-0">
                        <Image
                            src={user.avatar?.large || user.avatar?.medium}
                            alt={user.name}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                        <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">{user.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} />
                                {stats.totalAnime} anime
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye size={14} />
                                {stats.totalEpisodes} episodes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Watching', value: stats.watching, icon: <PlayCircle size={18} />, color: 'text-green-400' },
                        { label: 'Completed', value: stats.completed, icon: <CheckCircle size={18} />, color: 'text-purple-400' },
                        { label: 'Planning', value: stats.planning, icon: <Clock size={18} />, color: 'text-blue-400' },
                        { label: 'Total', value: stats.totalAnime, icon: <Trophy size={18} />, color: 'text-accent' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-card rounded-2xl p-4 border border-white/5">
                            <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                                {stat.icon}
                                <span className="text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                {collections?.lists && (
                    <div className="space-y-6">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {collections.lists.map((list) => (
                                list.entries.length > 0 && (
                                    <button
                                        key={list.name}
                                        onClick={() => setActiveTab(list.name)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                            activeTab === list.name
                                                ? 'bg-accent text-white'
                                                : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                                        }`}
                                    >
                                        {TAB_ICONS[list.name] || <Film size={16} />}
                                        {list.name.charAt(0) + list.name.slice(1).toLowerCase()}
                                        <span className="text-xs opacity-60">({list.entries.length})</span>
                                    </button>
                                )
                            ))}
                        </div>

                        {/* Entries Grid */}
                        {(() => {
                            const activeList = collections.lists.find(l => l.name === activeTab);
                            if (!activeList) return null;

                            return (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {activeList.entries.map((entry: AniListEntry) => (
                                    <div
                                        key={entry.media.id}
                                        className="group"
                                    >
                                        <div className="bg-card rounded-2xl overflow-hidden border border-white/5 transition-all hover:scale-105 hover:border-accent/30 hover:shadow-xl">
                                            <div className="aspect-[2/3] relative">
                                                {entry.media.coverImage?.large ? (
                                                    <Image
                                                        src={entry.media.coverImage.large}
                                                        alt={entry.media.title.english || entry.media.title.romaji}
                                                        fill
                                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                                        <Film size={24} className="text-muted-foreground" />
                                                    </div>
                                                )}
                                                {/* Progress overlay */}
                                                {entry.progress > 0 && entry.media.episodes && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                        <div
                                                            className="h-full bg-accent transition-all"
                                                            style={{ width: `${Math.min(100, (entry.progress / entry.media.episodes) * 100)}%` }}
                                                        />
                                                    </div>
                                                )}
                                                {/* Status badge */}
                                                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-background/80 backdrop-blur-sm ${STATUS_COLORS[entry.status] || ''}`}>
                                                    {entry.status}
                                                </div>
                                            </div>
                                            <div className="p-3 space-y-1">
                                                <p className="text-xs font-bold truncate leading-tight">
                                                    {entry.media.title.english || entry.media.title.romaji}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Ep {entry.progress}{entry.media.episodes ? ` / ${entry.media.episodes}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-accent" size={32} />
                    </div>
                )}
            </div>

            <div className="mt-12">
                <Footer />
            </div>
        </main>
    );
}

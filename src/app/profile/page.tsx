'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import {
    List,
    Film,
    Star,
    Clock,
    Play,
    BookmarkPlus,
    Loader2,
    TrendingUp,
    CheckCircle2,
    BookOpen,
    ThumbsDown,
    PauseCircle,
    RotateCcw,
    LogIn,
    BarChart3,
    User,
} from 'lucide-react';
import type { AniListEntry, AniListCollection } from '@/lib/anilist';

const STATUS_ICONS: Record<string, React.ReactNode> = {
    CURRENT: <Play size={14} />,
    COMPLETED: <CheckCircle2 size={14} />,
    PLANNING: <BookmarkPlus size={14} />,
    DROPPED: <ThumbsDown size={14} />,
    PAUSED: <PauseCircle size={14} />,
    REPEATING: <RotateCcw size={14} />,
};

const STATUS_LABELS: Record<string, string> = {
    CURRENT: 'Currently Watching',
    COMPLETED: 'Completed',
    PLANNING: 'Planning',
    DROPPED: 'Dropped',
    PAUSED: 'Paused',
    REPEATING: 'Rewatching',
};

const STATUS_COLORS: Record<string, string> = {
    CURRENT: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    COMPLETED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    PLANNING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    DROPPED: 'bg-red-500/20 text-red-400 border-red-500/30',
    PAUSED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    REPEATING: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
};

const STATUS_TAB_ORDER = ['CURRENT', 'COMPLETED', 'PLANNING', 'PAUSED', 'DROPPED', 'REPEATING'] as const;

function getScoreColor(score: number | null): string {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
}

function AnimeListCard({ entry }: { entry: AniListEntry }) {
    const title = entry.media.title.english || entry.media.title.romaji;
    const totalEpisodes = entry.media.episodes || 0;
    const progress = entry.progress || 0;
    const progressPercent = totalEpisodes > 0 ? Math.min((progress / totalEpisodes) * 100, 100) : 0;
    return (
        <Link
            href={`/search?q=${encodeURIComponent(title)}`}
            className="group bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-accent/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
            {/* Poster */}
            <div className="aspect-[2/3] relative overflow-hidden">
                <Image
                    src={entry.media.coverImage.large}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Score Badge */}
                {entry.score && entry.score > 0 ? (
                    <div className={`absolute top-2 right-2 ${getScoreColor(entry.score * 10)} bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-bold`}>
                        <Star size={12} fill={entry.score * 10 >= 60 ? 'currentColor' : 'none'} />
                        {entry.score}
                    </div>
                ) : entry.media.averageScore ? (
                    <div className="absolute top-2 right-2 text-muted-foreground bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-xs font-bold">
                        <Star size={12} />
                        {entry.media.averageScore}%
                    </div>
                ) : null}

                {/* Status Badge Top */}
                <div className={`absolute top-2 left-2 ${STATUS_COLORS[entry.status]} backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border`}>
                    {STATUS_ICONS[entry.status]}
                    {STATUS_LABELS[entry.status]}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-2">
                <h3 className="text-sm font-bold line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                    {title}
                </h3>

                {/* Progress Bar */}
                {totalEpisodes > 0 && (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Film size={10} />
                                {progress} / {totalEpisodes}
                            </span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Format + episodes */}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {entry.media.format && (
                        <span className="bg-white/5 px-1.5 py-0.5 rounded">{entry.media.format}</span>
                    )}
                    {totalEpisodes > 0 && (
                        <span>{totalEpisodes} ep</span>
                    )}
                </div>
            </div>
        </Link>
    );
}

function StatsCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
    return (
        <div className="bg-card border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black">{value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user, loading: authLoading, login } = useAuth();
    const [collection, setCollection] = useState<AniListCollection | null>(null);
    const [loadingList, setLoadingList] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('ALL');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoadingList(false);
            return;
        }
        setLoadingList(true);
        setError(null);
        fetch('/api/anilist/list')
            .then(r => {
                if (!r.ok) throw new Error('Failed to fetch list');
                return r.json();
            })
            .then(data => {
                setCollection(data.collection);
            })
            .catch(e => {
                setError(e.message);
            })
            .finally(() => setLoadingList(false));
    }, [user]);

    // Compute stats
    const allEntries = collection?.lists?.flatMap(l => l.entries) || [];
    const totalAnime = allEntries.length;
    const totalEpisodesWatched = allEntries.reduce((sum, e) => sum + (e.progress || 0), 0);
    const totalDaysWatched = Math.round((totalEpisodesWatched * 24) / 60);
    const averageScore = allEntries.length > 0
        ? Math.round(allEntries.reduce((sum, e) => sum + (e.score || 0), 0) / allEntries.length * 10) / 10
        : 0;

    // Group by status
    const groupedByStatus: Record<string, AniListEntry[]> = {};
    for (const entry of allEntries) {
        if (!groupedByStatus[entry.status]) groupedByStatus[entry.status] = [];
        groupedByStatus[entry.status].push(entry);
    }

    // Get tabs with counts
    const tabs = [
        { id: 'ALL', label: 'All', count: totalAnime, icon: <List size={14} /> },
        ...STATUS_TAB_ORDER
            .filter(s => groupedByStatus[s]?.length > 0)
            .map(s => ({
                id: s,
                label: STATUS_LABELS[s].split(' ')[0],
                count: groupedByStatus[s].length,
                icon: STATUS_ICONS[s],
            })),
    ];

    const displayedEntries = activeTab === 'ALL' ? allEntries : (groupedByStatus[activeTab] || []);

    // ── Loading state ──
    if (authLoading) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center pt-32 pb-24">
                    <Loader2 size={32} className="animate-spin text-accent" />
                </div>
                <Footer />
            </main>
        );
    }

    // ── Not signed in ──
    if (!user) {
        return (
            <main className="min-h-screen">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 pt-32 pb-24 text-center space-y-8">
                    <div className="w-20 h-20 rounded-full bg-card border border-white/10 mx-auto flex items-center justify-center">
                        <User size={36} className="text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black uppercase italic tracking-tight">My List</h1>
                        <p className="text-muted-foreground font-medium">
                            Sign in with AniList to see your anime list and track your progress.
                        </p>
                    </div>
                    <button
                        onClick={login}
                        className="inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-accent/20"
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

            <div className="max-w-7xl mx-auto px-4 md:px-12 pt-28 pb-24 space-y-12">
                {/* ── Profile Header ── */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-card rounded-3xl p-8 border border-white/5">
                    <div className="relative">
                        <img
                            src={user.avatar?.large || ''}
                            alt={user.name}
                            className="w-24 h-24 rounded-2xl object-cover border-2 border-accent/30 shadow-xl"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent border-2 border-card flex items-center justify-center">
                            <CheckCircle2 size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">{user.name}</h1>
                        <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
                            <Film size={14} />
                            {totalAnime} anime tracked
                        </p>
                    </div>
                    <a
                        href={`https://anilist.co/user/${user.name}/animelist`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 uppercase tracking-wider"
                    >
                        <BarChart3 size={16} />
                        Full List
                    </a>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatsCard
                        icon={<Film size={18} />}
                        label="Total Anime"
                        value={totalAnime}
                        color="bg-accent/20 text-accent"
                    />
                    <StatsCard
                        icon={<Play size={18} />}
                        label="Episodes Watched"
                        value={totalEpisodesWatched}
                        color="bg-blue-500/20 text-blue-400"
                    />
                    <StatsCard
                        icon={<Clock size={18} />}
                        label="Days Watched"
                        value={totalDaysWatched}
                        color="bg-purple-500/20 text-purple-400"
                    />
                    <StatsCard
                        icon={<Star size={18} />}
                        label="Avg Score"
                        value={averageScore}
                        color="bg-amber-500/20 text-amber-400"
                    />
                </div>

                {/* ── Loading State ── */}
                {loadingList && (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="animate-spin text-accent" />
                        <p className="text-muted-foreground font-medium">Loading your list...</p>
                    </div>
                )}

                {/* ── Error State ── */}
                {error && !loadingList && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
                        <ThumbsDown size={32} className="mx-auto text-red-400" />
                        <p className="font-bold text-lg">Failed to Load List</p>
                        <p className="text-muted-foreground text-sm">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl text-sm font-bold transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loadingList && !error && totalAnime === 0 && (
                    <div className="text-center py-20 space-y-6">
                        <div className="w-20 h-20 rounded-full bg-card border border-white/10 mx-auto flex items-center justify-center">
                            <BookOpen size={36} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black uppercase italic">Your list is empty</h2>
                            <p className="text-muted-foreground font-medium max-w-md mx-auto">
                                Start adding anime from the detail pages to build your list and track your progress.
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                        >
                            <TrendingUp size={18} />
                            BROWSE ANIME
                        </Link>
                    </div>
                )}

                {/* ── Tabs + Grid ── */}
                {!loadingList && !error && totalAnime > 0 && (
                    <div className="space-y-8">
                        {/* Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                                        activeTab === tab.id
                                            ? 'bg-accent/20 text-accent border-accent/30 shadow-lg shadow-accent/5'
                                            : 'bg-white/5 text-muted-foreground border-transparent hover:bg-white/10 hover:text-foreground'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                        activeTab === tab.id ? 'bg-accent/30' : 'bg-white/10'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {displayedEntries.map(entry => (
                                <AnimeListCard key={entry.id} entry={entry} />
                            ))}
                        </div>

                        {/* Empty tab state */}
                        {displayedEntries.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground font-medium">No anime in this category.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

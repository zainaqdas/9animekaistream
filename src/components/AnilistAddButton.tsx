'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BookmarkPlus, BookmarkCheck, Loader2, Search } from 'lucide-react';
import type { MediaListStatus, AniListEntry, AniListMediaSearchResult } from '@/lib/anilist';

interface Props {
    mediaId?: number;
    mediaTitle: string;
    totalEpisodes: number;
}

const STATUS_LABELS: Record<MediaListStatus, string> = {
    CURRENT: 'Watching',
    COMPLETED: 'Completed',
    PLANNING: 'Plan to Watch',
    DROPPED: 'Dropped',
    PAUSED: 'Paused',
    REPEATING: 'Rewatching',
};

export default function AnilistAddButton({ mediaId: propMediaId, mediaTitle, totalEpisodes }: Props) {
    const { user, loading: authLoading, login } = useAuth();
    const [entry, setEntry] = useState<AniListEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [mediaId, setMediaId] = useState<number | null>(propMediaId || null);

    // Auto-search for media ID by title
    const searchMediaId = useCallback(async () => {
        if (propMediaId) {
            setMediaId(propMediaId);
            return;
        }
        try {
            const res = await fetch(`/api/anilist/search?title=${encodeURIComponent(mediaTitle)}`);
            const data = await res.json();
            if (data.results?.length > 0) {
                setMediaId(data.results[0].id);
            }
        } catch {
            // silently fail - user can still click login/sign in
        }
    }, [propMediaId, mediaTitle]);

    const fetchEntry = useCallback(async () => {
        if (!user || !mediaId) return;
        setLoading(true);
        try {
            const res = await fetch('/api/anilist/list');
            const data = await res.json();
            if (data.collection) {
                for (const list of data.collection.lists) {
                    for (const e of list.entries) {
                        if (e.media.id === mediaId) {
                            setEntry(e);
                            return;
                        }
                    }
                }
            }
            setEntry(null);
        } catch {
            setEntry(null);
        } finally {
            setLoading(false);
        }
    }, [user, mediaId]);

    useEffect(() => {
        searchMediaId();
    }, [searchMediaId]);

    useEffect(() => {
        if (user && mediaId) fetchEntry();
    }, [user, mediaId, fetchEntry]);

    const handleAddToList = async (status: MediaListStatus) => {
        if (!user) {
            login();
            return;
        }
        if (!mediaId) return;
        setLoading(true);
        try {
            const res = await fetch('/api/anilist/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId,
                    status,
                    progress: status === 'COMPLETED' ? totalEpisodes : entry?.progress || 0,
                    id: entry?.id,
                }),
            });
            const data = await res.json();
            if (data.entry) setEntry(data.entry);
        } catch (e) {
            console.error('Failed to add to list:', e);
        } finally {
            setLoading(false);
            setShowStatusPicker(false);
        }
    };

    if (authLoading) return null;

    if (!user) {
        return (
            <button
                onClick={login}
                className="bg-white/5 hover:bg-accent hover:text-white border border-white/10 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105"
            >
                <BookmarkPlus size={20} />
                ADD TO LIST
            </button>
        );
    }

    if (!mediaId) {
        return (
            <button disabled className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 opacity-50">
                <Search size={20} />
                SEARCHING...
            </button>
        );
    }

    if (loading) {
        return (
            <button disabled className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 opacity-50">
                <Loader2 size={20} className="animate-spin" />
                LOADING
            </button>
        );
    }

    if (entry) {
        return (
            <div className="relative">
                <button
                    onClick={() => setShowStatusPicker(!showStatusPicker)}
                    className="bg-accent/20 text-accent border border-accent/30 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 w-full"
                >
                    <BookmarkCheck size={20} />
                    {STATUS_LABELS[entry.status as MediaListStatus] || entry.status}
                    {entry.progress > 0 && ` \u2022 ${entry.progress}${totalEpisodes ? `/${totalEpisodes}` : ''}`}
                </button>

                {showStatusPicker && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        {(['CURRENT', 'COMPLETED', 'PLANNING', 'DROPPED', 'PAUSED', 'REPEATING'] as MediaListStatus[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => handleAddToList(status)}
                                className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-white/5 transition-colors ${entry.status === status ? 'text-accent' : 'text-muted-foreground'}`}
                            >
                                {STATUS_LABELS[status]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowStatusPicker(!showStatusPicker)}
                className="bg-white/5 hover:bg-accent hover:text-white border border-white/10 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 w-full"
            >
                <BookmarkPlus size={20} />
                ADD TO LIST
            </button>

            {showStatusPicker && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                    {(['CURRENT', 'COMPLETED', 'PLANNING'] as MediaListStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => handleAddToList(status)}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-white/5 transition-colors"
                        >
                            {STATUS_LABELS[status]}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BookmarkPlus, Check, ChevronUp, Loader2 } from 'lucide-react';

interface Props {
    mediaId?: number;
    mediaTitle?: string;
    currentEpisode: number;
    totalEpisodes: number | null;
}

export default function AnilistProgress({ mediaId: propMediaId, mediaTitle, currentEpisode, totalEpisodes }: Props) {
    const { user, login } = useAuth();
    const [entry, setEntry] = useState<{ id?: number; progress: number; status: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [resolvedMediaId, setResolvedMediaId] = useState<number | null>(propMediaId || null);

    // Auto-search for media ID by title if not provided directly
    useEffect(() => {
        if (propMediaId) {
            setResolvedMediaId(propMediaId);
            return;
        }
        if (!mediaTitle) return;
        let cancelled = false;
        fetch(`/api/anilist/search?title=${encodeURIComponent(mediaTitle)}`)
            .then(r => r.json())
            .then(data => {
                if (!cancelled && data.results?.length > 0) {
                    setResolvedMediaId(data.results[0].id);
                }
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [propMediaId, mediaTitle]);

    const fetchEntry = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch('/api/anilist/list');
            const data = await res.json();
            if (data.collection) {
                for (const list of data.collection.lists) {
                    for (const e of list.entries) {
                        if (e.media.id === resolvedMediaId) {
                            setEntry({ id: e.id, progress: e.progress, status: e.status });
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
    }, [user, resolvedMediaId]);

    useEffect(() => {
        if (user && resolvedMediaId) fetchEntry();
    }, [user, resolvedMediaId, fetchEntry]);

    const handleSync = async () => {
        if (!user) {
            login();
            return;
        }

        setSyncing(true);
        try {
            const newProgress = Math.max(currentEpisode, entry?.progress || 0);
            const isComplete = totalEpisodes ? newProgress >= totalEpisodes : false;

            const res = await fetch('/api/anilist/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId: resolvedMediaId,
                    progress: newProgress,
                    status: isComplete ? 'COMPLETED' : entry?.status === 'COMPLETED' ? 'COMPLETED' : 'CURRENT',
                    id: entry?.id,
                }),
            });

            const data = await res.json();
            if (data.entry) {
                setEntry({ id: data.entry.id, progress: data.entry.progress, status: data.entry.status });
            }
        } catch (e) {
            console.error('Failed to sync progress:', e);
        } finally {
            setSyncing(false);
        }
    };

    if (!user && !loading) {
        return (
            <button
                onClick={login}
                className="bg-white/5 hover:bg-accent border border-white/10 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 uppercase tracking-wider"
            >
                <BookmarkPlus size={16} />
                {resolvedMediaId ? 'Track on AniList' : 'Sign in to Track'}
            </button>
        );
    }

    if (!resolvedMediaId) {
        return (
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Looking up anime...
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="bg-card border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
                    <div className="flex items-center gap-1">
                        {entry ? (
                            <>
                                <span className="text-sm font-bold text-accent">{entry.progress}</span>
                                {totalEpisodes && (
                                    <>
                                        <span className="text-muted-foreground">/</span>
                                        <span className="text-sm font-bold text-muted-foreground">{totalEpisodes}</span>
                                    </>
                                )}
                            </>
                        ) : (
                            <span className="text-sm font-bold text-muted-foreground">—</span>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={handleSync}
                disabled={syncing}
                className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20 uppercase tracking-wider"
            >
                {syncing ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <ChevronUp size={16} />
                )}
                {syncing ? 'Syncing...' : `EP ${currentEpisode}`}
            </button>
        </div>
    );
}

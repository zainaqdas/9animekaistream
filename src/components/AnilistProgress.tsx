'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { BookmarkCheck, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
    mediaId?: number | null;
    mediaTitle: string;
    currentEpisode: number;
    totalEpisodes?: number | null;
}

export default function AnilistProgress({ mediaId: propMediaId, mediaTitle, currentEpisode, totalEpisodes }: Props) {
    const { user, login } = useAuth();
    const [entry, setEntry] = useState<{ id: number; progress: number; status: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [mediaId, setMediaId] = useState<number | null>(propMediaId ?? null);

    // Fetch user's list to find existing entry
    const fetchList = useCallback(async (id: number) => {
        try {
            const res = await fetch('/api/anilist/list');
            if (!res.ok) return;
            const data = await res.json();
            for (const list of data.lists || []) {
                for (const e of list.entries || []) {
                    if (e.media.id === id) {
                        setEntry({ id: e.id, progress: e.progress, status: e.status });
                        return;
                    }
                }
            }
        } catch {}
    }, []);

    // Try to find existing entry for this media
    useEffect(() => {
        if (!user || !mediaId) return;
        fetchList(mediaId);
    }, [user, mediaId, fetchList]);

    const updateProgress = useCallback(async (newProgress: number) => {
        if (!mediaId || saving) return;
        setSaving(true);

        const status = totalEpisodes && newProgress >= totalEpisodes ? 'COMPLETED' : 'CURRENT';

        try {
            const res = await fetch('/api/anilist/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId,
                    progress: newProgress,
                    status,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setEntry({ id: data.id, progress: data.progress, status: data.status });
            }
        } catch {}
        setSaving(false);
    }, [mediaId, saving, totalEpisodes]);

    // Auto-sync if not yet tracked
    const syncEpisode = useCallback(async () => {
        if (!user || !mediaId || entry || saving || loading) return;

        // No existing entry — create one with progress = current episode
        setLoading(true);
        const status = totalEpisodes && currentEpisode >= totalEpisodes ? 'COMPLETED' : 'CURRENT';
        try {
            const res = await fetch('/api/anilist/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId,
                    progress: currentEpisode,
                    status,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setEntry({ id: data.id, progress: data.progress, status: data.status });
            }
        } catch {}
        setLoading(false);
    }, [user, mediaId, entry, saving, loading, currentEpisode, totalEpisodes]);

    if (!user) return null;

    return (
        <div className="bg-card rounded-2xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookmarkCheck size={16} className="text-accent" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        AniList Progress
                    </span>
                </div>
                {entry?.status === 'COMPLETED' && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                        Completed
                    </span>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-2">
                    <Loader2 className="animate-spin text-muted-foreground" size={18} />
                </div>
            ) : entry ? (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => updateProgress(Math.max(0, entry.progress - 1))}
                                disabled={saving || entry.progress <= 0}
                                className="p-1 rounded hover:bg-white/5 disabled:opacity-30 transition-all"
                            >
                                <ChevronDown size={16} />
                            </button>
                            <span className="font-bold text-lg min-w-[3ch] text-center tabular-nums">
                                {entry.progress}
                            </span>
                            <button
                                onClick={() => updateProgress(entry.progress + 1)}
                                disabled={saving || (totalEpisodes ? entry.progress >= totalEpisodes : false)}
                                className="p-1 rounded hover:bg-white/5 disabled:opacity-30 transition-all"
                            >
                                <ChevronUp size={16} />
                            </button>
                        </div>
                        {totalEpisodes && (
                            <span className="text-sm text-muted-foreground">/ {totalEpisodes}</span>
                        )}
                    </div>
                    {saving && <Loader2 className="animate-spin text-muted-foreground" size={16} />}
                    {!saving && entry.status !== 'COMPLETED' && (
                        <button
                            onClick={() => updateProgress(totalEpisodes || currentEpisode)}
                            className="text-xs text-accent hover:text-accent/80 font-bold transition-colors"
                        >
                            {totalEpisodes ? 'Catch Up' : 'Mark Current'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Not in your list</span>
                    <button
                        onClick={syncEpisode}
                        className="text-xs text-accent hover:text-accent/80 font-bold transition-colors"
                    >
                        Track Episode {currentEpisode}
                    </button>
                </div>
            )}
        </div>
    );
}

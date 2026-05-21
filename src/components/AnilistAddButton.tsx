'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import type { MediaListStatus } from '@/lib/anilist';
import { BookmarkPlus, BookmarkCheck, Loader2, Search, Check } from 'lucide-react';

interface Props {
    mediaId?: number | null;
    mediaTitle: string;
    totalEpisodes?: number | null;
}

interface SearchResult {
    id: number;
    title: { romaji: string; english: string | null; native: string | null };
    coverImage: { large: string | null };
    episodes: number | null;
    format: string | null;
    startDate: { year: number | null };
}

export default function AnilistAddButton({ mediaId: propMediaId, mediaTitle, totalEpisodes }: Props) {
    const { user, login, loading: authLoading } = useAuth();
    const [entry, setEntry] = useState<{ id: number; status: string; progress: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [mediaId, setMediaId] = useState<number | null>(propMediaId ?? null);

    const checkExistingEntry = useCallback(async (id: number) => {
        try {
            const res = await fetch('/api/anilist/list');
            if (!res.ok) return;
            const data = await res.json();
            for (const list of data.lists || []) {
                for (const e of list.entries || []) {
                    if (e.media.id === id) {
                        setEntry({ id: e.id, status: e.status, progress: e.progress });
                        return;
                    }
                }
            }
        } catch {}
    }, []);

    const addToList = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const res = await fetch('/api/anilist/entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaId: id,
                    status: 'PLANNING',
                    progress: 0,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setEntry({ id: data.id, status: 'PLANNING', progress: 0 });
                setMediaId(id);
                setSearchOpen(false);
            }
        } catch {}
        setLoading(false);
    }, []);

    const searchAnime = useCallback(async (query: string) => {
        if (!query.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(`/api/anilist/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.slice(0, 6));
            }
        } catch {}
        setSearching(false);
    }, []);

    if (authLoading) return null;

    if (!user) {
        return (
            <button
                onClick={login}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 border border-white/10"
            >
                <BookmarkPlus size={20} />
                ADD TO LIST
            </button>
        );
    }

    if (entry) {
        return (
            <div className="bg-accent/10 text-accent px-6 py-4 rounded-xl font-bold flex items-center gap-3 border border-accent/20">
                <BookmarkCheck size={20} />
                {entry.status === 'COMPLETED' ? 'Completed' :
                 entry.status === 'CURRENT' ? `Watching (Ep ${entry.progress})` :
                 entry.status === 'PLANNING' ? 'Plan to Watch' :
                 `${entry.status} (Ep ${entry.progress})`}
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setSearchOpen(true)}
                className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 border border-white/10"
            >
                <BookmarkPlus size={20} />
                ADD TO LIST
            </button>

            {/* Search Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-white/10 rounded-3xl p-6 w-full max-w-lg mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Search AniList</h3>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder={`Search for "${mediaTitle}"...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchAnime(searchQuery)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                                autoFocus
                            />
                            <Search className="absolute right-3 top-3 text-muted-foreground" size={18} />
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto">
                            {searching ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="animate-spin text-muted-foreground" size={24} />
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => addToList(result.id)}
                                        disabled={loading}
                                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5">
                                            {result.coverImage?.large && (
                                                <img
                                                    src={result.coverImage.large}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">
                                                {result.title.english || result.title.romaji}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {result.format} {result.startDate?.year && `• ${result.startDate.year}`} {result.episodes && `• ${result.episodes} eps`}
                                            </p>
                                        </div>
                                        {loading ? (
                                            <Loader2 className="animate-spin shrink-0" size={16} />
                                        ) : (
                                            <Check size={16} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-accent" />
                                        )}
                                    </button>
                                ))
                            ) : searchQuery ? (
                                <p className="text-center text-muted-foreground py-8 text-sm">
                                    No results. Try a different search term.
                                </p>
                            ) : (
                                <p className="text-center text-muted-foreground py-8 text-sm">
                                    Search for the anime on AniList to add it to your list.
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => { setSearchOpen(false); setSearchResults([]); setSearchQuery(''); }}
                            className="mt-4 w-full py-3 text-sm text-muted-foreground hover:text-white transition-colors font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

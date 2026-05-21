'use client';

import React from 'react';
import { AnimeSearchResult } from '@/lib/scraper';
import AnimeCard from './AnimeCard';

interface AnimeGridProps {
    title: string;
    animes: AnimeSearchResult[];
    loading?: boolean;
}

const AnimeGrid: React.FC<AnimeGridProps> = ({ title, animes, loading }) => {
    if (loading) {
        return (
            <section className="py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-card rounded-xl aspect-[2/3] animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    if (animes.length === 0) return null;

    return (
        <section className="py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight border-l-4 border-accent pl-4">{title}</h2>
                <button className="text-sm font-medium text-muted-foreground hover:text-accent transition-colors">
                    View All
                </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {animes.map((anime) => (
                    <AnimeCard key={anime.slug} anime={anime} />
                ))}
            </div>
        </section>
    );
};

export default AnimeGrid;

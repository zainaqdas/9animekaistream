'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimeSearchResult } from '@/lib/scraper';

interface AnimeCardProps {
    anime: AnimeSearchResult;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-card rounded-xl overflow-hidden shadow-lg aspect-[2/3]"
        >
            <Link href={`/anime/${anime.slug}`}>
                <div className="relative w-full h-full">
                    <img 
                        src={anime.image} 
                        alt={anime.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-accent p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                            <Play size={24} fill="white" className="text-white ml-1" />
                        </div>
                    </div>

                    {/* Version Tag */}
                    <div className="absolute top-2 left-2 flex gap-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${anime.version === 'Dub' ? 'bg-blue-600' : 'bg-accent'} text-white uppercase tracking-wider`}>
                            {anime.version}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-accent transition-colors">
                            {anime.title}
                        </h3>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default AnimeCard;

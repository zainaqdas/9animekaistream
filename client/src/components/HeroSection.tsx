'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeSearchResult } from '@/lib/scraper';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSectionProps {
    spotlight: AnimeSearchResult[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ spotlight }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying || spotlight.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % spotlight.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, spotlight.length]);

    if (spotlight.length === 0) return <div className="h-[70vh] bg-card animate-pulse rounded-3xl mt-20 mx-4 md:mx-12" />;

    const currentAnime = spotlight[currentIndex];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % spotlight.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + spotlight.length) % spotlight.length);
        setIsAutoPlaying(false);
    };

    return (
        <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden mt-16 bg-background">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Banner Image */}
                    <div className="absolute inset-0">
                        <img 
                            src={currentAnime.banner || currentAnime.image} 
                            alt={currentAnime.title}
                            className="w-full h-full object-cover object-center scale-105"
                        />
                        {/* Overlays for better text readability and cinematic look */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-center px-6 md:px-24 max-w-5xl space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <span className="bg-accent px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-accent/20 italic">
                                    Spotlight #{currentIndex + 1}
                                </span>
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                                    <Star size={12} fill="currentColor" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Top Rated</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] uppercase italic">
                                <span className="gradient-text">{currentAnime.title}</span>
                            </h1>

                            <p className="text-white/80 text-sm md:text-base max-w-xl line-clamp-3 mb-6 leading-relaxed font-medium drop-shadow-md">
                                {currentAnime.description || `Embark on an epic journey with ${currentAnime.title}. Experience a world filled with action, adventure, and breathtaking moments.`}
                            </p>

                            <div className="flex flex-wrap gap-4 pt-2">
                                <Link href={`/anime/${currentAnime.slug}`}>
                                    <button className="bg-accent hover:bg-accent/90 text-white px-8 py-3.5 rounded-xl font-black flex items-center gap-2.5 transition-all shadow-xl shadow-accent/30 hover:scale-105 active:scale-95 uppercase italic tracking-tighter text-sm">
                                        <Play size={18} fill="white" />
                                        Watch Now
                                    </button>
                                </Link>
                                <Link href={`/anime/${currentAnime.slug}`}>
                                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white px-8 py-3.5 rounded-xl font-black flex items-center gap-2.5 transition-all border border-white/10 hover:scale-105 active:scale-95 uppercase italic tracking-tighter text-sm">
                                        <Info size={18} />
                                        Details
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 right-6 md:right-24 flex gap-4 z-20">
                <button 
                    onClick={prevSlide}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-accent border border-white/10 hover:border-accent text-white transition-all backdrop-blur-md group shadow-xl"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={nextSlide}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-accent border border-white/10 hover:border-accent text-white transition-all backdrop-blur-md group shadow-xl"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-6 md:left-24 flex gap-2 z-20">
                {spotlight.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentIndex(index);
                            setIsAutoPlaying(false);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            index === currentIndex ? 'w-12 bg-accent shadow-lg shadow-accent/50' : 'w-3 bg-white/20 hover:bg-white/40'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;

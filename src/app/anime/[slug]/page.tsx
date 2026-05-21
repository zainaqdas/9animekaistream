import { getAnimeInfo } from '@/lib/scraper';
import { resolveAniListId } from '@/lib/anilist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnilistAddButton from '@/components/AnilistAddButton';
import { Play, Star, Calendar, Tv } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function AnimeDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const info = await getAnimeInfo(slug);

    if (!info) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Anime not found</h1>
            </div>
        );
    }

    // Auto-resolve AniList mapping
    const aniListId = await resolveAniListId(
        slug,
        info.title,
        info.year,
        info.episodes.length,
        info.type,
    );

    const firstEpisode = info.episodes[info.episodes.length - 1]; // Usually ep 1 is at the end of the list on 9anime
    const reversedEpisodes = [...info.episodes].reverse(); // Reversed copy for display

    return (
        <main className="min-h-screen">
            <Navbar />

            {/* Banner */}
            <div className="relative h-[40vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-accent/20 backdrop-blur-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-32 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Poster */}
                    <div className="w-full md:w-72 shrink-0 space-y-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[2/3] relative group">
                            <Image 
                                src={info.image} 
                                alt={info.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 288px"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={firstEpisode ? `/watch/${firstEpisode.slug}` : '#'}>
                                    <div className="bg-accent p-4 rounded-full scale-75 group-hover:scale-100 transition-transform duration-300">
                                        <Play fill="white" size={32} />
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl p-6 space-y-4 border border-white/5">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Status</span>
                                <span className={`text-sm font-bold ${info.status?.toLowerCase() === 'ongoing' ? 'text-green-400' : 'text-muted-foreground'}`}>{info.status || 'Airing'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Type</span>
                                <span className="text-sm font-bold">{info.type || 'TV Series'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Version</span>
                                <span className="text-sm font-bold px-2 py-0.5 rounded bg-accent/20 text-accent uppercase text-[10px] tracking-widest">{info.version}</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                {info.rating && (
                                    <>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            <span className="text-lg font-bold text-white">{info.rating}</span>
                                        </div>
                                        <span className="text-muted-foreground">•</span>
                                    </>
                                )}
                                {info.year && (
                                    <>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Calendar size={16} />
                                            <span className="text-sm font-medium">{info.year}</span>
                                        </div>
                                        <span className="text-muted-foreground">•</span>
                                    </>
                                )}
                                {info.type && (
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Tv size={16} />
                                        <span className="text-sm font-medium">{info.type}</span>
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight leading-tight uppercase italic">{info.title}</h1>
                            
                            <div className="flex gap-4">
                                <Link href={firstEpisode ? `/watch/${firstEpisode.slug}` : '#'} className="flex-1 md:flex-none">
                                    <button className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-xl shadow-accent/20">
                                        <Play fill="white" size={20} />
                                        WATCH NOW
                                    </button>
                                </Link>
                                <AnilistAddButton
                                    mediaId={aniListId}
                                    mediaTitle={info.title}
                                    totalEpisodes={info.episodes.length}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="w-1 h-6 bg-accent rounded-full" />
                                SYNOPSIS
                            </h2>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                {info.synopsis || "No synopsis available for this anime."}
                            </p>
                        </div>

                        {/* Episodes */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <span className="w-1 h-6 bg-accent rounded-full" />
                                    EPISODES
                                </h2>
                                <span className="text-muted-foreground text-sm font-medium">{info.episodes.length} Total</span>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                {reversedEpisodes.map((ep) => (
                                    <Link 
                                        key={ep.slug} 
                                        href={`/watch/${ep.slug}`}
                                        className="bg-card hover:bg-accent hover:text-white transition-all rounded-lg py-3 flex items-center justify-center text-sm font-bold border border-white/5 hover:scale-110 shadow-lg"
                                    >
                                        {ep.number}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

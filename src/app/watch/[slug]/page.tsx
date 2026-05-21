import { getStreamLinks, getAnimeInfo } from '@/lib/scraper';
import { resolveAniListId } from '@/lib/anilist';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import AnilistProgress from '@/components/AnilistProgress';
import Link from 'next/link';
import { ChevronLeft, List, Play } from 'lucide-react';

export default async function WatchPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const streams = await getStreamLinks(slug);
    
    // Extract anime slug from episode slug (rough heuristic for 9anime)
    // e.g. "one-piece-episode-1162" -> "one-piece"
    const animeSlugMatch = slug.match(/(.+)-episode-(\d+)/);
    const animeSlug = animeSlugMatch ? animeSlugMatch[1] : slug.split('-episode-')[0];
    const episodeNumber = animeSlugMatch ? parseInt(animeSlugMatch[2]) : 0;
    const info = await getAnimeInfo(animeSlug);

    // Auto-resolve AniList mapping
    const aniListId = info ? await resolveAniListId(
        animeSlug,
        info.title,
        info.year,
        info.episodes.length,
        info.type,
    ) : null;

    if (!streams || streams.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Stream not found</h1>
                <Link href="/" className="text-accent hover:underline">Go back home</Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Player & Info */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <Link 
                                href={`/anime/${animeSlug}`}
                                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm uppercase tracking-wider"
                            >
                                <ChevronLeft size={20} />
                                Back to Details
                            </Link>
                            <div className="flex items-center gap-4">
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold border border-white/10 uppercase tracking-widest">
                                    {slug.split('-').pop()?.replace('episode-', 'EP ')}
                                </span>
                            </div>
                        </div>

                        <VideoPlayer initialStreams={streams} />

                        {/* AniList Progress - shown below player */}
                        {aniListId && info && (
                            <AnilistProgress
                                mediaId={aniListId}
                                mediaTitle={info.title}
                                currentEpisode={episodeNumber}
                                totalEpisodes={info.episodes.length}
                            />
                        )}

                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
                                {info?.title} - Episode {slug.split('-').pop()}
                            </h1>
                            <p className="text-muted-foreground line-clamp-2 font-medium">
                                {info?.synopsis}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Episode Sidebar */}
                    <div className="w-full lg:w-96 shrink-0 space-y-6">
                        <div className="bg-card rounded-3xl p-6 border border-white/5 h-full max-h-[800px] flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <List size={20} className="text-accent" />
                                <h2 className="font-black italic uppercase tracking-wider">Episodes List</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                                {[...(info?.episodes || [])].reverse().map((ep) => (
                                    <Link
                                        key={ep.slug}
                                        href={`/watch/${ep.slug}`}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all border group ${
                                            slug === ep.slug
                                                ? 'bg-accent/10 border-accent/50 text-accent'
                                                : 'bg-white/5 border-transparent text-muted-foreground hover:bg-white/10 hover:border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                                                slug === ep.slug ? 'bg-accent text-white' : 'bg-white/10'
                                            }`}>
                                                {ep.number}
                                            </div>
                                            <span className="text-sm font-bold truncate max-w-[150px]">Episode {ep.number}</span>
                                        </div>
                                        <Play 
                                            size={16} 
                                            fill={slug === ep.slug ? "currentColor" : "none"}
                                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${slug === ep.slug ? 'opacity-100' : ''}`} 
                                        />
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

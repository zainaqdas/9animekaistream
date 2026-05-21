import { searchAnime } from '@/lib/scraper';
import AnimeGrid from '@/components/AnimeGrid';
import AnimeCard from '@/components/AnimeCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search } from 'lucide-react';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q: string }> }) {
    const { q } = await searchParams;
    const query = q || '';
    const results = query ? await searchAnime(query) : [];

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 md:px-12 pt-28 pb-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-accent">
                            <Search size={24} />
                            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Search Results</h1>
                        </div>
                        <p className="text-muted-foreground font-medium">
                            Showing results for: <span className="text-white italic">&quot;{query}&quot;</span>
                        </p>
                    </div>
                    
                    <div className="bg-card px-6 py-3 rounded-2xl border border-white/5 shadow-lg">
                        <span className="text-sm font-bold text-accent">{results.length}</span>
                        <span className="text-sm text-muted-foreground ml-2 uppercase tracking-widest font-black">Titles Found</span>
                    </div>
                </div>

                {results.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {results.map((anime) => (
                            <div key={anime.slug}>
                                {/* Using AnimeCard directly since AnimeGrid adds a section title */}
                                <AnimeCard anime={anime} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
                        <div className="bg-card p-6 rounded-full border border-white/5 mb-4">
                            <Search size={48} className="text-muted-foreground opacity-20" />
                        </div>
                        <h2 className="text-xl font-bold text-muted-foreground italic uppercase tracking-wider">No results found for &quot;{query}&quot;</h2>
                        <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
                            Try adjusting your search or check if the title is spelled correctly. You can also browse our trending section.
                        </p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}

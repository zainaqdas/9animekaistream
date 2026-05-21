import { getHomePageData } from '@/lib/scraper';
import HeroSection from '@/components/HeroSection';
import AnimeGrid from '@/components/AnimeGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function Home() {
    const { spotlight, popularToday, latestEpisodes, topAnime } = await getHomePageData();

    return (
        <main className="min-h-screen">
            <Navbar />
            
            <HeroSection spotlight={spotlight} />

            <div className="px-4 md:px-12 mt-12 md:mt-20 relative z-10 space-y-12">
                <AnimeGrid 
                    title="Trending Now" 
                    animes={popularToday} 
                />
                
                <AnimeGrid 
                    title="Latest Updates" 
                    animes={latestEpisodes} 
                />

                <AnimeGrid 
                    title="Top Airing" 
                    animes={topAnime} 
                />
            </div>

            <Footer />
        </main>
    );
}

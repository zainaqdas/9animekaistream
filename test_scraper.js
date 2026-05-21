const scraper = require('./src/api/scraper');

async function test() {
    console.log('--- Testing Search ---');
    const searchResults = await scraper.search('one piece');
    console.log(`Found ${searchResults.length} results.`);
    if (searchResults.length > 0) {
        console.log('First Result:', searchResults[0]);
        
        console.log('\n--- Testing Anime Info ---');
        const animeSlug = searchResults[0].slug;
        const info = await scraper.getAnimeInfo(animeSlug);
        console.log('Anime Title:', info ? info.title : 'Not Found');
        console.log(`Found ${info ? info.episodes.length : 0} episodes.`);
        
        if (info && info.episodes.length > 0) {
            console.log('\n--- Testing Stream Link ---');
            const episodeSlug = info.episodes[0].slug;
            console.log(`Fetching stream for: ${episodeSlug}`);
            const streams = await scraper.getStreamLinks(episodeSlug);
            console.log('Stream Info:', streams);
        }
    }
}

test();

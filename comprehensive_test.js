const scraper = require('./src/api/scraper');

const testTitles = [
    'Naruto',
    'Bleach',
    'Black Clover',
    'Solo Leveling',
    'Jujutsu Kaisen'
];

async function runComprehensiveTest() {
    console.log('🚀 Starting Comprehensive API Test...\n');

    for (const title of testTitles) {
        console.log(`--- Testing Title: "${title}" ---`);
        
        // 1. Test Search
        console.log(`🔍 Searching for "${title}"...`);
        const searchResults = await scraper.search(title);
        
        if (searchResults.length === 0) {
            console.log(`❌ No results found for "${title}"\n`);
            continue;
        }
        
        console.log(`✅ Found ${searchResults.length} results. First result slug: ${searchResults[0].slug} [${searchResults[0].version}]`);

        // 2. Test Anime Info
        const slug = searchResults[0].slug;
        console.log(`ℹ️ Fetching info for slug: "${slug}"...`);
        const info = await scraper.getAnimeInfo(slug);
        
        if (!info || info.episodes.length === 0) {
            console.log(`❌ Failed to fetch info or episodes for "${slug}"\n`);
            continue;
        }
        
        console.log(`✅ Title: "${info.title}" [${info.version}]`);
        console.log(`✅ Episodes Found: ${info.episodes.length}`);

        // 3. Test Stream Link (First and Last episode if possible)
        const firstEp = info.episodes[0];
        console.log(`📺 Fetching streams for Episode ${firstEp.number}: "${firstEp.slug}"...`);
        const streams = await scraper.getStreamLinks(firstEp.slug);
        
        if (streams && streams.length > 0) {
            console.log(`✅ Found ${streams.length} stream servers:`);
            streams.forEach(s => console.log(`   - [${s.server}]: ${s.link}`));
        } else {
            console.log(`❌ Failed to fetch stream links for "${firstEp.slug}"`);
        }
        
        console.log('\n');
    }

    console.log('🏁 Testing Complete.');
}

runComprehensiveTest();

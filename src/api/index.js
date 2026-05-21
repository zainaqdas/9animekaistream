const express = require('express');
const cors = require('cors');
const scraper = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to 9anime Scraper API',
        endpoints: {
            search: '/api/search?q=query',
            animeInfo: '/api/anime/:slug',
            streamLink: '/api/episode/:slug'
        }
    });
});

// Search route
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    const results = await scraper.search(query);
    res.json(results);
});

// Anime Info route
app.get('/api/anime/:slug', async (req, res) => {
    const slug = req.params.slug;
    const info = await scraper.getAnimeInfo(slug);
    if (!info) {
        return res.status(404).json({ error: 'Anime not found' });
    }
    res.json(info);
});

// Stream Link route
app.get('/api/episode/:slug', async (req, res) => {
    const slug = req.params.slug;
    const streams = await scraper.getStreamLinks(slug);
    if (!streams || streams.length === 0) {
        return res.status(404).json({ error: 'Stream links not found' });
    }
    res.json(streams);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

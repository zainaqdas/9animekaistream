const axios = require('axios');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');

const BASE_URL = 'https://9anime.org.lv';

const client = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    httpAgent: new http.Agent({ family: 4 }),
    httpsAgent: new https.Agent({ family: 4 }),
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
});

// Cache System
const cache = new Map();
const CACHE_TTL = {
    SEARCH: 24 * 60 * 60 * 1000,    // 24 hours
    INFO: 15 * 60 * 1000,           // 15 mins
    STREAMS: 2 * 60 * 60 * 1000     // 2 hours
};

function getFromCache(key, ttl) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data;
    }
    return null;
}

function setToCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Search for anime (fetches all pages)
 */
async function search(query) {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cachedData = getFromCache(cacheKey, CACHE_TTL.SEARCH);
    if (cachedData) return cachedData;

    let allResults = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
        while (hasNextPage && currentPage <= 10) {
            const url = currentPage === 1 
                ? `/?s=${encodeURIComponent(query)}` 
                : `/page/${currentPage}/?s=${encodeURIComponent(query)}`;
            
            const response = await client.get(url);
            const $ = cheerio.load(response.data);
            const pageResults = [];

            $('.listupd article').each((i, el) => {
                const titleAttr = $(el).find('a').attr('title') || '';
                const link = $(el).find('a').attr('href') || '';
                const image = $(el).find('img').attr('src') || '';
                const slug = link ? link.replace(BASE_URL + '/anime/', '').replace(BASE_URL, '').replace(/\//g, '') : null;
                
                let version = 'Sub';
                if (titleAttr.toLowerCase().includes('(dub)') || slug.toLowerCase().includes('-dub')) {
                    version = 'Dub';
                }

                const title = titleAttr.replace(/ Episode \d+$/i, '').trim();

                if (title && slug) {
                    pageResults.push({ title, slug, image, link, version });
                }
            });

            if (pageResults.length === 0) {
                hasNextPage = false;
            } else {
                allResults = [...allResults, ...pageResults];
                const nextLink = $('.pagination a.next').length > 0;
                if (nextLink) {
                    currentPage++;
                } else {
                    hasNextPage = false;
                }
            }
        }

        setToCache(cacheKey, allResults);
        return allResults;
    } catch (error) {
        console.error('Search error:', error);
        return allResults;
    }
}

/**
 * Get anime info and episode list
 */
async function getAnimeInfo(slug) {
    const cacheKey = `info:${slug}`;
    const cachedData = getFromCache(cacheKey, CACHE_TTL.INFO);
    if (cachedData) return cachedData;

    try {
        const response = await client.get(`/anime/${slug}/`);
        const $ = cheerio.load(response.data);
        
        const title = $('.entry-title').text().trim();
        const synopsis = $('.entry-content p').text().trim();
        const episodes = [];

        let version = 'Sub';
        if (title.toLowerCase().includes('(dub)') || slug.toLowerCase().includes('-dub')) {
            version = 'Dub';
        }

        $('.eplister ul li').each((i, el) => {
            const epNum = $(el).find('.epl-num').text().trim();
            const epLink = $(el).find('a').attr('href');
            const epSlug = epLink ? epLink.replace(BASE_URL + '/', '').replace(BASE_URL, '').replace(/\//g, '') : null;
            
            if (epNum && epSlug) {
                episodes.push({
                    number: epNum,
                    slug: epSlug,
                    link: epLink
                });
            }
        });

        const result = { title, synopsis, episodes, version };
        setToCache(cacheKey, result);
        return result;
    } catch (error) {
        console.error('Get anime info error:', error);
        return null;
    }
}

/**
 * Get all available stream links for an episode
 */
async function getStreamLinks(episodeSlug) {
    const cacheKey = `streams:${episodeSlug}`;
    const cachedData = getFromCache(cacheKey, CACHE_TTL.STREAMS);
    if (cachedData) return cachedData;

    try {
        const response = await client.get(`/${episodeSlug}/`);
        const $ = cheerio.load(response.data);
        const streams = [];

        $('select.mirror option').each((i, el) => {
            const base64Value = $(el).attr('value');
            const serverName = $(el).text().trim();

            if (base64Value && base64Value !== "") {
                try {
                    const decodedIframe = Buffer.from(base64Value, 'base64').toString('utf8');
                    const $iframe = cheerio.load(decodedIframe);
                    const src = $iframe('iframe').attr('src');
                    
                    if (src) {
                        const normalizedLink = src.startsWith('//') ? `https:${src}` : src;
                        streams.push({
                            server: serverName,
                            link: normalizedLink
                        });
                    }
                } catch (e) {
                    console.error('Error decoding mirror:', e);
                }
            }
        });

        if (streams.length === 0) {
            const defaultIframeSrc = $('#pembed iframe').attr('src');
            if (defaultIframeSrc) {
                streams.push({
                    server: 'Default',
                    link: defaultIframeSrc
                });
            }
        }

        setToCache(cacheKey, streams);
        return streams;
    } catch (error) {
        console.error('Get stream links error:', error);
        return [];
    }
}

module.exports = {
    search,
    getAnimeInfo,
    getStreamLinks
};

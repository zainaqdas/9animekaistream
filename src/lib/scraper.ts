import axios from 'axios';
import * as cheerio from 'cheerio';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';

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

// Rate limiting: small delay between consecutive requests to be respectful
const RATE_LIMIT_DELAY_MS = 300;
let lastRequestTime = 0;

async function rateLimitedDelay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_DELAY_MS) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
}

// Cache System
const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'kaistream');
const CACHE_FILE = path.join(CACHE_DIR, 'cache.json');

interface CacheEntry {
    data: unknown;
    timestamp: number;
}

let cache = new Map<string, CacheEntry>();

// Load cache from disk on startup
function loadCacheFromDisk(): void {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const raw = fs.readFileSync(CACHE_FILE, 'utf-8');
            const parsed = JSON.parse(raw) as Record<string, CacheEntry>;
            cache = new Map(Object.entries(parsed));
        }
    } catch (e) {
        console.error('Failed to load cache from disk:', e);
    }
}

function saveCacheToDisk(): void {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }
        const obj = Object.fromEntries(cache.entries());
        fs.writeFileSync(CACHE_FILE, JSON.stringify(obj), 'utf-8');
    } catch (e) {
        console.error('Failed to save cache to disk:', e);
    }
}

// Load existing cache on module initialization
loadCacheFromDisk();

const CACHE_TTL = {
    SEARCH: 24 * 60 * 60 * 1000,    // 24 hours (titles are stable)
    INFO: 15 * 60 * 1000,           // 15 mins (catch new episodes)
    STREAMS: 2 * 60 * 60 * 1000,    // 2 hours (links are stable)
    HOME_LATEST: 5 * 60 * 1000,     // 5 mins (fresh updates)
};

function getFromCache<T>(key: string, ttl: number): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
        return cached.data as T;
    }
    return null;
}

function setToCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
    // Persist to disk asynchronously
    saveCacheToDisk();
}

export interface AnimeSearchResult {
    title: string;
    slug: string;
    image: string;
    banner?: string;
    description?: string;
    link: string;
    version: 'Sub' | 'Dub';
}

export interface Episode {
    number: string;
    slug: string;
    link: string;
}

export interface AnimeInfo {
    title: string;
    synopsis: string;
    image: string;
    episodes: Episode[];
    version: 'Sub' | 'Dub';
    rating?: string;
    year?: string;
    type?: string;
    status?: string;
}

export interface StreamServer {
    server: string;
    link: string;
}

export interface HomePageData {
    spotlight: AnimeSearchResult[];
    latestEpisodes: AnimeSearchResult[];
}

/**
 * Search for anime (fetches all pages)
 */
export async function searchAnime(query: string): Promise<AnimeSearchResult[]> {
    const cacheKey = `search:${query.toLowerCase()}`;
    const cachedData = getFromCache<AnimeSearchResult[]>(cacheKey, CACHE_TTL.SEARCH);
    if (cachedData) return cachedData;

    let allResults: AnimeSearchResult[] = [];
    let currentPage = 1;
    let hasNextPage = true;

    try {
        while (hasNextPage && currentPage <= 10) {
            await rateLimitedDelay();
            const url = currentPage === 1 
                ? `/?s=${encodeURIComponent(query)}` 
                : `/page/${currentPage}/?s=${encodeURIComponent(query)}`;
            
            const response = await client.get(url);
            const $ = cheerio.load(response.data);
            const pageResults: AnimeSearchResult[] = [];

            $('.listupd article').each((i, el) => {
                const titleAttr = $(el).find('a').attr('title') || '';
                const link = $(el).find('a').attr('href') || '';
                const image = $(el).find('img').attr('src') || '';
                const slug = link ? link.replace(BASE_URL + '/anime/', '').replace(BASE_URL, '').replace(/\//g, '') : '';
                
                let version: 'Sub' | 'Dub' = 'Sub';
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
 * Get data for the homepage with granular caching
 */
export async function getHomePageData(): Promise<HomePageData> {
    // Try to get individual components from cache first
    const cachedSpotlight = getFromCache<AnimeSearchResult[]>('home_spotlight', CACHE_TTL.SEARCH);
    const cachedLatest = getFromCache<AnimeSearchResult[]>('home_latest', CACHE_TTL.HOME_LATEST);

    // If all are cached, return immediately
    if (cachedSpotlight && cachedLatest) {
        return {
            spotlight: cachedSpotlight,
            latestEpisodes: cachedLatest
        };
    }

    try {
        await rateLimitedDelay();
        const response = await client.get('/');
        const $ = cheerio.load(response.data);
        
        // Extract Spotlight Slider
        const spotlight: AnimeSearchResult[] = [];
        $('#slidertwo .item').each((i, el) => {
            const title = $(el).find('h2 a').text().trim();
            const link = $(el).find('h2 a').attr('href') || '';
            const description = $(el).find('.info p').text().trim();
            const bannerStyle = $(el).find('.backdrop').attr('style') || '';
            const bannerMatch = bannerStyle.match(/url\(['"]?([^'"]+)['"]?\)/);
            const banner = bannerMatch ? bannerMatch[1] : '';
            const slug = link ? link.replace(BASE_URL + '/anime/', '').replace(BASE_URL, '').replace(/\//g, '') : '';

            if (title && slug) {
                spotlight.push({
                    title,
                    slug,
                    image: '', 
                    banner,
                    description,
                    link,
                    version: 'Sub'
                });
            }
        });

        const extractFromSection = (selector: string) => {
            const results: AnimeSearchResult[] = [];
            const section = $(selector);
            section.find('article.bs').each((i, el) => {
                const titleAttr = $(el).find('a').attr('title') || '';
                const link = $(el).find('a').attr('href') || '';
                const image = $(el).find('img').attr('src') || '';
                let slug = link ? link.replace(BASE_URL + '/anime/', '').replace(BASE_URL, '').replace(/\//g, '') : '';
                
                const epMatch = slug.match(/(.+)-episode-\d+/);
                if (epMatch) slug = epMatch[1];

                let version: 'Sub' | 'Dub' = 'Sub';
                if (titleAttr.toLowerCase().includes('(dub)') || slug.toLowerCase().includes('-dub')) {
                    version = 'Dub';
                }

                const title = titleAttr.replace(/ Episode \d+$/i, '').trim();

                if (title && slug) {
                    results.push({ title, slug, image, link, version });
                }
            });
            return results;
        };

        const latestEpisodes = extractFromSection('.releases.latesthome + .listupd').slice(0, 24);

        // Update caches
        setToCache('home_spotlight', spotlight);
        setToCache('home_latest', latestEpisodes);

        return {
            spotlight: spotlight.length > 0 ? spotlight : cachedSpotlight || [],
            latestEpisodes: latestEpisodes.length > 0 ? latestEpisodes : cachedLatest || []
        };
    } catch (error) {
        console.error('Get homepage data error:', error);
        return { 
            spotlight: cachedSpotlight || [],
            latestEpisodes: cachedLatest || [] 
        };
    }
}

/**
 * Get anime info and episode list
 */
export async function getAnimeInfo(slug: string): Promise<AnimeInfo | null> {
    const cacheKey = `info:${slug}`;
    const cachedData = getFromCache<AnimeInfo>(cacheKey, CACHE_TTL.INFO);
    if (cachedData) return cachedData;

    try {
        await rateLimitedDelay();
        const response = await client.get(`/anime/${slug}/`);
        const $ = cheerio.load(response.data);
        
        const title = $('.entry-title').text().trim();
        const synopsis = $('.entry-content p').text().trim();
        const image = $('.thumb img').attr('src') || '';
        const episodes: Episode[] = [];

        let version: 'Sub' | 'Dub' = 'Sub';
        if (title.toLowerCase().includes('(dub)') || slug.toLowerCase().includes('-dub')) {
            version = 'Dub';
        }

        // Scrape additional metadata: rating, year, type, status
        const rating = $('.rating .num, .rtp .num, .post-ratings .num').first().text().trim() || undefined;
        const type = $('.type').first().text().trim() || undefined;
        const status = $('.status, .anime-status').first().text().trim() || undefined;

        // Try to extract year from synopsis or content
        let year: string | undefined;
        const contentText = $('.entry-content').text();
        const yearMatch = contentText.match(/\b(19\d{2}|20\d{2})\b/);
        if (yearMatch) year = yearMatch[1];

        $('.eplister ul li').each((i, el) => {
            const epNum = $(el).find('.epl-num').text().trim();
            const epLink = $(el).find('a').attr('href') || '';
            const epSlug = epLink ? epLink.replace(BASE_URL + '/', '').replace(BASE_URL, '').replace(/\//g, '') : '';
            
            if (epNum && epSlug) {
                episodes.push({
                    number: epNum,
                    slug: epSlug,
                    link: epLink
                });
            }
        });

        const result: AnimeInfo = { title, synopsis, image, episodes, version, rating, year, type, status };
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
export async function getStreamLinks(episodeSlug: string): Promise<StreamServer[]> {
    const cacheKey = `streams:${episodeSlug}`;
    const cachedData = getFromCache<StreamServer[]>(cacheKey, CACHE_TTL.STREAMS);
    if (cachedData) return cachedData;

    try {
        await rateLimitedDelay();
        const response = await client.get(`/${episodeSlug}/`);
        const $ = cheerio.load(response.data);
        const streams: StreamServer[] = [];

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
                const normalizedLink = defaultIframeSrc.startsWith('//') ? `https:${defaultIframeSrc}` : defaultIframeSrc;
                streams.push({
                    server: 'Default',
                    link: normalizedLink
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

import axios from 'axios';
import fs from 'fs';
import path from 'path';

// ─── AniList API ────────────────────────────────────────────────────────────

const ANILIST_API = 'https://graphql.anilist.co';
const AUTH_URL = 'https://anilist.co/api/v2/oauth/authorize';
const TOKEN_URL = 'https://anilist.co/api/v2/oauth/token';

const client = axios.create({
    baseURL: ANILIST_API,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

// ─── GraphQL Queries ────────────────────────────────────────────────────────

const SEARCH_MEDIA = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
      id
      idMal
      title { romaji english native }
      startDate { year }
      episodes
      format
      status
      averageScore
      coverImage { large }
      bannerImage
      description
      genres
    }
  }
}`;

const GET_MEDIA_BY_ID = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    idMal
    title { romaji english }
    startDate { year }
    episodes
    format
    status
  }
}`;

const GET_VIEWER = `
query {
  Viewer {
    id
    name
    avatar { large medium }
    bannerImage
    about
    statistics {
      anime { count episodesWatched minutesWatched }
    }
  }
}`;

const GET_USER_LIST = `
query ($userId: Int, $type: MediaType) {
  MediaListCollection(userId: $userId, type: $type) {
    lists {
      name
      isCustomList
      entries {
        id
        progress
        status
        score
        media {
          id
          idMal
          title { romaji english }
          coverImage { large }
          episodes
          format
          status
          startDate { year }
        }
      }
    }
  }
}`;

const SAVE_ENTRY = `
mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus, $score: Float) {
  SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, score: $score) {
    id
    mediaId
    progress
    status
    score
  }
}`;

const DELETE_ENTRY = `
mutation ($id: Int) {
  DeleteMediaListEntry(id: $id) {
    deleted
  }
}`;

// ─── Types ──────────────────────────────────────────────────────────────────

export type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

export interface AniListMedia {
    id: number;
    idMal: number | null;
    title: { romaji: string; english: string | null; native: string | null };
    startDate: { year: number | null };
    episodes: number | null;
    format: string | null;
    status: string | null;
    averageScore: number | null;
    coverImage: { large: string | null };
    bannerImage: string | null;
    description: string | null;
    genres: string[] | null;
}

export interface AniListViewer {
    id: number;
    name: string;
    avatar: { large: string; medium: string };
    bannerImage: string | null;
    about: string | null;
    statistics: {
        anime: { count: number; episodesWatched: number; minutesWatched: number };
    } | null;
}

export interface AniListEntry {
    id: number;
    progress: number;
    status: MediaListStatus;
    score: number;
    media: AniListMedia;
}

export interface AniListCollection {
    lists: { name: string; entries: AniListEntry[] }[];
}

// ─── Mapping Cache ──────────────────────────────────────────────────────────

interface MappingEntry {
    aniListId: number;
    confirmed: boolean;
}

interface MappingData {
    mappings: Record<string, MappingEntry>;
    overrides: Record<string, number>;
    failed: Record<string, string>; // slug → title (so we know what failed)
}

const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'anilist');
const MAPPING_FILE = path.join(CACHE_DIR, 'mapping.json');

let mappingData: MappingData = { mappings: {}, overrides: {}, failed: {} };

function loadMapping(): void {
    try {
        if (fs.existsSync(MAPPING_FILE)) {
            const raw = fs.readFileSync(MAPPING_FILE, 'utf-8');
            mappingData = JSON.parse(raw);
        }
    } catch (e) {
        console.error('Failed to load AniList mapping:', e);
    }
}

function saveMapping(): void {
    try {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }
        fs.writeFileSync(MAPPING_FILE, JSON.stringify(mappingData, null, 2), 'utf-8');
    } catch (e) {
        console.error('Failed to save AniList mapping:', e);
    }
}

// Load on module init
loadMapping();

// ─── GraphQL Request ────────────────────────────────────────────────────────

async function graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}, token?: string | null, retries = 3): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await client.post<{ data: T }>('/', { query, variables }, { headers });
            return response.data.data;
        } catch (error: unknown) {
            if (attempt < retries && axios.isAxiosError(error) && error.response?.status === 429) {
                const waitSeconds = Math.min(60, Math.pow(2, attempt) * 5);
                console.warn(`AniList rate limited (429), retry ${attempt + 1}/${retries} in ${waitSeconds}s...`);
                await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000));
                continue;
            }
            throw error;
        }
    }
    throw new Error('Unreachable');
}

// ─── Title Normalization ────────────────────────────────────────────────────

function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/\(dub\)/gi, '')
        .replace(/\(sub\)/gi, '')
        .replace(/\(tv\)/gi, '')
        .replace(/\(movie\)/gi, '')
        .replace(/\(ona\)/gi, '')
        .replace(/\(ova\)/gi, '')
        .replace(/\(ona\)/gi, '')
        .replace(/[\(\)\[\]\{\}]/g, '')
        .replace(/['']/g, "'")
        .replace(/[""]/g, '"')
        .replace(/[:;,._\-–—]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function getTitleTokens(title: string): Set<string> {
    return new Set(
        normalizeTitle(title)
            .split(/\s+/)
            .filter(t => t.length > 2 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can'].includes(t))
    );
}

function titleSimilarity(title1: string, title2: string): number {
    const tokens1 = getTitleTokens(title1);
    const tokens2 = getTitleTokens(title2);

    if (tokens1.size === 0 || tokens2.size === 0) return 0;

    let intersection = 0;
    for (const token of tokens1) {
        for (const token2 of tokens2) {
            if (token === token2 || (token.length > 4 && token2.length > 4 && (token.includes(token2) || token2.includes(token)))) {
                intersection++;
                break;
            }
        }
    }

    const union = new Set([...tokens1, ...tokens2]);
    return intersection / union.size;
}

// ─── Auto-Matching ──────────────────────────────────────────────────────────

export interface MatchResult {
    aniListId: number;
    confidence: number;
    matchedTitle: string;
}

export function getCachedMapping(slug: string): number | null {
    // Check overrides first (highest priority)
    if (mappingData.overrides[slug]) return mappingData.overrides[slug];
    // Check auto-mapped
    if (mappingData.mappings[slug]) return mappingData.mappings[slug].aniListId;
    return null;
}

export function isFailedSlug(slug: string): boolean {
    return slug in mappingData.failed;
}

function setMapping(slug: string, aniListId: number, confirmed: boolean): void {
    mappingData.mappings[slug] = { aniListId, confirmed };
    delete mappingData.failed[slug];
    saveMapping();
}

function setFailed(slug: string, title: string): void {
    mappingData.failed[slug] = title;
    saveMapping();
}

export function setManualOverride(slug: string, aniListId: number): void {
    mappingData.overrides[slug] = aniListId;
    delete mappingData.failed[slug];
    saveMapping();
}

export function removeManualOverride(slug: string): void {
    delete mappingData.overrides[slug];
    saveMapping();
}

/**
 * Normalize a 9anime slug into a searchable title
 * e.g. "kimetsu-no-yaiba-hashira-training-arc-dub" → "kimetsu no yaiba hashira training arc"
 */
function slugToSearchable(slug: string): string {
    return slug
        .replace(/-dub$/i, '')
        .replace(/-sub$/i, '')
        .replace(/[-]/g, ' ')
        .trim();
}

/**
 * Search AniList for a media entry matching the given parameters.
 * Uses the 9anime slug as a hint when the title is ambiguous.
 */
export async function searchAniList(title: string): Promise<AniListMedia[]> {
    const data = await graphqlRequest<{ Page: { media: AniListMedia[] } }>(SEARCH_MEDIA, {
        search: title,
        page: 1,
        perPage: 8,
    });
    return data.Page.media;
}

/**
 * Resolve a 9anime slug + metadata to an AniList ID.
 * Uses mapping cache first, then runs auto-matching, then caches the result.
 */
export async function resolveAniListId(
    slug: string,
    title: string,
    year?: string | null,
    episodeCount?: number | null,
    format?: string | null,
): Promise<number | null> {
    // 0. Check cache first
    const cached = getCachedMapping(slug);
    if (cached) return cached;
    if (isFailedSlug(slug)) return null;

    // 1. Try searching by the full title
    const cleanedTitle = normalizeTitle(title);
    const searchTerms = cleanedTitle || slugToSearchable(slug);

    let candidates: AniListMedia[];
    try {
        candidates = await searchAniList(searchTerms);
    } catch (error) {
        console.error(`AniList search error for "${searchTerms}":`, error);
        return null;
    }

    if (candidates.length === 0) {
        // Try with just the slug-derived title
        try {
            candidates = await searchAniList(slugToSearchable(slug));
        } catch {
            setFailed(slug, title);
            return null;
        }
        if (candidates.length === 0) {
            setFailed(slug, title);
            return null;
        }
    }

    // 2. Score candidates
    interface ScoredCandidate {
        media: AniListMedia;
        score: number;
    }

    const scored: ScoredCandidate[] = candidates.map(media => {
        let score = 0;

        // Title similarity (0-60 points)
        const romajiSim = titleSimilarity(title, media.title.romaji);
        const englishSim = media.title.english ? titleSimilarity(title, media.title.english) : 0;
        const slugSim = titleSimilarity(slugToSearchable(slug), media.title.romaji);

        const bestTitleScore = Math.max(romajiSim, englishSim, slugSim);
        score += bestTitleScore * 60;

        // Year match (0-20 points)
        if (year && media.startDate?.year) {
            const yearNum = parseInt(year);
            if (yearNum === media.startDate.year) {
                score += 20;
            } else if (Math.abs(yearNum - media.startDate.year) === 1) {
                score += 10; // Close year
            }
        }

        // Episode count match (0-10 points)
        if (episodeCount && media.episodes) {
            const diff = Math.abs(episodeCount - media.episodes);
            if (diff === 0) score += 10;
            else if (diff <= 2) score += 7;
            else if (diff <= 5) score += 4;
            else if (diff <= 10) score += 2;
        }

        // Format match (0-10 points)
        if (format && media.format) {
            const normalizedFormat = format.toLowerCase();
            const mediaFormat = media.format.toLowerCase();
            if (normalizedFormat === mediaFormat) score += 10;
            else if (
                (normalizedFormat.includes('tv') && mediaFormat.includes('tv')) ||
                (normalizedFormat.includes('movie') && mediaFormat.includes('movie'))
            ) score += 5;
        }

        return { media, score };
    });

    // 3. Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    if (scored.length === 0) {
        setFailed(slug, title);
        return null;
    }

    const best = scored[0];

    // 4. Determine confidence
    const confirmed = best.score >= 70;
    if (best.score >= 40) {
        setMapping(slug, best.media.id, confirmed);
        return best.media.id;
    }

    // Low confidence or no good match — if there's a runner-up close in score,
    // don't auto-map (too ambiguous)
    if (scored.length > 1 && scored[1].score >= best.score - 15) {
        setFailed(slug, title);
        return null;
    }

    // Weak match but no competition — still map as unconfirmed
    setMapping(slug, best.media.id, false);
    return best.media.id;
}

// ─── OAuth ──────────────────────────────────────────────────────────────────

export function getAuthorizationUrl(): string {
    const clientId = process.env.ANILIST_CLIENT_ID;
    if (!clientId) {
        console.error('ANILIST_CLIENT_ID environment variable is not set');
        return '#';
    }
    const redirectUri = getRedirectUri();
    return `${AUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;
}

export function getRedirectUri(): string {
    return process.env.ANILIST_REDIRECT_URI || 'http://localhost:3000/api/auth/anilist/callback';
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
    const clientId = process.env.ANILIST_CLIENT_ID;
    const clientSecret = process.env.ANILIST_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
        throw new Error('ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET must be set');
    }
    const response = await axios.post<TokenResponse>(TOKEN_URL, {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: getRedirectUri(),
        code,
        grant_type: 'authorization_code',
    }, {
        headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
}

// ─── User / List Operations ─────────────────────────────────────────────────

export async function getViewer(token: string): Promise<AniListViewer> {
    const data = await graphqlRequest<{ Viewer: AniListViewer }>(GET_VIEWER, {}, token);
    return data.Viewer;
}

export async function getAnimeList(userId: number, token: string): Promise<AniListCollection> {
    const data = await graphqlRequest<{ MediaListCollection: AniListCollection }>(
        GET_USER_LIST,
        { userId, type: 'ANIME' },
        token
    );
    return data.MediaListCollection;
}

export async function saveListEntry(
    mediaId: number,
    token: string,
    progress?: number,
    status?: MediaListStatus,
    score?: number,
): Promise<{ id: number; mediaId: number; progress: number; status: string; score: number | null }> {
    const vars: Record<string, unknown> = { mediaId };
    if (progress !== undefined) vars.progress = progress;
    if (status) vars.status = status;
    if (score !== undefined) vars.score = score;

    const data = await graphqlRequest<{ SaveMediaListEntry: { id: number; mediaId: number; progress: number; status: string; score: number | null } }>(
        SAVE_ENTRY,
        vars,
        token
    );
    return data.SaveMediaListEntry;
}

export async function deleteListEntry(entryId: number, token: string): Promise<boolean> {
    const data = await graphqlRequest<{ DeleteMediaListEntry: { deleted: boolean } }>(DELETE_ENTRY, { id: entryId }, token);
    return data.DeleteMediaListEntry.deleted;
}

// ─── Search for User's Anime (with mapping) ─────────────────────────────────

export interface MappedSearchResult {
    aniListId: number;
    title: string;
    image: string | null;
    episodes: number | null;
    format: string | null;
}

export async function searchForUser(title: string, token?: string | null): Promise<AniListMedia[]> {
    return searchAniList(title);
}

// ─── Media Fetching ─────────────────────────────────────────────────────────

export async function getMediaById(id: number): Promise<AniListMedia | null> {
    try {
        const data = await graphqlRequest<{ Media: AniListMedia }>(GET_MEDIA_BY_ID, { id });
        return data.Media;
    } catch {
        return null;
    }
}

const ANILIST_API = 'https://graphql.anilist.co';
const AUTH_URL = 'https://anilist.co/api/v2/oauth/authorize';
const TOKEN_URL = 'https://anilist.co/api/v2/oauth/token';

// ── GraphQL Queries ──────────────────────────────────────────

const SEARCH_MEDIA_QUERY = `
  query ($search: String, $type: MediaType) {
    Page(page: 1, perPage: 5) {
      media(search: $search, type: $type) {
        id
        title { romaji english }
        coverImage { large medium }
        format
        episodes
        averageScore
      }
    }
  }
`;

const VIEWER_QUERY = `
  query {
    Viewer {
      id
      name
      avatar {
        large
        medium
      }
      siteUrl
    }
  }
`;

const ANIME_LIST_QUERY = `
  query ($userId: Int, $type: MediaType) {
    MediaListCollection(userId: $userId, type: $type) {
      lists {
        name
        isCustomList
        entries {
          id
          status
          score
          progress
          progressVolumes
          repeat
          priority
          notes
          startedAt { year month day }
          completedAt { year month day }
          updatedAt
          media {
            id
            title { romaji english native }
            coverImage { large medium }
            type
            format
            status
            episodes
            averageScore
            genres
            isAdult
          }
        }
      }
    }
  }
`;

const SAVE_ENTRY_MUTATION = `
  mutation ($mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $repeat: Int, $notes: String, $id: Int) {
    SaveMediaListEntry(mediaId: $mediaId, status: $status, score: $score, progress: $progress, repeat: $repeat, notes: $notes, id: $id) {
      id
      status
      score
      progress
      progressVolumes
      repeat
      priority
      notes
      startedAt { year month day }
      completedAt { year month day }
      updatedAt
      media {
        id
        title { romaji english }
        coverImage { large medium }
        episodes
      }
    }
  }
`;

const DELETE_ENTRY_MUTATION = `
  mutation ($id: Int) {
    DeleteMediaListEntry(id: $id) {
      deleted
    }
  }
`;

// ── Types ────────────────────────────────────────────────────

export interface AniListViewer {
    id: number;
    name: string;
    avatar: { large: string; medium: string };
    siteUrl: string;
}

export interface AniListMedia {
    id: number;
    title: { romaji: string; english: string | null; native: string | null };
    coverImage: { large: string; medium: string };
    type: string;
    format: string;
    status: string;
    episodes: number | null;
    averageScore: number | null;
    genres: string[];
    isAdult: boolean;
}

export interface AniListMediaSearchResult {
    id: number;
    title: { romaji: string; english: string | null };
    coverImage: { large: string; medium: string };
    format: string;
    episodes: number | null;
    averageScore: number | null;
}

export interface AniListEntry {
    id: number;
    status: string;
    score: number;
    progress: number;
    progressVolumes: number | null;
    repeat: number;
    priority: number;
    notes: string | null;
    startedAt: { year: number | null; month: number | null; day: number | null };
    completedAt: { year: number | null; month: number | null; day: number | null };
    updatedAt: number;
    media: AniListMedia;
}

export interface AniListCollection {
    lists: {
        name: string;
        isCustomList: boolean;
        entries: AniListEntry[];
    }[];
}

export type MediaListStatus = 'CURRENT' | 'PLANNING' | 'COMPLETED' | 'DROPPED' | 'PAUSED' | 'REPEATING';

// ── Helpers ──────────────────────────────────────────────────

function getClientId(): string {
    return process.env.ANILIST_CLIENT_ID || '';
}

function getClientSecret(): string {
    return process.env.ANILIST_CLIENT_SECRET || '';
}

function getRedirectUri(): string {
    return process.env.ANILIST_REDIRECT_URI || 'http://localhost:3000/api/auth/anilist/callback';
}

async function graphqlRequest<T>(query: string, variables: Record<string, unknown> = {}, token?: string): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(ANILIST_API, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
        throw new Error(json.errors[0]?.message || 'AniList API error');
    }

    return json.data as T;
}

// ── Auth ─────────────────────────────────────────────────────

export function getAuthorizationUrl(): string {
    const params = new URLSearchParams({
        client_id: getClientId(),
        redirect_uri: getRedirectUri(),
        response_type: 'code',
    });
    return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: getClientId(),
            client_secret: getClientSecret(),
            redirect_uri: getRedirectUri(),
            code,
        }),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Token exchange failed: ${text}`);
    }

    return res.json();
}

// ── API Methods ──────────────────────────────────────────────

export async function searchMedia(token: string | null, title: string): Promise<AniListMediaSearchResult[]> {
    const data = await graphqlRequest<{ Page: { media: AniListMediaSearchResult[] } }>(
        SEARCH_MEDIA_QUERY,
        { search: title, type: 'ANIME' },
        token || undefined
    );
    return data.Page.media;
}

export async function getViewer(token: string): Promise<AniListViewer> {
    const data = await graphqlRequest<{ Viewer: AniListViewer }>(VIEWER_QUERY, {}, token);
    return data.Viewer;
}

export async function getAnimeList(token: string, userId: number): Promise<AniListCollection | null> {
    const data = await graphqlRequest<{ MediaListCollection: AniListCollection | null }>(
        ANIME_LIST_QUERY,
        { userId, type: 'ANIME' },
        token
    );
    return data.MediaListCollection;
}

export async function saveListEntry(
    token: string,
    variables: {
        mediaId?: number;
        status?: MediaListStatus;
        score?: number;
        progress?: number;
        repeat?: number;
        notes?: string;
        id?: number;
    }
): Promise<AniListEntry> {
    const data = await graphqlRequest<{ SaveMediaListEntry: AniListEntry }>(
        SAVE_ENTRY_MUTATION,
        variables,
        token
    );
    return data.SaveMediaListEntry;
}

export async function deleteListEntry(token: string, entryId: number): Promise<boolean> {
    const data = await graphqlRequest<{ DeleteMediaListEntry: { deleted: boolean } }>(
        DELETE_ENTRY_MUTATION,
        { id: entryId },
        token
    );
    return data.DeleteMediaListEntry.deleted;
}

// Find a user's list entry for a specific media ID
export function findEntryInCollection(collection: AniListCollection | null, mediaId: number): AniListEntry | null {
    if (!collection) return null;
    for (const list of collection.lists) {
        for (const entry of list.entries) {
            if (entry.media.id === mediaId) return entry;
        }
    }
    return null;
}

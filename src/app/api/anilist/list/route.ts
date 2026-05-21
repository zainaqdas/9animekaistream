import { NextRequest, NextResponse } from 'next/server';
import { getViewer, getAnimeList } from '@/lib/anilist';

export async function GET(request: NextRequest) {
    const token = request.cookies.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const viewer = await getViewer(token);
        const list = await getAnimeList(viewer.id, token);
        return NextResponse.json(list);
    } catch (error) {
        console.error('AniList list API error:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}

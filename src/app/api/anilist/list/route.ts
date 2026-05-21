import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getViewer, getAnimeList } from '@/lib/anilist';

export async function GET(_req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const viewer = await getViewer(token);
        const collection = await getAnimeList(token, viewer.id);
        return NextResponse.json({ collection, viewer });
    } catch (error) {
        console.error('Failed to fetch anime list:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}

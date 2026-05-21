import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { searchMedia } from '@/lib/anilist';

export async function GET(req: NextRequest) {
    const title = req.nextUrl.searchParams.get('title');

    if (!title) {
        return NextResponse.json({ error: 'Title parameter required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('anilist_token')?.value || null;

    try {
        const results = await searchMedia(token, title);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('Failed to search AniList:', error);
        return NextResponse.json({ results: [] });
    }
}

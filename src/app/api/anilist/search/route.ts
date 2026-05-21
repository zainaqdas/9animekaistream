import { NextRequest, NextResponse } from 'next/server';
import { searchAniList } from '@/lib/anilist';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    try {
        const results = await searchAniList(query);
        return NextResponse.json(results);
    } catch (error) {
        console.error('AniList search API error:', error);
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}

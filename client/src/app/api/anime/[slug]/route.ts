import { getAnimeInfo } from '@/lib/scraper';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        const info = await getAnimeInfo(slug);
        if (!info) {
            return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
        }
        return NextResponse.json(info);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

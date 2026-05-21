import { getStreamLinks } from '@/lib/scraper';
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
        const streams = await getStreamLinks(slug);
        if (!streams || streams.length === 0) {
            return NextResponse.json({ error: 'Stream links not found' }, { status: 404 });
        }
        return NextResponse.json(streams);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

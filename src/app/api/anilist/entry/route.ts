import { NextRequest, NextResponse } from 'next/server';
import { saveListEntry, deleteListEntry } from '@/lib/anilist';

export async function POST(request: NextRequest) {
    const token = request.cookies.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { mediaId, progress, status, score } = body;

        if (!mediaId) {
            return NextResponse.json({ error: 'mediaId is required' }, { status: 400 });
        }

        const result = await saveListEntry(mediaId, token, progress, status, score);
        return NextResponse.json(result);
    } catch (error) {
        console.error('AniList entry save error:', error);
        return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const token = request.cookies.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const entryId = searchParams.get('entryId');

        if (!entryId) {
            return NextResponse.json({ error: 'entryId is required' }, { status: 400 });
        }

        await deleteListEntry(parseInt(entryId), token);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('AniList entry delete error:', error);
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}

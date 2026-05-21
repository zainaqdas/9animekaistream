import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { saveListEntry, deleteListEntry } from '@/lib/anilist';

export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { mediaId, status, score, progress, notes, id } = body;

        const entry = await saveListEntry(token, {
            mediaId,
            status,
            score,
            progress,
            notes,
            id,
        });

        return NextResponse.json({ entry });
    } catch (error) {
        console.error('Failed to save list entry:', error);
        return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('anilist_token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { entryId } = await req.json();
        await deleteListEntry(token, entryId);
        return NextResponse.json({ deleted: true });
    } catch (error) {
        console.error('Failed to delete list entry:', error);
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}

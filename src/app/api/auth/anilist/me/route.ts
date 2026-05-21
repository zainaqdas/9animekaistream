import { NextRequest, NextResponse } from 'next/server';
import { getViewer } from '@/lib/anilist';

export async function GET(request: NextRequest) {
    const cookieStore = request.cookies;
    const userCookie = cookieStore.get('anilist_user');
    const tokenCookie = cookieStore.get('anilist_token');

    if (!userCookie || !tokenCookie) {
        return NextResponse.json({ user: null });
    }

    try {
        const user = JSON.parse(userCookie.value);
        // Refresh viewer data from AniList
        const viewer = await getViewer(tokenCookie.value);
        return NextResponse.json({ user: viewer });
    } catch {
        // Token might be expired, return cached user data
        try {
            const user = JSON.parse(userCookie.value);
            return NextResponse.json({ user });
        } catch {
            return NextResponse.json({ user: null });
        }
    }
}

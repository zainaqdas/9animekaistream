import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getViewer } from '@/lib/anilist';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
        const tokenData = await exchangeCodeForToken(code);
        const viewer = await getViewer(tokenData.access_token);

        const response = NextResponse.redirect(new URL('/profile', request.url));

        response.cookies.set('anilist_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
        });

        response.cookies.set('anilist_user', JSON.stringify({
            id: viewer.id,
            name: viewer.name,
            avatar: viewer.avatar,
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('AniList auth callback error:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
}

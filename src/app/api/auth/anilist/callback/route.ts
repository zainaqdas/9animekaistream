import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getViewer } from '@/lib/anilist';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', req.url));
    }

    try {
        const tokenData = await exchangeCodeForToken(code);
        const viewer = await getViewer(tokenData.access_token);

        // Store token and user info in httpOnly cookies
        const response = NextResponse.redirect(new URL('/', req.url));

        response.cookies.set('anilist_token', tokenData.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });

        response.cookies.set('anilist_user', JSON.stringify({
            id: viewer.id,
            name: viewer.name,
            avatar: viewer.avatar,
        }), {
            httpOnly: false, // Allow client to read user info
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('AniList auth error:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', req.url));
    }
}

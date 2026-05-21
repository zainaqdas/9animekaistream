import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.json({ loggedOut: true });

    response.cookies.set('anilist_token', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/',
    });

    response.cookies.set('anilist_user', '', {
        httpOnly: false,
        maxAge: 0,
        path: '/',
    });

    return response;
}

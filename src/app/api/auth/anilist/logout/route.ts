import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(new URL('/', origin));
    response.cookies.set('anilist_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('anilist_user', '', { maxAge: 0, path: '/' });
    return response;
}

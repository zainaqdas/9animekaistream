import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('anilist_user');

    if (!userCookie) {
        return NextResponse.json({ user: null });
    }

    try {
        const user = JSON.parse(userCookie.value);
        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null });
    }
}

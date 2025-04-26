import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/auth/sign-in'];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;


    if (!token) {
        const loginUrl = new URL('/auth/sign-in', req.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        const loginUrl = new URL('/auth/sign-in', req.url);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ['/project/:path*'],
};
import { NextResponse } from 'next/server';

const rateLimitMap = new Map();

export function middleware(req) {
    const ip = req.headers.get('x-forwarded-for');
    const now = Date.now();

    const data = rateLimitMap.get(ip) || {
        count: 0,
        startTime: now
    };

    if (now - data.startTime > 60000) {
        data.count = 1;
        data.startTime = now;
    } else {
        data.count++;
    }

    rateLimitMap.set(ip, data);

    if (data.count > 10) {
        return new NextResponse(
            JSON.stringify({
                error: 'Terlalu banyak request'
            }), {
                status: 429
            }
        );

    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};

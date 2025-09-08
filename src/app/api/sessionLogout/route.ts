/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/sessionLogout/route.ts
// This API route clears the session cookie
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const response = NextResponse.json({ status: 'success' }, { status: 200 });

    // Clear the session cookie by setting its value to empty and maxAge to 0
    response.cookies.set({
        name: 'session',
        value: '',
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    });

    return response;
}
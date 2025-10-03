/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    return NextResponse.json({
        status: 'OK',
        message: 'Epilux Water API Server is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
}
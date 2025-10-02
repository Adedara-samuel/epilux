/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Simulate health checks
        const timestamp = new Date().toISOString();

        // Mock uptime calculation (in a real app, this would come from process uptime)
        const uptime = process.uptime();
        const uptimeString = `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`;

        // Mock database check
        const dbStart = Date.now();
        // Simulate database query delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
        const dbResponseTime = Date.now() - dbStart;

        // Mock services check
        const services = [
            {
                name: 'Authentication Service',
                status: 'up' as const,
                responseTime: Math.floor(Math.random() * 100) + 20,
            },
            {
                name: 'Product Service',
                status: 'up' as const,
                responseTime: Math.floor(Math.random() * 100) + 15,
            },
            {
                name: 'Order Service',
                status: 'up' as const,
                responseTime: Math.floor(Math.random() * 100) + 25,
            },
            {
                name: 'Payment Gateway',
                status: Math.random() > 0.95 ? 'down' as const : 'up' as const,
                responseTime: Math.floor(Math.random() * 200) + 50,
            },
        ];

        // Determine overall health status
        const allServicesHealthy = services.every(service => service.status === 'up');
        const dbHealthy = dbResponseTime < 1000; // Consider healthy if response < 1s

        const overallStatus = allServicesHealthy && dbHealthy ? 'healthy' : 'unhealthy';

        const healthData = {
            status: overallStatus,
            timestamp,
            uptime: uptimeString,
            database: {
                status: dbHealthy ? 'connected' : 'disconnected',
                responseTime: dbResponseTime,
            },
            services,
        };

        return NextResponse.json(healthData, { status: 200 });
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed',
            },
            { status: 500 }
        );
    }
}
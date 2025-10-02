// app/health/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Activity, CheckCircle, XCircle, RefreshCw, Server, Database, Clock } from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  services: {
    name: string;
    status: 'up' | 'down';
    responseTime: number;
  }[];
}

export default function HealthPage() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }

      const data = await response.json();
      setHealthData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'up':
        return 'text-green-600';
      case 'unhealthy':
      case 'disconnected':
      case 'down':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'up':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'unhealthy':
      case 'disconnected':
      case 'down':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Server className="h-10 w-10 text-blue-600" />
            System Health Check
          </h1>
          <p className="text-lg text-gray-600">
            Monitor the health and status of all system components and services
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <Button
            onClick={checkHealth}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Refresh Health Status'}
          </Button>
        </div>

        {error && (
          <Card className="p-6 mb-6 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Health Check Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {loading && !healthData && (
          <Card className="p-8 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Checking system health...</p>
          </Card>
        )}

        {healthData && (
          <div className="space-y-6">
            {/* Overall Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Overall Status</h2>
                <div className="flex items-center gap-2">
                  {getStatusIcon(healthData.status)}
                  <span className={`font-semibold capitalize ${getStatusColor(healthData.status)}`}>
                    {healthData.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Check</p>
                    <p className="font-medium">{new Date(healthData.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Uptime</p>
                    <p className="font-medium">{healthData.uptime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Database className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Database</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(healthData.database.status)}
                      <span className={`font-medium ${getStatusColor(healthData.database.status)}`}>
                        {healthData.database.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({healthData.database.responseTime}ms)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Services Status */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Services Status</h2>
              <div className="space-y-3">
                {healthData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <span className="font-medium text-gray-900">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${getStatusColor(service.status)}`}>
                        {service.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {service.responseTime}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Information */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Environment</h3>
                  <p className="text-gray-600">Production</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Version</h3>
                  <p className="text-gray-600">1.0.0</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Node.js Version</h3>
                  <p className="text-gray-600">{process.env.NODE_ENV || 'Unknown'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Last Deployment</h3>
                  <p className="text-gray-600">Recent</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
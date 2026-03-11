// src/Components/GoogleMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

import { Loader } from '@googlemaps/js-api-loader';
declare global {
  interface Window {
    google: any;
  }
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'pending' | 'in_transit' | 'delivered';
}

interface GoogleMapProps {
  orders?: Order[];
  selectedOrder?: Order | null;
  showDirections?: boolean;
  height?: string;
  className?: string;
}

export default function GoogleMap({
  orders = [],
  selectedOrder = null,
  showDirections = false,
  height = '400px',
  className = ''
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLng | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      try {
        await new Promise<void>((resolve, reject) => {
          loader.loadCallback((e: any) => {
            if (e) reject(e);
            else resolve();
          });
        });

        if (mapRef.current && window.google) {
          const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: { lat: 6.5244, lng: 3.3792 }, // Lagos, Nigeria
            zoom: 12,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          setMap(mapInstance);

          // Initialize directions service
          const directionsServiceInstance = new window.google.maps.DirectionsService();
          const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
            map: mapInstance,
            suppressMarkers: true, // We'll add our own markers
          });

          setDirectionsService(directionsServiceInstance);
          setDirectionsRenderer(directionsRendererInstance);

          // Get current location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const currentPos = new google.maps.LatLng(
                  position.coords.latitude,
                  position.coords.longitude
                );
                setCurrentLocation(currentPos);

                // Add current location marker
                new google.maps.Marker({
                  position: currentPos,
                  map: mapInstance,
                  title: 'Your Location',
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(24, 24),
                  },
                });
              },
              (error) => {
                console.error('Error getting current location:', error);
              }
            );
          }
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, []);

  // Update markers when orders change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for orders
    orders.forEach((order) => {
      const marker = new google.maps.Marker({
        position: order.coordinates,
        map: map,
        title: `${order.customerName} - Order ${order.orderNumber}`,
        icon: getOrderIcon(order.status),
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px;">Order ${order.orderNumber}</h3>
            <p style="margin: 4px 0;"><strong>Customer:</strong> ${order.customerName}</p>
            <p style="margin: 4px 0;"><strong>Address:</strong> ${order.address}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${order.status.replace('_', ' ').toUpperCase()}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (orders.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      orders.forEach(order => bounds.extend(order.coordinates));
      if (currentLocation) bounds.extend(currentLocation);
      map.fitBounds(bounds);

      // Don't zoom in too much
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    }
  }, [map, orders, currentLocation]);

  // Handle directions for selected order
  useEffect(() => {
    if (!map || !directionsService || !directionsRenderer || !currentLocation || !selectedOrder || !showDirections) {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
        directionsRenderer.setMap(map);
      }
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: currentLocation,
      destination: selectedOrder.coordinates,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Directions request failed:', status);
      }
    });
  }, [map, directionsService, directionsRenderer, currentLocation, selectedOrder, showDirections]);

  const getOrderIcon = (status: Order['status']) => {
    const icons = {
      pending: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#F59E0B" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">P</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
      },
      in_transit: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">T</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
      },
      delivered: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#10B981" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">D</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
      },
    };

    return icons[status];
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="rounded-lg border"
      />
      {!map && (
        <div
          style={{ height, width: '100%' }}
          className="rounded-lg border bg-gray-100 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
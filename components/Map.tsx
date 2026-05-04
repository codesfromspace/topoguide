'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export interface Location {
  location_name: string;
  country: string;
  what_happens_here: string;
  what_hero_sees: string;
  latitude: number;
  longitude: number;
}

interface MapProps {
  locations: Location[];
}

export default function Map({ locations }: MapProps) {
  // Center map on the first location, or default to Europe
  const defaultCenter: [number, number] = locations.length > 0 
    ? [locations[0].latitude, locations[0].longitude] 
    : [48.8566, 2.3522]; // Paris default

  // Extract coordinates for the polyline path
  const path: [number, number][] = locations.map(loc => [loc.latitude, loc.longitude]);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
      <MapContainer 
        center={defaultCenter} 
        zoom={locations.length > 0 ? 5 : 4} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((loc, index) => (
          <Marker 
            key={`${loc.location_name}-${index}`} 
            position={[loc.latitude, loc.longitude]}
            icon={icon}
          >
            <Popup>
              <div className="max-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex items-center justify-center bg-blue-600 text-white w-5 h-5 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <strong className="text-base text-gray-900">{loc.location_name}</strong>
                </div>
                <div className="text-sm text-gray-500 mb-2">{loc.country}</div>
                <p className="text-sm text-gray-800 mb-2"><strong>Děj:</strong> {loc.what_happens_here}</p>
                <p className="text-sm text-gray-800"><strong>Co vidí:</strong> {loc.what_hero_sees}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {locations.length > 1 && (
          <Polyline 
            positions={path} 
            color="#3b82f6" 
            weight={3} 
            opacity={0.7} 
            dashArray="10, 10" 
          />
        )}
      </MapContainer>
    </div>
  );
}

'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Create a custom modern glowing icon
const createCustomIcon = (index: number) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        border: 2px solid rgba(255,255,255,0.8);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        transform: translateY(-15px);
      ">
        ${index + 1}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};


export interface Location {
  location_name: string;
  country: string;
  what_happens_here: string;
  what_hero_sees: string;
  interesting_fact?: string;
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
    <div className="h-full w-full rounded-2xl overflow-hidden glass-panel">
      <MapContainer 
        center={defaultCenter} 
        zoom={locations.length > 0 ? 5 : 4} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {locations.map((loc, index) => (
          <Marker 
            key={`${loc.location_name}-${index}`} 
            position={[loc.latitude, loc.longitude]}
            icon={createCustomIcon(index)}
          >
            <Popup>
              <div className="max-w-[260px]">
                <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
                  <span className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white w-6 h-6 rounded-full text-xs font-bold shadow-lg shadow-blue-500/30">
                    {index + 1}
                  </span>
                  <div>
                    <strong className="text-base text-gray-100 block leading-tight">{loc.location_name}</strong>
                    <span className="text-xs text-gray-400">{loc.country}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong className="text-blue-400 font-semibold block text-xs uppercase tracking-wider mb-1">Děj</strong>
                    {loc.what_happens_here}
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <strong className="text-purple-400 font-semibold block text-xs uppercase tracking-wider mb-1">Co vidí</strong>
                    {loc.what_hero_sees}
                  </p>
                  {loc.interesting_fact && (
                    <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-2 rounded border border-white/5">
                      <strong className="text-yellow-400 font-semibold block text-xs uppercase tracking-wider mb-1">Zajímavost</strong>
                      {loc.interesting_fact}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <a 
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${loc.latitude},${loc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
                  >
                    🚶‍♂️ Otevřít ve Street View
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {locations.length > 1 && (
          <Polyline 
            positions={path} 
            color="#60a5fa" 
            weight={3} 
            opacity={0.6} 
            dashArray="8, 8" 
          />
        )}
      </MapContainer>
    </div>
  );
}

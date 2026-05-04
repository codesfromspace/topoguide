'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, BookOpen, Loader2, Search } from 'lucide-react';
import { Location } from '../components/Map';

// Dynamically import Map component with ssr disabled
const MapComponent = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <span className="ml-2 text-gray-500">Načítám mapu...</span>
    </div>
  )
});

export default function Home() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Location[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setLocations(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Něco se pokazilo');
      }

      setLocations(data.locations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex flex-col font-sans">
      <header className="max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold tracking-tight">Topografický průvodce</h1>
        </div>
        
        <form onSubmit={analyzeBook} className="relative max-w-2xl">
          <div className="relative flex items-center w-full h-14 rounded-full focus-within:shadow-lg bg-white overflow-hidden border border-gray-300">
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <Search className="h-6 w-6 text-gray-400" />
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 bg-transparent"
              type="text"
              id="search"
              placeholder="Zadejte název knihy a autora (např. Šifra mistra Leonarda, Dan Brown)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            /> 
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 h-full font-medium disabled:bg-blue-300 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
              {loading ? 'Hledám...' : 'Objevit cestu'}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg max-w-2xl border border-red-100">
            {error}
          </div>
        )}
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of locations */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            Itinerář cesty
          </h2>
          
          {!locations && !loading && (
             <div className="text-center text-gray-400 py-10">
               Zadejte knihu a prozkoumejte místa, kudy hrdina procházel.
             </div>
          )}

          {loading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex gap-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {locations && locations.map((loc, index) => (
            <div key={index} className="relative pl-8 pb-8 last:pb-0">
              {/* Timeline line */}
              {index !== locations.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-px bg-blue-200"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-xs font-bold text-blue-800">
                {index + 1}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1">{loc.location_name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-3">{loc.country}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">Děj</span>
                    <p className="text-sm text-gray-700">{loc.what_happens_here}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 block mb-1">Co hrdina vidí</span>
                    <p className="text-sm text-gray-700">{loc.what_hero_sees}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-[600px] lg:h-auto bg-gray-200 rounded-xl overflow-hidden relative shadow-inner">
          <MapComponent locations={locations || []} />
        </div>
      </div>
    </main>
  );
}

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, BookOpen, Loader2, Search, Compass, Map as MapIcon, ArrowRight } from 'lucide-react';
import { Location } from '../components/Map';

// Dynamically import Map component with ssr disabled
const MapComponent = dynamic(() => import('../components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center glass-panel rounded-2xl">
      <div className="relative">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
        <Compass className="w-12 h-12 text-blue-400 animate-[spin_3s_linear_infinite]" />
      </div>
      <span className="mt-6 text-sm font-medium text-blue-400 tracking-widest uppercase">Inicializace satelitů...</span>
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
    <main className="min-h-screen bg-[#0f1117] text-gray-200 p-4 md:p-8 flex flex-col font-sans relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>

      <header className="max-w-6xl mx-auto w-full mb-10 mt-4 relative z-10 animate-fade-in stagger-1">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Gemini AI Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
            TopoGuide
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Zadejte knihu a prozkoumejte interaktivní mapu reálných míst, kterými hrdina procházel.
          </p>
        </div>
        
        <form onSubmit={analyzeBook} className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center w-full h-16 rounded-full bg-[#171b26] border border-white/10 shadow-2xl focus-within:border-blue-500/50 transition-all overflow-hidden pr-2 pl-6">
            <Search className="h-6 w-6 text-blue-400 shrink-0" />
            <input
              className="h-full w-full outline-none text-base text-gray-200 bg-transparent px-4 placeholder-gray-500"
              type="text"
              placeholder="Např. Šifra mistra Leonarda, Dan Brown"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            /> 
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all text-white px-6 py-2.5 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapIcon className="w-5 h-5" />}
              {loading ? 'Skenuji...' : 'Mapovat'}
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-6 p-4 bg-red-900/30 text-red-300 rounded-xl max-w-2xl mx-auto border border-red-500/30 backdrop-blur-md flex items-center justify-center animate-fade-in">
            {error}
          </div>
        )}
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 animate-fade-in stagger-2">
        {/* Left Column: Itinerary */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-3 text-white">
            <Compass className="w-5 h-5 text-purple-400" />
            Chronologický itinerář
          </h2>
          
          {!locations && !loading && (
             <div className="flex flex-col items-center justify-center text-center h-64 text-gray-500">
               <BookOpen className="w-12 h-12 mb-4 opacity-20" />
               <p>Zadejte titul a objevte trasu</p>
             </div>
          )}

          {loading && (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse"></div>
                    <div className="h-16 bg-white/5 rounded w-full animate-pulse mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {locations && locations.map((loc, index) => (
            <div key={index} className="relative pl-10 pb-10 last:pb-0 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Timeline line */}
              {index !== locations.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 to-transparent"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#171b26] border border-blue-500/50 flex items-center justify-center text-xs font-bold text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] z-10">
                {index + 1}
              </div>
              
              <div className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:border-blue-500/30">
                <h3 className="font-bold text-lg text-white leading-tight mb-1 flex items-center justify-between">
                  {loc.location_name}
                  <ArrowRight className="w-4 h-4 text-blue-500/0 group-hover:text-blue-400 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                </h3>
                <p className="text-xs font-medium text-purple-400 mb-4">{loc.country}</p>
                
                <div className="space-y-4">
                  <div className="bg-[#0f1117]/50 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-1">Co se stalo</span>
                    <p className="text-sm text-gray-300">{loc.what_happens_here}</p>
                  </div>
                  <div className="bg-[#0f1117]/50 p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block mb-1">Pohled hrdiny</span>
                    <p className="text-sm text-gray-300">{loc.what_hero_sees}</p>
                  </div>
                  {loc.interesting_fact && (
                    <div className="bg-[#0f1117]/50 p-3 rounded-lg border border-yellow-500/20">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 block mb-1">Zajímavost</span>
                      <p className="text-sm text-gray-300 italic">{loc.interesting_fact}</p>
                    </div>
                  )}
                  <a 
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${loc.latitude},${loc.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-blue-500/30 w-full justify-center"
                  >
                    <MapPin className="w-3 h-3" />
                    Prozkoumat ve Street View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2 h-[600px] lg:h-auto rounded-2xl relative shadow-2xl border border-white/10 overflow-hidden animate-fade-in stagger-3">
          <MapComponent locations={locations || []} />
          
          {/* Overlay to give it an inset shadow feel */}
          <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] z-20"></div>
        </div>
      </div>
    </main>
  );
}

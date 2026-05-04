# 🗺️ TopoGuide (Topografický průvodce knihami)

Interaktivní webová aplikace, která pomocí umělé inteligence (Google Gemini) vyhledává geografické lokace ze zadaných knih a vykresluje trasu hlavního hrdiny na reálné mapě.

## Funkce
- AI extrakce lokací a děje z knihy
- Automatický odhad GPS souřadnic
- Interaktivní mapa trasy (Leaflet)
- Chronologický itinerář

## Technologie
- Next.js 15 (App Router)
- React
- Tailwind CSS
- react-leaflet (Mapy OpenStreetMap)
- Google GenAI SDK (Gemini 2.5 Flash)

## Lokální spuštění

1. Klonujte repozitář
2. Nainstalujte závislosti:
```bash
npm install
```
3. Vytvořte soubor `.env.local` v kořenovém adresáři a vložte svůj API klíč:
```env
GEMINI_API_KEY=vas_klic_zde
```
4. Spusťte vývojový server:
```bash
npm run dev
```

Aplikace poběží na [http://localhost:3000](http://localhost:3000).

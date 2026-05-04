import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Není zadán dotaz' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Chybí GEMINI_API_KEY v konfiguraci' }, { status: 500 });
    }

    // Define the schema for the expected JSON response
    const locationSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          location_name: {
            type: Type.STRING,
            description: "Přesný název místa (např. Muzeum Louvre, Náměstí sv. Petra)"
          },
          country: {
            type: Type.STRING,
            description: "Země, ve které se místo nachází"
          },
          what_happens_here: {
            type: Type.STRING,
            description: "Krátký popis (1-2 věty), jaký klíčový děj se zde odehrává"
          },
          what_hero_sees: {
            type: Type.STRING,
            description: "Krátký popis toho, co zde hlavní hrdina vidí nebo objevuje"
          },
          latitude: {
            type: Type.NUMBER,
            description: "Odhadovaná zeměpisná šířka (např. 48.8606 pro Louvre)"
          },
          longitude: {
            type: Type.NUMBER,
            description: "Odhadovaná zeměpisná délka (např. 2.3376 pro Louvre)"
          }
        },
        required: ["location_name", "country", "what_happens_here", "what_hero_sees", "latitude", "longitude"]
      }
    };

    const prompt = `Jsi literární geograf. Analyzuj následující knihu nebo sérii: "${query}". 
Vypiš chronologicky všechny klíčové reálné geografické lokace, kterými hlavní hrdina prochází.
Pokud se kniha odehrává na fiktivním místě (např. Pán Prstenů, Harry Potter - Bradavice), pokus se buď identifikovat reálná místa natáčení, nebo reálné inspirace, a pokud to nejde, vymysli přibližné (byť fiktivní) souřadnice na Zemi, aby se to dalo vykreslit na mapu, a do popisu uveď, že jde o fiktivní místo.

Vrať seznam míst ve stanoveném JSON formátu.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: locationSchema,
        temperature: 0.2, // Low temperature for more factual extraction
      }
    });

    if (!response.text) {
      throw new Error('Prázdná odpověď od modelu');
    }

    const locations = JSON.parse(response.text);

    return NextResponse.json({ locations });

  } catch (error: any) {
    console.error('Chyba při analýze:', error);
    return NextResponse.json({ 
      error: 'Nastala chyba při analýze knihy.',
      details: error.message 
    }, { status: 500 });
  }
}

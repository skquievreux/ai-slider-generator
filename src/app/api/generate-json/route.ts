import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PresentationFormData, Presentation } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body: PresentationFormData = await request.json();

    // Validate input
    if (!body.topic || body.topic.trim().length === 0) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (body.slideCount < 1 || body.slideCount > 50) {
      return NextResponse.json(
        { error: "Slide count must be between 1 and 50" },
        { status: 400 },
      );
    }

    // Generate presentation using OpenAI
    const systemPrompt = `Du bist ein professioneller Präsentations-Designer.
Deine Aufgabe ist es, eine Struktur für eine Präsentation zu erstellen.
Antworte AUSSCHLIESSLICH mit validem JSON.
Halte dich strikt an das angeforderte Schema.`;

    const userPrompt = `Erstelle eine Präsentation zum Thema "${body.topic}" im Stil "${body.style}".
Anzahl der Folien: ${body.slideCount}

Das JSON muss exakt diesem Schema folgen:
{
  "title": "Titel der Präsentation",
  "theme": "${body.style}",
  "slides": [
    {
      "id": "slide_1",
      "type": "title|content",
      "layout": "TITLE_SLIDE|TITLE_AND_BODY",
      "content": {
        "title": "Folien-Überschrift",
        "body": ["Punkt 1", "Punkt 2", "Punkt 3"]
      }
    }
  ]
}

Regeln:
1. Die erste Folie MUSS layout="TITLE_SLIDE" haben.
2. Die anderen Folien sollen layout="TITLE_AND_BODY" haben.
3. Der Inhalt (body) soll aus kurzen, prägnanten Stichpunkten bestehen (Array of Strings).
4. Generiere exakt ${body.slideCount} Folien.`;

    console.log("Sending prompt to OpenAI...");

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("OpenAI response received");

    // Parse JSON safely
    let presentation: Presentation;
    try {
      presentation = JSON.parse(content);
      
      // Basic validation of the structure
      if (!presentation.slides || !Array.isArray(presentation.slides)) {
        throw new Error("Invalid JSON structure: 'slides' array missing");
      }
      
      console.log(`Successfully parsed presentation with ${presentation.slides.length} slides`);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse valid JSON from OpenAI response");
    }

    return NextResponse.json(presentation);
  } catch (error) {
    console.error("Error generating presentation JSON:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateMockSlides(count: number, topic: string): any[] {
  const slides = [];

  // Title slide
  slides.push({
    id: "title",
    type: "title",
    layout: "TITLE_SLIDE",
    content: {
      title: topic,
      body: [`Eine Präsentation zu ${topic}`],
    },
  });

  // Content slides
  for (let i = 1; i < count - 1; i++) {
    slides.push({
      id: `content-${i}`,
      type: "content",
      layout: "TITLE_AND_BODY",
      content: {
        title: `Abschnitt ${i}`,
        body: [
          `Wichtiger Punkt ${i}.1 zu ${topic}`,
          `Wichtiger Punkt ${i}.2 zu ${topic}`,
          `Wichtiger Punkt ${i}.3 zu ${topic}`,
        ],
      },
    });
  }

  // Conclusion slide
  slides.push({
    id: "conclusion",
    type: "content",
    layout: "TITLE_AND_BODY",
    content: {
      title: "Zusammenfassung",
      body: [
        "Zusammenfassung der wichtigsten Punkte",
        "Nächste Schritte",
        "Fragen und Antworten",
      ],
    },
  });

  return slides;
}

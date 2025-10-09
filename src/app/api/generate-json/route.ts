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

    if (body.slideCount < 5 || body.slideCount > 30) {
      return NextResponse.json(
        { error: "Slide count must be between 5 and 30" },
        { status: 400 },
      );
    }

    // Generate presentation using OpenAI
    const prompt = `Erstelle eine strukturierte Präsentation zum Thema "${body.topic}" im Stil "${body.style}".

Anforderungen:
- Genau ${body.slideCount} Folien
- Jede Folie muss einen Titel haben
- Inhalt sollte als Bullet Points strukturiert sein
- Verwende professionelle, prägnante Sprache

Gib das Ergebnis als JSON zurück mit dieser Struktur:
{
  "title": "Präsentationstitel",
  "theme": "${body.style}",
  "slides": [
    {
      "id": "slide_1",
      "type": "title|content|image|chart|big_number",
      "layout": "TITLE_SLIDE|TITLE_AND_BODY|TITLE_AND_TWO_COLUMNS|etc.",
      "content": {
        "title": "Foliendertitel",
        "body": ["Bullet Point 1", "Bullet Point 2", "Bullet Point 3"]
      }
    }
  ]
}

Stelle sicher, dass die erste Folie eine Titel-Folie ist und die letzte eine Zusammenfassung.

WICHTIG: Gib NUR das JSON zurück, keine zusätzlichen Erklärungen oder Formatierungen!`;

    console.log("Sending prompt to OpenAI:", prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein Experte für die Erstellung professioneller Präsentationen. Gib immer gültiges JSON zurück. Antworte nur mit dem JSON, keine zusätzlichen Texte.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    console.log("OpenAI response:", content);

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Try to parse JSON, handle potential formatting issues
    let presentation: Presentation;
    try {
      // Remove potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      presentation = JSON.parse(cleanContent);
      console.log("Successfully parsed presentation:", presentation);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw content:", content);

      // Fallback: try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          presentation = JSON.parse(jsonMatch[0]);
          console.log("Fallback parsing successful:", presentation);
        } catch (fallbackError) {
          console.error("Fallback parsing failed:", fallbackError);
          throw new Error("Failed to parse OpenAI response as JSON");
        }
      } else {
        throw new Error("No JSON found in OpenAI response");
      }
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

import { NextResponse } from "next/server";
import { TemplateConfig } from "@/types";

// Mock templates - in a real app, these would come from a database or file system
const templates: TemplateConfig[] = [
  {
    id: "techeroes-modern-2025",
    name: "Techeroes Modern",
    branding: {
      colors: {
        primary: "#00D9D9",
        secondary: "#FF6B35",
        accent: "#7C3AED",
        background: "#FFFFFF",
        backgroundAlt: "#F5F5F5",
        text: "#2D2D2D",
        textLight: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fonts: {
        heading: "Poppins",
        body: "Inter",
        mono: "Roboto Mono",
      },
      logos: {
        main: "https://www.techeroes.de/logo-main.svg",
        icon: "https://www.techeroes.de/fox-icon.svg",
        footer: "https://www.techeroes.de/logo-horizontal.svg",
      },
    },
    layouts: {
      TITLE_SLIDE: {
        id: "TITLE_SLIDE",
        name: "Title Slide",
        description:
          "Opening slide with large title, subtitle, and brand elements",
        elements: [],
      },
      TITLE_AND_BODY: {
        id: "TITLE_AND_BODY",
        name: "Content - Basic",
        description: "Standard content slide with title and bullet points",
        elements: [],
      },
    },
  },
];

export async function GET() {
  try {
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { WebsiteAnalyzer } from "@/lib/website-analyzer";
import { WebsiteAnalysis } from "@/types";

const analyzer = new WebsiteAnalyzer();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    console.log(`Starting website analysis for: ${url}`);

    // Analyze the website
    const analysis: WebsiteAnalysis = await analyzer.analyzeWebsite(url);

    console.log(`Analysis completed for ${url}`);
    console.log(
      `Found ${analysis.colors.length} colors, ${analysis.fonts.length} fonts, ${analysis.logos.length} logos`,
    );

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Website analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Website analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Cleanup on process exit
process.on("exit", async () => {
  await analyzer.close();
});

process.on("SIGINT", async () => {
  await analyzer.close();
  process.exit();
});

process.on("SIGTERM", async () => {
  await analyzer.close();
  process.exit();
});

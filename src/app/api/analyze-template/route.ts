import { NextResponse } from "next/server";
import { createUserGoogleServices } from "@/lib/user-auth";

export async function GET() {
  try {
    const { slides } = await createUserGoogleServices();

    // Analyze the template presentation
    const templateId = "1h4FhJxXgsrZ71wArJf5WjKWZB1lV98iYfn_CJ2pYMD8";

    const presentation = await slides.presentations.get({
      presentationId: templateId,
    });

    // Analyze slide structure in detail
    const slideAnalysis =
      presentation.data.slides?.map((slide, index) => {
        const pageElements = slide.pageElements || [];

        return {
          slideIndex: index,
          slideId: slide.objectId,
          pageElements: pageElements.map((element) => {
            const shape = element.shape;
            const hasText = shape?.text !== undefined;
            const textContent =
              shape?.text?.textElements
                ?.map((te) => te.textRun?.content || "")
                .join("")
                .trim() || null;

            return {
              id: element.objectId,
              type: shape?.shapeType || "unknown",
              hasText,
              textContent,
              canEdit: hasText && textContent !== null,
              shapeProperties: {
                shapeType: shape?.shapeType,
                textExists: !!shape?.text,
                textElementsCount: shape?.text?.textElements?.length || 0,
              },
            };
          }),
        };
      }) || [];

    return NextResponse.json({
      success: true,
      templateId,
      title: presentation.data.title,
      totalSlides: presentation.data.slides?.length || 0,
      slideAnalysis,
    });
  } catch (error) {
    console.error("Template analysis failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

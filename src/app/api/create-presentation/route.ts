import { NextRequest, NextResponse } from "next/server";
import { Slide } from "@/types";
import { createUserGoogleServices } from "@/lib/user-auth";
import { GaxiosError } from "gaxios";

interface CreatePresentationRequest {
  slides: Slide[];
  templateId?: string;
}

/**
 * Create a Google Slides presentation using template-based approach
 * Based on Google Slides API documentation for batch operations
 */
export async function POST(request: NextRequest) {
  let presentationId: string | null = null;

  try {
    // Parse and validate request body
    const body: CreatePresentationRequest = await request.json();

    if (
      !body.slides ||
      !Array.isArray(body.slides) ||
      body.slides.length === 0
    ) {
      return NextResponse.json(
        { error: "Valid slides array is required" },
        { status: 400 },
      );
    }

    // Authenticate user and create API clients
    const { slides, drive } = await createUserGoogleServices();

    // Template ID for copying (user's existing presentation)
    const templateId = "1h4FhJxXgsrZ71wArJf5WjKWZB1lV98iYfn_CJ2pYMD8";

    // Step 1: Copy template to create new presentation
    // Based on Google Drive API documentation for file operations
    const copyRequest = {
      fileId: templateId,
      requestBody: {
        name: body.slides[0]?.content.title || "AI Generated Presentation",
        // No parents specified = copy to user's root My Drive
      },
    };

    const copiedPresentation = await drive.files.copy(copyRequest);

    if (!copiedPresentation.data.id) {
      throw new Error("Failed to copy template presentation");
    }

    presentationId = copiedPresentation.data.id;
    console.log(`✅ Presentation copied: ${presentationId}`);

    // Step 2: Get presentation structure
    const presentation = await slides.presentations.get({
      presentationId,
    });

    const existingSlides = presentation.data.slides || [];

    if (existingSlides.length === 0) {
      throw new Error("Template presentation has no slides");
    }

    // Step 3: Analyze template structure to find editable text elements
    const firstSlide = existingSlides[0];
    if (!firstSlide) {
      throw new Error("Template has no slides");
    }

    const slideId = firstSlide.objectId;
    const pageElements = firstSlide.pageElements || [];

    // Step 4: Prepare batch update requests
    const requests: any[] = [];

    // Find ALL text elements that can be edited (not just TEXT_BOX)
    const textElements = pageElements.filter((element) => {
      const shape = element.shape;
      return shape?.text?.textElements && shape?.text?.textElements.length > 0;
    });

    console.log(
      `Found ${textElements.length} text elements:`,
      textElements.map((el) => ({
        id: el.objectId,
        type: el.shape?.shapeType,
        hasText: !!el.shape?.text,
      })),
    );

    let textElementId: string;

    if (textElements.length === 0) {
      // Fallback: try to find any element with text content
      const anyTextElements = pageElements.filter((element) => {
        const shape = element.shape;
        const textElements = shape?.text?.textElements;
        return (
          textElements &&
          textElements.some(
            (te) => te.textRun?.content && te.textRun.content.trim().length > 0,
          )
        );
      });

      console.log(
        `Fallback: Found ${anyTextElements.length} elements with text content`,
      );

      if (anyTextElements.length > 0) {
        textElements.push(...anyTextElements);
        textElementId = textElements[0].objectId!;
      } else {
        // Instead of creating new shape, throw error with detailed info
        console.error(
          "No text elements found in template. Page elements:",
          pageElements.map((el) => ({
            id: el.objectId,
            type: el.shape?.shapeType || "unknown",
            hasText: !!el.shape?.text,
          })),
        );
        throw new Error(
          `Template slide has no text elements. Please ensure the template has at least one text box or shape with text. Found ${pageElements.length} elements.`,
        );
      }
    } else {
      textElementId = textElements[0].objectId!;
    }

    console.log(
      `Using text element: ${textElementId} (type: ${textElements[0]?.shape?.shapeType || "created"})`,
    );

    // Clear existing content first
    requests.push({
      deleteText: {
        objectId: textElementId,
        textRange: { type: "ALL" },
      },
    });

    // Combine all slide content into one presentation
    let fullContent = "";

    body.slides.forEach((slide, index) => {
      if (slide.content.title && slide.content.title.trim()) {
        fullContent += `${slide.content.title.trim()}\n\n`;
      }

      if (
        slide.content.body &&
        Array.isArray(slide.content.body) &&
        slide.content.body.length > 0
      ) {
        const bodyText = slide.content.body
          .filter((item) => item && item.trim())
          .map((item) => `• ${item.trim()}`)
          .join("\n");
        fullContent += `${bodyText}\n\n`;
      }

      // Add separator between slides
      if (index < body.slides.length - 1) {
        fullContent += "---\n\n";
      }
    });

    // Add the combined content
    if (fullContent.trim()) {
      requests.push({
        insertText: {
          objectId: textElementId,
          text: fullContent.trim(),
          insertionIndex: 0,
        },
      });
    }

    // Step 4: Execute batch update if there are requests
    if (requests.length > 0) {
      console.log(`📝 Updating ${requests.length} slide operations...`);

      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests },
      });

      console.log("✅ Presentation content updated successfully");
    }

    // Step 5: Generate Google Slides URL
    const googleSlidesUrl = `https://docs.google.com/presentation/d/${presentationId}/edit`;

    return NextResponse.json({
      success: true,
      presentationId,
      googleSlidesUrl,
      slideCount: body.slides.length,
    });
  } catch (error) {
    console.error("❌ Error creating presentation:", error);

    // Clean up failed presentation if it was created
    if (presentationId) {
      try {
        const { drive } = await createUserGoogleServices();
        await drive.files.delete({ fileId: presentationId });
        console.log("🗑️ Cleaned up failed presentation");
      } catch (cleanupError) {
        console.error("Failed to cleanup presentation:", cleanupError);
      }
    }

    // Handle specific error types
    if (error instanceof GaxiosError) {
      const statusCode = error.status || 500;
      const errorMessage = error.message || "Google API error";

      if (statusCode === 403) {
        return NextResponse.json(
          {
            error: "Access denied. Please check your Google Drive permissions.",
          },
          { status: 403 },
        );
      }

      if (statusCode === 404) {
        return NextResponse.json(
          { error: "Template not found. Please check the template ID." },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { error: `Google API error: ${errorMessage}` },
        { status: statusCode },
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "Failed to create presentation. Please try again." },
      { status: 500 },
    );
  }
}

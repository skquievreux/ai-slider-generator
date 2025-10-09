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

    // Step 1: Copy template if specified, otherwise create blank presentation
    if (body.templateId) {
      // Copy existing template
      const copyRequest = {
        fileId: body.templateId,
        requestBody: {
          name: body.slides[0]?.content.title || "AI Generated Presentation",
        },
      };

      const copiedPresentation = await drive.files.copy(copyRequest);

      if (!copiedPresentation.data.id) {
        throw new Error("Failed to copy template presentation");
      }

      presentationId = copiedPresentation.data.id;
      console.log(`✅ Presentation copied from template: ${presentationId}`);
    } else {
      // Create new blank presentation
      const presentation = await slides.presentations.create({
        requestBody: {
          title: body.slides[0]?.content.title || "AI Generated Presentation",
        },
      });

      if (!presentation.data.presentationId) {
        throw new Error("Failed to create presentation");
      }

      presentationId = presentation.data.presentationId;
      console.log(`✅ Blank presentation created: ${presentationId}`);
    }

    // Step 2: Handle content replacement based on template type
    if (body.templateId) {
      // Template-based presentation: replace placeholders
      await replaceTemplatePlaceholders(slides, presentationId, body.slides);
    } else {
      // Blank presentation: create content from scratch
      await createBlankPresentationContent(slides, presentationId, body.slides);
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
        const { slides } = await createUserGoogleServices();
        // Note: Google Slides API doesn't have a direct delete method
        // The presentation will remain but can be manually deleted by the user
        console.log("🗑️ Presentation creation failed, presentation remains for manual cleanup");
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

async function replaceTemplatePlaceholders(
  slides: any,
  presentationId: string,
  slidesData: Slide[]
) {
  // Get presentation structure
  const presentation = await slides.presentations.get({
    presentationId,
  });

  const existingSlides = presentation.data.slides || [];

  if (existingSlides.length === 0) {
    throw new Error("Template presentation has no slides");
  }

  const requests: any[] = [];

  // For each slide, find text elements and replace placeholders
  existingSlides.forEach((slide, slideIndex) => {
    const slideData = slidesData[slideIndex];
    if (!slideData) return;

    const pageElements = slide.pageElements || [];

    pageElements.forEach((element) => {
      if (element.shape?.text?.textElements) {
        const textElements = element.shape.text.textElements;
        const currentText = textElements
          .map(te => te.textRun?.content || '')
          .join('');

        // Replace placeholders with actual content
        let newText = currentText;

        // Replace title placeholder
        if (slideData.content.title) {
          newText = newText.replace(/\{\{TITLE\}\}/g, slideData.content.title);
          newText = newText.replace(/\{\{SLIDE_TITLE_\d+\}\}/g, slideData.content.title);
        }

        // Replace content placeholders
        if (slideData.content.body) {
          const bodyText = Array.isArray(slideData.content.body)
            ? slideData.content.body.join('\n\n')
            : slideData.content.body;

          newText = newText.replace(/\{\{CONTENT\}\}/g, bodyText);
          newText = newText.replace(/\{\{CONTENT_\d+\}\}/g, bodyText);
        }

        // Only update if text actually changed
        if (newText !== currentText) {
          requests.push({
            deleteText: {
              objectId: element.objectId,
              textRange: { type: "ALL" },
            },
          });

          requests.push({
            insertText: {
              objectId: element.objectId,
              text: newText,
              insertionIndex: 0,
            },
          });
        }
      }
    });
  });

  // Execute all replacements in one batch
  if (requests.length > 0) {
    console.log(`📝 Replacing ${requests.length} placeholder instances...`);

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests },
    });

    console.log("✅ Template placeholders replaced successfully");
  }
}

async function createBlankPresentationContent(
  slides: any,
  presentationId: string,
  slidesData: Slide[]
) {
  // Create slides and content from scratch (fallback for when no template is used)
  const allRequests: any[] = [];

  slidesData.forEach((slide, index) => {
    // Create new slide
    allRequests.push({
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: "BLANK",
        },
      },
    });
  });

  // Execute slide creation first
  const slideBatchResult = await slides.presentations.batchUpdate({
    presentationId,
    requestBody: { requests: allRequests },
  });

  // Get the created slide IDs
  const createdSlides = slideBatchResult.data.replies || [];
  const slideIds: string[] = [];

  createdSlides.forEach((reply, index) => {
    if (reply.createSlide?.objectId) {
      slideIds.push(reply.createSlide.objectId);
    }
  });

  console.log(`Created ${slideIds.length} slides:`, slideIds);

  // Add content to each slide
  const contentRequests: any[] = [];

  slidesData.forEach((slide, index) => {
    const slideId = slideIds[index];
    if (!slideId) return;

    const slideTitle = slide.content.title || `Slide ${index + 1}`;
    const slideContent = Array.isArray(slide.content.body)
      ? slide.content.body.filter(item => item && item.trim()).join('\n\n')
      : slide.content.body || '';

    // Create title text box
    contentRequests.push({
      createShape: {
        objectId: `title_${slideId}`,
        shapeType: "TEXT_BOX",
        elementProperties: {
          pageObjectId: slideId,
          size: {
            width: { magnitude: 600, unit: "PT" },
            height: { magnitude: 80, unit: "PT" },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: 50,
            translateY: 50,
            unit: "PT",
          },
        },
      },
    });

    // Add title text
    contentRequests.push({
      insertText: {
        objectId: `title_${slideId}`,
        text: slideTitle,
        insertionIndex: 0,
      },
    });

    // Style title
    contentRequests.push({
      updateTextStyle: {
        objectId: `title_${slideId}`,
        style: {
          fontSize: { magnitude: 36, unit: "PT" },
          bold: true,
        },
        fields: "fontSize,bold",
      },
    });

    // Only create content text box if there's content
    if (slideContent.trim()) {
      contentRequests.push({
        createShape: {
          objectId: `content_${slideId}`,
          shapeType: "TEXT_BOX",
          elementProperties: {
            pageObjectId: slideId,
            size: {
              width: { magnitude: 600, unit: "PT" },
              height: { magnitude: 300, unit: "PT" },
            },
            transform: {
              scaleX: 1,
              scaleY: 1,
              translateX: 50,
              translateY: 140,
              unit: "PT",
            },
          },
        },
      });

      // Add content text
      contentRequests.push({
        insertText: {
          objectId: `content_${slideId}`,
          text: slideContent,
          insertionIndex: 0,
        },
      });

      // Style content
      contentRequests.push({
        updateTextStyle: {
          objectId: `content_${slideId}`,
          style: {
            fontSize: { magnitude: 18, unit: "PT" },
          },
          fields: "fontSize",
        },
      });
    }
  });

  // Execute all content creation in one batch
  if (contentRequests.length > 0) {
    console.log(`📝 Adding content to ${slideIds.length} slides...`);

    await slides.presentations.batchUpdate({
      presentationId,
      requestBody: { requests: contentRequests },
    });

    console.log("✅ Blank presentation content created successfully");
  }
}

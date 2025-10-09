import { NextResponse } from "next/server";
import { createUserGoogleServices } from "@/lib/user-auth";

export async function POST() {
  try {
    const { slides } = await createUserGoogleServices();

    // Create new presentation
    const presentation = await slides.presentations.create({
      requestBody: {
        title: "AI Slides Default Template",
      },
    });

    const presentationId = presentation.data.presentationId!;
    console.log(`Created default template: ${presentationId}`);

    // Create slides with placeholder text
    const slideConfigs = [
      {
        title: "{{TITLE}}",
        content: "{{CONTENT}}",
        yOffset: 120
      },
      {
        title: "{{SLIDE_TITLE_1}}",
        content: "{{CONTENT_1}}",
        yOffset: 120
      },
      {
        title: "{{SLIDE_TITLE_2}}",
        content: "{{CONTENT_2}}",
        yOffset: 120
      }
    ];

    for (const config of slideConfigs) {
      // Create blank slide
      const slideRequests = [
        {
          createSlide: {
            slideLayoutReference: {
              predefinedLayout: "BLANK",
            },
          },
        },
      ];

      const slideResponse = await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: slideRequests },
      });

      const slideId = slideResponse.data.replies![0].createSlide!.objectId!;

      // Create title text box
      const titleRequests = [
        {
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
        },
        {
          insertText: {
            objectId: `title_${slideId}`,
            text: config.title,
            insertionIndex: 0,
          },
        },
        {
          updateTextStyle: {
            objectId: `title_${slideId}`,
            style: {
              fontSize: {
                magnitude: 36,
                unit: "PT",
              },
              bold: true,
            },
            fields: "fontSize,bold",
          },
        },
      ];

      // Create content text box
      const contentRequests = [
        {
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
                translateY: config.yOffset,
                unit: "PT",
              },
            },
          },
        },
        {
          insertText: {
            objectId: `content_${slideId}`,
            text: config.content,
            insertionIndex: 0,
          },
        },
        {
          updateTextStyle: {
            objectId: `content_${slideId}`,
            style: {
              fontSize: {
                magnitude: 18,
                unit: "PT",
              },
            },
            fields: "fontSize",
          },
        },
      ];

      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: titleRequests },
      });

      await slides.presentations.batchUpdate({
        presentationId,
        requestBody: { requests: contentRequests },
      });
    }

    return NextResponse.json({
      success: true,
      templateId: presentationId,
      message: "Default template created successfully",
    });
  } catch (error) {
    console.error("Error creating default template:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create default template",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
import { NextResponse } from "next/server";
import { createGoogleAuth } from "@/lib/google-auth";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Testing Google Slides API...");

    const auth = createGoogleAuth();
    console.log("✅ Auth created successfully");

    const slides = google.slides({ version: "v1", auth });
    console.log("✅ Slides client created");

    // Test 1: Create a simple presentation
    console.log("Creating test presentation...");
    const presentation = await slides.presentations.create({
      requestBody: {
        title: "Test Template - AI Slides Generator",
      },
    });

    const presentationId = presentation.data.presentationId!;
    console.log(`✅ Test presentation created: ${presentationId}`);

    // Test 2: Get presentation details
    console.log("Getting presentation details...");
    const details = await slides.presentations.get({
      presentationId,
    });

    console.log(`✅ Presentation details retrieved: ${details.data.title}`);

    // Test 3: Clean up - delete test presentation
    console.log("Cleaning up test presentation...");
    const drive = google.drive({ version: "v3", auth });
    await drive.files.delete({
      fileId: presentationId,
    });

    console.log("✅ Test presentation deleted");

    return NextResponse.json({
      success: true,
      message: "Google Slides API is working correctly",
      details: {
        presentationId,
        title: details.data.title,
      },
    });
  } catch (error) {
    console.error("❌ Google Slides API test failed:", error);

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Check if it's a Google API error
    if (error && typeof error === "object" && "code" in error) {
      console.error("Google API error code:", (error as any).code);
      console.error("Google API error status:", (error as any).status);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Google Slides API test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        errorName: error instanceof Error ? error.name : undefined,
        errorCode:
          error && typeof error === "object" && "code" in error
            ? error.code
            : undefined,
        details: error,
      },
      { status: 500 },
    );
  }
}

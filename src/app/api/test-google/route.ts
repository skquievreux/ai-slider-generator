import { NextResponse } from "next/server";
import { createGoogleAuth } from "@/lib/google-auth";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Testing Google credentials...");

    // Test 1: Can we create auth?
    const auth = createGoogleAuth();
    console.log("✅ Auth object created successfully");

    // Test 2: Can we get a client?
    const client = await auth.getClient();
    console.log("✅ Auth client obtained successfully");

    // Test 3: Can we access Drive API?
    const drive = google.drive({ version: "v3", auth });
    console.log("✅ Drive API client created");

    // Test 4: Simple API call
    const response = await drive.files.list({ pageSize: 1 });
    console.log(
      "✅ Drive API call successful, files found:",
      response.data.files?.length || 0,
    );

    return NextResponse.json({
      success: true,
      message: "Google credentials are valid and APIs are accessible",
      details: {
        filesCount: response.data.files?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Google credentials test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Google credentials validation failed",
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { createGoogleAuth } from "@/lib/google-auth";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Testing Google Drive access...");

    const auth = createGoogleAuth();
    const drive = google.drive({ version: "v3", auth });

    // Test folder ID from user
    const testFolderId = "1M6FINI2XkluOIPG5kYLQvypHBlQSlfj";

    console.log("Testing access to folder:", testFolderId);

    // Test 1: Check if we can access the folder
    const folder = await drive.files.get({
      fileId: testFolderId,
      fields: "id,name,owners,permissions",
    });

    console.log("✅ Folder access successful:", folder.data.name);

    // Test 2: Try to create a test file in the folder
    const testFile = await drive.files.create({
      requestBody: {
        name: "test-access.txt",
        parents: [testFolderId],
        mimeType: "text/plain",
      },
      media: {
        mimeType: "text/plain",
        body: "Test file to verify access",
      },
    });

    console.log("✅ Test file created:", testFile.data.id);

    // Clean up - delete test file
    if (testFile.data.id) {
      await drive.files.delete({
        fileId: testFile.data.id,
      });
    }

    console.log("✅ Test file deleted");

    return NextResponse.json({
      success: true,
      message: "Google Drive access is working correctly",
      details: {
        folderId: testFolderId,
        folderName: folder.data.name,
        testFileId: testFile.data.id,
      },
    });
  } catch (error) {
    console.error("❌ Google Drive access test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Google Drive access test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}

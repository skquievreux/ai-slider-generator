import { NextResponse } from "next/server";
import { createGoogleAuth } from "@/lib/google-auth";
import { google } from "googleapis";

export async function GET() {
  try {
    console.log("Testing Google Drive folder access...");

    const auth = createGoogleAuth();
    const drive = google.drive({ version: "v3", auth });

    // Test folder ID from user
    const testFolderId = "1M6FINI2XkluOIPG5kYLQvypHBlQSlfj";

    console.log("Testing access to folder:", testFolderId);

    // Test 1: Check if we can access the folder
    const folder = await drive.files.get({
      fileId: testFolderId,
      fields: "id,name,owners,permissions,capabilities",
    });

    console.log("✅ Folder access successful:", folder.data.name);
    console.log("Folder capabilities:", folder.data.capabilities);

    // Test 2: Try to list files in the folder
    const files = await drive.files.list({
      q: `'${testFolderId}' in parents`,
      pageSize: 10,
      fields: "files(id,name,mimeType)",
    });

    console.log("✅ Files in folder:", files.data.files?.length || 0);

    // Test 3: Try to create a test file in the folder
    const testFile = await drive.files.create({
      requestBody: {
        name: "test-access.txt",
        parents: [testFolderId],
        mimeType: "text/plain",
      },
      media: {
        mimeType: "text/plain",
        body: "Test file to verify write access",
      },
    });

    console.log("✅ Test file created:", testFile.data.id);

    // Clean up - delete test file
    if (testFile.data.id) {
      await drive.files.delete({
        fileId: testFile.data.id,
      });
      console.log("✅ Test file deleted");
    }

    return NextResponse.json({
      success: true,
      message: "Google Drive folder access is working correctly",
      details: {
        folderId: testFolderId,
        folderName: folder.data.name,
        canEdit: folder.data.capabilities?.canEdit,
        filesCount: files.data.files?.length || 0,
      },
    });
  } catch (error) {
    console.error("❌ Google Drive folder access test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Google Drive folder access test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}

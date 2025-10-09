import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

interface RouteParams {
  params: {
    id: string;
    format: "pdf" | "pptx";
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, format } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Presentation ID is required" },
        { status: 400 },
      );
    }

    if (!["pdf", "pptx"].includes(format)) {
      return NextResponse.json(
        { error: "Format must be pdf or pptx" },
        { status: 400 },
      );
    }

    // Check if Google credentials are available
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_PROJECT_ID
    ) {
      // Fallback to mock for development
      console.warn("Google credentials not configured, using mock response");
      const mockFileContent = `Mock ${format.toUpperCase()} content for presentation ${id}`;

      return new NextResponse(mockFileContent, {
        headers: {
          "Content-Type":
            format === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="presentation.${format}"`,
        },
      });
    }

    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Export the presentation
    const mimeType =
      format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    const response = await drive.files.export(
      {
        fileId: id,
        mimeType,
      },
      {
        responseType: "stream",
      },
    );

    // Return the file stream
    return new NextResponse(response.data as any, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="presentation.${format}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting presentation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

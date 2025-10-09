import { NextResponse } from "next/server";
import { validateGoogleCredentials } from "@/lib/google-auth";

export async function GET() {
  try {
    console.log("Testing Google credentials...");

    const isValid = await validateGoogleCredentials();

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "Google credentials are valid",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Google credentials validation failed",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Credentials test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Credentials test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}

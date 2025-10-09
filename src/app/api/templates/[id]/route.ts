import { NextRequest, NextResponse } from "next/server";
import { TemplateManager } from "@/lib/template-manager";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body = await request.json();

    if (body.googleSlidesTemplateId) {
      TemplateManager.updateTemplateGoogleSlidesId(
        id,
        body.googleSlidesTemplateId,
      );
      return NextResponse.json({
        success: true,
        message: `Template ${id} updated with Google Slides ID`,
      });
    }

    return NextResponse.json(
      { error: "googleSlidesTemplateId is required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const template = TemplateManager.getTemplate(id);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import fs from "fs";
import path from "path";
import { TemplateConfig } from "@/types";

export class TemplateManager {
  private static templates: TemplateConfig[] = [];

  static loadTemplates(): TemplateConfig[] {
    // Load from templates.json file
    const templatePath = path.join(process.cwd(), "templates.json");

    if (fs.existsSync(templatePath)) {
      try {
        const data = fs.readFileSync(templatePath, "utf8");
        this.templates = JSON.parse(data);
        console.log(`Loaded ${this.templates.length} templates from file`);
      } catch (error) {
        console.error("Error loading templates:", error);
      }
    } else {
      // Fallback to hardcoded templates
      this.templates = [
        {
          id: "techeroes-modern-2025",
          name: "Techeroes Modern",
          branding: {
            colors: {
              primary: "#00D9D9",
              secondary: "#FF6B35",
              accent: "#7C3AED",
              background: "#FFFFFF",
              backgroundAlt: "#F5F5F5",
              text: "#2D2D2D",
              textLight: "#6B7280",
              success: "#10B981",
              warning: "#F59E0B",
            },
            fonts: {
              heading: "Poppins",
              body: "Inter",
              mono: "Roboto Mono",
            },
            logos: {
              main: "https://www.techeroes.de/logo-main.svg",
              icon: "https://www.techeroes.de/fox-icon.svg",
              footer: "https://www.techeroes.de/logo-horizontal.svg",
            },
          },
          layouts: {},
        },
      ];
      console.log("Using fallback templates");
    }

    return this.templates;
  }

  static getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.find((t) => t.id === id);
  }

  static addTemplate(template: TemplateConfig): void {
    // Check if template already exists
    const existingIndex = this.templates.findIndex((t) => t.id === template.id);
    if (existingIndex >= 0) {
      this.templates[existingIndex] = template;
    } else {
      this.templates.push(template);
    }

    this.saveTemplates();
  }

  static updateTemplateGoogleSlidesId(
    templateId: string,
    googleSlidesId: string,
  ): void {
    const template = this.getTemplate(templateId);
    if (template) {
      (template as any).googleSlidesTemplateId = googleSlidesId;
      this.saveTemplates();
      console.log(
        `Updated template ${templateId} with Google Slides ID: ${googleSlidesId}`,
      );
    }
  }

  private static saveTemplates(): void {
    const templatePath = path.join(process.cwd(), "templates.json");
    try {
      fs.writeFileSync(templatePath, JSON.stringify(this.templates, null, 2));
      console.log("Templates saved to file");
    } catch (error) {
      console.error("Error saving templates:", error);
    }
  }

  static extractGoogleSlidesId(url: string): string | null {
    // Extract ID from Google Slides URL
    const match = url.match(/\/presentation\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  }

  static validateTemplate(template: TemplateConfig): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!template.id) errors.push("Template ID is required");
    if (!template.name) errors.push("Template name is required");
    if (!template.branding) errors.push("Branding configuration is required");
    if (!template.branding.colors) errors.push("Color scheme is required");
    if (!template.branding.fonts) errors.push("Font configuration is required");

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Initialize templates on module load
TemplateManager.loadTemplates();

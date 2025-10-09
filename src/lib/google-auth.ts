import { google } from "googleapis";
import fs from "fs";
import path from "path";

export function createGoogleAuth() {
  // Try to load from local JSON file first (more reliable)
  const jsonPath = path.join(process.cwd(), "google-credentials.json");
  console.log("Current working directory:", process.cwd());
  console.log("Checking local JSON file path:", jsonPath);
  console.log("Local file exists:", fs.existsSync(jsonPath));

  if (fs.existsSync(jsonPath)) {
    try {
      console.log("Loading Google credentials from JSON file");
      const keyFile = fs.readFileSync(jsonPath, "utf8");
      console.log("Raw JSON content length:", keyFile.length);

      const key = JSON.parse(keyFile);
      console.log("Parsed client_email:", key.client_email);
      console.log(
        "Private key starts with:",
        key.private_key.substring(0, 50) + "...",
      );

      const privateKey = key.private_key.replace(/\\n/g, "\n");
      console.log(
        "Processed private key starts with:",
        privateKey.substring(0, 50) + "...",
      );

      return new google.auth.GoogleAuth({
        credentials: {
          client_email: key.client_email,
          private_key: privateKey,
        },
        scopes: [
          "https://www.googleapis.com/auth/presentations",
          "https://www.googleapis.com/auth/drive",
        ],
      });
    } catch (error) {
      console.error("Error loading JSON file:", error);
      throw error;
    }
  }

  // Fallback to environment variables
  console.log("JSON file not found, trying environment variables");
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  console.log("Env client_email:", credentials.client_email);
  console.log("Env private_key exists:", !!credentials.private_key);

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error(
      "Google credentials not configured. Please check GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in .env.local or ensure the JSON file exists",
    );
  }

  console.log("Loading Google credentials from environment variables");
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/presentations",
      "https://www.googleapis.com/auth/drive",
    ],
  });
}

export async function validateGoogleCredentials() {
  try {
    const auth = createGoogleAuth();

    // Test API call
    const drive = google.drive({ version: "v3", auth });
    await drive.files.list({ pageSize: 1 });

    console.log("✅ Google credentials are valid");
    return true;
  } catch (error) {
    console.error("❌ Google credentials validation failed:", error);
    return false;
  }
}

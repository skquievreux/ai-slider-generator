import { google } from "googleapis";
import { cookies } from "next/headers";
import { OAuth2Client } from "google-auth-library";

/**
 * Get authenticated OAuth2 client for the current user
 * Based on Google APIs documentation for OAuth2 authentication
 */
export async function getUserAuth(): Promise<OAuth2Client> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value;
  const refreshToken = cookieStore.get("google_refresh_token")?.value;

  if (!accessToken) {
    throw new Error("No access token found. Please log in with Google first.");
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials not configured");
  }

  // Create OAuth2 client with proper configuration
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
  );

  // Set credentials with proper token handling
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    // Token expiry handling will be done automatically by google-auth-library
  });

  return oauth2Client;
}

/**
 * Create authenticated Google API service clients
 * Returns Slides and Drive API clients with proper authentication
 */
export async function createUserGoogleServices() {
  try {
    const auth = await getUserAuth();

    // Create service clients with proper versioning and auth
    const slides = google.slides({
      version: "v1",
      auth,
    });

    const drive = google.drive({
      version: "v3",
      auth,
    });

    return {
      slides,
      drive,
      auth,
    };
  } catch (error) {
    console.error("Failed to create Google services:", error);
    throw new Error("Authentication failed. Please log in again.");
  }
}

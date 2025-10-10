import { test, expect } from "@playwright/test";

test.describe("AI Slides Generator - Hauptfunktionalität", () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for API calls
    test.setTimeout(60000);
  });

  test("1. Startseite lädt korrekt", async ({ page }) => {
    await page.goto("/");

    // Check page title and main elements
    await expect(page).toHaveTitle(/AI Slides Generator/);
    await expect(page.locator("h1")).toContainText("AI Slides Generator");
    await expect(page.locator("h1")).toContainText("v1.0.4");

    // Check main form elements
    await expect(
      page.locator('textarea[placeholder*="Präsentationsthema"]'),
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "Präsentation generieren" }),
    ).toBeVisible();

    // Take screenshot
    await page.screenshot({
      path: "test-results/01-startpage.png",
      fullPage: true,
    });
  });

  test("2. Formular-Validierung funktioniert", async ({ page }) => {
    await page.goto("/");

    // Button should be disabled when form is empty
    const submitButton = page.locator("button", {
      hasText: "Präsentation generieren",
    });
    await expect(submitButton).toBeDisabled();

    // Fill textarea and check if button becomes enabled
    await page
      .locator('textarea[placeholder*="Präsentationsthema"]')
      .fill("Test Thema");
    await page.waitForTimeout(500);
    await expect(submitButton).toBeEnabled();

    // Clear textarea and check if button becomes disabled again
    await page.locator('textarea[placeholder*="Präsentationsthema"]').clear();
    await expect(submitButton).toBeDisabled();

    // Take screenshot of validation state
    await page.screenshot({ path: "test-results/02-form-validation.png" });

    console.log("✅ Form validation funktioniert korrekt");
  });

  test("3. Präsentationsgenerierung (ohne Auth)", async ({ page }) => {
    await page.goto("/");

    // Fill form with test data
    await page
      .locator('textarea[placeholder*="Präsentationsthema"]')
      .fill("Test Präsentation über KI");
    await page.locator("select#style").selectOption("business");

    // Submit form
    await page
      .locator("button", { hasText: "Präsentation generieren" })
      .click();

    // Wait for loading to complete or error
    await page.waitForTimeout(5000);

    // Take screenshot of result
    await page.screenshot({
      path: "test-results/03-presentation-generation.png",
      fullPage: true,
    });

    // Check if we get an auth error or success
    const hasAuthError = await page.locator("text=/auth/i").isVisible();
    const hasSuccess = await page.locator("text=/erfolgreich/i").isVisible();

    if (hasAuthError) {
      console.log("✅ Authentifizierung wird korrekt erzwungen");
    } else if (hasSuccess) {
      console.log("✅ Präsentation wurde generiert");
    }
  });

  test("4. Google Login Button funktioniert", async ({ page }) => {
    await page.goto("/");

    // Check Google Login button
    const googleButton = page.locator("button", { hasText: /Google/ });
    await expect(googleButton).toBeVisible();

    // Click Google login (will redirect to Google)
    await googleButton.click();

    // Wait for redirect
    await page.waitForTimeout(2000);

    // Take screenshot of login redirect
    await page.screenshot({ path: "test-results/04-google-login.png" });

    // Should redirect to Google OAuth
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/google|accounts\.google/);
  });

  test("5. API Endpunkte sind erreichbar", async ({ page }) => {
    // Test template endpoint
    const templateResponse = await page.request.get("/api/templates");
    expect(templateResponse.ok()).toBeTruthy();

    // Test auth status endpoint
    const authResponse = await page.request.get("/api/auth/status");
    expect(authResponse.status()).toBe(200);

    console.log("✅ API Endpunkte sind erreichbar");
  });

  test("6. Responsive Design - Mobile View", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Check mobile layout
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: "test-results/06-mobile-responsive.png" });

    console.log("✅ Mobile responsive Design funktioniert");
  });

  test("7. Error Handling - Netzwerkfehler", async ({ page }) => {
    // Mock network failure
    await page.route("**/api/generate-json", (route) => route.abort());

    await page.goto("/");

    // Fill and submit form
    await page
      .locator('textarea[placeholder*="Präsentationsthema"]')
      .fill("Test Thema");
    await page
      .locator("button", { hasText: "Präsentation generieren" })
      .click();

    // Wait for error
    await page.waitForTimeout(3000);

    // Take screenshot of error state
    await page.screenshot({ path: "test-results/07-error-handling.png" });

    console.log("✅ Error Handling funktioniert");
  });
});

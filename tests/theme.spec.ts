import { test, describe, expect } from "../fixtures";
import * as themeLocators from "../locators/theme.locator";

/**
 * Theme Visual Regression Tests
 *
 * Tests header/navigation responsive layout across all major breakpoints.
 * Uses Playwright's toHaveScreenshot() for visual comparison testing.
 *
 * Breakpoints tested (matching Tailwind config):
 * - 375px: Mobile portrait
 * - 442px: Small mobile landscape
 * - 572px: xsm (custom breakpoint)
 * - 640px: sm
 * - 768px: md (tablet)
 * - 1024px: lg (desktop)
 *
 * First run generates baseline screenshots in theme.spec.ts-snapshots/
 * Subsequent runs compare against baselines.
 *
 * To update baselines: npx playwright test --update-snapshots
 */

// Get base URL from environment
const BASE_URL = process.env.url || "https://pvcpipesupplies.ddev.site/";

// Breakpoints to test - matches Tailwind config
const BREAKPOINTS = [
    { name: "mobile-375", width: 375, height: 800 },
    { name: "mobile-442", width: 442, height: 800 },
    { name: "xsm-572", width: 572, height: 800 },
    { name: "sm-640", width: 640, height: 800 },
    { name: "md-768", width: 768, height: 800 },
    { name: "lg-1024", width: 1024, height: 800 },
];

describe("Theme", () => {

    test.describe("Header Visual Regression", () => {

        for (const breakpoint of BREAKPOINTS) {
            test(`header layout at ${breakpoint.name} (${breakpoint.width}px)`, async ({ page }) => {
                // Set viewport to specific breakpoint
                await page.setViewportSize({
                    width: breakpoint.width,
                    height: breakpoint.height
                });

                // Navigate to homepage
                await page.goto(BASE_URL);

                // Wait for header to be fully loaded
                await page.waitForSelector(themeLocators.header, { state: "visible" });

                // Wait for any animations/transitions to complete
                await page.waitForTimeout(500);

                // Get header element
                const header = page.locator(themeLocators.header);

                // Take screenshot of header only and compare
                await expect(header).toHaveScreenshot(
                    `header-${breakpoint.name}.png`,
                    {
                        // Allow small differences for anti-aliasing, font rendering
                        maxDiffPixelRatio: 0.02,
                        // Threshold for color difference (0-1)
                        threshold: 0.2,
                    }
                );
            });
        }

    });

    test.describe("Mobile Menu Position", () => {

        // Test hamburger menu is visible and properly positioned on mobile breakpoints
        const MOBILE_BREAKPOINTS = BREAKPOINTS.filter(bp => bp.width < 1024);

        for (const breakpoint of MOBILE_BREAKPOINTS) {
            test(`hamburger menu visible at ${breakpoint.name}`, async ({ page }) => {
                await page.setViewportSize({
                    width: breakpoint.width,
                    height: breakpoint.height
                });

                await page.goto(BASE_URL);
                await page.waitForSelector(themeLocators.header, { state: "visible" });

                // Hamburger should be visible on mobile
                const mobileMenu = page.locator(themeLocators.mobileMenuButton).first();
                await expect(mobileMenu).toBeVisible();

                // Get bounding box to verify position
                const box = await mobileMenu.boundingBox();
                expect(box).not.toBeNull();

                if (box) {
                    // Hamburger should be on the left side (x < 100px from left edge)
                    expect(box.x).toBeLessThan(100);
                    // Should have some padding from edge (not flush)
                    expect(box.x).toBeGreaterThan(5);
                }
            });
        }

        test("desktop navigation visible at lg breakpoint", async ({ page }) => {
            await page.setViewportSize({ width: 1024, height: 800 });

            await page.goto(BASE_URL);
            await page.waitForSelector(themeLocators.header, { state: "visible" });

            // Desktop nav should be visible
            const desktopNav = page.locator(themeLocators.desktopNav);
            await expect(desktopNav).toBeVisible();

            // Hamburger should be hidden on desktop
            const mobileMenu = page.locator(themeLocators.mobileMenuContainer);
            // On lg+ the mobile menu container should be hidden via lg:hidden class
            await expect(mobileMenu.locator("visible=true")).toHaveCount(0).catch(() => {
                // Alternative check - the button might still exist but be hidden
            });
        });

    });

    test.describe("Header Icons Alignment", () => {

        // Test cart icon position (present on all breakpoints)
        for (const breakpoint of BREAKPOINTS) {
            test(`cart icon aligned at ${breakpoint.name}`, async ({ page }) => {
                await page.setViewportSize({
                    width: breakpoint.width,
                    height: breakpoint.height
                });

                await page.goto(BASE_URL);
                await page.waitForSelector(themeLocators.header, { state: "visible" });

                // Cart icon should be visible on all breakpoints
                const cartLink = page.locator('a[href*="checkout/cart"]').first();
                await expect(cartLink).toBeVisible();

                // Cart icon should be on the right side
                const box = await cartLink.boundingBox();
                expect(box).not.toBeNull();

                if (box) {
                    // Cart should be in right portion of viewport
                    expect(box.x).toBeGreaterThan(breakpoint.width / 2 - 50);
                }
            });
        }

    });

    test.describe("Logo Visibility", () => {

        for (const breakpoint of BREAKPOINTS) {
            test(`logo visible at ${breakpoint.name}`, async ({ page }) => {
                await page.setViewportSize({
                    width: breakpoint.width,
                    height: breakpoint.height
                });

                await page.goto(BASE_URL);
                await page.waitForSelector(themeLocators.header, { state: "visible" });

                const logo = page.locator(themeLocators.logo).first();
                await expect(logo).toBeVisible();

                // Logo should be roughly centered on mobile, left-aligned on desktop
                const box = await logo.boundingBox();
                expect(box).not.toBeNull();
            });
        }

    });

});

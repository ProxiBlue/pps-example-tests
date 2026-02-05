import { test, expect } from "@playwright/test";

const PRODUCT_URL = "/1-2-x-20-schedule-40-pvc-pipe-h0400050pw2000.html";
const BASE_URL = "https://pvcpipesupplies.ddev.site";

test.describe("Custom Options Qty Limit - Add to Cart (#337)", () => {

    test("should hide all radio options and allow add-to-cart when qty >= all limits", async ({ page }) => {
        // Go to product page
        await page.goto(`${BASE_URL}${PRODUCT_URL}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);

        // Verify options are visible at qty=1
        const pipeLength = page.locator('.option-wrapper[data-option-id]').first();
        await expect(pipeLength).toBeVisible();

        const radios = page.locator('input[type="radio"].product-custom-option');
        const radioCount = await radios.count();
        expect(radioCount).toBeGreaterThan(0);

        // Set qty to 90 (both values have limits: 50 and 70)
        const qtyInput = page.locator('input[name="qty"]');
        await qtyInput.fill("90");
        await qtyInput.dispatchEvent("input");
        await qtyInput.dispatchEvent("change");
        await page.waitForTimeout(500);

        // Verify the option wrapper is now hidden
        await expect(pipeLength).toBeHidden({ timeout: 5000 });

        // Click Add to Cart
        const addToCartButton = page.locator('button:has-text("Add to Cart")');
        await addToCartButton.click();

        // Wait for response
        await page.waitForTimeout(3000);

        // Check for error message
        const errorMessage = page.locator('.message-error, .messages .message.error');
        const hasError = await errorMessage.count() > 0;

        // The test passes if there's no "required option" error
        expect(hasError, "Should not have error about required options").toBe(false);
    });

    test("should show options when qty is below threshold", async ({ page }) => {
        await page.goto(`${BASE_URL}${PRODUCT_URL}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);

        const pipeLength = page.locator('.option-wrapper[data-option-id]').first();

        // At qty=1, options should be visible
        await expect(pipeLength).toBeVisible();

        // Set qty to 40 (below both limits of 50 and 70)
        const qtyInput = page.locator('input[name="qty"]');
        await qtyInput.fill("40");
        await qtyInput.dispatchEvent("input");
        await page.waitForTimeout(500);

        // Both values should still be visible
        await expect(pipeLength).toBeVisible();
        const visibleChoices = pipeLength.locator('.field.choice:visible');
        expect(await visibleChoices.count()).toBe(2);
    });

    test("should hide only first value when qty between 50 and 69", async ({ page }) => {
        await page.goto(`${BASE_URL}${PRODUCT_URL}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(1000);

        const pipeLength = page.locator('.option-wrapper[data-option-id]').first();

        // Set qty to 60 (above first limit 50, below second limit 70)
        const qtyInput = page.locator('input[name="qty"]');
        await qtyInput.fill("60");
        await qtyInput.dispatchEvent("input");
        await page.waitForTimeout(500);

        // Option wrapper should still be visible (one value remains)
        await expect(pipeLength).toBeVisible();

        // One value should be hidden, one visible
        const hiddenChoices = pipeLength.locator('.field.choice[data-qty-hidden="true"]');
        const visibleChoices = pipeLength.locator('.field.choice:not([data-qty-hidden])');
        expect(await hiddenChoices.count()).toBe(1);
        expect(await visibleChoices.count()).toBe(1);
    });
});

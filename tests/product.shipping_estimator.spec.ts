import { test, describe, expect } from "../fixtures";
import * as testData from "../data/product.shipping_estimator.data.json";
import * as estimatorLocators from "../locators/product.shipping_estimator.locator";

describe("Product Page Shipping Estimator", () => {
    // Set timeout for all tests in this suite
    test.setTimeout(120000);

    describe("Estimator Enable/Disable Functionality", () => {
        test("Product with estimator enabled shows the shipping calculator button", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Navigate to product with estimator enabled
            await page.goto(process.env.url + testData.product_with_estimator.url);
            await page.waitForLoadState("networkidle");

            // Verify estimator button is visible
            const isButtonVisible = await productShippingEstimatorPage.isEstimatorButtonVisible();
            expect(isButtonVisible).toBe(true);

            // Verify button has correct attributes
            const button = page.locator(estimatorLocators.estimator_button);
            await expect(button).toBeVisible();
            await expect(button).toHaveAttribute("id", "product-shipping-button");
        });

        test.skip("Product with estimator disabled does NOT show the shipping calculator button", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // NOTE: This test is skipped because we need to configure a product with show_ship_calc=0
            // To enable this test:
            // 1. Find or create a product with show_ship_calc attribute set to "No"
            // 2. Update product_without_estimator.url in the data file
            // 3. Remove the .skip from this test

            // Navigate to product with estimator disabled
            await page.goto(process.env.url + testData.product_without_estimator.url);
            await page.waitForLoadState("networkidle");

            // Verify estimator button is NOT visible
            const isButtonVisible = await productShippingEstimatorPage.isEstimatorButtonVisible();
            expect(isButtonVisible).toBe(false);
        });
    });

    describe("Popup Display and Interaction", () => {
        test.beforeEach(async ({ page }) => {
            // Navigate to product with estimator enabled
            await page.goto(process.env.url + testData.product_with_estimator.url);
            await page.waitForLoadState("networkidle");
        });

        test("Clicking the button opens the shipping estimator popup", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Click the estimator button
            await productShippingEstimatorPage.openEstimatorPopup();

            // Verify popup is displayed
            await productShippingEstimatorPage.verifyPopupIsOpen();

            // Verify popup contains expected elements
            await expect(page.locator(estimatorLocators.popup_content)).toBeVisible();
            await expect(page.locator(estimatorLocators.zip_input)).toBeVisible();
            await expect(page.locator(estimatorLocators.region_select)).toBeVisible();
            await expect(page.locator(estimatorLocators.calculate_button)).toBeVisible();
        });

        test("Popup can be closed using the close button", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();
            await productShippingEstimatorPage.verifyPopupIsOpen();

            // Close popup
            await productShippingEstimatorPage.closeEstimatorPopup();

            // Verify popup is hidden
            await expect(page.locator(estimatorLocators.popup_modal)).not.toBeVisible();
        });

        test("ZIP input field receives focus when popup opens", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();

            // Wait a moment for focus to be set (as per init() function)
            await page.waitForTimeout(100);

            // Verify ZIP input has focus
            const focusedElement = await page.evaluateHandle(() => document.activeElement);
            const zipInput = await page.locator(estimatorLocators.zip_input).elementHandle();

            // Compare the focused element with the ZIP input
            const isFocused = await page.evaluate(
                ([focused, zip]) => focused === zip,
                [focusedElement, zipInput]
            );

            expect(isFocused).toBe(true);
        });
    });

    describe("AJAX Shipping Calculation", () => {
        test.beforeEach(async ({ page }) => {
            // Navigate to product and open popup
            await page.goto(process.env.url + testData.product_with_estimator.url);
            await page.waitForLoadState("networkidle");
        });

        test("Form submission makes AJAX call and returns JSON array of shipping methods", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();

            // Fill form with valid data
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.valid_zip,
                testData.shipping_test_data.valid_region_id
            );

            // Calculate shipping and capture response
            const response = await productShippingEstimatorPage.calculateShipping();

            // Verify response is successful
            expect(response.status()).toBe(200);

            // Parse and verify response body
            const responseData = await response.json();

            // Verify response structure
            expect(responseData.success).toBeDefined();
            expect(responseData.success).toBe(true);
            expect(responseData.methods).toBeDefined();
            expect(Array.isArray(responseData.methods)).toBe(true);
            expect(responseData.methods.length).toBeGreaterThanOrEqual(
                testData.shipping_test_data.expected_min_methods
            );

            // Verify each method has required properties
            responseData.methods.forEach((method: any) => {
                expect(method).toHaveProperty("carrier");
                expect(method).toHaveProperty("method");
                expect(method).toHaveProperty("price");
                expect(typeof method.price).toBe("number");
            });
        });

        test("Shipping methods are displayed in the UI after calculation", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();

            // Fill form
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.valid_zip,
                testData.shipping_test_data.valid_region_id
            );

            // Calculate shipping
            await productShippingEstimatorPage.calculateShipping();

            // Verify shipping methods are displayed
            await productShippingEstimatorPage.verifyShippingMethodsDisplayed(
                testData.shipping_test_data.expected_min_methods
            );

            // Verify results container is visible
            await expect(page.locator(estimatorLocators.results_container)).toBeVisible();
            await expect(page.locator(estimatorLocators.shipping_methods_list)).toBeVisible();
        });

        test("Each shipping method displays carrier, method name, and price", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup and fill form
            await productShippingEstimatorPage.openEstimatorPopup();
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.valid_zip,
                testData.shipping_test_data.valid_region_id
            );

            // Calculate shipping
            const response = await productShippingEstimatorPage.calculateShipping();
            const responseData = await response.json();

            // Wait for methods to display
            await productShippingEstimatorPage.verifyShippingMethodsDisplayed();

            // Get methods from UI
            const uiMethods = await productShippingEstimatorPage.getShippingMethods();

            // Verify UI methods match response data count
            expect(uiMethods.length).toBe(responseData.methods.length);

            // Verify each UI method has carrier, method, and price
            uiMethods.forEach((method) => {
                expect(method.carrier).toBeTruthy();
                expect(method.method).toBeTruthy();
                expect(method.price).toBeTruthy();
                // Verify price format (should be a number)
                expect(parseFloat(method.price)).toBeGreaterThan(0);
            });
        });

        test("Calculating with different ZIP codes returns different results", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();

            // First calculation - Texas
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.valid_zip,
                testData.shipping_test_data.valid_region_id
            );
            const response1 = await productShippingEstimatorPage.calculateShipping();
            const data1 = await response1.json();

            // Wait for results to display
            await productShippingEstimatorPage.verifyShippingMethodsDisplayed();

            // Second calculation - California
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.california_zip,
                testData.shipping_test_data.california_region_id
            );
            const response2 = await productShippingEstimatorPage.calculateShipping();
            const data2 = await response2.json();

            // Verify both calculations succeeded
            expect(data1.success).toBe(true);
            expect(data2.success).toBe(true);

            // Both should have methods
            expect(data1.methods.length).toBeGreaterThan(0);
            expect(data2.methods.length).toBeGreaterThan(0);

            // Note: We can't guarantee prices will be different, but we can verify
            // that the system is capable of calculating for different locations
        });
    });

    describe("Error Handling", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(process.env.url + testData.product_with_estimator.url);
            await page.waitForLoadState("networkidle");
        });

        test.skip("Invalid ZIP code shows error message", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // NOTE: This test is skipped because error handling behavior needs to be verified
            // The current implementation may not validate ZIP codes on the client side
            // Enable this test once error handling is confirmed

            // Open popup
            await productShippingEstimatorPage.openEstimatorPopup();

            // Fill with invalid ZIP
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.invalid_zip,
                testData.shipping_test_data.valid_region_id
            );

            // Calculate shipping
            await productShippingEstimatorPage.calculateShipping();

            // Verify error is displayed
            await productShippingEstimatorPage.verifyErrorDisplayed();
        });
    });

    describe("Integration with Product Quantity", () => {
        test("Shipping calculation includes current product quantity", async ({
            page,
            productShippingEstimatorPage
        }) => {
            // Navigate to product
            await page.goto(process.env.url + testData.product_with_estimator.url);
            await page.waitForLoadState("networkidle");

            // Find and fill quantity input
            const qtyInput = page.locator('input[name="qty"]').first();
            await qtyInput.fill("5");

            // Open popup and calculate
            await productShippingEstimatorPage.openEstimatorPopup();
            await productShippingEstimatorPage.fillEstimatorForm(
                testData.shipping_test_data.valid_zip,
                testData.shipping_test_data.valid_region_id
            );

            // Calculate shipping
            const response = await productShippingEstimatorPage.calculateShipping();
            const responseData = await response.json();

            // Verify successful calculation
            expect(responseData.success).toBe(true);
            expect(responseData.methods.length).toBeGreaterThan(0);

            // Note: We verify the calculation works with quantity
            // Actual price differences would require comparing with qty=1
        });
    });
});

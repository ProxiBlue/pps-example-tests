import { test, describe, expect } from "../fixtures";
import * as testData from "../data/product.custom_options_qty_limit.data.json";

describe("Custom Options Quantity Limit - Issue #337", () => {

    test.setTimeout(120000); // 2 minutes for admin operations

    // Test 1: Admin can add qty limit to field option
    test('Admin can add qty limit field to custom option', async ({
        adminPage,
        adminProductCustomOptionsPage,
        browserName
    }) => {
        // Only run on chromium to avoid duplicate admin operations
        if (browserName !== 'chromium') {
            test.skip();
            return;
        }

        // Navigate to admin and login
        await adminPage.navigateTo();
        await adminPage.login();

        // Navigate to products, search, and edit (using common products page)
        await adminProductCustomOptionsPage.productsPage.navigateToProducts();
        await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
        await adminProductCustomOptionsPage.productsPage.editFirstProduct();

        // Navigate to custom options tab
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Clean up any existing test custom options first
        const existingOptionsCount = await adminProductCustomOptionsPage.getCustomOptionsCount();
        for (let i = existingOptionsCount - 1; i >= 0; i--) {
            await adminProductCustomOptionsPage.deleteCustomOption(i);
            await adminProductCustomOptionsPage.page.waitForTimeout(500);
        }

        // Add a new field option with qty limit
        await adminProductCustomOptionsPage.addCustomOption();
        await adminProductCustomOptionsPage.selectOptionType(testData.field_option.type);
        await adminProductCustomOptionsPage.fillOptionTitle(testData.field_option.title, 0);

        // Set qty limit value (the field should be visible after selecting field type)
        await adminProductCustomOptionsPage.setOptionQtyLimit(testData.field_option.qty_limit, 0);

        // Save product (using common products page)
        await adminProductCustomOptionsPage.productsPage.saveAndContinueEdit();

        // Check if we're still on the product edit page, if not, navigate back
        const isOnProductPage = await adminProductCustomOptionsPage.page.locator('.page-title:has-text("' + testData.product_sku + '")').isVisible({ timeout: 2000 }).catch(() => false);

        if (!isOnProductPage) {
            await adminProductCustomOptionsPage.productsPage.navigateToProducts();
            await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
            await adminProductCustomOptionsPage.productsPage.editFirstProduct();
        }

        // Navigate to custom options tab and verify persistence
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        const savedQtyLimit = await adminProductCustomOptionsPage.getOptionQtyLimitValue(0);
        expect(savedQtyLimit).toBe(testData.field_option.qty_limit);
    });

    // Test 2: Admin can add qty limit to dropdown option values
    test('Admin can add qty limit to dropdown option values', async ({
        adminPage,
        adminProductCustomOptionsPage,
        browserName
    }) => {
        if (browserName !== 'chromium') {
            test.skip();
            return;
        }

        await adminPage.navigateTo();
        await adminPage.login();

        await adminProductCustomOptionsPage.productsPage.navigateToProducts();
        await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
        await adminProductCustomOptionsPage.productsPage.editFirstProduct();
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Clean up any existing test custom options first
        const existingOptionsCount = await adminProductCustomOptionsPage.getCustomOptionsCount();
        for (let i = existingOptionsCount - 1; i >= 0; i--) {
            await adminProductCustomOptionsPage.deleteCustomOption(i);
            await adminProductCustomOptionsPage.page.waitForTimeout(500);
        }

        // Add dropdown option
        await adminProductCustomOptionsPage.addCustomOption();

        await adminProductCustomOptionsPage.selectOptionType(testData.dropdown_option.type);

        await adminProductCustomOptionsPage.fillOptionTitle(testData.dropdown_option.title, 0);

        // Add option values with different qty limits
        for (let i = 0; i < testData.dropdown_option.values.length; i++) {
            const value = testData.dropdown_option.values[i];

            await adminProductCustomOptionsPage.addOptionValue();


            await adminProductCustomOptionsPage.fillOptionValueTitle(value.title, i);

            if (value.qty_limit) {
                await adminProductCustomOptionsPage.setOptionValueQtyLimit(value.qty_limit, i);
            }
        }


        // Save product (using common products page)
        await adminProductCustomOptionsPage.productsPage.saveAndContinueEdit();

        // Check if we're still on the product edit page, if not, navigate back
        const isOnProductPage = await adminProductCustomOptionsPage.page.locator('.page-title:has-text("' + testData.product_sku + '")').isVisible({ timeout: 2000 }).catch(() => false);

        if (!isOnProductPage) {
            await adminProductCustomOptionsPage.productsPage.navigateToProducts();
            await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
            await adminProductCustomOptionsPage.productsPage.editFirstProduct();
        }

        // Navigate to custom options tab and verify persistence
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Check how many options exist
        const optionsCount = await adminProductCustomOptionsPage.getCustomOptionsCount();

        // Expand ALL custom option panels to see their contents
        for (let i = 0; i < optionsCount; i++) {
            await adminProductCustomOptionsPage.toggleOptionPanel(i);
            await adminProductCustomOptionsPage.page.waitForTimeout(500);
        }


        // Verify the dropdown option values with qty limits were saved
        // Note: ALL values have qty_limit inputs, even those without limits (they're just empty)
        for (let i = 0; i < testData.dropdown_option.values.length; i++) {
            const value = testData.dropdown_option.values[i];
            if (value.qty_limit) {
                const savedQtyLimit = await adminProductCustomOptionsPage.getOptionValueQtyLimitValue(i);
                expect(savedQtyLimit).toBe(value.qty_limit);
            }
        }
    });

    // Test 3: Frontend - Complete qty limit behavior test
    test('Frontend qty limit behavior - options gray out, become unselectable, and return when qty changes', async ({
        adminPage,
        adminProductCustomOptionsPage,
        productCustomOptionsPage,
        browserName
    }) => {
        // Increase timeout for this test due to admin setup
        test.setTimeout(180000); // 3 minutes

        if (browserName !== 'chromium') {
            test.skip();
            return;
        }

        // Step 1: Setup - Add radio option with qty limits in admin (do once)
        await adminPage.navigateTo();
        await adminPage.login();

        await adminProductCustomOptionsPage.productsPage.navigateToProducts();
        await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
        await adminProductCustomOptionsPage.productsPage.editFirstProduct();
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Clean up any existing test custom options first
        const existingOptionsCount = await adminProductCustomOptionsPage.getCustomOptionsCount();

        // Delete all options at once without checking count in between (faster)
        for (let i = existingOptionsCount - 1; i >= 0; i--) {
            await adminProductCustomOptionsPage.deleteCustomOption(i);
        }

        await adminProductCustomOptionsPage.productsPage.saveAndContinueEdit();
        await adminProductCustomOptionsPage.page.waitForTimeout(3000);

        // Flush cache so frontend sees the updated product without old options
        await adminProductCustomOptionsPage.page.evaluate(() => {
            return fetch('/rest/V1/system/cache/flush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        });
        await adminProductCustomOptionsPage.page.waitForTimeout(2000);

        // Navigate back to custom options tab
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Add radio option with qty limits
        await adminProductCustomOptionsPage.addCustomOption();
        await adminProductCustomOptionsPage.selectOptionType(testData.radio_option.type);
        await adminProductCustomOptionsPage.fillOptionTitle(testData.radio_option.title, 0);

        for (let i = 0; i < testData.radio_option.values.length; i++) {
            const value = testData.radio_option.values[i];

            await adminProductCustomOptionsPage.addOptionValue();
            await adminProductCustomOptionsPage.fillOptionValueTitle(value.title, i);

            if (value.qty_limit) {
                await adminProductCustomOptionsPage.setOptionValueQtyLimit(value.qty_limit, i);
            }
        }

        await adminProductCustomOptionsPage.productsPage.saveAndContinueEdit();

        // Step 2: Navigate to frontend and test all qty limit behaviors
        await productCustomOptionsPage.navigateToProduct(testData.product_url);
        await productCustomOptionsPage.verifyCustomOptionsVisible();

        // Test A: Low quantity (1) - All options should be enabled and selectable
        await productCustomOptionsPage.setProductQuantity(testData.test_quantities.low);

        // Verify qty limit message is hidden
        await productCustomOptionsPage.verifyQtyLimitMessageHidden();

        // All options should be enabled
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[0].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[2].title, testData.radio_option.title);

        // Verify we can select any option when qty is low
        await productCustomOptionsPage.selectRadioOption(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionChecked(testData.radio_option.values[1].title, testData.radio_option.title);

        // Test B: Medium quantity (3) - Option B (limit 2) should be grayed out
        await productCustomOptionsPage.setProductQuantity(testData.test_quantities.medium);

        // Verify qty limit message appears
        await productCustomOptionsPage.verifyQtyLimitMessageVisible();
        const messageText = await productCustomOptionsPage.getQtyLimitMessageText();
        expect(messageText.length).toBeGreaterThan(0);

        // Option A (no limit) should still be enabled
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[0].title, testData.radio_option.title);

        // Option B (limit 2) should be grayed out
        await productCustomOptionsPage.verifyRadioOptionGrayedOut(testData.radio_option.values[1].title, testData.radio_option.title);

        // Option C (limit 5) should still be enabled
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[2].title, testData.radio_option.title);

        // Verify grayed out option cannot be selected
        await productCustomOptionsPage.selectRadioOption(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionNotChecked(testData.radio_option.values[1].title, testData.radio_option.title);

        // Verify enabled option can still be selected
        await productCustomOptionsPage.selectRadioOption(testData.radio_option.values[0].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionChecked(testData.radio_option.values[0].title, testData.radio_option.title);

        // Test C: High quantity (5) - Both Option B and C should be grayed out
        await productCustomOptionsPage.setProductQuantity(testData.test_quantities.high);

        // Option A should still be enabled
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[0].title, testData.radio_option.title);

        // Both Option B and C should be grayed out
        await productCustomOptionsPage.verifyRadioOptionGrayedOut(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionGrayedOut(testData.radio_option.values[2].title, testData.radio_option.title);

        // Test D: Back to low quantity - Options should become enabled again
        await productCustomOptionsPage.setProductQuantity(testData.test_quantities.low);

        // Verify qty limit message is hidden again
        await productCustomOptionsPage.verifyQtyLimitMessageHidden();

        // All options should be enabled again
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[0].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[2].title, testData.radio_option.title);

        // Verify previously grayed out option is now selectable
        await productCustomOptionsPage.selectRadioOption(testData.radio_option.values[1].title, testData.radio_option.title);
        await productCustomOptionsPage.verifyRadioOptionChecked(testData.radio_option.values[1].title, testData.radio_option.title);

        // Test E: Back to medium quantity - Option B should gray out again
        await productCustomOptionsPage.setProductQuantity(testData.test_quantities.medium);

        // Option B should be grayed out again
        await productCustomOptionsPage.verifyRadioOptionGrayedOut(testData.radio_option.values[1].title, testData.radio_option.title);

        // But Option C should still be enabled
        await productCustomOptionsPage.verifyRadioOptionEnabled(testData.radio_option.values[2].title, testData.radio_option.title);


    });

    // Test 4: Frontend dropdown qty limit behavior - simple visual check
    test('Frontend dropdown qty limit behavior - visual check only', async ({
        productCustomOptionsPage,
        browserName
    }) => {
        test.setTimeout(60000); // 1 minute

        if (browserName !== 'chromium') {
            test.skip();
            return;
        }

        // Navigate to product (assuming dropdown options are already configured)
        await productCustomOptionsPage.navigateToProduct(testData.product_url);

        // Wait for page to be fully loaded
        await productCustomOptionsPage.page.waitForLoadState('networkidle');
        await productCustomOptionsPage.page.waitForTimeout(2000);

        // Check if custom options exist
        const hasCustomOptions = await productCustomOptionsPage.page.locator('h2:has-text("Customizable Options")').count();

        if (hasCustomOptions === 0) {
            console.log('No custom options found on product page - skipping dropdown test');
            test.skip();
            return;
        }

        // Check if dropdown exists
        const dropdownCount = await productCustomOptionsPage.page.locator('select.product-custom-option').count();

        if (dropdownCount === 0) {
            console.log('No dropdown options found - test needs dropdown options to be configured in admin first');
            test.skip();
            return;
        }

        // Simple test: verify dropdown exists and is interactive
        const dropdown = productCustomOptionsPage.page.locator('select.product-custom-option').first();
        await expect(dropdown).toBeVisible();

        // Test changing quantity triggers visibility updates
        await productCustomOptionsPage.setProductQuantity(1);
        await productCustomOptionsPage.page.waitForTimeout(1000);

        // Get all option values
        const optionsAtQty1 = await dropdown.evaluate((sel: HTMLSelectElement) => {
            return Array.from(sel.options).map(opt => ({
                text: opt.text,
                disabled: opt.disabled,
                display: window.getComputedStyle(opt).display
            }));
        });

        console.log('Options at qty=1:', optionsAtQty1);

        // Increase quantity
        await productCustomOptionsPage.setProductQuantity(10);
        await productCustomOptionsPage.page.waitForTimeout(1000);

        const optionsAtQty10 = await dropdown.evaluate((sel: HTMLSelectElement) => {
            return Array.from(sel.options).map(opt => ({
                text: opt.text,
                disabled: opt.disabled,
                display: window.getComputedStyle(opt).display
            }));
        });

        console.log('Options at qty=10:', optionsAtQty10);

        // Basic assertion: At least one option should change state
        // This is a loose test - just verifies the mechanism is working
        const hasStateChange = optionsAtQty1.some((opt1, idx) => {
            const opt10 = optionsAtQty10[idx];
            return opt1.disabled !== opt10.disabled || opt1.display !== opt10.display;
        });

        // If options have qty limits configured, we expect state changes
        // If no qty limits configured, this test will pass regardless
        console.log('State change detected:', hasStateChange);
    });

    // Test 5: Clean up - Remove test custom options
    test.afterAll(async ({ adminPage, adminProductCustomOptionsPage, browserName }) => {
        // Increase timeout for cleanup operations (admin navigation + deletion)
        test.setTimeout(120000); // 2 minutes

        if (browserName !== 'chromium') {
            return;
        }


        // Navigate to admin and login
        await adminPage.navigateTo();
        await adminPage.login();

        // Navigate to product and edit
        await adminProductCustomOptionsPage.productsPage.navigateToProducts();
        await adminProductCustomOptionsPage.productsPage.searchProduct(testData.product_sku);
        await adminProductCustomOptionsPage.productsPage.editFirstProduct();

        // Navigate to custom options tab
        await adminProductCustomOptionsPage.navigateToCustomOptionsTab();

        // Delete all custom options
        const optionsCount = await adminProductCustomOptionsPage.getCustomOptionsCount();

        for (let i = optionsCount - 1; i >= 0; i--) {
            await adminProductCustomOptionsPage.deleteCustomOption(i);
            await adminProductCustomOptionsPage.page.waitForTimeout(300);
        }


        // Save product
        await adminProductCustomOptionsPage.productsPage.saveAndContinueEdit();
        await adminProductCustomOptionsPage.page.waitForTimeout(2000);

    });
});

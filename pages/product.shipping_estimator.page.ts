import BasePage from "@common/pages/base.page";
import { Page, TestInfo, expect, test } from "@playwright/test";
import * as data from "../data/product.shipping_estimator.data.json";
import * as estimatorLocators from "../locators/product.shipping_estimator.locator";

export default class ProductShippingEstimatorPage extends BasePage {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo, data, estimatorLocators);
    }

    /**
     * Check if the shipping estimator button is visible
     */
    async isEstimatorButtonVisible(): Promise<boolean> {
        return await test.step(
            this.workerInfo.project.name + ": Check if estimator button is visible",
            async () => {
                try {
                    await this.page.waitForSelector(estimatorLocators.estimator_button, { timeout: 3000 });
                    return await this.page.locator(estimatorLocators.estimator_button).isVisible();
                } catch (error) {
                    return false;
                }
            }
        );
    }

    /**
     * Click the shipping estimator button to open the popup
     */
    async openEstimatorPopup() {
        await test.step(
            this.workerInfo.project.name + ": Click shipping estimator button",
            async () => {
                await this.page.waitForSelector(estimatorLocators.estimator_button);
                await this.page.click(estimatorLocators.estimator_button);
                // Wait for popup to appear
                await this.page.waitForSelector(estimatorLocators.popup_modal, { state: 'visible' });
            }
        );
    }

    /**
     * Close the estimator popup
     */
    async closeEstimatorPopup() {
        await test.step(
            this.workerInfo.project.name + ": Close estimator popup",
            async () => {
                await this.page.click(estimatorLocators.popup_close);
                // Wait for popup to disappear
                await this.page.waitForSelector(estimatorLocators.popup_modal, { state: 'hidden' });
            }
        );
    }

    /**
     * Verify the popup is open and visible
     */
    async verifyPopupIsOpen() {
        await test.step(
            this.workerInfo.project.name + ": Verify popup is open",
            async () => {
                await expect(this.page.locator(estimatorLocators.popup_modal)).toBeVisible();
                await expect(this.page.locator(estimatorLocators.popup_content)).toBeVisible();
            }
        );
    }

    /**
     * Fill the shipping estimator form
     * @param zip - ZIP code
     * @param regionId - Region ID to select
     */
    async fillEstimatorForm(zip: string, regionId: string) {
        await test.step(
            this.workerInfo.project.name + ": Fill estimator form with ZIP: " + zip,
            async () => {
                // Fill ZIP code
                await this.page.fill(estimatorLocators.zip_input, zip);

                // Select region
                await this.page.selectOption(estimatorLocators.region_select, regionId);
            }
        );
    }

    /**
     * Click the calculate shipping button and wait for response
     */
    async calculateShipping() {
        return await test.step(
            this.workerInfo.project.name + ": Calculate shipping",
            async () => {
                // Set up promise to wait for the API response
                const responsePromise = this.page.waitForResponse(
                    response => response.url().includes('/shippingcalc/ajax/calculateShipping')
                );

                // Click calculate button
                await this.page.click(estimatorLocators.calculate_button);

                // Wait for and return the response
                const response = await responsePromise;
                return response;
            }
        );
    }

    /**
     * Verify the AJAX response is successful and contains shipping methods
     * @param response - The fetch Response object
     */
    async verifyShippingResponse(response: any) {
        await test.step(
            this.workerInfo.project.name + ": Verify shipping response",
            async () => {
                // Check response status
                expect(response.status()).toBe(200);

                // Parse response body
                const responseData = await response.json();

                // Verify success flag
                expect(responseData.success).toBe(true);

                // Verify methods array exists
                expect(responseData.methods).toBeDefined();
                expect(Array.isArray(responseData.methods)).toBe(true);

                return responseData;
            }
        );
    }

    /**
     * Verify shipping methods are displayed in the UI
     * @param expectedMinCount - Minimum expected number of shipping methods
     */
    async verifyShippingMethodsDisplayed(expectedMinCount: number = 1) {
        await test.step(
            this.workerInfo.project.name + ": Verify shipping methods are displayed",
            async () => {
                // Wait for results to appear
                await this.page.waitForSelector(estimatorLocators.shipping_methods_list, {
                    state: 'visible',
                    timeout: 10000
                });

                // Count shipping method items
                const methodCount = await this.page.locator(estimatorLocators.shipping_method_item).count();

                // Verify we have at least the expected number of methods
                expect(methodCount).toBeGreaterThanOrEqual(expectedMinCount);
            }
        );
    }

    /**
     * Verify loading state is shown during calculation
     */
    async verifyLoadingState() {
        await test.step(
            this.workerInfo.project.name + ": Verify loading state",
            async () => {
                // Check if loading message appears (it may be brief)
                const loadingVisible = await this.page.locator(estimatorLocators.loading_message).isVisible().catch(() => false);
                // We don't assert here because the loading state might be too brief to catch
                // Just log for debugging purposes
                if (!loadingVisible) {
                    console.log("Loading state was too brief to capture or not shown");
                }
            }
        );
    }

    /**
     * Verify error message is displayed
     */
    async verifyErrorDisplayed() {
        await test.step(
            this.workerInfo.project.name + ": Verify error is displayed",
            async () => {
                await this.page.waitForSelector(estimatorLocators.error_message, { state: 'visible' });
                await expect(this.page.locator(estimatorLocators.error_message)).toBeVisible();
            }
        );
    }

    /**
     * Get all shipping method details from the UI
     */
    async getShippingMethods(): Promise<Array<{carrier: string, method: string, price: string}>> {
        return await test.step(
            this.workerInfo.project.name + ": Get shipping methods from UI",
            async () => {
                await this.page.waitForSelector(estimatorLocators.shipping_methods_list);

                const methods = await this.page.locator(estimatorLocators.shipping_method_item).all();
                const methodDetails = [];

                for (const method of methods) {
                    const text = await method.textContent() || '';
                    methodDetails.push({
                        carrier: text.split('-')[0]?.trim() || '',
                        method: text.split('-')[1]?.split(':')[0]?.trim() || '',
                        price: text.split('$')[1]?.trim() || ''
                    });
                }

                return methodDetails;
            }
        );
    }
}

import SimpleProductPage from "@hyva/pages/simple_product.page";
import type { Page, TestInfo } from "@playwright/test";
import { expect } from "../fixtures";
import * as customOptionsLocators from "../locators/product.custom_options.locator";

export default class PPSProductCustomOptionsPage extends SimpleProductPage {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo);
    }

    /**
     * Navigate to product page
     */
    async navigateToProduct(productUrl: string) {
        await this.page.goto(process.env.url + productUrl);
        await this.page.waitForLoadState("networkidle");
    }

    /**
     * Set product quantity
     */
    async setProductQuantity(quantity: number) {
        await this.page.fill(customOptionsLocators.product_qty_input, quantity.toString());

        // Trigger the update-qty event manually to ensure Alpine.js updates
        await this.page.evaluate((qty) => {
            window.dispatchEvent(new CustomEvent('update-qty', { detail: qty }));
        }, quantity);

        // Wait for the event to propagate
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify custom options section is visible
     */
    async verifyCustomOptionsVisible() {
        await expect(this.page.locator(customOptionsLocators.custom_options_heading)).toBeVisible();
    }

    /**
     * Verify qty limit warning message is visible
     */
    async verifyQtyLimitMessageVisible() {
        await expect(this.page.locator(customOptionsLocators.qty_limit_message)).toBeVisible();
    }

    /**
     * Verify qty limit warning message is hidden
     */
    async verifyQtyLimitMessageHidden() {
        await expect(this.page.locator(customOptionsLocators.qty_limit_message)).toBeHidden();
    }

    /**
     * Get qty limit message text
     */
    async getQtyLimitMessageText(): Promise<string> {
        const messageElement = this.page.locator(customOptionsLocators.qty_limit_message_text);
        return (await messageElement.textContent()) || '';
    }

    /**
     * Verify dropdown option is disabled
     */
    async verifyDropdownOptionDisabled(optionText: string) {
        const option = this.page.locator(customOptionsLocators.select_option_value)
            .filter({ hasText: optionText });

        // Check if option is disabled
        await expect(option).toHaveAttribute('disabled', '');
    }

    /**
     * Verify dropdown option is enabled
     */
    async verifyDropdownOptionEnabled(optionText: string) {
        const option = this.page.locator(customOptionsLocators.select_option_value)
            .filter({ hasText: optionText });

        // Check if option is NOT disabled
        const isDisabled = await option.getAttribute('disabled');
        expect(isDisabled).toBeNull();
    }

    /**
     * Verify radio option is grayed out (disabled with opacity)
     * @param optionText The text of the specific option value (e.g., "Option A (No Limit)")
     * @param customOptionTitle Optional title of the parent custom option to scope to (e.g., "Test Radio Option")
     */
    async verifyRadioOptionGrayedOut(optionText: string, customOptionTitle?: string) {
        // Simply use .first() since we have only one custom option in tests
        const label = this.page.locator(customOptionsLocators.radio_option_label)
            .filter({ hasText: optionText }).first();

        await expect(label).toBeVisible();

        // Check for grayed out styling (opacity: 0.5)
        const opacity = await label.evaluate((el) => {
            return window.getComputedStyle(el).opacity;
        });

        expect(parseFloat(opacity)).toBeLessThanOrEqual(0.5);

        // Find the radio input - could be inside label or previous sibling
        let radio = label.locator('input[type="radio"]').first();
        const radioCount = await radio.count();

        if (radioCount === 0) {
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                radio = this.page.locator(`#${forAttr}`);
            }
        }

        await expect(radio).toBeDisabled();
    }

    /**
     * Verify radio option is enabled (not grayed out)
     * @param optionText The text of the specific option value (e.g., "Option A (No Limit)")
     * @param customOptionTitle Optional title of the parent custom option to scope to (e.g., "Test Radio Option")
     */
    async verifyRadioOptionEnabled(optionText: string, customOptionTitle?: string) {
        // Simply use .first() since we have only one custom option in tests
        const label = this.page.locator(customOptionsLocators.radio_option_label)
            .filter({ hasText: optionText }).first();

        await expect(label).toBeVisible();

        // Check opacity is normal (1 or empty)
        const opacity = await label.evaluate((el) => {
            const computedOpacity = window.getComputedStyle(el).opacity;
            return computedOpacity === '' || parseFloat(computedOpacity) === 1;
        });

        expect(opacity).toBe(true);

        // Find the radio input - could be inside label or previous sibling
        let radio = label.locator('input[type="radio"]').first();
        const radioCount = await radio.count();

        if (radioCount === 0) {
            // Input is likely a previous sibling, not inside label
            // Get the 'for' attribute from label to find the input by ID
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                radio = this.page.locator(`#${forAttr}`);
            }
        }

        await expect(radio).toBeEnabled();
    }

    /**
     * Verify checkbox option is grayed out (disabled with opacity)
     */
    async verifyCheckboxOptionGrayedOut(optionText: string) {
        const label = this.page.locator(customOptionsLocators.checkbox_option_label)
            .filter({ hasText: optionText });

        await expect(label).toBeVisible();

        // Check for grayed out styling
        const opacity = await label.evaluate((el) => {
            return window.getComputedStyle(el).opacity;
        });

        expect(parseFloat(opacity)).toBeLessThanOrEqual(0.5);

        // Verify the checkbox input is disabled
        const checkbox = label.locator('input[type="checkbox"]').first();
        await expect(checkbox).toBeDisabled();
    }

    /**
     * Verify checkbox option is enabled
     */
    async verifyCheckboxOptionEnabled(optionText: string) {
        const label = this.page.locator(customOptionsLocators.checkbox_option_label)
            .filter({ hasText: optionText });

        await expect(label).toBeVisible();

        // Check opacity is normal
        const opacity = await label.evaluate((el) => {
            const computedOpacity = window.getComputedStyle(el).opacity;
            return computedOpacity === '' || parseFloat(computedOpacity) === 1;
        });

        expect(opacity).toBe(true);

        // Verify checkbox is enabled
        const checkbox = label.locator('input[type="checkbox"]').first();
        await expect(checkbox).toBeEnabled();
    }

    /**
     * Try to select a radio option
     * @param optionText The text of the specific option value (e.g., "Option A (No Limit)")
     * @param customOptionTitle Optional title of the parent custom option to scope to (e.g., "Test Radio Option")
     */
    async selectRadioOption(optionText: string, customOptionTitle?: string) {
        // Simply use .first() since we have only one custom option in tests
        const label = this.page.locator(customOptionsLocators.radio_option_label)
            .filter({ hasText: optionText }).first();

        // Find the radio input - could be inside label or previous sibling
        let radio = label.locator('input[type="radio"]').first();
        const radioCount = await radio.count();

        if (radioCount === 0) {
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                radio = this.page.locator(`#${forAttr}`);
            }
        }

        await radio.click({ force: true });
    }

    /**
     * Verify radio option is checked
     * @param optionText The text of the specific option value (e.g., "Option A (No Limit)")
     * @param customOptionTitle Optional title of the parent custom option to scope to (e.g., "Test Radio Option")
     */
    async verifyRadioOptionChecked(optionText: string, customOptionTitle?: string) {
        // Simply use .first() since we have only one custom option in tests
        const label = this.page.locator(customOptionsLocators.radio_option_label)
            .filter({ hasText: optionText }).first();

        // Find the radio input - could be inside label or previous sibling
        let radio = label.locator('input[type="radio"]').first();
        const radioCount = await radio.count();

        if (radioCount === 0) {
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                radio = this.page.locator(`#${forAttr}`);
            }
        }

        await expect(radio).toBeChecked();
    }

    /**
     * Verify radio option is not checked
     * @param optionText The text of the specific option value (e.g., "Option A (No Limit)")
     * @param customOptionTitle Optional title of the parent custom option to scope to (e.g., "Test Radio Option")
     */
    async verifyRadioOptionNotChecked(optionText: string, customOptionTitle?: string) {
        // Simply use .first() since we have only one custom option in tests
        const label = this.page.locator(customOptionsLocators.radio_option_label)
            .filter({ hasText: optionText }).first();

        // Find the radio input - could be inside label or previous sibling
        let radio = label.locator('input[type="radio"]').first();
        const radioCount = await radio.count();

        if (radioCount === 0) {
            const forAttr = await label.getAttribute('for');
            if (forAttr) {
                radio = this.page.locator(`#${forAttr}`);
            }
        }

        await expect(radio).not.toBeChecked();
    }

    /**
     * Count visible (non-disabled) dropdown options
     */
    async countEnabledDropdownOptions(): Promise<number> {
        const allOptions = await this.page.locator(customOptionsLocators.select_option_value).all();
        let enabledCount = 0;

        for (const option of allOptions) {
            const isDisabled = await option.getAttribute('disabled');
            if (!isDisabled) {
                enabledCount++;
            }
        }

        return enabledCount;
    }

    /**
     * Select a dropdown option by text
     */
    async selectDropdownOption(optionText: string) {
        const select = this.page.locator(customOptionsLocators.select_option).first();
        await select.selectOption({ label: optionText });
        await this.page.waitForTimeout(300);
    }

    /**
     * Verify dropdown option is hidden (display: none)
     */
    async verifyDropdownOptionHidden(optionText: string) {
        const option = this.page.locator(customOptionsLocators.select_option_value)
            .filter({ hasText: optionText });

        // Check if option has display: none
        const isHidden = await option.evaluate((el) => {
            return window.getComputedStyle(el).display === 'none';
        });

        expect(isHidden).toBe(true);

        // Also check disabled attribute
        await expect(option).toHaveAttribute('disabled', '');
    }

    /**
     * Verify dropdown option is visible (not hidden)
     */
    async verifyDropdownOptionVisible(optionText: string) {
        const option = this.page.locator(customOptionsLocators.select_option_value)
            .filter({ hasText: optionText });

        // Check if option is NOT display: none
        const isVisible = await option.evaluate((el) => {
            const display = window.getComputedStyle(el).display;
            return display !== 'none';
        });

        expect(isVisible).toBe(true);

        // Check that it's not disabled
        const isDisabled = await option.getAttribute('disabled');
        expect(isDisabled).toBeNull();
    }

    /**
     * Get currently selected dropdown option text
     */
    async getSelectedDropdownOptionText(): Promise<string> {
        const select = this.page.locator(customOptionsLocators.select_option).first();
        return await select.evaluate((el: HTMLSelectElement) => {
            const selectedOption = el.options[el.selectedIndex];
            return selectedOption ? selectedOption.text : '';
        });
    }

    /**
     * Attempt to add product to cart
     */
    async clickAddToCart() {
        await this.page.locator(customOptionsLocators.add_to_cart_button).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify error message appears
     */
    async verifyErrorMessageVisible() {
        const errorMessage = this.page.locator('.message-error, [data-ui-id*="message-error"]').first();
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
    }

    /**
     * Verify dropdown option is selected
     */
    async verifyDropdownOptionSelected(optionText: string) {
        const selectedText = await this.getSelectedDropdownOptionText();
        expect(selectedText).toContain(optionText);
    }
}

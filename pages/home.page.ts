import HomePage from "@hyva/pages/home.page";
import type { Page, TestInfo } from "@playwright/test";
import { expect, test } from "../fixtures";
import { loadLocators } from "@utils/functions/file";

// Load the locators dynamically based on the APP_NAME environment variable
const locators = loadLocators('locators/home.locator', 'pps');
const pageLocators = loadLocators('locators/page.locator', 'hyva');
const searchSelectors = loadLocators('locators/search.locator', 'hyva');
const product = loadLocators('locators/product.locator', 'hyva');

export default class PPSHomePage extends HomePage {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo);
    }

    async verifyHasCategoryList() {
        await test.step(
            this.workerInfo.project.name + ": Verify element exists " + locators.category_grid,
            async () => await expect(this.page.locator(locators.category_grid)).toHaveCount(1)
        );
    }

    async canSearchFromHomepage(isMobile: boolean) {
        // Handle both data structures: with and without 'default' property
        const searchTerm = (this.data as { default?: { search_term: string }; search_term?: string }).default?.search_term || (this.data as { search_term?: string }).search_term;

        if (isMobile) {
            await this.page.click(searchSelectors.headerSearchIcon);
            await this.page.waitForSelector(searchSelectors.headerSearchFieldMobile);
            await this.page.fill(searchSelectors.headerSearchFieldMobile, searchTerm || "", {force: true});
            await this.page.press(searchSelectors.headerSearchFieldMobile, 'Enter');
        } else {
            await this.page.waitForSelector(searchSelectors.headerSearchField);
            await this.page.fill(searchSelectors.headerSearchField, searchTerm || "");
            await this.page.press(searchSelectors.headerSearchField, 'Enter');
        }
        await this.page.waitForSelector(pageLocators.pageTitle);
        const mainHeadingText = await this.page.$eval(pageLocators.pageTitle, (el) => el.textContent);
        expect(mainHeadingText).toContain(searchTerm);
        await test.step(
            this.workerInfo.project.name + ": Verify element is visible " + product.productGrid,
            async () => expect(await this.page.locator(product.productGrid).isVisible()).toBe(true)
        );
        await expect.poll(async () => this.page.locator(product.productGridItem).count()).toBeGreaterThan(0);
    }

}

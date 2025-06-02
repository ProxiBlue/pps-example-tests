import CategoryPage from "@hyva/pages/category.page";
import type {Page, TestInfo} from "@playwright/test";
import { expect } from "../fixtures";
import * as data from "../data/category.data.json";
import { loadLocators } from "@utils/functions/file";

// Load the locators dynamically based on the APP_NAME environment variable
const locators = loadLocators('locators/category.locator', 'pps');

export default class PPSCategoryPage extends CategoryPage {

    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo);
    }

    async checkPPSFilter(isMobile: boolean) {
        const filters: Record<string, Record<string, number>> = data.default.filters || [];
        let filter: string = '';
        let option: string = '';
        for (filter in filters) {
            await this.checkPPSFilterExists(filter, isMobile);
            for (option in filters[filter]) {
                await this.checkPPSFilterResults(filter, option, filters[filter][option], isMobile);
            }
        }
    }

    async checkPPSFilterExists(filter: string, isMobile: boolean) {
        if(isMobile) {
            this.mobileOpenFilters()
        }
        await expect(await this.page.getByText(filter, { exact: true })).toBeVisible();
    }

    async checkPPSFilterResults(filter: string, option: string, count: number, isMobile: boolean) {
        const filterButton = await this.page.getByText(filter, { exact: true });
        //await filterButton.click();
        if(isMobile) {
            this.mobileOpenFilters()
        }
        const filterContainer = await this.page.locator('.filter-option', {has: filterButton});
        await expect(await filterContainer.getByRole('link', {name: option, exact: true})).toBeVisible();
        const filterOption = await filterContainer.getByRole('link', {name: option, exact: true});
        await filterOption.click();
        if(isMobile) {
            this.mobileOpenFilters()
        }
        await this.page.waitForSelector(locators.active_filtering_content);
        await expect(await this.page.textContent(locators.active_filtering_content)).toContain(option);
        const countLocator = await this.page.locator(locators.toolbar_amount).last();
        await expect(await countLocator.textContent()).toContain(count.toString());
        await this.page.getByRole('link', {name: 'Remove This Item'}).click();

        await expect(this.page.locator(locators.active_filtering_content)).not.toBeVisible();
    }

    async mobileOpenFilters() {
        const filterContent = this.page.locator('.filter-content');
        if(await filterContent.isHidden()) {
            await this.page.locator('.py-1 > .transition-transform').first().click();
        }
    }

}

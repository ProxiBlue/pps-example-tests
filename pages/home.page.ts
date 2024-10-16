import HomePage from "@hyva/pages/home.page";
import type { Page, TestInfo } from "@playwright/test";
import { expect } from "../fixtures";
import * as actions from "@utils/base/web/actions";
import * as locators from "../locators/home.locator";
import * as pageLocators from "@hyva/locators/page.locator";
import * as searchSelectors from "@hyva/locators/search.locator";
import * as product from "@hyva/locators/product.locator";


export default class PPSHomePage extends HomePage {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo);
    }

    async verifyHasCategoryList() {
        await actions.verifyElementExists(this.page, locators.category_grid, this.workerInfo);
    }

    async canSearchFromHomepage(isMobile: boolean) {
        if (isMobile) {
            await this.page.click(searchSelectors.headerSearchIcon);
            await this.page.waitForSelector(searchSelectors.headerSearchFieldMobile);
            await this.page.fill(searchSelectors.headerSearchFieldMobile, this.data.search_term, {force: true});
            await this.page.press(searchSelectors.headerSearchFieldMobile, 'Enter');
        } else {
            await this.page.waitForSelector(searchSelectors.headerSearchField);
            await this.page.fill(searchSelectors.headerSearchField, this.data.search_term);
            await this.page.press(searchSelectors.headerSearchField, 'Enter');
        }
        await this.page.waitForSelector(pageLocators.pageTitle);
        const mainHeadingText = await this.page.$eval(pageLocators.pageTitle, (el) => el.textContent);
        expect(mainHeadingText).toContain(this.data.search_term);
        await actions.verifyElementIsVisible(this.page, product.productGrid, this.workerInfo);
        await expect.poll(async () => this.page.locator(product.productGridItem).count()).toBeGreaterThan(0);
    }

}

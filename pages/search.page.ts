import SearchPage from "@hyva/pages/search.page";
import {Page, TestInfo, expect, test} from "@playwright/test";
import * as pageLocators from "@hyva/locators/page.locator";

export default class PPSSearchPage extends SearchPage {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo); // pass the data and locators to the base page class
    }

    async navigateTo() {
        await test.step(
            this.workerInfo.project.name + ": Go to " + (process.env.url || ''),
            async () => await this.page.goto(process.env.url || '')
        );
    }

    async searchForSingleProduct(isMobile: boolean = false) {
        await this.search(this.data.default.single_product || '', isMobile);
        await this.page.waitForSelector(pageLocators.message_success);
        const successMessageText = await this.page.locator(pageLocators.message_success).textContent();
        expect(successMessageText).toContain(
            `${this.data.default.single_product_name} is the only product matching your '${this.data.default.single_product}' search.`
        );
    }

}

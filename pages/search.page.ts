import SearchPage from "@hyva/pages/search.page";
import {Page, TestInfo, expect, test} from "@playwright/test";
import * as pageLocators from "@hyva/locators/page.locator";
import * as searchLocators from "@hyva/locators/search.locator";
import cartPage from "../../hyva/pages/cart.page";


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

    async checkSearchSuggestions(isMobile: boolean = false, countMatch: number = 3) {
        await this.page.waitForSelector(searchLocators.headerSearchField);
        await this.page.fill(searchLocators.headerSearchField, this.data.default.search_dropdown || 'pipes');
        //put a 3s delay here
        await this.page.waitForTimeout(3000);
        await expect(this.page.locator(searchLocators.mini_search).first()).toBeVisible();
        const lookupText = await this.page.locator(searchLocators.mini_search).nth(1).textContent();
        expect(lookupText).toContain(this.data.default.hint_result);
    }

    async checkSearchSuggestionsAddToCart(isMobile: boolean = false, countMatch: number = 3) {
        await this.page.waitForSelector(searchLocators.headerSearchField);
        await this.page.fill(searchLocators.headerSearchField, this.data.default.search_dropdown || 'pipes');
        //put a 3s delay here
        await this.page.waitForTimeout(3000);
        await expect(this.page.locator(searchLocators.mini_search).first()).toBeVisible();
        // check for inout by name and get first name="qty"
        const qtyInput = this.page.locator("input[name='qty']").first();
        await qtyInput.fill("1");
        // click the button btn-primary that comes right after the input
        const addToCartButton = this.page.locator("button.btn-primary").first();
        await addToCartButton.click();
        await this.page.waitForTimeout(3000);
        
        const cartPageObject = await new cartPage(this.page, this.workerInfo);
        await cartPageObject.navigateTo();
        await cartPageObject.checkQuantity(0, 1);
    }

}

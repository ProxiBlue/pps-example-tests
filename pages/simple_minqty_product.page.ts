import BasePage from "@common/pages/base.page";
import {Page, TestInfo, expect, test} from "@playwright/test";
import * as data from "../data/minqtysimple.data.json";
import { loadLocators } from "@utils/functions/file";


//import * as data from "../data/simple_product.data.json";

// Load the locators dynamically based on the APP_NAME environment variable
const locators = loadLocators('locators/product.locator', 'hyva');

export default class SimpleMinQtyProductPage extends BasePage {

    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo, data, locators); // pass the data and locators to teh base page class
    }

    async verifyPageTitle() {
        const titleText = await test.step(
            this.workerInfo.project.name + ": Get innertext from " + this.locators.title,
            async () => await this.page.innerText(this.locators.title)
        );
        await expect(titleText).toEqual(data.name);
    }

    async verifyDomTitle() {
        await test.step(
            this.workerInfo.project.name + ": Verify page title is '" + data.name + "'",
            async () => await expect(this.page).toHaveTitle(data.name)
        );
    }

    async addToCart() {
        await test.step(
            this.workerInfo.project.name + ": Enter text: 1",
            async () => await this.page.fill(locators.product_qty_input, '1')
        );
        await test.step(
            this.workerInfo.project.name + ": Click element " + locators.product_add_to_cart_button,
            async () => await this.page.locator(locators.product_add_to_cart_button).click()
        );
        await test.step(
            this.workerInfo.project.name + ": Wait for load state networkidle",
            async () => await this.page.waitForLoadState("networkidle")
        );
        //await test.step(
        //    this.workerInfo.project.name + ": Verify element is visible " + pageLocators.message_success,
        //    async () => expect(await this.page.locator(pageLocators.message_success).isVisible()).toBe(true)
        //);
        //expect(await this.page.locator(pageLocators.message_success).textContent()).toContain(data.name);
    }

    async getProductPrice() {
        const productPrice = await test.step(
            this.workerInfo.project.name + ": Get innertext from " + locators.productItemPriceRegular,
            async () => await this.page.innerText(locators.productItemPriceRegular)
        );
        return productPrice;
    }

}

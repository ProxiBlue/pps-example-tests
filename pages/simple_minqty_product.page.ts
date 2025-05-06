import BasePage from "@common/pages/base.page";
import type { Page, TestInfo } from "@playwright/test";
import { expect } from "@hyva/fixtures";
import * as actions from "@utils/base/web/actions";
import * as locators from "@hyva/locators/product.locator";
import * as data from "../data/minqtysimple.data.json";


//import * as data from "../data/simple_product.data.json";

export default class SimpleMinQtyProductPage extends BasePage {

    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo, data, locators); // pass the data and locators to teh base page class
    }

    async verifyPageTitle() {
        const titleText = await actions.getInnerText(
            this.page,
            this.locators.title,
            this.workerInfo
        );
        await expect(titleText).toEqual(data.name);
    }

    async verifyDomTitle() {
        await actions.verifyPageTitle(this.page, data.name, this.workerInfo);
    }

    async addToCart() {
        await actions.fill(this.page, locators.product_qty_input, '1', this.workerInfo);
        await actions.clickElement(this.page, locators.product_add_to_cart_button, this.workerInfo);
        await actions.waitForLoadState(this.page, "networkidle", this.workerInfo);
        //await actions.verifyElementIsVisible(this.page, pageLocators.message_success, this.workerInfo);
        //expect(await this.page.locator(pageLocators.message_success).textContent()).toContain(data.name);
    }

    async getProductPrice() {
        const productPrice = await actions.getInnerText(this.page, locators.productItemPriceRegular, this.workerInfo);
        return productPrice;
    }

}

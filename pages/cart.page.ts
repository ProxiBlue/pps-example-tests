import CartPage from "@hyva/pages/cart.page";
import type { Page, TestInfo } from "@playwright/test";
import { expect } from "../fixtures";
import * as actions from "@utils/base/web/actions";

export default class PPSCartPage extends CartPage {

    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo);
    }
    async checkShippingMatches(total: string, label: string) {
        await this.page.locator('#cart-totals').getByText(total).first().innerText().then((value) => {
            // mobiles (and seems safari) get the label string included, so strip it if it exists
            // i am sure there is s smarter regex way, but i am not feeling smart right now ;)
            value = value.replace(label + ': ','');
            value = value.replace(label + ':','');
            value = value.replace(label + ' ','');
            value = value.replace(label,'');
            expect(actions.parsePrice(value)).toEqual(total);
        });
    }

}

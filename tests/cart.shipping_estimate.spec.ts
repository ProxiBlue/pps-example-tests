import { test, describe } from "../fixtures";
import { expect } from "@playwright/test";
import * as shippingRateData from "../data/cart.shipping_estimate.data.json";
import * as locators from "../locators/cart.shipping_estimate.locator";
import * as productLocators from "@hyva/locators/product.locator";
import * as pageLocators from "@hyva/locators/page.locator";

describe("Cart shipping estimate with ShipperHQ", () => {

    test.setTimeout(120000)

    test.skip("Isolated shipping rate test", async (
        { page, cartPage}) => {
        await page.goto(process.env.url + shippingRateData.default.product_1);
        await page.fill(productLocators.product_qty_input, '1')
        await page.locator(productLocators.product_add_to_cart_button).click();
        expect(await page.locator(pageLocators.message_success).isVisible()).toBe(true);
        expect(await page.locator(pageLocators.message_success).textContent()).toContain('to your cart');
        await page.goto(process.env.url + shippingRateData.default.product_2);
        await page.fill(productLocators.product_qty_input, '50')
        await page.locator(productLocators.product_add_to_cart_button).click();
        await page.waitForLoadState("networkidle");
        expect(await page.locator(pageLocators.message_success).isVisible()).toBe(true);
        expect(await page.locator(pageLocators.message_success).textContent()).toContain('to your cart');
        await cartPage.navigateTo();
        expect(await page.getByText(shippingRateData.default.form_heading).isVisible()).toBe(true);
        await page.selectOption(locators.region, shippingRateData.default.region);
        await page.waitForTimeout(2000);
        await page.getByLabel('zip').clear();
        await page.waitForTimeout(2000);
        await page.getByLabel('zip').fill(shippingRateData.default.postcode)
        await page.waitForTimeout(2000);
        await page.dispatchEvent(locators.postcode, 'input');
        const response = await page.waitForResponse(response => response.url().includes('/estimate-shipping-methods'));
        expect(response.status()).toBe(200);
        const responseBody =  await response.text();
        const responseObject = JSON.parse(responseBody);
        let count = responseObject.length;
        expect(count).toBe(4);
        let shippingAmount = '';
        try {
            for (var key in responseObject) {
                switch (key) {
                    case '0':
                        expect(responseObject[key].carrier_code).toBe('shqfreeshipping');
                        expect(responseObject[key].method_code).toBe('free');
                        shippingAmount = responseObject[key].amount;
                        break;
                    case '1':
                        expect(responseObject[key].carrier_code).toBe('multicarrier');
                        expect(responseObject[key].method_code).toBe('ground-freight');
                        shippingAmount = responseObject[key].amount;
                        break;
                    case '2':
                        expect(responseObject[key].carrier_code).toBe('shqups');
                        expect(responseObject[key].method_code).toBe('2DA');
                        break;
                    case '3':
                        expect(responseObject[key].carrier_code).toBe('shqups');
                        expect(responseObject[key].method_code).toBe('1DA');
                        break;
                }
            }
        } finally {
            // now select the shipping rate
            const response = await page.waitForResponse(response => response.url().includes('/totals-information'));
            expect(response.status()).toBe(200);
            await page.locator(locators.ground_freight).check();
            await cartPage.checkShippingMatches(shippingAmount, shippingRateData.default.rate_label);
        }

    });

});

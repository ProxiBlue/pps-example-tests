import { test, describe } from "../fixtures";
import { expect } from "@playwright/test";
import * as productLocators from "@hyva/locators/product.locator";
import * as pageLocators from "@hyva/locators/page.locator";
import * as minqty from "../data/cart.minqty.data.json";

describe("Cart blocks min QTY required messages", () => {

    test.setTimeout(120000)

    test.skip("Isolated max qty in cart required", async (
        { page, cartPage, checkoutPage}) => {
        await page.goto(process.env.url + minqty.product);
        await page.fill(productLocators.product_qty_input, '1')
        await page.locator(productLocators.product_add_to_cart_button).click();
        expect(await page.locator(pageLocators.message_success).isVisible()).toBe(true);
        expect(await page.locator(pageLocators.message_success).textContent()).toContain('to your cart');
        await cartPage.navigateTo();
        expect(await page.getByText(minqty.page_heading).isVisible()).toBe(true);
        checkoutPage.navigateTo();
        checkoutPage.fillCustomerForm();
        checkoutPage.selectShippingMethod()
        checkoutPage.selectPaymentmethodByName('Check / Money order');
        checkoutPage.actionPlaceOrder();
        await checkoutPage.testSuccessPage();
    });

});

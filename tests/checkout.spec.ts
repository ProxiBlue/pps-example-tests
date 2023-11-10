import { test, describe } from "../fixtures";
import * as actions from "@utils/base/web/actions";
import * as locators from "../locators/checkout.locator";
import {expect} from "@playwright/test";

describe("Checkout", () => {

    test.beforeEach(async ({ simpleProductPage }) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
    });

    test('Can enter checkout page from cart', async ({checkoutPage, isMobile, cartPage }) => {
        await cartPage.navigateTo();
        await checkoutPage.navigateTo();
    });

    test('Can enter checkout page from side-cart', async ({checkoutPage, isMobile, cartPage }) => {
        await cartPage.navigateTo();
        await checkoutPage.navigateToBySideCart();
    });

    test('Enter new email and not get password login', async ({checkoutPage, isMobile, cartPage }) => {
        await cartPage.navigateTo();
        await checkoutPage.navigateTo();
        await checkoutPage.fillNewEmail();
    });

    test('Checkout and create an account', async ({simpleProductPage,checkoutPage, isMobile, cartPage, request }) => {
        test.setTimeout(150000);
        await cartPage.navigateTo();
        await checkoutPage.navigateTo();
        await checkoutPage.fillNewEmail();
        await checkoutPage.fillAddress();
        await checkoutPage.fillShippingMethod();
        await checkoutPage.selectPaymentMethod();
        await checkoutPage.checkResult(request);
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
        await cartPage.navigateTo();
        await checkoutPage.navigateTo();
        await checkoutPage.fillOldEmail();
    });

});

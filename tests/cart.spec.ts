import { test, describe } from "../fixtures";
import * as actions from "@utils/base/web/actions";
import * as locators from "@hyva/locators/product.locator";
import { expect } from "@playwright/test";
import * as pageLocators from "@hyva/locators/page.locator";
import * as cartLocators from "@hyva/locators/cart.locator";

describe("Cart actions with one Item in cart", () => {

    test.beforeEach(async ({simpleProductPage}) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
    });

    test("Can clear the cart", async ({cartPage}) => {
        await cartPage.navigateTo();
        await cartPage.clearCart();
        await actions.verifyElementIsVisible(cartPage.page, cartLocators.cart_empty, cartPage.workerInfo);
    });

    test("Can cancel clear the cart", async ({cartPage}) => {
        await cartPage.navigateTo();
        await cartPage.clearCartCancel();
        await actions.verifyElementDoesNotExists(cartPage.page, cartLocators.cart_empty, cartPage.workerInfo);
    });

    test("Persistent side cart works", async ({homePage, isMobile, cartPage}) => {
        await homePage.navigateTo();
        if (isMobile) {
            await actions.verifyElementIsNotVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        } else {
            await actions.verifyElementIsVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        }
        await cartPage.navigateTo();
        await actions.verifyElementIsNotVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        await cartPage.clearCart();
        await homePage.navigateTo();
        await actions.verifyElementIsNotVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
    });

});

describe("Cart actions for min qty in cart", () => {

    test.beforeEach(async ({minQtySimpleProductPage}) => {
        await minQtySimpleProductPage.navigateTo();
        await minQtySimpleProductPage.addToCart();
    });

    test("Min qty in cart works", async ({minQtySimpleProductPage, cartPage, page}) => {
        await cartPage.navigateTo();
        await page.getByText('We\'re sorry for any inconvenience but in order for us to keep our prices as low ').isVisible();
        await cartPage.changeQuantity(0, 2);
        await page.getByText('We\'re sorry for any inconvenience but in order for us to keep our prices as low ').isVisible();
    });
});

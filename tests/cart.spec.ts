import { test, describe, expect } from "../fixtures";
import * as cartLocators from "@hyva/locators/cart.locator";

describe("Cart actions with one Item in cart", () => {

    test.beforeEach(async ({simpleProductPage}) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
    });

    test("Can clear the cart", async ({cartPage}) => {
        await cartPage.navigateTo();
        await cartPage.clearCart();
        await test.step(
            cartPage.workerInfo.project.name + ": Verify element is visible " + cartLocators.cart_empty,
            async () => expect(await cartPage.page.locator(cartLocators.cart_empty).isVisible()).toBe(true)
        );
    });

    test("Can cancel clear the cart", async ({cartPage}) => {
        await cartPage.navigateTo();
        await cartPage.clearCartCancel();
        await test.step(
            cartPage.workerInfo.project.name + ": Verify element does not exist " + cartLocators.cart_empty,
            async () => await expect(cartPage.page.locator(cartLocators.cart_empty)).toHaveCount(0)
        );
    });

    test("Min Order Limit", async ({cartPage}) => {
        await cartPage.navigateTo();
    });


});

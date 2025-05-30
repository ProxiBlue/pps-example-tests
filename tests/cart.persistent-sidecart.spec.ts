import { test, describe, expect } from "../fixtures";
import * as cartLocators from "@hyva/locators/cart.locator";

describe("Persistent Side Cart", () => {

    test("Persistent side cart works", async ({homePage, isMobile, cartPage, simpleProductPage, page  }) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
        await homePage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        if (isMobile) {
            await test.step(
                homePage.workerInfo.project.name + ": Verify element is NOT visible #persistent-cart-sticky",
                async () => expect(await homePage.page.locator('#persistent-cart-sticky').isVisible()).toBe(false)
            );
        } else {
            await test.step(
                homePage.workerInfo.project.name + ": Verify element is visible #persistent-cart-sticky",
                async () => expect(await homePage.page.locator('#persistent-cart-sticky').isVisible()).toBe(true)
            );
        }
        await cartPage.page.waitForLoadState('domcontentloaded')
        await homePage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await test.step(
            homePage.workerInfo.project.name + ": Verify element is visible #persistent-cart-sticky",
            async () => expect(await homePage.page.locator('#persistent-cart-sticky').isVisible()).toBe(true)
        );
        await cartPage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await test.step(
            homePage.workerInfo.project.name + ": Verify element is NOT visible #persistent-cart-sticky",
            async () => expect(await homePage.page.locator('#persistent-cart-sticky').isVisible()).toBe(false)
        );
    });

});

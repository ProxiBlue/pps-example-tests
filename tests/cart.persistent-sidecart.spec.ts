import { test, describe } from "../fixtures";
import * as actions from "@utils/base/web/actions";
import * as cartLocators from "@hyva/locators/cart.locator";

describe("Persistent Side Cart", () => {

    test("Persistent side cart works", async ({homePage, isMobile, cartPage, simpleProductPage, page  }) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
        await homePage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(5000);
        if (isMobile) {
            await actions.verifyElementIsNotVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        } else {
            await actions.verifyElementIsVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        }
        await cartPage.page.waitForLoadState('domcontentloaded')
        await homePage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await actions.verifyElementIsVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
        await cartPage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await actions.verifyElementIsNotVisible(homePage.page, '#persistent-cart-sticky', homePage.workerInfo);
    });

});

import { test as hyvaBase } from "@hyva/fixtures";
import CommonPage from "@common/pages/common.page";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import checkoutPage from "../pages/checkout.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";

type pages = {
    commonPage: CommonPage;
    checkoutPage: checkoutPage;
    minQtySimpleProductPage: minQtySimpleProductPage;
};

const testPages = hyvaBase.extend<pages>({
    cartPage: async ({ page }, use, workerInfo) => {
        await use(new PPSCartPage(page, workerInfo));
    },
    homePage: async ({ page }, use, workerInfo) => {
        await use(new PPSHomePage(page, workerInfo));
    },
    categoryPage: async ({ page }, use, workerInfo) => {
        await use(new PPSCategoryPage(page, workerInfo));
    },
    checkoutPage: async ({ page }, use, workerInfo) => {
        // generate a set of customer data to be unique for each test
        let email = Math.random().toString().substr(2) + '@email.com';
        await use(new checkoutPage(page, workerInfo, email));
    },
    minQtySimpleProductPage: async ({ page }, use, workerInfo) => {
        await use(new minQtySimpleProductPage(page, workerInfo));
    }
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

import { test as hyvaBase } from "@hyva/fixtures";
import CommonPage from "@common/pages/common.page";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";

type pages = {
    commonPage: CommonPage;
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
    minQtySimpleProductPage: async ({ page }, use, workerInfo) => {
        await use(new minQtySimpleProductPage(page, workerInfo));
    }
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

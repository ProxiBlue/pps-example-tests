import { test as hyvaBase } from "@hyva/fixtures";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";
import checkoutPage from "@checkout/pages/checkout.page";
import AdminPage from '@admin/pages/admin.page';


type pages = {
    minQtySimpleProductPage: minQtySimpleProductPage;
    checkoutPage: checkoutPage;
    adminPage: AdminPage;
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
    },
    checkoutPage: async ({ page }, use, workerInfo) => {
        await use(new checkoutPage(page, workerInfo));
    },
    adminPage: async ({ page }, use, workerInfo) => {
        await use(new AdminPage(page, workerInfo));
    }
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

import { test as hyvaBase } from "@hyva/fixtures";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";
import checkoutPage from "@checkout/pages/checkout.page";
import AdminPage from '@admin/pages/admin.page';
import FormsPage from "../pages/forms.page";
import AdminOrdersPage from "@admin/pages/orders.page";
import PPSSearchPage from "../pages/search.page";

type pages = {
    minQtySimpleProductPage: minQtySimpleProductPage;
    checkoutPage: checkoutPage;
    adminPage: AdminPage;
    formsPage: FormsPage;
    adminOrdersPage: AdminOrdersPage;
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
    },
    formsPage: async ({ page }, use, workerInfo) => {
        await use(new FormsPage(page, workerInfo));
    },
    adminOrdersPage: async ({ page }, use, workerInfo) => {
        await use(new AdminOrdersPage(page, workerInfo));
    },
    searchPage: async ({ page }, use, workerInfo) => {
        await use(new PPSSearchPage(page, workerInfo));
    },
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

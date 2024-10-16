import { test as hyvaBase } from "@hyva/fixtures";
import CommonPage from "@common/pages/common.page";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";
import checkoutPage from "../../luma_checkout/pages/checkout.page";
import { Customer } from "@hyva/fixtures/customer";
import { CustomerData } from '@hyva/interfaces/CustomerData';

type pages = {
    commonPage: CommonPage;
    minQtySimpleProductPage: minQtySimpleProductPage;
    checkoutPage: checkoutPage;
    customerData: CustomerData;
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
    customerData: async ({ page }, use) => {
        const customer = new Customer();
        const customerData: CustomerData = customer.getCustomerData();
        await use(customerData);
    },
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

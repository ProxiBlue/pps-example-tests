import { test as hyvaBase } from "@hyva/fixtures";
import { BrowserContext, chromium, Page } from "@playwright/test";
import PPSCartPage from "../pages/cart.page";
import PPSHomePage from "../pages/home.page";
import PPSCategoryPage from "../pages/category.page";
import minQtySimpleProductPage from "../pages/simple_minqty_product.page";
import checkoutPage from "@checkout/pages/checkout.page";
import AdminPage from '@admin/pages/admin.page';
import FormsPage from "../pages/forms.page";
import AdminOrdersPage from "@admin/pages/orders.page";
import PPSSearchPage from "../pages/search.page";
import ProductShippingEstimatorPage from "../pages/product.shipping_estimator.page";
import PPSProductCustomOptionsPage from "../pages/product.custom_options.page";
import AdminProductsPage from "@admin/pages/products.page";
import AdminProductCustomOptionsPage from "@admin/pages/product.custom_options.page";

type pages = {
    minQtySimpleProductPage: minQtySimpleProductPage;
    checkoutPage: checkoutPage;
    adminPage: AdminPage;
    formsPage: FormsPage;
    adminOrdersPage: AdminOrdersPage;
    adminContext: BrowserContext;
    adminBrowserPage: Page;
    productShippingEstimatorPage: ProductShippingEstimatorPage;
    productCustomOptionsPage: PPSProductCustomOptionsPage;
    adminProductsPage: AdminProductsPage;
    adminProductCustomOptionsPage: AdminProductCustomOptionsPage;
};

const testPages = hyvaBase.extend<pages>({
    // Create a separate Chromium browser context for admin operations
    adminContext: [async ({ browser, testInfo }, use) => {
        // Launch a Chromium browser instance
        const chromiumBrowser = await chromium.launch();

        // Create a new context with the same options as the main context
        const context = await chromiumBrowser.newContext({
            ignoreHTTPSErrors: true,
            viewport: { width: 1280, height: 1400 }
        });

        await use(context);
        await context.close();
        await chromiumBrowser.close();
    }, { scope: 'test' }],

    // Create a page in the admin context
    adminBrowserPage: async ({ adminContext }: { adminContext: BrowserContext }, use) => {
        const page = await adminContext.newPage();
        await use(page);
    },

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
    adminPage: async ({ adminBrowserPage }, use, workerInfo) => {
        // Use the admin browser page for admin operations
        await use(new AdminPage(adminBrowserPage, workerInfo));
    },
    formsPage: async ({ page }, use, workerInfo) => {
        await use(new FormsPage(page, workerInfo));
    },
    adminOrdersPage: async ({ adminBrowserPage }, use, workerInfo) => {
        // Use the admin browser page for admin operations
        await use(new AdminOrdersPage(adminBrowserPage, workerInfo));
    },
    searchPage: async ({ page }, use, workerInfo) => {
        await use(new PPSSearchPage(page, workerInfo));
    },
    productShippingEstimatorPage: async ({ page }, use, workerInfo) => {
        await use(new ProductShippingEstimatorPage(page, workerInfo));
    },
    productCustomOptionsPage: async ({ page }, use, workerInfo) => {
        await use(new PPSProductCustomOptionsPage(page, workerInfo));
    },
    adminProductsPage: async ({ adminBrowserPage, adminPage }, use, workerInfo) => {
        // Common admin products page - can be used by any product-related test
        await use(new AdminProductsPage(adminBrowserPage, workerInfo, adminPage));
    },
    adminProductCustomOptionsPage: async ({ adminBrowserPage, adminProductsPage }, use, workerInfo) => {
        // Custom options page composes with common products page for navigation/search/save
        await use(new AdminProductCustomOptionsPage(adminBrowserPage, workerInfo, adminProductsPage));
    },
});

export const test = testPages;
export const expect = testPages.expect;
export const describe = testPages.describe;

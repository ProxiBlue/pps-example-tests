import {test, describe, expect} from "@hyva/fixtures";
import { loadLocators } from "@utils/functions/file";

// Load the locators dynamically based on the APP_NAME environment variable
const pageLocators = loadLocators('locators/page.locator', 'hyva');
const productLocators = loadLocators('locators/product.locator', 'hyva');
const locators = loadLocators('locators/customer.locator', 'hyva');
const cartLocators = loadLocators('locators/cart.locator', 'hyva');

describe("Configurable products test suite", () => {
    test.beforeEach(async ({configurableProductPage}, testInfo) => {
        await configurableProductPage.navigateTo();
    });

    test("Can increment the product quantity on the pdp", async ({configurableProductPage}, testInfo) => {
        await configurableProductPage.page.locator(productLocators.product_qty_input_selector).press('ArrowUp');
        await configurableProductPage.page.waitForLoadState('domcontentloaded');
        const qtyValue = await configurableProductPage.page.locator(productLocators.product_qty_input_selector).inputValue();
        expect(qtyValue).toBe('2');

        await configurableProductPage.selectProductAttributes();
        // Add the item to the cart
        await configurableProductPage.addToCart('2');

        // Navigate to the cart page
        await configurableProductPage.page.goto(process.env.url + '/checkout/cart');
        await configurableProductPage.page.waitForLoadState('domcontentloaded');

        // Verify the cart quantity is also 2
        const cartItemRow = 0; // First item in the cart
        const cartQtyInput = cartLocators.cart_table + '>>' + cartLocators.cart_table_body + ">>nth=" + cartItemRow + '>>' + cartLocators.cart_row_item_info + '>>' + cartLocators.cart_row_qty_input;
        const cartQtyValue = await configurableProductPage.page.locator(cartQtyInput).inputValue();
        expect(cartQtyValue).toBe('2');

    });

    test("Can add configurable product to cart and verify options in cart", async ({configurableProductPage}, testInfo) => {
        // Select random options for the configurable product and add to cart
        await configurableProductPage.selectProductAttributes();

        await configurableProductPage.addToCart('1');

        // Verify the selected options appear in the cart
        await configurableProductPage.verifyOptionsInCart();
    });

    test("Can't add a product to a wishlist when the user in not logged in", async ({configurableProductPage}, testInfo) => {
        await configurableProductPage.selectProductAttributes();
        await configurableProductPage.addToWishlistNotLoggedIn();
    });

    test("Can add a product to a wishlist when the user is logged in", async ({
                                                                                  configurableProductPage,
                                                                                  customerPage,
                                                                                  customerData,
                                                                                  page
                                                                              }, testInfo) => {
        // First login the user
        await customerPage.navigateTo();
        await customerPage.page.waitForLoadState('domcontentloaded');
        await expect(page.getByRole('link', {name: locators.create_button})).toBeVisible();
        await customerPage.page.getByRole('link', {name: locators.create_button}).click();
        await customerPage.fillCreateForm(customerData);
        await customerPage.page.waitForLoadState('domcontentloaded');
        await customerPage.page.getByRole('button', {name: locators.create_button}).click();
        await customerPage.page.waitForLoadState('domcontentloaded');
        await customerPage.page.waitForSelector(pageLocators.message_success);

        // Navigate back to the configurable product page
        await configurableProductPage.navigateTo();

        // Select product attributes
        await configurableProductPage.selectProductAttributes();
        await configurableProductPage.page.waitForLoadState('domcontentloaded');
        await configurableProductPage.addToWishlistLoggedIn();
    });

});

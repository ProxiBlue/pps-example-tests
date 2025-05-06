import { test, describe, expect } from "../fixtures";
import * as locators from "@admin/locators/admin.locator";

describe("Admin Tests - Order Email Edits", () => {

    test.setTimeout(90000);

    test('it can edit guest order email', async (
        { adminPage, checkoutPage, simpleProductPage, customerData, page, browserName }) => {
        if (browserName !== 'webkit') {
            await simpleProductPage.navigateTo();
            await simpleProductPage.addToCart();
            await checkoutPage.navigateTo();
            await checkoutPage.fillCustomerForm(customerData)
            await checkoutPage.selectShippingMethod();
            await checkoutPage.selectPaymentmethodByName('Check / Money order');
            await checkoutPage.actionPlaceOrder();
            await checkoutPage.page.getByRole('img', { name: 'Loading...' }).first().waitFor({ state: 'hidden' });
            const orderId = await checkoutPage.testSuccessPage();
            await adminPage.navigateTo();
            await adminPage.login();
            await adminPage.navigateToOrdersPage();
            await page.locator(locators.admin_grid_search).first().fill(orderId);
            await page.locator(locators.admin_grid_search_submit).first().click()
            await page.waitForLoadState("networkidle");
            await page.waitForLoadState("domcontentloaded");
            await page.locator('.data-grid .data-row:nth-child(1) .action-menu-item').click();
            await page.locator('#mpEditOrderEmailPopup').waitFor({state: 'visible'});
            await page.click('#mpEditOrderEmailPopup');
            await page.locator('.wrapper > .admin__control-text').waitFor({state: 'visible'});
            await page.locator('.wrapper > .admin__control-text').fill('new@example.com');
            await page.locator('.action > span').click();
            await page.locator('.msg').waitFor({state: 'visible'});
            await expect(page.locator('.msg')).toContainText('Email address successfully changed');
            await page.locator('.modal-popup .action-close').last().click({force: true});
            await page.locator('.admin__table-secondary > tbody > :nth-child(2) > td > a').waitFor({state: 'visible'});
            await expect(page.locator('.admin__table-secondary > tbody > :nth-child(2) > td > a')).toHaveText('new@example.com');
        }
    });

});

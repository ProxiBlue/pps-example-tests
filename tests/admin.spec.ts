import { test, describe, expect } from "../fixtures";
import * as locators from "@admin/locators/admin.locator";
import * as customerForm from "@checkout/locators/customer_form.locator";

describe("Admin Tests - Order Email Edits", () => {

    test.setTimeout(90000);

    test('it can edit guest order email', async (
        { adminPage, checkoutPage, simpleProductPage, customerData, browserName, adminOrdersPage }) => {
        if (browserName === 'chromium') {
            await simpleProductPage.navigateTo();
            await simpleProductPage.addToCart();
            await checkoutPage.navigateTo();
            await checkoutPage.page.fill(customerForm.email, customerData.email);
            await checkoutPage.page.waitForLoadState("domcontentloaded");
            await checkoutPage.fillCustomerForm(customerData)
            await checkoutPage.selectShippingMethod();
            await checkoutPage.selectPaymentmethodByName('Check / Money order');
            await checkoutPage.actionPlaceOrder();
            await checkoutPage.page.getByRole('img', { name: 'Loading...' }).first().waitFor({ state: 'hidden' });
            const orderId = await checkoutPage.testSuccessPage();
            await adminPage.navigateTo();
            await adminPage.login();
            await adminOrdersPage.navigateTo();
            await adminOrdersPage.checkIfOrderExistsByIncrementId(orderId);
            await adminPage.page.locator(locators.admin_grid_search).first().fill(orderId);
            await adminPage.page.locator(locators.admin_grid_search_submit).first().click()
            await adminPage.page.waitForLoadState("networkidle");
            await adminPage.page.waitForLoadState("domcontentloaded");
            await adminPage.page.locator('.data-grid .data-row:nth-child(1) .action-menu-item').click();
            await adminPage.page.locator('#mpEditOrderEmailPopup').waitFor({state: 'visible'});
            await adminPage.page.click('#mpEditOrderEmailPopup');
            await adminPage.page.locator('.wrapper > .admin__control-text').waitFor({state: 'visible'});
            await adminPage.page.locator('.wrapper > .admin__control-text').fill('new@example.com');
            await adminPage.page.locator('.action > span').click();
            await adminPage.page.locator('.msg').waitFor({state: 'visible'});
            await expect(adminPage.page.locator('.msg')).toContainText('Email address successfully changed');
            await adminPage.page.locator('.modal-popup .action-close').last().click({force: true});
            await adminPage.page.locator('.admin__table-secondary > tbody > :nth-child(2) > td > a').waitFor({state: 'visible'});
            await expect(adminPage.page.locator('.admin__table-secondary > tbody > :nth-child(2) > td > a')).toHaveText('new@example.com');
        }
    });

});

describe("Improved Forms Tests", () => {
    // Combined test for footer form submission and verification in admin
    test('Can fill in footer form and verify in admin', async ({ formsPage, adminPage, browserName }) => {
        // Generate a unique ID for this test
        const uniqueId = Date.now().toString();

        // Step 1: Fill and submit the footer form (runs on all browsers)
        await formsPage.navigateToHomepage();
        await formsPage.page.fill(formsPage.locators.footerEmailField, uniqueId + '@example.com');
        await formsPage.page.fill(formsPage.locators.footerCommentField, 'Automated test comment - ' + uniqueId);
        await formsPage.page.click(formsPage.locators.footerSubmitButton);

        // Verify success message
        await formsPage.page.waitForSelector(formsPage.locators.successMessage);
        const messageText = await formsPage.page.locator(formsPage.locators.successMessage).textContent();
        test.expect(messageText).toContain(formsPage.pageData.default.footerSuccessMessage || "Thanks for the feedback");

        // Step 2: Verify the submission in admin (only on Chromium browser)
        if (browserName === 'chromium') {
            await adminPage.navigateTo();
            await adminPage.login();

            // Navigate to form submissions
            await adminPage.page.click(formsPage.locators.marketingMenu);
            await adminPage.page.waitForTimeout(1000); // Wait for menu to expand
            await adminPage.page.click(formsPage.locators.formSubmissionsLink);
            await adminPage.page.waitForTimeout(1000); // Wait for page to load

            // Search for the unique ID in the admin grid
            await adminPage.page.fill(adminPage.locators.admin_grid_search, uniqueId);
            await adminPage.page.click(adminPage.locators.admin_grid_search_submit);
            await adminPage.page.waitForTimeout(2000); // Wait for search results

            // Verify the form submission details
            const emailText = await adminPage.page.locator(formsPage.locators.formDataGridEmail).textContent();
            test.expect(emailText).toContain(uniqueId);

            const commentText = await adminPage.page.locator(formsPage.locators.formDataGridComment).textContent();
            test.expect(commentText).toContain(uniqueId);

            const formTypeText = await adminPage.page.locator(formsPage.locators.formDataGridFormType).textContent();
            test.expect(formTypeText).toContain('footer');
        }
    });

    // Combined test for contact form submission and verification in admin
    test('Can fill in contact form and verify in admin', async ({ formsPage, adminPage, browserName }) => {
        // Generate a unique ID for this test
        const uniqueId = Date.now().toString();

        // Step 1: Fill and submit the contact form (runs on all browsers)
        await formsPage.navigateToContactPage();
        await formsPage.page.fill(formsPage.locators.contactNameField, uniqueId);
        await formsPage.page.fill(formsPage.locators.contactTelephoneField, uniqueId);
        await formsPage.page.fill(formsPage.locators.contactEmailField, uniqueId + '@example.com');
        await formsPage.page.fill(formsPage.locators.contactCommentField, uniqueId);
        await formsPage.page.click(formsPage.locators.contactSubmitButton);

        // Verify success message
        await formsPage.page.waitForSelector(formsPage.locators.successMessage);
        const messageText = await formsPage.page.locator(formsPage.locators.successMessage).textContent();
        test.expect(messageText).toContain(formsPage.pageData.default.contactSuccessMessage || "Thanks for contacting us");

        // Step 2: Verify the submission in admin (only on Chromium browser)
        if (browserName === 'chromium') {
            await adminPage.navigateTo();
            await adminPage.login();

            // Navigate to form submissions
            await adminPage.page.click(formsPage.locators.marketingMenu);
            await adminPage.page.waitForTimeout(1000); // Wait for menu to expand
            await adminPage.page.click(formsPage.locators.formSubmissionsLink);
            await adminPage.page.waitForTimeout(1000); // Wait for page to load

            // Search for the unique ID in the admin grid
            await adminPage.page.fill(adminPage.locators.admin_grid_search, uniqueId);
            await adminPage.page.click(adminPage.locators.admin_grid_search_submit);
            await adminPage.page.waitForTimeout(2000); // Wait for search results

            // Verify the form submission details
            const nameText = await adminPage.page.locator(formsPage.locators.formDataGridName).textContent();
            test.expect(nameText).toContain(uniqueId);

            const telephoneText = await adminPage.page.locator(formsPage.locators.formDataGridTelephone).textContent();
            test.expect(telephoneText).toContain(uniqueId);

            const emailText = await adminPage.page.locator(formsPage.locators.formDataGridEmail).textContent();
            test.expect(emailText).toContain(uniqueId);

            const commentText = await adminPage.page.locator(formsPage.locators.formDataGridComment).textContent();
            test.expect(commentText).toContain(uniqueId);

            const formTypeText = await adminPage.page.locator(formsPage.locators.formDataGridFormType).textContent();
            test.expect(formTypeText).toContain('contact');
        }
    });

    // Combined test for contractor quote form submission and verification in admin
    test('Can fill in contractor quote form and verify in admin', async ({ formsPage, adminPage, browserName }) => {
        // Generate a unique ID for this test
        const uniqueId = Date.now().toString();

        // Step 1: Fill and submit the contractor quote form (runs on all browsers)
        await formsPage.navigateToContractorQuotePage();
        await formsPage.page.fill(formsPage.locators.contractorNameField, uniqueId);
        await formsPage.page.fill(formsPage.locators.contractorEmailField, uniqueId + '@example.com');
        await formsPage.page.fill(formsPage.locators.contractorTelephoneField, uniqueId);
        await formsPage.page.fill(formsPage.locators.contractorCompanyField, uniqueId + 'company');
        await formsPage.page.fill(formsPage.locators.contractorAddressLine1Field, uniqueId + 'address_line_1');
        await formsPage.page.fill(formsPage.locators.contractorCityField, uniqueId + 'city');
        await formsPage.page.fill(formsPage.locators.contractorZipField, uniqueId + 'zip');
        await formsPage.page.fill(formsPage.locators.contractorStateField, uniqueId + 'state');
        await formsPage.page.fill(formsPage.locators.contractorJobNameField, uniqueId + 'job_name');
        await formsPage.page.fill(formsPage.locators.contractorJobAddressLine1Field, uniqueId + 'job_address_line_1');
        await formsPage.page.fill(formsPage.locators.contractorJobCityField, uniqueId + 'job_city');
        await formsPage.page.fill(formsPage.locators.contractorJobZipField, uniqueId + 'job_zip');
        await formsPage.page.fill(formsPage.locators.contractorJobStateField, uniqueId + 'job_state');
        await formsPage.page.fill(formsPage.locators.contractorCommentField, uniqueId + 'job_comment');
        await formsPage.page.click(formsPage.locators.contractorSubmitButton);

        // Verify success message
        await formsPage.page.waitForSelector(formsPage.locators.successMessage);
        const messageText = await formsPage.page.locator(formsPage.locators.successMessage).textContent();
        test.expect(messageText).toContain(formsPage.pageData.default.contractorQuoteSuccessMessage || "Your submission has been received");

        // Step 2: Verify the submission in admin (only on Chromium browser)
        if (browserName === 'chromium') {
            await adminPage.navigateTo();
            await adminPage.login();

            // Navigate to form submissions
            await adminPage.page.click(formsPage.locators.marketingMenu);
            await adminPage.page.waitForTimeout(1000); // Wait for menu to expand
            await adminPage.page.click(formsPage.locators.formSubmissionsLink);
            await adminPage.page.waitForTimeout(1000); // Wait for page to load

            // Search for the unique ID in the admin grid
            await adminPage.page.fill(adminPage.locators.admin_grid_search, uniqueId);
            await adminPage.page.click(adminPage.locators.admin_grid_search_submit);
            await adminPage.page.waitForTimeout(2000); // Wait for search results

            // Verify the form submission details
            const nameText = await adminPage.page.locator(formsPage.locators.formDataGridName).textContent();
            test.expect(nameText).toContain(uniqueId);

            const telephoneText = await adminPage.page.locator(formsPage.locators.formDataGridTelephone).textContent();
            test.expect(telephoneText).toContain(uniqueId);

            const emailText = await adminPage.page.locator(formsPage.locators.formDataGridEmail).textContent();
            test.expect(emailText).toContain(uniqueId);

            const commentText = await adminPage.page.locator(formsPage.locators.formDataGridComment).textContent();
            test.expect(commentText).toContain(uniqueId);

            const formTypeText = await adminPage.page.locator(formsPage.locators.formDataGridFormType).textContent();
            test.expect(formTypeText).toContain('contractor-quote');
        }
    });
});

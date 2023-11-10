import basePage from "@hyva/pages/base.page";
import type {Page, TestInfo} from "@playwright/test";
import {expect, test} from "../fixtures";
import * as locators from "../locators/checkout.locator";
import * as data from "../data/checkout.data.json";
import { mailhog } from '@utils/mail/mailhog';
import { customers } from '@utils/api/customers';

export default class checkoutPage extends basePage {
    constructor(public page: Page, public workerInfo: TestInfo, public email: string) {
        super(page, workerInfo, data, locators);
    }

    async navigateTo() {
        await this.page.getByRole('link', {name: 'Proceed to Checkout'}).click();
        await test.step(
            this.workerInfo.project.name +
            ": verify Page Title " +
            this.data.header_title,
            async () => this.verifyPageTitle()
        );
    }

    async navigateToBySideCart() {
        await this.page.locator(this.locators.cart_menu_icon).click();
        await this.page.getByRole('link', {name: 'Checkout', exact: true}).click();
        await test.step(
            this.workerInfo.project.name +
            ": verify Page Title " +
            this.data.header_title,
            async () => this.verifyPageTitle()
        );
    }

    async fillNewEmail() {
        await this.page.waitForLoadState("networkidle");
        await this.page.getByRole('textbox', {name: this.locators.email}).fill(this.email)
        await this.page.getByLabel(this.locators.firstname).focus();
        const response = await this.page.waitForResponse(response => response.url().includes('/rest/default/V1/customers/isEmailAvailable'));
        await expect(response.status()).toBe(200);
        await expect(this.page.getByRole('textbox', {name: this.locators.password})).not.toBeVisible();
        await expect(this.page.getByText('Create an account and make your next checkout easy. (You will be emailed your lo')).toBeVisible();
    }

    async fillOldEmail() {
        await this.page.waitForLoadState("networkidle");
        await this.page.getByRole('textbox', {name: this.locators.email}).fill(this.email);
        await this.page.getByLabel(this.locators.firstname).focus();
        const response = await this.page.waitForResponse(response => response.url().includes('/rest/default/V1/customers/isEmailAvailable'));
        await expect(response.status()).toBe(200);
        let responseText = await response.text();
        expect(responseText).toBe('false');
    }

    async fillAddress() {
        await this.page.waitForLoadState("networkidle");
        await this.page.getByLabel(this.locators.firstname).fill(this.data.firstname);
        await this.page.getByLabel(this.locators.lastname).fill(this.data.lastname);
        await this.page.getByLabel(this.locators.street_address).fill(this.data.street_address);
        await this.page.getByLabel(this.locators.city).fill(this.data.city);
        await this.page.locator(this.locators.state).selectOption(this.data.state);
        await this.page.getByLabel(this.locators.postcode).fill(this.data.postcode);
        await this.page.getByLabel(this.locators.telephone).fill(this.data.phone);
        await this.page.getByLabel(this.locators.telephone).blur();
        await this.page.waitForLoadState("networkidle");
        await this.page.reload();
    }

    async fillShippingMethod() {
        await this.page.waitForLoadState("networkidle");
        this.page.getByRole('button', {name: 'Next'}).click();
        await this.page.waitForLoadState("networkidle");
    }

    async selectPaymentMethod() {
        await this.page.waitForLoadState("networkidle");
        await this.page.getByRole('img', { name: 'Loading...' }).waitFor({state: 'hidden'});
        await this.page.locator('.payment-group').waitFor({state: 'visible'});
        this.page.getByLabel('Check / Money order').click();
        this.page.getByRole('button', {name: 'Place Order'}).click();
    }

    async checkResult(request : object) {
        await this.page.waitForURL('**/checkout/onepage/success/**');
        await expect(this.page.getByText(this.data.success_message)).toBeVisible();
        const mailhogObject = new mailhog(request);
        await mailhogObject.getEmailByToAndSubject(this.email, this.data.order_email_subject).then((emailCount) => {
            expect(emailCount).toBe(1);
        });
        await mailhogObject.getEmailByToAndSubject(this.email, this.data.email_welcome).then((emailCount) => {
            expect(emailCount).toBe(1);
        });
        const apiObject = new customers(request);
        await apiObject.checkEmailCanRegister(this.email).then((response) => {
            expect(response).toBe(false);
        });
    }



}

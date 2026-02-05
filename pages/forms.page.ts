import BasePage from "@common/pages/base.page";
import { Page, TestInfo, expect, test } from "@playwright/test";
import { loadJsonData, loadLocators } from "@utils/functions/file";

// Define the interface for the forms data structure
interface FormsData {
  default: {
    homePageUrl?: string;
    contactPageUrl?: string;
    contractorQuotePageUrl?: string;
    footerSuccessMessage: string;
    contactSuccessMessage: string;
    contractorQuoteSuccessMessage: string;
    url?: string;
    header_title?: string;
    page_title_text?: string;
  }
}

// Default forms data structure
const defaultData: FormsData = {
  default: {
    footerSuccessMessage: "",
    contactSuccessMessage: "",
    contractorQuoteSuccessMessage: ""
  }
};

// Load the forms data using the utility function
const data = loadJsonData<FormsData>('forms.data.json', 'pps', defaultData);

// Load the locators dynamically based on the APP_NAME environment variable
const locators = loadLocators('locators/forms.locator', 'pps');
const adminLocators = loadLocators('locators/admin.locator', 'admin');

export default class FormsPage extends BasePage<FormsData> {
    constructor(public page: Page, public workerInfo: TestInfo) {
        super(page, workerInfo, data, locators);
    }

    // Store the unique ID for verification between tests
    private static uniqueId: string;

    // Method to set the unique ID
    setUniqueId(id: string) {
        FormsPage.uniqueId = id;
    }

    // Method to get the unique ID
    getUniqueId(): string {
        if (!FormsPage.uniqueId) {
            throw new Error('uniqueId is not set. Make sure the form submission test has run before the admin verification test.');
        }
        return FormsPage.uniqueId;
    }

    // Navigate to homepage
    async navigateToHomepage() {
        await test.step(
            this.workerInfo.project.name + ": Go to " + (process.env.url || ''),
            async () => await this.page.goto(process.env.url || '')
        );
    }

    // Navigate to contact page
    async navigateToContactPage() {
        await test.step(
            this.workerInfo.project.name + ": Go to " + (process.env.url + 'contact/index/'),
            async () => await this.page.goto(process.env.url + 'contact/index/')
        );
    }

    // Navigate to contractor quote form
    async navigateToContractorQuotePage() {
        await test.step(
            this.workerInfo.project.name + ": Go to " + (process.env.url + 'contact?form=contractor-quote'),
            async () => await this.page.goto(process.env.url + 'contact?form=contractor-quote')
        );
    }

    // Fill and submit footer form
    async fillAndSubmitFooterForm() {
        const uniqueId = Date.now().toString();
        this.setUniqueId(uniqueId);

        await this.page.fill(locators.footerEmailField, uniqueId + '@example.com');
        await this.page.fill(locators.footerCommentField, 'Automated test comment - ' + uniqueId);
        await this.page.click(locators.footerSubmitButton);

        await this.page.waitForSelector(locators.successMessage);
        const messageText = await this.page.locator(locators.successMessage).textContent();

        if (!data.default.footerSuccessMessage) {
            // Use a fallback message if the expected one is undefined
            expect(messageText).toContain("Thanks for the feedback");
        } else {
            expect(messageText).toContain(data.default.footerSuccessMessage);
        }

        return uniqueId;
    }

    // Verify footer form submission in admin
    async verifyFooterFormInAdmin() {
        const uniqueId = this.getUniqueId();
        await this.page.waitForSelector(locators.formDataGrid);

        const emailText = await this.page.locator(locators.formDataGridEmail).textContent();
        expect(emailText).toContain(uniqueId);

        const commentText = await this.page.locator(locators.formDataGridComment).textContent();
        expect(commentText).toContain(uniqueId);

        const formTypeText = await this.page.locator(locators.formDataGridFormType).textContent();
        expect(formTypeText).toContain('footer');
    }


    // Fill and submit contact form
    async fillAndSubmitContactForm() {
        const uniqueId = Date.now().toString();
        this.setUniqueId(uniqueId);

        await this.page.fill(locators.contactNameField, uniqueId);
        await this.page.fill(locators.contactTelephoneField, uniqueId);
        await this.page.fill(locators.contactEmailField, uniqueId + '@example.com');
        await this.page.fill(locators.contactCommentField, uniqueId);
        await this.page.click(locators.contactSubmitButton);

        await this.page.waitForSelector(locators.successMessage);
        const messageText = await this.page.locator(locators.successMessage).textContent();

        if (!data.default.contactSuccessMessage) {
            // Use a fallback message if the expected one is undefined
            expect(messageText).toContain("Thanks for contacting us");
        } else {
            expect(messageText).toContain(data.default.contactSuccessMessage);
        }

        return uniqueId;
    }

    // Verify contact form submission in admin
    async verifyContactFormInAdmin() {
        const uniqueId = this.getUniqueId();

        await this.page.waitForSelector(locators.formDataGrid);

        const nameText = await this.page.locator(locators.formDataGridName).textContent();
        expect(nameText).toContain(uniqueId);

        const telephoneText = await this.page.locator(locators.formDataGridTelephone).textContent();
        expect(telephoneText).toContain(uniqueId);

        const emailText = await this.page.locator(locators.formDataGridEmail).textContent();
        expect(emailText).toContain(uniqueId);

        const commentText = await this.page.locator(locators.formDataGridComment).textContent();
        expect(commentText).toContain(uniqueId);

        const formTypeText = await this.page.locator(locators.formDataGridFormType).textContent();
        expect(formTypeText).toContain('contact');
    }


    // Fill and submit contractor quote form
    async fillAndSubmitContractorQuoteForm() {
        const uniqueId = Date.now().toString();
        this.setUniqueId(uniqueId);

        await this.page.fill(locators.contractorNameField, uniqueId);
        await this.page.fill(locators.contractorEmailField, uniqueId + '@example.com');
        await this.page.fill(locators.contractorTelephoneField, uniqueId);
        await this.page.fill(locators.contractorCompanyField, uniqueId + 'company');
        await this.page.fill(locators.contractorAddressLine1Field, uniqueId + 'address_line_1');
        await this.page.fill(locators.contractorCityField, uniqueId + 'city');
        await this.page.fill(locators.contractorZipField, uniqueId + 'zip');
        await this.page.fill(locators.contractorStateField, uniqueId + 'state');
        await this.page.fill(locators.contractorJobNameField, uniqueId + 'job_name');
        await this.page.fill(locators.contractorJobAddressLine1Field, uniqueId + 'job_address_line_1');
        await this.page.fill(locators.contractorJobCityField, uniqueId + 'job_city');
        await this.page.fill(locators.contractorJobZipField, uniqueId + 'job_zip');
        await this.page.fill(locators.contractorJobStateField, uniqueId + 'job_state');
        await this.page.fill(locators.contractorCommentField, uniqueId + 'job_comment');
        await this.page.click(locators.contractorSubmitButton);

        await this.page.waitForSelector(locators.successMessage);
        const messageText = await this.page.locator(locators.successMessage).textContent();

        if (!data.default.contractorQuoteSuccessMessage) {
            // Use a fallback message if the expected one is undefined
            expect(messageText).toContain("Your submission has been received");
        } else {
            expect(messageText).toContain(data.default.contractorQuoteSuccessMessage);
        }

        return uniqueId;
    }

    // Verify contractor quote form submission in admin
    async verifyContractorQuoteFormInAdmin() {
        const uniqueId = this.getUniqueId();

        await this.page.waitForSelector(locators.formDataGrid);

        const nameText = await this.page.locator(locators.formDataGridName).textContent();
        expect(nameText).toContain(uniqueId);

        const telephoneText = await this.page.locator(locators.formDataGridTelephone).textContent();
        expect(telephoneText).toContain(uniqueId);

        const emailText = await this.page.locator(locators.formDataGridEmail).textContent();
        expect(emailText).toContain(uniqueId);

        const commentText = await this.page.locator(locators.formDataGridComment).textContent();
        expect(commentText).toContain(uniqueId);

        const formTypeText = await this.page.locator(locators.formDataGridFormType).textContent();
        expect(formTypeText).toContain('contractor-quote');
    }

    // Navigate to admin form collection
    async navigateToAdminFormCollection() {
        await this.page.click(locators.marketingMenu);
        await this.page.waitForTimeout(1000); // Wait for menu to expand
        await this.page.click(locators.formSubmissionsLink);
        await this.page.waitForTimeout(1000); // Wait for page to load
    }

}

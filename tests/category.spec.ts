import { test, describe } from "../fixtures";

describe("Category Product List actions", () => {

    test.beforeEach(async ({ categoryPage }) => {
        await categoryPage.navigateTo();
    });

    test("PPS Filters", async ({ categoryPage, isMobile }, testInfo) => {
        test.setTimeout(150000);
        await categoryPage.checkPPSFilter(isMobile);
    });


});

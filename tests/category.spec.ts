import { test, describe } from "../fixtures";

describe("Category test suite", () => {

    test.beforeEach(async ({ categoryPage }) => {
        await categoryPage.navigateTo();
    });

    test("PPS Filters", async ({ categoryPage, isMobile }, testInfo) => {
        test.setTimeout(150000);
        //@ts.ignore
        //await categoryPage.checkPPSFilter(isMobile);
    });


});

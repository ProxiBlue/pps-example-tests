import { test, describe } from "../fixtures";
import * as actions from "@utils/base/web/actions";
import * as locators from "@hyva/locators/home.locator";
import {expect} from "@playwright/test";

describe("Category Product List actions", () => {

    test.beforeEach(async ({ categoryPage }) => {
        await categoryPage.navigateTo();
    });

    test("PPS Filters", async ({ categoryPage, isMobile }, testInfo) => {
        test.setTimeout(150000);
        await categoryPage.checkPPSFilter(isMobile);
    });


});

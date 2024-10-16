import { test, describe } from "../fixtures";

describe("Home", () => {

    test('it can perform search from homepage', async ({homePage, isMobile }) => {
        await homePage.navigateTo();
        await homePage.canSearchFromHomepage(isMobile);
    });
});

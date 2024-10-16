import { test, describe } from "../fixtures";

describe("Home", () => {

    test('Can perform search from homepage', async ({homePage, isMobile }) => {
        await homePage.navigateTo();
        await homePage.canSearchFromHomepage(isMobile);
    });
});

import {describe, test} from "../fixtures";

describe("Search Functionality", () => {

    test.beforeEach(async ({ searchPage }, testInfo) => {
        await searchPage.navigateTo();
    });

    test("it can search for a single product", async ({ searchPage, isMobile }, testInfo) => {
        //@ts-ignore
        await searchPage.searchForSingleProduct(isMobile);
    });

    test("search suggestions work", async ({ searchPage, isMobile }, testInfo) => {
        //@ts-ignore
        await searchPage.checkSearchSuggestions(isMobile);
    });

    test("search suggestions add to cart work", async ({ searchPage, isMobile }, testInfo) => {
        //@ts-ignore
        await searchPage.checkSearchSuggestionsAddToCart(isMobile);
    });



});

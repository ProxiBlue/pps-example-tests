/**
 * Theme locators for visual regression testing
 * Used for header/navigation responsive layout tests
 */

// Header elements
export const header = "nav#header";
export const headerContainer = "#header-container";
export const headerInner = "nav#header > div:first-child";

// Mobile menu (hamburger)
export const mobileMenuButton = "button[aria-label='Open menu'], nav[aria-label='Site navigation'] button";
export const mobileMenuContainer = "nav[aria-label='Site navigation']";

// Logo
export const logo = "a[aria-label='store logo'], a.logo";

// Search
export const searchButton = "button[aria-label='Search']";
export const mobileSearchContent = "#mobile-search-content";

// Icons row (search, account, cart)
export const headerIcons = "nav#header .flex.items-center.order-3";

// Desktop navigation
export const desktopNav = "nav#header .bg-secondary";

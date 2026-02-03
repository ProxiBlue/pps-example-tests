import { test, expect } from "../fixtures";

test.describe('Cart Table Structure Validation', () => {
    test.beforeEach(async ({simpleProductPage, cartPage}) => {
        await simpleProductPage.navigateTo();
        await simpleProductPage.addToCart();
        await cartPage.navigateTo();
    });

  test('should display cart with table structure and column headers', async ({ page }) => {
    // Check if the cart table exists
    const cartTable = page.locator('table#shopping-cart-table');
    await expect(cartTable).toBeVisible();

    // Check for table header
    const thead = cartTable.locator('thead');
    await expect(thead).toBeVisible();

    // Check for column headers
    const headers = thead.locator('th');
    await expect(headers).toHaveCount(5); // Item, Price, Qty, Subtotal, Actions

    // Verify header text content
    await expect(headers.nth(0)).toContainText('Item');
    await expect(headers.nth(1)).toContainText('Price');
    await expect(headers.nth(2)).toContainText('Qty');
    await expect(headers.nth(3)).toContainText('Subtotal');
    await expect(headers.nth(4)).toContainText('Actions');
  });

  test('should render cart items as table rows with proper columns', async ({ page }) => {
    const cartTable = page.locator('table#shopping-cart-table');
    const tbody = cartTable.locator('tbody.cart.item');

    // Check if tbody exists
    await expect(tbody).toBeVisible();

    // Check if there are cart item rows
    const itemRows = tbody.locator('tr.item-info');
    const itemCount = await itemRows.count();

    if (itemCount > 0) {
      // Check first item has correct number of columns
      const firstRow = itemRows.first();
      const cells = firstRow.locator('td');
      await expect(cells).toHaveCount(5); // Item, Price, Qty, Subtotal, Actions

      // Verify each column has expected content
      await expect(cells.nth(0)).toHaveClass(/col item/);
      await expect(cells.nth(1)).toHaveClass(/col price/);
      await expect(cells.nth(2)).toHaveClass(/col qty/);
      await expect(cells.nth(3)).toHaveClass(/col subtotal/);
      await expect(cells.nth(4)).toHaveClass(/col actions/);

      // Verify Item column contains product details
      const itemCell = cells.nth(0);
      await expect(itemCell.locator('.product-item-photo')).toBeVisible();
      await expect(itemCell.locator('.product-item-name')).toBeVisible();

      // Verify Qty column contains input field
      const qtyCell = cells.nth(2);
      await expect(qtyCell.locator('input[data-role="cart-item-qty"]')).toBeVisible();

      // Verify Actions column contains action buttons
      const actionsCell = cells.nth(4);
      await expect(actionsCell.locator('.item-actions')).toBeVisible();
    }
  });
});

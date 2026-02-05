// PPS uses a table-based cart layout (table/tbody/tr/td) instead of
// Hyvä's default list-based layout (ul/li/article).
// Only locators that differ from the base Hyvä cart.locator.ts are overridden here.

// The PPS form.phtml has a duplicate id="shopping-cart-table" on both
// the fieldset and inner table. Use element type to disambiguate.
export const cart_table = 'table#shopping-cart-table';
export const cart_table_head = 'table#shopping-cart-table thead';

// In Hyvä base: 'li' (one per item). In PPS: tbody contains tr.item-info rows.
// Using 'tbody' here means nth=0 selects the single tbody, then
// cart_row_item_info ('tr.item-info') selects the item rows within it.
export const cart_table_body = 'tbody';

// In Hyvä base: 'article' (single wrapper inside each li).
// In PPS: each item is a tr.item-info containing td columns.
export const cart_row_item = 'tr.item-info';
export const cart_row_item_info = 'tr.item-info';

// In Hyvä base: '.price' (generic, inside article). PPS splits price
// into separate td columns, so we scope to the specific column.
export const cart_row_item_price = '.col.price .price';

// In Hyvä base: '.font-medium .price' (subtotal wrapped in .font-medium span).
// PPS renders subtotal directly in td.col.subtotal without the wrapper.
export const cart_row_subtotal = '.col.subtotal .price';

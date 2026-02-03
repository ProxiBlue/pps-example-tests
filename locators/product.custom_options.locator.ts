// Frontend Product Custom Options with Qty Limit Locators
// For testing custom options visibility based on quantity

// Product Page Elements
export const product_name = 'h1.page-title';
export const product_sku = '.product-info-sku .value';
export const product_qty_input = 'input[name="qty"]';
export const add_to_cart_button = '#product-addtocart-button';

// Custom Options Section
export const custom_options_heading = 'h2:has-text("Customizable Options")';
export const custom_options_container = 'div[x-data*="initOptions"]';
export const option_wrapper = '.option-wrapper';

// Qty Limit Message (shown when qty threshold reached)
export const qty_limit_message = '.bg-yellow-50.border-yellow-200';
export const qty_limit_message_text = '.bg-yellow-50.border-yellow-200 p';

// Dropdown/Select Options
export const select_option = 'select.product-custom-option';
export const select_option_value = 'select.product-custom-option option';
export const select_option_disabled_value = 'select.product-custom-option option[disabled]';
export const select_option_hidden_value = 'select.product-custom-option option[data-qty-hidden]';

// Radio Button Options
export const radio_option = 'input[type="radio"].product-custom-option';
export const radio_option_label = 'input[type="radio"].product-custom-option + label, label:has(input[type="radio"].product-custom-option)';
export const radio_option_disabled = 'input[type="radio"].product-custom-option[disabled]';
export const radio_option_grayed_label = 'label[data-qty-hidden]';

// Checkbox Options
export const checkbox_option = 'input[type="checkbox"].product-custom-option';
export const checkbox_option_label = 'input[type="checkbox"].product-custom-option + label, label:has(input[type="checkbox"].product-custom-option)';
export const checkbox_option_disabled = 'input[type="checkbox"].product-custom-option[disabled]';
export const checkbox_option_grayed_label = 'label[data-qty-hidden]';

// Text/Field Options
export const text_option = 'input[type="text"].product-custom-option';
export const textarea_option = 'textarea.product-custom-option';

// General Option Attributes
export const option_data_attribute_selector = '[data-option-type-id]';

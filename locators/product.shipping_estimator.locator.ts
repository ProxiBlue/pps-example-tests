// PPS Product Page Shipping Estimator Locators

// Main button to trigger the shipping estimator popup
export const estimator_button = '#product-shipping-button';

// Popup modal and container
export const popup_modal = '.popup-modal';
export const popup_content = '.popup-content';
export const popup_close = '.popup-close';

// Form inputs
export const zip_input = '#zip';
export const region_select = '#region_id';
export const calculate_button = 'button:has-text("Calculate Shipping")';

// Results and status
export const results_container = '#shipping-results';
export const loading_message = 'p:has-text("Calculating shipping...")';
export const error_message = 'p.text-red-600';
export const shipping_methods_list = '#shipping-results ul';
export const shipping_method_item = '#shipping-results ul li';

// Method details within each item
export const method_carrier = 'span:nth-of-type(1)';
export const method_name = 'span:nth-of-type(2)';
export const method_price = 'span:nth-of-type(3)';

// PPS uses dropdown selects for configurable options, not swatches.
// Override the swatch-based invalid_element from the base Hyvä locators.
export const invalid_element = 'select.super-attribute-select:invalid';

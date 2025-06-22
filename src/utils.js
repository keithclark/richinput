/**
 * Guards against unwanted style changes for a specific selector by generating a
 * declaration that unsets everything but a list of allowed properties.
 * 
 * @param {CSSStyleSheet} styleSheet The style sheet to add the guard to.
 * @param {string} selector the selector to create the guard for
 * @param {string[]} allowed the style properties that are allowd to be configured
 */
export const createStyleGuard = (styleSheet, selector, allowed = []) => {
  const rules = [];
  for (const style of getComputedStyle(document.documentElement)) {
    if (!allowed.includes(style)) {
      rules.push(`${style}: unset !important`)
    }
  }
  styleSheet.insertRule(`${selector} {${rules.join(';')}}`)
};


/**
 * Encodes the `<` and `&` characters into HTML entities so that text strings
 * can be rendered correctly as raw HTML content.
 * 
 * @param {string} text The text string to encode
 * @returns {string} the encoded string
 */
export const htmlEncode = (text) => {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
};

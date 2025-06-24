import stylesheet from './styles.css';
import template from './template.html';

import { createStyleGuard, htmlEncode } from './utils.js';

const SAFE_INPUT_TYPES = ['text', 'email', 'url', 'tel'];

createStyleGuard(stylesheet, 'b', [
  'color', 'background-color', 
  'text-decoration-color', 'text-decoration-line', 
  'text-decoration-style','text-decoration-thickness',
  'text-shadow'
]);


/**
 * RichInput enhances the native text-based <input> form element, providing 
 * real-time colourization of user input using a Regular Expression pattern.
 */
export default class RichInputElement extends HTMLElement {

  #input;
  #output;
  #internals = this.attachInternals();

  /** @type {RegExp | null} */
  #formatRegex = null;

  /**
   * @ignore
   */
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });
    shadowRoot.appendChild(template.cloneNode(true));
    shadowRoot.adoptedStyleSheets = [stylesheet];
    this.#input = shadowRoot.querySelector('input');
    this.#output = shadowRoot.querySelector('output');

    // Synchronise the colourised output with the users input
    this.#input.oninput = () => this.#update();

    // If there's a text selection we switch the stacking order of the `<input>`
    // so it renders below the `<output>` or the selection bounds will cover the
    // text content. If there's no selection then the input is rendered above 
    // `<output>` so that the caret sits over the text.
    // Note: the HTML spec excludes type="email" from using this event so email
    // inputs won't get this benefit.
    // See: https://html.spec.whatwg.org/multipage/input.html#do-not-apply
    this.#input.onselectionchange = () => {
      const { selectionStart, selectionEnd, classList } = this.#input;
      // if `selectionStart` is `null` then the input doesn't support selections
      // and we should not apply the `noselection` class
      classList.toggle('noselection', selectionStart !== null && selectionStart === selectionEnd);
    };

    // when receiving focus update the ::selection styles
    this.addEventListener('focus', () => {
      // when receiving focus update the ::selection styles
      this.#updateSelectionStyles();

      // If the user has configured a `DataList` for this element then we must
      // create a temporary clone of the list and append it to the shadow DOM.
      // This is necessary because the `<input>` in the shadow DOM cannot reach 
      // up to the light DOM and resolve the element referred to by `list` 
      // attribute. Once focus is lost the copy id destroyed and will be
      //recreated again next time the element receives focus.
      const listElem = this.list;
      if (listElem) {
        const clone = listElem.cloneNode(true);
        this.shadowRoot.appendChild(clone);
        this.addEventListener('blur', () => {
          clone.remove();
        }, { once: true });
      }

      // Bug in Chrome prevents focus from moving to the input when setting focus 
      // from a label element.
      this.#input.focus();
    });
  }


  /**
   * @ignore
   */
  connectedCallback() {
    this.value = this.getAttribute('value');
    this.readOnly = this.hasAttribute('readonly');
    this.disabled = this.hasAttribute('disabled');
    this.required = this.hasAttribute('required');
    if (this.hasAttribute('pattern')) {
      this.pattern = this.getAttribute('pattern');
    }
    this.#updateSelectionStyles()
  }

  /**
   * @ignore
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'stylepattern') {
      try {
        this.#formatRegex = new RegExp(`^(?:${newValue})$`, 'd');
      } catch (e) {
        this.#formatRegex = null;
      }
    } else if (name === 'type') { 
      if (SAFE_INPUT_TYPES.includes(newValue)) {
        this.#input.type = newValue;
      } else {
        this.#input.type = 'text';
      }
    } else {
      if (newValue === null) {
        this.#input.removeAttribute(name);
      } else {
        this.#input.setAttribute(name, newValue);
      }
    }
    this.#update();
  }

  #setValidityFromInput() {
    const { validity, validationMessage } = this.#input;
    this.#internals.setValidity(validity, validationMessage || 'Error', this.#input);
  }

  #updateSelectionStyles() {
    // It's not possible for ::selection to inherit values form the cascade
    // so we query the host element styles and pass them on through a custom
    // property.
    const { backgroundColor } = getComputedStyle(this, '::selection');
    this.#input.style.setProperty('--selection', backgroundColor);
  }


  #update() {

    const { value } = this.#input;

    this.#internals.setFormValue(value);
    this.#setValidityFromInput();

    // If the output doesn't match the regex then there is no need to higlight
    // the content so set `textContent`
    const match = this.#formatRegex?.exec(value);
    if (!match) {
      this.#output.textContent = value;
      return;
    }

    // Split the regex match by it's match indicies and wrap each group in a
    // HTML element. 
    const { indices } = match;
    const chunks = [];
    let lastIndex = 0;
    for (let i = 1; i < indices.length; i++) {
      if (!indices[i]) {
        continue;
      }
      const [start, end] = indices[i];
      if (start > lastIndex) {
        chunks.push(htmlEncode(value.slice(lastIndex, start)));
      }
      chunks.push(`<b part="group-${i}">${htmlEncode(value.slice(start, end))}</b>`);
      lastIndex = end;
    }
    if (lastIndex < value.length) {
      chunks.push(htmlEncode(value.slice(lastIndex)));
    }
    this.#output.innerHTML = chunks.join('');
  }


  /**
   * The text content of the input.
   * @htmlattr value
   * @type {string}
   */
  get value() {
    return this.#input.value;
  }

  set value(value) {
    this.#input.value = value;
    this.#update();
  }


  /**
   * Returns a reference to the `<datalist>` element referred to by the `list`
   * attribute, or `null` if the attribute is not present or the list it refers 
   * to is not accessible.
   * 
   * Note: A clone of the `<datalist>` element reference by this property will 
   * be appended to the Shadow DOM when the input receives focus. This is 
   * required because the element that captures user input is located in the 
   * Shadow DOM and cannot access elements in the Light DOM. The clone is 
   * destroyed once the element loses focus.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/list
   * @type {HTMLDataListElement?}
   */
  get list() {
    return this.ownerDocument.getElementById(this.getAttribute('list'));
  }


  /**
   * Controls the type of value the input should contain. If omitted or set to 
   * invalid value, the default value of `text` will be implied.
   * @htmlattr type
   * @type {'text'|'tel'|'email'|'url'}
   */
  get type() {
    const attrVal = this.getAttribute('type');
    if (!SAFE_INPUT_TYPES.includes(attrVal)) {
      return 'text';
    }
    return attrVal;
  }

  set type(value) {
    this.setAttribute('type', value);
  }


  // Selections
  // ---------------------------------------------------------------------------

  /**
   * Sets the start and end positions of the text selection in the element.
   * Note: As per the HTML5 spec, this method will throw a `InvalidStateError` 
   * exception for inputs with a type of `email`.
   * 
   * @param {number} selectionStart The index of the first selected character
   * @param {number} selectionEnd The index of the last selected character
   * @param {"forward"|"backward"|"none"} [selectionDirection] direction the selection was made
   */
  setSelectionRange(...args) {
    this.#input.setSelectionRange(...args);
  }


  /**
   * Sets the start and end positions of the text selection in the element.
   * Note: As per the HTML5 spec, this method will throw a `InvalidStateError` 
   * exception for inputs with a type of `email`.
   * 
   * @param {string} replacement The string to insert.
   * @param {number} [start]  The index of the first character to replace. Defaults to the current `selectionStart` value.
   * @param {number} [end] The index of the character after the last character to replace. Defaults to the current `selectionEnd` value.
   * @param {'select'|'start'|'end'|'preserve'} [selectMode] selection state after the text has been replaced.
   */
  setRangeText(...args) {
    this.#input.setRangeText(...args);
    this.#update();
  }


  /**
   * Sets the current selection to the text content of the input.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select() {
    this.#input.select();
  }
  

  /**
   * Programatically set the focus to the input.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
   * @param {Object} options
   */
  focus(options) {
    this.#input.focus(options);
  }


  /**
   * Gets or sets the index of the first character in the text selection or the 
   * caret position, if nothing is selected. 
   * Note: As per the HTML5 spec, this property will return `null` for inputs 
   * with a type of `email`.
   * @type {number|null}
   */
  get selectionStart() {
    return this.#input.selectionStart;
  }

  set selectionStart(value) {
    this.#input.selectionStart = value;
  }


  /**
   * Gets or sets the index of the last character in the text selection or the 
   * caret position, if nothing is selected. 
   * Note: As per the HTML5 spec, this property will return `null` for inputs 
   * with a type of `email`.
   * @type {number|null}
   */
  get selectionEnd() {
    return this.#input.selectionEnd;
  }

  set selectionEnd(value) {
    this.#input.selectionEnd = value;
  }


  /**
   * Gets or sets direction the current text selection was made.
   * Note: As per the HTML5 spec, this property will return `null` for inputs 
   * with a type of `email`.
   * @type {'forward'|'backward'|'none'|null}
   */
  get selectionDirection() {
    return this.#input.selectionDirection;
  }

  set selectionDirection(value) {
    this.#input.selectionDirection = value;
  }


  // Form
  // ---------------------------------------------------------------------------

  /**
   * Returns the form assosicated with the element, or `null` if a form is not 
   * available.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/form
   * @type {HTMLFormElement}
   */
  get form() {
    return this.#internals.form;
  }


  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Indicates if the input has any validation issues.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
   * @returns {boolean}
   */
  checkValidity() {
    return this.#internals.checkValidity();
  }


  /**
   * Performs a validation check and reports any resulting failure to the user. 
   * If this input has an associated form element, the form submission will be
   * prevented until the element is in a valid state.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
   * @returns {boolean}
   */
  reportValidity() {
    return this.#internals.reportValidity();
  }


  /**
   * Sets a custom validity message for the input. When a validation check is
   * performed by `reportValidity`, this message will be shown to the user. To
   * stop showing the message call this method with an empty string.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
   * @param {string} message 
   */
  setCustomValidity(message) {
    if (message) {
      this.#internals.setValidity({customError: true}, message, this.#input);
    } else {
      this.#setValidityFromInput();
    }
  }


  /**
   * The current validation error message to show the user.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/validationMessage
   * @type {string}
   */
  get validationMessage() {
    return this.#internals.validationMessage;
  }


  /**
   * Returns the current validity state of the input.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/validity
   * @type {ValidityState}
   */
  get validity() {
    return this.#internals.validity;
  }


  /**
   * Indicates whether this input will participate in validation or not.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/willValidate
   * @type {boolean}
   */
  get willValidate() {
    return this.#internals.willValidate;
  }


  // Reflected properties
  // ---------------------------------------------------------------------------

  /**
   * The regular expression pattern used to control styling of the input value.
   * The pattern must match the entire input value, rather than matching a 
   * substring.
   * @htmlattr stylepattern
   * @type {string}
   */
  get stylePattern() {
    return this.getAttribute('stylepattern');
  }

  set stylePattern(value) {
    this.setAttribute('stylepattern', value);
  }


  /**
   * A text string that is displayed in the field as a prompt until the user 
   * puts focus on the field.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/placeholder
   * @htmlattr placeholder
   * @type {string}
   */
  get placeholder() {
    return this.getAttribute('placeholder');
  }

  set placeholder(value) {
    this.setAttribute('placeholder', value);
  }


  /**
   * Indicates whether the input value can be automatically completed by the 
   * browser. For information on allowed values please see:
   * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/autocomplete
   * @htmlattr autocomplete
   * @type {'on'|'off'|'<token-list>'}
   */
  get autocomplete() {
    return this.getAttribute('autocomplete');
  }

  set autocomplete(value) {
    this.setAttribute('autocomplete', value);
  }



  /**
   * Determines if the user must supply a value for this input for it to be 
   * considered valid. If the input is marked as required and a value is 
   * missing, the user will be prompted to set one when attempting to submit a 
   * form. 
   * @htmlattr required
   * @type {boolean}
   */
  get required() {
    return this.hasAttribute('required');
  }

  set required(value) {
    this.toggleAttribute('required', !!value);
  }


  /**
   * Controls whether the user is able interact with the input, or not. A 
   * disabled input cannot receive focus or have it's value modifed by the user.
   * @htmlattr disabled
   * @type {boolean}
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.toggleAttribute('disabled', !!value);
  }


  /**
   * Determines whether a user can modify the input value. An input marked as
   * read-only can receive focus.
   * @htmlattr readonly
   * @type {boolean}
   */
  get readOnly() {
    this.hasAttribute('readonly');
  }

  set readOnly(value) {
    this.toggleAttribute('readonly', !!value);
  }


  /**
   * A string containing a regular expression that the user's input must match. 
   * The regular expression must match the entire input value, rather than 
   * matching a substring.
   * @htmlattr pattern
   * @type {string}
   */
  get pattern() {
    return this.getAttribute('pattern');
  }

  set pattern(value) {
    this.setAttribute('pattern', value);
  }


  /**
   * Determines the maximum number of characters permissable in the value
   * @htmlattr maxlength
   * @type {number}
   */
  get maxLength() {
    return this.getAttribute('maxlength');
  }

  set maxLength(value) {
    this.setAttribute('maxlength', value);
  }


  /**
   * @ignore
   */
  static formAssociated = true;


  /**
   * @ignore
   */
  static get observedAttributes() {
    return [
      'stylepattern',
      'readonly',
      'value',
      'disabled',
      'required',
      'pattern',
      'placeholder',
      'type',
      'size',
      'list',
      'dirName',
      'autocomplete',
      'maxlength'
    ]
  }

}

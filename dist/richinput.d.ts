// Automatically generated during build
declare module "@keithclark/richinput" {
  class RichInputElement extends HTMLElement {
    /**
     * Sets the start and end positions of the text selection in the element.
     * Note: As per the HTML5 spec, this method will throw a
     * `InvalidStateError` exception for inputs with a type of `email`.
     * @param selectionStart The index of the first selected character
     * @param selectionEnd The index of the last selected character
     * @param selectionDirection direction the selection was made
     */
    setSelectionRange(selectionStart: number, selectionEnd: number, selectionDirection?: "forward"|"backward"|"none"): void;
    /**
     * Sets the start and end positions of the text selection in the element.
     * Note: As per the HTML5 spec, this method will throw a
     * `InvalidStateError` exception for inputs with a type of `email`.
     * @param replacement The string to insert.
     * @param start The index of the first character to replace. Defaults to
     * the current `selectionStart` value.
     * @param end The index of the character after the last character to
     * replace. Defaults to the current `selectionEnd` value.
     * @param selectMode selection state after the text has been replaced.
     */
    setRangeText(replacement: string, start?: number, end?: number, selectMode?: "select"|"start"|"end"|"preserve"): void;
    /**
     * Sets the current selection to the text content of the input.
     */
    select(): void;
    /**
     * Programatically set the focus to the input.
     */
    focus(options: Object): void;
    /**
     * Indicates if the input has any validation issues.
     */
    checkValidity(): boolean;
    /**
     * Performs a validation check and reports any resulting failure to the
     * user. If this input has an associated form element, the form submission
     * will be prevented until the element is in a valid state.
     */
    reportValidity(): boolean;
    /**
     * Sets a custom validity message for the input. When a validation check is
     * performed by `reportValidity`, this message will be shown to the user.
     * To stop showing the message call this method with an empty string.
     */
    setCustomValidity(message: string): void;
    /**
     * The text content of the input.
     */
    value: string;
    /**
     * Returns a reference to the `<datalist>` element referred to by the
     * `list` attribute, or `null` if the attribute is not present or the list
     * it refers to is not accessible.
     *
     * Note: A clone of the `<datalist>` element reference by this property
     * will be appended to the Shadow DOM when the input receives focus. This
     * is required because the element that captures user input is located in
     * the Shadow DOM and cannot access elements in the Light DOM. The clone is
     * destroyed once the element loses focus.
     */
    readonly list: HTMLDataListElement|null;
    /**
     * Controls the type of value the input should contain. If omitted or set
     * to invalid value, the default value of `text` will be implied.
     */
    type: "text"|"tel"|"email"|"url";
    /**
     * Gets or sets the index of the first character in the text selection or
     * the caret position, if nothing is selected. Note: As per the HTML5 spec,
     * this property will return `null` for inputs with a type of `email`.
     */
    selectionStart: number|null;
    /**
     * Gets or sets the index of the last character in the text selection or
     * the caret position, if nothing is selected. Note: As per the HTML5 spec,
     * this property will return `null` for inputs with a type of `email`.
     */
    selectionEnd: number|null;
    /**
     * Gets or sets direction the current text selection was made. Note: As per
     * the HTML5 spec, this property will return `null` for inputs with a type
     * of `email`.
     */
    selectionDirection: "forward"|"backward"|"none"|null;
    /**
     * Returns the form assosicated with the element, or `null` if a form is
     * not available.
     */
    readonly form: HTMLFormElement;
    /**
     * The current validation error message to show the user.
     */
    readonly validationMessage: string;
    /**
     * Returns the current validity state of the input.
     */
    readonly validity: ValidityState;
    /**
     * Indicates whether this input will participate in validation or not.
     */
    readonly willValidate: boolean;
    /**
     * The regular expression pattern used to control styling of the input
     * value. It's compiled with the `v` flag, so it's Unicode-aware. The
     * pattern must match the entire input value—not just part of it.
     */
    stylePattern: string;
    /**
     * A text string that is displayed in the field as a prompt until the user
     * puts focus on the field.
     */
    placeholder: string;
    /**
     * Indicates whether the input value can be automatically completed by the
     * browser. For information on allowed values please see:
     * https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#
     * utofill
     */
    autocomplete: "on"|"off"|"<token-list>";
    /**
     * Determines if the user must supply a value for this input for it to be
     * considered valid. If the input is marked as required and a value is
     * missing, the user will be prompted to set one when attempting to submit
     * a form.
     */
    required: boolean;
    /**
     * Controls whether the user is able interact with the input, or not. A
     * disabled input cannot receive focus or have it's value modifed by the
     * user.
     */
    disabled: boolean;
    /**
     * Determines whether a user can modify the input value. An input marked as
     * read-only can receive focus.
     */
    readOnly: boolean;
    /**
     * A string containing a regular expression that the user's input must
     * match. The regular expression must match the entire input value, rather
     * than matching a substring.
     */
    pattern: string;
    /**
     * Determines the maximum number of characters permissable in the value
     */
    maxLength: number;
  }
  /**
   * RichInput enhances the native text-based <input> form element, providing
   * real-time colourization of user input using a Regular Expression pattern.
   */
  export default RichInputElement;
  
}

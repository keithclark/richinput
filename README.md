
# @keithclark/richinput API Documentation

# RichInputElement Class
Extends HTMLElement.  
## Instance Methods

### `RichInputElement.checkValidity()`

Indicates if the input has any validation issues. 

#### Syntax

```js
RichInputElement.checkValidity()
```

#### Returns
boolean
### `RichInputElement.focus()`

Programatically set the focus to the input. 

#### Syntax

```js
RichInputElement.focus(options)
```

#### Arguments


Name | Type | Description
-|-|-
`options` | Object | 

### `RichInputElement.reportValidity()`

Performs a validation check and reports any resulting failure to the user. If this input has an associated form element, the form submission will be prevented until the element is in a valid state. 

#### Syntax

```js
RichInputElement.reportValidity()
```

#### Returns
boolean
### `RichInputElement.select()`

Sets the current selection to the text content of the input. 

#### Syntax

```js
RichInputElement.select()
```

### `RichInputElement.setCustomValidity()`

Sets a custom validity message for the input. When a validation check is performed by `reportValidity`, this message will be shown to the user. To stop showing the message call this method with an empty string. 

#### Syntax

```js
RichInputElement.setCustomValidity(message)
```

#### Arguments


Name | Type | Description
-|-|-
`message` | string | 

### `RichInputElement.setRangeText()`

Sets the start and end positions of the text selection in the element. Note: As per the HTML5 spec, this method will throw a `InvalidStateError` exception for inputs with a type of `email`. 

#### Syntax

```js
RichInputElement.setRangeText(replacement, start, end, selectMode)
```

#### Arguments


Name | Type | Description
-|-|-
`replacement` | string | The string to insert.
`start` (Optional) | number | The index of the first character to replace. Defaults to the current `selectionStart` value.
`end` (Optional) | number | The index of the character after the last character to replace. Defaults to the current `selectionEnd` value.
`selectMode` (Optional) | `"select"`, `"start"`, `"end"` or `"preserve"` | selection state after the text has been replaced.

### `RichInputElement.setSelectionRange()`

Sets the start and end positions of the text selection in the element. Note: As per the HTML5 spec, this method will throw a `InvalidStateError` exception for inputs with a type of `email`. 

#### Syntax

```js
RichInputElement.setSelectionRange(selectionStart, selectionEnd, selectionDirection)
```

#### Arguments


Name | Type | Description
-|-|-
`selectionStart` | number | The index of the first selected character
`selectionEnd` | number | The index of the last selected character
`selectionDirection` (Optional) | `"forward"`, `"backward"` or `"none"` | direction the selection was made

## Instance Properties

### `RichInputElement.autocomplete`

A `"on"`, `"off"` or `"\<token-list>"`.  Indicates whether the input value can be automatically completed by the browser. 

### `RichInputElement.disabled`

A boolean.  Controls whether the user is able interact with the input, or not. A disabled input cannot receive focus or have it's value modifed by the user. 

### `RichInputElement.form` (Read-only)

A HTMLFormElement.  Returns the form assosicated with the element, or `null` if a form is not available. 

### `RichInputElement.list` (Read-only)

A HTMLDataListElement or null.  Returns a reference to the `<datalist>` element referred to by the `list` attribute, or `null` if the attribute is not present or the list it refers to is not accessible.

Note: A clone of the `<datalist>` element reference by this property will be appended to the Shadow DOM when the input receives focus. This is required because the element that captures user input is located in the Shadow DOM and cannot access elements in the Light DOM. The clone is destroyed once the element loses focus. 

### `RichInputElement.maxLength`

A number.  Determines the maximum number of characters permissable in the value.  

### `RichInputElement.pattern`

A string.  A string containing a regular expression that the user's input must match. The regular expression must match the entire input value, rather than matching a substring. 

### `RichInputElement.placeholder`

A string.  A text string that is displayed in the field as a prompt until the user puts focus on the field. 

### `RichInputElement.readOnly`

A boolean.  Determines whether a user can modify the input value. An input marked as read-only can receive focus. 

### `RichInputElement.required`

A boolean.  Determines if the user must supply a value for this input for it to be considered valid. If the input is marked as required and a value is missing, the user will be prompted to set one when attempting to submit a form. 

### `RichInputElement.selectionDirection`

A `"forward"`, `"backward"`, `"none"` or null.  Gets or sets direction the current text selection was made. Note: As per the HTML5 spec, this property will return `null` for inputs with a type of `email`. 

### `RichInputElement.selectionEnd`

A number or null.  Gets or sets the index of the last character in the text selection or the caret position, if nothing is selected. Note: As per the HTML5 spec, this property will return `null` for inputs with a type of `email`. 

### `RichInputElement.selectionStart`

A number or null.  Gets or sets the index of the first character in the text selection or the caret position, if nothing is selected. Note: As per the HTML5 spec, this property will return `null` for inputs with a type of `email`. 

### `RichInputElement.stylePattern`

A string.  The regular expression pattern used to control styling of the input value. The pattern must match the entire input value, rather than matching a substring. 

### `RichInputElement.type`

A `"text"`, `"tel"`, `"email"` or `"url"`.  Controls the type of value the input should contain. If omitted or set to invalid value, the default value of `text` will be implied. 

### `RichInputElement.validationMessage` (Read-only)

A string.  The current validation error message to show the user. 

### `RichInputElement.validity` (Read-only)

A ValidityState.  Returns the current validity state of the input. 

### `RichInputElement.value`

A string.  The text content of the input. 

### `RichInputElement.willValidate` (Read-only)

A boolean.  Indicates whether this input will participate in validation or not. 

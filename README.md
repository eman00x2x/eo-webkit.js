
# **eo.userClient**
The `eo.userClient` collects and manages client-related data, including:
* User Agent: The client's browser user agent string.
* Geo Information: The client's location data (retrieved from ipinfo.io).
* Browser Detection: Determines the browser name based on the user agent.

This information is cached in localStorage to avoid redundant API calls.

* ## Usage Example
   ```javascript
   console.log(userClient.userAgent); // e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
   console.log(userClient.geo); // e.g., { country: "US", city: "New York", ... }
   console.log(userClient.browser); // e.g., "Google Chrome"
   ```

* ## Properties
   userClient **Object**
   | Property | Type | Description |
   | --- | --- | --- |
   | `userAgent` | `string` | The browser's user agent string. |
   | `geo` | `Object` | null |
   | `browser` | `string` | string |

* ## Implementation Details
   **Fetching Geolocation Data**
   * If geolocation data isn't stored, userClient calls https://ipinfo.io/json to retrieve location details.
   * The response is cached in localStorage for future use.  
   **Browser Detection**
   * Uses navigator.userAgent to determine the browser name.
   * Compares the user agent string against common browser signatures.

* ## Error Handling
   * Geo Fetch Failure: Logs an error (Error getting geo info:).
   * Unknown Browser: Defaults to "Unknown Browser" if no match is found.

# **eo.validator**
The `eo.validator` is a lightweight data validation utility that checks objects against predefined rules. It supports nested properties using dot notation and provides customizable validation rules.

* ## Usage Example
   ```javascript
   const rules = {
     name: { required: true, length: { min: 3, max: 50 } },
     email: { required: true, email: true },
     age: { number: { min: 18, max: 99 } },
     address: { 
       street: { required: true }, 
       city: { required: true }
     }
   };
   
   validator.setConstraints(rules);
   
   const data = {
     name: "John",
     email: "invalid-email",
     age: 17,
     address: { street: "123 Main St" }
   };
   
   if (!validator.validate(data)) {
     console.log(validator.getErrors()); 
     // Output: [ "Email is not a valid email address.", "Age must be a number greater than 18.", "Address City is required." ]
   }
   ```
* ## Methods
   * ### `validate(data, rules)`
   
      Validates the given data object against rules and collects errors.  
      **Parameters:**
      * `data` (Object) – The object to validate.
      * `rules` (Object, optional) – The validation rules. If omitted, previously set constraints are used.
      
      **Returns:**
      * `true` if validation passes.
      * `false` if validation fails (errors can be retrieved using getErrors()).
      
      **Example:**
      ```javascript
      const isValid = validator.validate({ name: "Alice" });
      console.log(isValid); // true or false
      ```
   * ### `getErrors()`
   
      Retrieves an array of validation errors from the last `validate()` call.  
      **Returns:**
      * `Array<String>` – A list of human-readable error messages.
      
      **Example:**
      ```javascript
      console.log(validator.getErrors());
      // Output: [ "Email is not a valid email address." ]
      ```
   * ### `setConstraints(rules)`
      Sets default validation rules to be used for all future validations.
      
      **Parameters:**
      * `rules (Object)` – The validation rules object.
      
      **Example:**
      ```javascript
      validator.setConstraints({ username: { required: true } });
      ```
   * ### `resetConstraints()`
   
      Clears all previously set validation rules.
      
      **Example:**
      ```javascript
      validator.resetConstraints();
      ```
* ## Validation Rules
   The validator supports various rules that can be applied to fields.
   
   | Rule | Parrameter Type | Description |
   | --- | --- | --- |
   | `required` | `Boolean` | Ensures a value is present (not `null`, `undefined`, or empty). |
   | `length` | `{ min, max }` | Enforces string length constraints. |
   | `number` | `{ min, max }` | Ensures a value is a number and optionally within a range. |
   | `url` | `Boolean` | Ensures a valid URL format (http:// or https://). |
   | `email` | `Boolean` | Ensures a valid email format. |
   | `date` | `Boolean` | Ensures a valid date format (`YYYY-MM-DD`). |
   | `datetime` | `Boolean` | Ensures a valid datetime format. |
   | `equality` | `Any` | Ensures the value matches the given parameter exactly. |
   | `type` | `String` | Ensures the value is of the specified JavaScript type (`string`, `number`, etc.). |
   
   **Example Rule Definition:**
   ```javascript
   const rules = {
     username: { required: true, length: { min: 5, max: 20 } },
     password: { required: true },
     birthdate: { date: true },
     email: { email: true },
     age: { number: { min: 18, max: 65 } }
   };
   ```






# eo.redirect(url)

`@param {string} url - The URL to redirect to`

Redirects the browser to a given URL.

# eo.epochToTimeString(epoch)
`@param {number} epoch - The epoch time, in seconds
@returns {string} A localized string representation of the date and time`

Converts an epoch time (in seconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"

# eo.trim(stringValue, maximumLength)
`@param {string} stringValue - The string to trim
@param {number} maximumLength - The maximum allowed length of the string
@returns {string} The trimmed string`

Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam pretium vel sem sit amet sagittis. Mauris congue et nibh et posuere. Mauris eget velit sed metus porttitor venenatis.

# eo.formatFileSize(bytes, decimalPlaces = 0)
`@param {number} bytes - The number of bytes to convert
@param {number} [decimalPlaces=2] - The number of decimal places to include
@returns {string} A human-readable string representation of the given number of bytes`

Converts a given number of bytes to a human-readable string, appending the appropriate unit (Bytes, KB, MB, etc.).

# eo.uuidv4()
`@returns {string} A randomly generated UUID version 4`

Generates a random UUID (Universally Unique Identifier) version 4.  
This function uses the Web Cryptography API to generate a random UUID.  
The UUID is in the standard format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.

# eo.getRandomChar(length)
`@param {number} length - The length of the random hexadecimal string to generate
@returns {string} A random hexadecimal string of the specified length`

Generates a random hexadecimal string of the specified length.  
The function uses the Web Cryptography API to generate cryptographically secure random values, which are then converted to a hexadecimal string.

# eo.getRandomNum(start, end)
`@param {number} start - The lowest number to generate
@param {number} end - The highest number to generate
@returns {number} A randomly generated number between start and end`

Generates a random number between the given start and end.  
The end number is inclusive, so the function will return a number that is greater than or equal to start, and less than or equal to end.

# eo.convertCurrency(amount)
`@param {number} amount - The number to convert to a human-readable format
@returns {string} A human-readable string representation of the given number`

Converts a given number to a human-readable currency format.  
The function will return a string that represents the given number in a  
human-readable format. The format will be one of the following:  
\- Billions: 1,234,567,890,000 -> 1.23B  
\- Millions: 1,234,567 -> 1.23M  
\- Thousands: 1,234 -> 1.23K  
\- Default: 1234 -> 1234

# eo.serializeFormData(formData)
`@param {FormData|Array|object} formData - The input to serialize
@returns {object} A plain JavaScript object containing the serialized data`

Serializes a given input into a plain JavaScript object.  
This function accepts either a native FormData object, an array of objects with 'name' and 'value' properties, or a regular object. It processes the input to produce a plain JavaScript object with key-value pairs.  
\- If the input is a FormData object, it converts the entries to an object.  
\- If the input is an array, it reduces the array to an object using the 'name' and 'value' properties of each item.  
\- If the input is already a regular object, it is returned as is.

# eo.getYoutubeVideoData(url)
`@param {string} url - The YouTube video URL to parse
@returns {object} The parsed YouTube video object, or an error alert if the given URL is invalid`

Returns a YouTube video object given a YouTube video URL.  
The returned object contains the YouTube video ID, thumbnail URLs, video URL, and embed URL.  
  
The supported YouTube URL formats are:  
\- http://www.youtube.com/watch?v=VIDEO\_ID  
\- http://www.youtube.com/watch?v=VIDEO\_ID&feature=player\_embedded  
\- http://www.youtube.com/watch?v=VIDEO\_ID&feature=feedrec\_grec\_index  
\- http://www.youtube.com/user/USER\_NAME#p/a/u/1/VIDEO\_ID  
\- http://www.youtube.com/v/VIDEO\_ID?fs=1&hl=en\_US&rel=0  
\- http://www.youtube.com/watch?v=VIDEO\_ID#t=0m10s  
\- http://www.youtube.com/embed/VIDEO\_ID?rel=0  
\- http://youtu.be/VIDEO\_ID

# eo.createElements(tag, attributes = {}, children)
`@param {string} tag - The HTML tag name for the element to be created.
@param {object} [attributes={}] - An object representing key-value pairs of attributes for the element.
@param {Array} [children] - An array of children to append to the created element. Children can be strings or DOM nodes.
@returns {HTMLElement} The created and configured HTML element.
@throws {Error} If the tag is not a valid string, attributes is not an object, or children is not an array.`

Creates an HTML element with a specified tag name, attributes, and children.  
  
The function performs type checking and sanitization on the inputs to ensure safe and valid element creation. The tag name is sanitized, and attributes are set securely. Children can be strings or DOM nodes and are appended to the created element after sanitization.

Sample Usage:
```javascript
const div = eo.createElements('div', { class: 'container', id: 'main' }, [
        eo.createElements('p', {}, ['Hello, world!']),
        'Some text',
]);
document.body.appendChild(div);
```

# eo.moveHtmlElement(fromSelector, toSelector)

`@param {string} fromSelector - The CSS selector for the element to move the content from.
@param {string} toSelector - The CSS selector for the element to move the content to.`

Move the innerHTML of the element matching fromSelector to the element matching toSelector.

Sample Usage:
```javascript
moveHtmlElement('.source', '#destination');
```

# eo.post
`@param {string} url - The URL to make the request to
@param {(Array<{name: string, value: string}> | FormData | object)} data - The data to send in the request body
@param {object} [options] - Options for the request
@param {function} [onBeforeSend] - Called before the request is sent
@param {function} [onSuccess] - Called when the request returns a JSON response
@param {function} [onError] - Called when the request fails
@param {function} [onComplete] - Called after the request has completed
@param {string} [contentType='application/x-www-form-urlencoded; charset=UTF-8'] - The content type of the request`

Syntax
```javascript
eo.post(url, data, {  
    onBeforeSend,  
    onSuccess,  
    onError,  
    onComplete,  
    contentType = 'application/x-www-form-urlencoded; charset=UTF-8'  
} = {})
```

Makes a POST request to the given URL with the given data.  
This function automatically sets the X-Requested-With header to 'XMLHttpRequest' and handles JSON responses.  
The beforeSend callback is called before the request is sent.  
  
If the request returns a JSON response, the onSuccess callback is called with the parsed JSON.  
If the request returns an HTML or text response, the onSuccess callback is called with the response text.  
  
If the request fails, the onError callback is called with the error message and the actual error object.  
  
The onComplete callback is called after the request has completed, regardless of success or failure.

Sample Usage:
```javascript
eo.post('https://www.domain.com', new FormData(form));
```
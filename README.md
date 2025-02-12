# eo.js

## Important Note

include this meta tags in your html head

```html
<meta name="inDevelopment" content="1">
<meta name="csrf-token" content="{{ csrf_token() }}">
```

The inDevelopment meta tag is used to set it to production mode, either remove the meta tag or set its content to any value other than "1" once set all errors will show in console logs.

The csrf-token is required if you are using the following:

```javascript
window.eo.post(url, data);
window.eo.get(url);
```

Take note that you need to generate your own csrf-token

# methods

```javascript
/**
 * Redirects the browser to a given URL.
 *
 * @param {string} url - The URL to redirect to
 */
eo.redirect(url);
```

```javascript
/**
 * Converts an epoch time (in seconds) to a localized string in the format:
 * "Weekday, Month Day, Year, HH:MM AM/PM"
 *
 * @param {number} epoch - The epoch time, in seconds
 * @returns {string} A localized string representation of the date and time
 */
eo.epochToTimeString(epoch);
```

```javascript
/**
 * Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
 *
 * @param {string} stringValue - The string to trim
 * @param {number} maximumLength - The maximum allowed length of the string
 * @returns {string} The trimmed string
 */
eo.trim(string, max_length)
```

```javascript
/**
 * Converts a given number of bytes to a human-readable string,
 * appending the appropriate unit (Bytes, KB, MB, etc.).
 *
 * @param {number} bytes - The number of bytes to convert
 * @param {number} [decimalPlaces=2] - The number of decimal places to include
 * @returns {string} A human-readable string representation of the given number of bytes
 */
eo.formatFileSize(bytes, decimal_places = 2);
```

```javascript
/**
 * Generates a random UUID (Universally Unique Identifier) version 4.
 *
 * This function uses the Web Cryptography API to generate a random UUID.
 * The UUID is in the standard format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
 *
 * @returns {string} A randomly generated UUID version 4
 */
eo.uuidv4();
```

```javascript
/**
 * Generates a random hexadecimal string of the specified length.
 *
 * The function uses the Web Cryptography API to generate cryptographically
 * secure random values, which are then converted to a hexadecimal string.
 *
 * @param {number} length - The length of the random hexadecimal string to generate
 * @returns {string} A random hexadecimal string of the specified length
 */
eo.getRandomChar(length);
```

```javascript
/**
 * Generates a random number between the given start and end.
 *
 * The end number is inclusive, so the function will return a number that is
 * greater than or equal to start, and less than or equal to end.
 *
 * @param {number} start - The lowest number to generate
 * @param {number} end - The highest number to generate
 * @returns {number} A randomly generated number between start and end
 */
eo.getRandomNum(start, end);
```

```javascript
/**
 * Converts a given number to a human-readable currency format.
 *
 * The function will return a string that represents the given number in a
 * human-readable format. The format will be one of the following:
 *
 * - Billions: 1,234,567,890,000 -> 1.23B
 * - Millions: 1,234,567 -> 1.23M
 * - Thousands: 1,234 -> 1.23K
 * - Default: 1234 -> 1234
 *
 * @param {number} amount - The number to convert to a human-readable format
 * @returns {string} A human-readable string representation of the given number
 */
eo.convertCurrency(amount);
```

```javascript
/**
 * Serializes a given FormData object into a plain JavaScript object.
 *
 * @param {FormData} formData - The FormData object to serialize
 * @returns {object} A plain JavaScript object containing the same key-value pairs as the given FormData object
 */
eo.serializeFormData(formData);
```

```javascript
/**
 * Returns a YouTube video object given a YouTube video URL.
 *
 * The returned object contains the YouTube video ID, thumbnail URLs, video URL, and embed URL.
 *
 * The supported YouTube URL formats are:
 *
 * - http://www.youtube.com/watch?v=VIDEO_ID
 * - http://www.youtube.com/watch?v=VIDEO_ID&feature=player_embedded
 * - http://www.youtube.com/watch?v=VIDEO_ID&feature=feedrec_grec_index
 * - http://www.youtube.com/user/USER_NAME#p/a/u/1/VIDEO_ID
 * - http://www.youtube.com/v/VIDEO_ID?fs=1&hl=en_US&rel=0
 * - http://www.youtube.com/watch?v=VIDEO_ID#t=0m10s
 * - http://www.youtube.com/embed/VIDEO_ID?rel=0
 * - http://youtu.be/VIDEO_ID
 *
 * If the given URL is not a supported YouTube URL format, the function returns an object with a status of 2 and an error message.
 *
 * @param {string} url - The YouTube video URL to parse
 * @returns {object} The parsed YouTube video object, or an object with a status of 2 and an error message if the given URL is invalid
 */
eo.getYoutubeVideoData(url);
```

```javascript
/**
 * Makes a POST request to the given URL with the given data.
 * This function automatically sets the X-Requested-With header to 'XMLHttpRequest' and handles JSON responses.
 * The beforeSend callback is called before the request is sent.
 *
 * If the request returns a JSON response, the onSuccess callback is called with the parsed JSON.
 * If the request returns an HTML or text response, the onSuccess callback is called with the response text.
 *
 * If the request fails, the onError callback is called with the error message and the actual error object.
 *
 * The onComplete callback is called after the request has completed, regardless of success or failure.
 *
 * @param {string} url - The URL to make the request to
 * @param {(Array<{name, value}> | FormData | object | string)} data - The data to send in the request body
 * @param {object} [options] - Options for the request
 * @param {function} [options.beforeSend] - Called before the request is sent
 * @param {function} [options.onSuccess] - Called when the request returns a JSON response
 * @param {function} [options.onError] - Called when the request fails
 * @param {function} [options.onComplete] - Called after the request has completed
 * @param {boolean} [options.processData=true] - Whether to process the data before sending it
 * @param {string} [options.contentType='application/x-www-form-urlencoded; charset=UTF-8'] - The content type of the request
 */

eo.post(url, data, {
	beforeSend,
	onSuccess,
	onError,
	onComplete,
	processData = true,
	contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
});
```

```javascript
/**
 * Send a GET request to the given URL.
 *
 * This function returns a promise object that resolves to the response from the server.
 *
 * The function takes an optional object with the following properties as its last argument:
 *
 * - `beforeRequest`: a function called before the request is sent.
 * - `onSuccess`: a function called when the request is successful.
 * - `onError`: a function called when the request fails.
 *
 * @param {string} url - The URL to send the request to
 * @param {object} [options] - The options object
 * @returns {Promise} The promise object
 */

eo.get(url, {
	beforeRequest,
	onSuccess,
	onError
});
```

```javascript
/**
 * Gets the user client information from local storage or fetches it from IPInfo and determines the browser.
 * @returns {object} The client information, with the following properties:
 * - `userAgent`: The user agent string
 * - `geo`: The geo information from IPInfo
 * - `browser`: The browser name
 */

eo.userClient();
```

```javascript
/**
 * Submits the given form id, handles validation, redirects, and callbacks
 *
 * @param {String} formId - the form id to submit
 * @param {{ validation: Object, callback: Function, onBeforeSend: Function, redirectUrl: String  }} [options] - options for the submission
 * @param {{ validation: Object }} [options.validation] - the validation object, see https://validatejs.org/#validatejs-validators
 * @param {Function} [options.callback] - the callback function to call on success
 * @param {Function} [options.onBeforeSend] - the callback function to call before sending
 * @param {String} [options.redirectUrl] - the url to redirect to on success
 * @returns {JQueryPromise} - the promise returned by $.post
 */

eo.submitFormx(formId, {
	validation,
	callback,
	onBeforeSend,
	redirectUrl
});
```

```javascript
/**
 * Creates a modal element with a given id, size, content, status and destroyable flag.
 * @param {string} id - The id of the modal element.
 * @param {string} size - The size of the modal element. Can be "xs", "sm", "md", "lg", "xl", "fullscreen".
 * @param {function} [callback] - A callback function to be called to generate the modal content.
 * @param {boolean} [status=false] - Whether to add a modal status element to the modal element.
 * @param {boolean} [destroyable=false] - Whether to add a modal destroyable class to the modal element.
 */

eo.component.modal.create({
	id,
	size,
	callback,
	status = false,
	destroyable = true
})
```
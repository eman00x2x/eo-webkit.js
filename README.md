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
window.eo.post(url: string, data: object);
window.eo.get(url: string);
```

Take note that you need to generate your own csrf-token

# methods

redirects to the given url
```javascript
eo.redirect(url: string);
```

Converts an epoch time (in seconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"
```javascript
eo.epochToTimeString(epoch: integer);
```

Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
```javascript
eo.trim(string: string, max_length: integer)
```

Converts a given number of bytes to a human-readable string, appending the appropriate unit (Bytes, KB, MB, etc.).
```javascript
eo.formatFileSize(bytes: integer, decimal_places = 2);
```

Generates a random UUID (Universally Unique Identifier) version 4.
```javascript
eo.uuidv4();
```

Generates a random hexadecimal string of the specified length.
```javascript
eo.getRandomChar(length: integer);
```

Generates a random number between the given start and end.
```javascript
eo.getRandomNum(start: integer, end: integer);
```

Converts a given number to a human-readable currency format.
```javascript
eo.convertCurrency(amount: float);
```

Serializes a given FormData object into a plain JavaScript object.
```javascript
eo.serializeFormData(formData: object);
```

Returns a YouTube video object given a YouTube video URL.
The returned object contains the YouTube video ID, thumbnail URLs, video URL, and embed URL.
```javascript
eo.getYoutubeVideoData(url: string);
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
 * @param {(Array<{name: string, value: string}> | FormData | object | string)} data - The data to send in the request body
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
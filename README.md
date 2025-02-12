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

redirects to the given url
```javascript
eo.redirect(url);
```

Converts an epoch time (in seconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"
```javascript
eo.epochToTimeString(epoch);
```

Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
```javascript
eo.trim(string, max_length)
```

Converts a given number of bytes to a human-readable string, appending the appropriate unit (Bytes, KB, MB, etc.).
```javascript
eo.formatFileSize(bytes, decimalPlaces = 2);
```

Generates a random UUID (Universally Unique Identifier) version 4.
```javascript
eo.uuidv4();
```

Generates a random hexadecimal string of the specified length.
```javascript
eo.getRandomChar(length);
```

Generates a random number between the given start and end.
```javascript
eo.getRandomNum(start, ennd);
```

Converts a given number to a human-readable currency format.
```javascript
eo.convertCurrency(amount);
```

Serializes a given FormData object into a plain JavaScript object.
```javascript
eo.serializeFormData(formData);
```

Returns a YouTube video object given a YouTube video URL.
The returned object contains the YouTube video ID, thumbnail URLs, video URL, and embed URL.
```javascript
eo.getYoutubeVideoData(url);
```
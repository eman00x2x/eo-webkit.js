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
eo.redirect(url);
```
redirects to the url given

```javascript
eo.epochToTimeString(epoch);
```
Converts an epoch time (in seconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"

```javascript
eo.trim(string, max_length)
```
Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
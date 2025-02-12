# eo.js

## Important Note

include this meta tags in your html head

```html
<meta name="inDevelopment" content="1">
<meta name="csrf-token" content="{{ csrf_token() }}">
```

The inDevelopment meta tag is used to set it to production mode, either remove the meta tag or set its content to any value other than "1" once set all errors will show in console logs.

The csrf-token is required if you are using the following:
take note that you need to generate your own csrf-token

```javascript
window.eo.post(url, data);
window.eo.get(url);
```
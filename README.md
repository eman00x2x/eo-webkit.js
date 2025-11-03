# eo-webkit.js - A Comprehensive JavaScript Utility Library

eo-webkit.js is a comprehensive JavaScript utility library designed to streamline web development. It provides a wide range of functions for common tasks, including data manipulation, date/time handling, DOM manipulation, network requests, random data generation, form handling, UI components, third-party integrations, settings management, and calculators.

## Table of Contents

*   [Introduction](#introduction)
*   [Installation](#installation)
*   [Usage](#usage)
    *   [Browser](#browser)
    *   [Node.js](#nodejs)
    *   [AMD](#amd)
*   [API Reference](#api-reference)
    *   [Data Manipulation](#data-manipulation)
        *   [`eo.trim`](#eotrim) - Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
        *   [`eo.formatFileSize`](#eoformatfilesize) - Formats a file size into a human-readable string (e.g., "10KB", "2MB").
        *   [`eo.uuidv4`](#eouuidv4) - Generates a UUID (Universally Unique Identifier) v4.
        *   [`eo.formatCurrency`](#eoformatcurrency) - formats large numbers into a more readable currency notation
        *   [`eo.serializeFormData`](#eoserializeformdata) - Serializes form data into a query string.
        *   [`eo.arrayToDotNotation`](#eoarraytodotnotation) - Converts a nested object into a flat object with dot notation keys.
        *   [`eo.dotNotationToArray`](#eodotnotationtoarray) - Converts dot notation to an array.
        *   [`eo.removeFalseArray`](#eoremovefalsearray) - Filters an array by removing empty strings, null, false, undefined, and boolean values.
        *   [`eo.removeDuplicatesArray`](#eoremoveduplicatesarray) - Removes duplicate elements from an array.values.
    *   [Date and Time](#date-and-time)
        *   [`eo.epochToTimeString`](#eoepochtotimestring) - Converts an epoch timestamp to a human-readable time string.
        *   [`eo.readableDate`](#eoreadabledate) - Formats dates as "Today", "Yesterday", or full date with time based on the input date.
        *   [`eo.diffDays`](#eodiffDays) - Calculates the difference in days between two dates.
    *   [DOM Manipulation](#dom-manipulation)
        *   [`eo.moveHtmlElement`](#eomovehtmlelement) - Moves an HTML element to a new target element.
        *   [`eo.createElements`](#eocreateelements) - Creates one or more HTML elements.
        *   [`eo.getYoutubeVideoData`](#eogetyoutubevideodata) - Retrieves data about a YouTube video.
    *   [Network Requests](#network-requests)
        *   [`eo.post`](#eopost) - Makes a POST request.
        *   [`eo.get`](#eoget) - Makes a GET request.
        *   [`eo.redirect`](#eoredirect) - Redirects the browser to a new URL.
        *   [`eo.userClient`](#eouserclient) - Manages user client interactions.
        *   [`eo.listener`](#eolistener) - Websocket listener.
        *   [`eo._CSRFToken`](#eo_csrftoken) - Retrieves the CSRF token.
    *   [Random Data Generation](#random-data-generation)
        *   [`eo.getRandomChar`](#eogetrandomchar) - Generates a random character.
        *   [`eo.getRandomNum`](#eogetrandomnum) - Generates a random number within a range.
    *   [Form Handling and Validation](#form-handling-and-validation)
        *   [`eo.validator`](#eovalidator) - Validates a form based on specified rules.
        *   [`eo.submitForm`](#eosubmitform) - Submits a form.
    *   [Cookie Management](#cookie-management)
        *   [`eo.setCookie`](#eosetCookie) - Sets a cookie with the given key and value, expiring in the specified number of days.
        *   [`eo.getCookie`](#eogetCookie) - Retrieves the value of a specified cookie by its key.
    *   [UI Components](#ui-components)
        *   [`eo.modal`](#eomodal) - Manages a modal dialog.
        *   [`eo.alert`](#eoalert) - Displays an alert message.
        *   [`eo.button`](#eobutton) - Provides an interface for interacting with buttons.
        *   [`eo.uploader`](#eouploader) - Manages a file uploader.
        *   [`eo.compressImage`](#eocompressimage) - Manages a file uploader.
        *   [`eo.video`](#eovideo) - Provides an interface for interacting with video elements.
        *   [`eo.mortgageCalculator`](#eomortgagecalculator) - Provides a mortgage calculator component.
    *   [Third-Party Integrations](#third-party-integrations)
        *   [`eo.tinymce`](#eotinymce) - Integrates with TinyMCE.
        *   [`eo.googleChart`](#eogooglechart) - Integrates with Google Charts.
        *   [`eo.tomSelect`](#eotomselect) - Integrates with Tom Select.
*   [License](#license)


# Introduction
eo-webkit.js aims to simplify front-end development by providing a single, well-documented library for a variety of everyday tasks.  It's designed to be modular and easy to use, helping developers build web applications more efficiently.

# Installation
## Browser
**1. Include the script:**
The simplest way to use eo-webkit.js in a browser is to include the script directly in your HTML file. Place the following `<script>` tag just before the closing `</body>` tag:
```html
<body>
   <!-- your html content here -->

   <script type='text/javascript' src='path/to/eo-webkit.js' />
</body>
```
Replace `"path/to/eo-webkit.js"` with the actual path to your `eo-webkit.js` file.  If you're using a CDN, you would use the CDN URL here.

**2. Use the module:**  
After including the script, you can access the module's functions through the eo global object:
```javascript
console.log(eo.trim("  hello  ")); // Example usage
```

## Node.js
**1. Install the package**
```bash
npm install eo-webkit
```

**2. Require the module:**   
In your Node.js code, require the module:
```javascript
const eo = require('eo-webkit.js');

console.log(eo.trim("  hello  "));
```

## AMD (Asynchronous Module Definition)
If you're using an AMD module loader like RequireJS, you can load eo.js as an AMD module:

**1. Configure RequireJS:**   
Make sure RequireJS is configured in your HTML file.

**2. Define the module path:**   
Configure the path to your eo.js file in your RequireJS configuration:
```javascript
require.config({
  paths: {
    'eo-webkit': 'path/to/eo-webkit' // Path to your eo-webkit.js file (without the .js extension)
  }
});
```

**3. Use the module:**  
Use require to load and use the module:
```javascript
require(['eo-webkit'], function(eo) {
  console.log(eo.trim("  hello  ")); // Example usage
});
```

# API-Reference
   ## Data Manipulation
   ### eo.trim
   `eo.trim(stringValue, maxLength)` truncates a string if it exceeds the specified maxLength and appends "...". If the string is within the limit, it   remains unchanged.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `stringValue` | `String` | The input string to be trimmed. |
   | `maxLength` | `Number` | The maximum allowed length of the string (including ... if truncated). |

   #### Returns
   `String` The original string if within maxLength, otherwise a truncated version with "..." appended.

   #### Example Usage
   ```javascript
   console.log(eo.trim("Hello, world!", 10)); 
   // Output: "Hello, w..."

   console.log(eo.trim("Short", 10)); 
   // Output: "Short" (unchanged)
   ```

   ### eo.formatFileSize
   `eo.formatFileSize(bytes, decimalPlaces = 0)` converts a file size in bytes into a human-readable format (e.g., KB, MB, GB). It supports up to Yottabytes (YB) and allows formatting with a specified number of decimal places.

   #### Parameters
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `bytes` | `Number` | Required | The file size in **bytes**. |
   | `decimalPlaces` | `Number` | `0` (optional) | The **number of decimal places** for formatting. |
   
   #### Returns
   `String` A human-readable file size with units (e.g., "1.5 MB", "500 KB").

   #### Example Usage
   ```javascript
   console.log(eo.formatFileSize(1024));       
   // Output: "1 KB"

   console.log(eo.formatFileSize(1048576));    
   // Output: "1 MB"

   console.log(eo.formatFileSize(1500000, 2)); 
   // Output: "1.50 MB"

   console.log(eo.formatFileSize(0));          
   // Output: "0 Bytes"
   ```

   ### eo.uuidv4
   `eo.uuidv4()` generates a random UUID (Universally Unique Identifier) Version 4 in the standard format:  
   `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`  
   where x is a random hexadecimal digit and y is one of 8, 9, A, or B (per UUID v4 specification).
   
   #### Returns
   `String` A randomly generated UUID v4 in the format "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".
   
   #### Example Usage
   ```javascript
   console.log(eo.uuidv4()); 
   // Output: "3f94a8a7-1d2b-4c19-9b2f-6de8f0ea6df0" (random each time)
   ```

   ### eo.formatCurrency
   `eo.formatCurrency(amount)` formats large numbers into a more readable currency notation using suffixes like K (thousand), M (million), B (billion) T (trillion), and beyond, up to Googol (1e100).
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `amount` | `Number` \| `String` | The numeric value to be formatted. Can be a number or a string that represents a number. |

   #### Returns
   `String` A formatted string representing the number with an appropriate suffix (e.g., "1.5M", "2B").

   #### Example Usage
   ```javascript
   console.log(eo.formatCurrency(1500));      // "1.5K"
   console.log(eo.formatCurrency(1000000));   // "1M"
   console.log(eo.formatCurrency(2500000000)); // "2.5B"
   console.log(eo.formatCurrency(1e100));     // "1V"  (Googol)
   console.log(eo.formatCurrency(999));       // "999"
   ```

   ### eo.serializeFormData
   `eo.serializeFormData(formData)` converts form data into a plain JavaScript object. It supports different input types, including:
   * **FormData** (browser API)  
   * **Array of object**s (e.g., { name: "email", value: "test@example.com" })  
   * **Plain JavaScript objects**  
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `formData` | `FormData` \| `Array` \| `Object` | The data to be converted into a plain object. |

   #### Returns
   `Object` A JavaScript object where keys represent form field names and values represent user input.

   #### Example Usage
   * **Handling FormData**
      ```javascript
      const formElement = document.querySelector("form");
      const formData = new FormData(formElement);
      console.log(eo.serializeFormData(formData));
      // { name: "John", email: "john@example.com", password: "123456" }
      ```

   * **Handling an Array of Objects**
      ```javascript
      const formArray = [
          { name: "username", value: "johndoe" },
          { name: "email", value: "john@example.com" }
      ];
      console.log(eo.serializeFormData(formArray));
      // { username: "johndoe", email: "john@example.com" }
      ```

   * **Handling a Plain Object**
      ```javascript
      const formObject = { age: 25, country: "USA" };
      console.log(eo.serializeFormData(formObject));
      // { age: 25, country: "USA" }
      ```

   ### eo.objectToDotNotation
   `eo.objectToDotNotation(obj, prefix = '')` Converts a nested object into a flat object with dot notation keys.
   
   **Features**
   * **Object Flattening:** Converts a nested object into a flat object with dot notation keys.   
   * **Recursive Handling:** Recursively processes nested objects to ensure all nested properties are flattened.   
   * **Custom Prefix:** Allows specifying a prefix for the keys in the resulting flat object.   

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `obj` | `Object` | The nested object to be converted. |
   | `prefix` | `string` | An optional prefix for the keys in the resulting flat object. |
   
   #### Returns
   `Object` A new flat object with dot notation keys.
   
   #### Example Usage
   ```javascript
   const nestedObj = {
      user: {
         name: 'John Doe',
         address: {
               city: 'New York',
               zip: '10001'
         }
      }
   };

   const flatObj = eo.objectToDotNotation(nestedObj);
   console.log(flatObj); // Outputs: { 'user.name': 'John Doe', 'user.address.city': 'New York', 'user.address.zip': '10001' }

   const anotherNestedObj = {
      product: {
         id: 123,
         details: {
               name: 'Laptop',
               specs: {
                  cpu: 'Intel i7',
                  ram: '16GB'
               }
         }
      }
   };

   const anotherFlatObj = eo.objectToDotNotation(anotherNestedObj);
   console.log(anotherFlatObj); // Outputs: { 'product.id': 123, 'product.details.name': 'Laptop', 'product.details.specs.cpu': 'Intel i7', 'product details.specs.ram': '16GB' }
   ```

   ### eo.dotNotationToObject
   `eo.dotNotationToObject(obj)` Converts a nested object into a flat object with dot notation keys.

   **Features**
   * **Dot Notation to Object Conversion:** Converts an object with dot notation keys into a nested object.
   * **Recursive Handling:** Recursively processes dot notation keys to create a deeply nested object structure.
   * **Efficient Processing:** Uses the reduce method for efficient key processing and object construction.

   #### Parameters
   | Parameters | Type | Default | Description |
   | --- | --- | --- | --- |
   | `obj` | `Object` | required | The object with dot notation keys to be converted. |

   #### Returns
   `Object` A new flat object with dot notation keys.

   #### Example Usage
   ```javascript
   const dotNotatedObj = {
      'product.id': 123,
      'product.details.name': 'Laptop',
      'product.details.specs.cpu': 'Intel i7',
      'product.details.specs.ram': '16GB'
   };

   const nestedProduct = eo.dotNotationToObject(dotNotatedObj);
   console.log(nestedProduct); // Outputs: { product: { id: 123, details: { name: 'Laptop', specs: { cpu: 'Intel i7', ram: '16GB' } } } }

   const anotherDotNotatedObj = {
      'order.number': 456,
      'order.date': '2023-01-01',
      'order.items.0.name': 'Book',
      'order.items.0.price': 19.99,
      'order.items.1.name': 'Pen',
      'order.items.1.price': 2.99
   };

   const nestedOrder = eo.dotNotationToObject(anotherDotNotatedObj);
   console.log(nestedOrder); // Outputs: { order: { number: 456, date: '2023-01-01', items: [ { name: 'Book', price: 19.99 }, { name: 'Pen', price: 2.99 } ] } }
   ```

   ### eo.removeFalseArray
   `eo.removeFalseArray(arr)` Filters an array by removing empty strings, null, false, undefined, and boolean values.

   **Features**
   * **Filter Out Falsy Values:** Removes empty strings, null, false, undefined, and boolean values from an array.
   * **Simplified Filtering:** Uses the filter method for efficient and concise array filtering.

   #### Parameter
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `arr` | `Array` | The `array` to be filtered. |

   #### Return
   `Array` A new array with the falsy values removed.

   #### Example Usage
   ```javascript
   const array = [0, 1, false, '', 'hello', null, undefined, true, 'world'];
   const filteredArray = eo.removeFalseArray(array);
   console.log(filteredArray); // Outputs: [0, 1, 'hello', 'world']

   const mixedArray = [0, '', false, true, null, undefined, 'string', 123];
   const filteredMixedArray = eo.removeFalseArray(mixedArray);
   console.log(filteredMixedArray); // Outputs: [0, 'string', 123]
   ```

   ### eo.removeDuplicatesArray
   `eo.removeDuplicatesArray(arr)` Removes duplicate elements from an array.
   
   **Features**
   * **Remove Duplicate Elements:** Efficiently removes duplicate elements from an array.
   * **Simplified Usage:** Uses the Set object to filter out duplicates, returning a new array.

   #### Parameter
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `arr` | `Array` | The `array` from which duplicates will be removed. |
   
   #### Return
   `Array` A new array with duplicate elements removed.

   #### Example Usage
   ```javascript
   const array = [1, 2, 2, 3, 4, 4, 5];
   const uniqueArray = eo.removeDuplicatesArray(array);
   console.log(uniqueArray); // Outputs: [1, 2, 3, 4, 5]

   const stringArray = ['apple', 'banana', 'apple', 'orange'];
   const uniqueStringArray = eo.removeDuplicatesArray(stringArray);
   console.log(uniqueStringArray); // Outputs: ['apple', 'banana', 'orange']
   ```

   ## Date and Time
   ### eo.epochToTimeString
   `eo.epochToTimeString(epoch)` converts a Unix epoch timestamp (seconds/milliseconds since 1970-01-01 UTC) into a human-readable date string formatted in US English.
   Converts an epoch time (in seconds/milliseconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `epoch` | `Number` | A **Unix timestamp** in **seconds/milliseconds**. |

   #### Returns
   `String` A formatted date string in English (US locale).

   #### Example Usage
   ```javascript
   console.log(eo.epochToTimeString(1700000000)); 
   // Output: "Sunday, November 12, 2023, 12:26 PM"
   ```
   
   ### eo.readableDate
   `eo.readableDate(timestamp)` Converts a timestamp into a human-readable date string similar to Meta Messenger's format. It can accept epoch time in seconds, milliseconds, a string representation of a date, or a Date object.

   #### Parameter
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `timestamp` | `number` or `string` or `Date` | The input timestamp to be converted. Can be a number (in seconds or milliseconds), a string representation of a date, or a Date object. |

   #### Returns
   `string` The formatted date `string`.

   #### Throws
   `Error` Throws an error if the timestamp type is invalid.

   #### Example Usage
   ```javascript
   console.log(eo.readableDate(1739845344)); // Outputs: formatted date assuming input in seconds
   console.log(eo.readableDate(1739845344000)); // Outputs: formatted date assuming input in milliseconds
   console.log(eo.readableDate('2022-12-31T23:59:59Z')); // Outputs: formatted date from string
   console.log(eo.readableDate(new Date())); // Outputs: current time if input is Date object
   ```

   ### eo.diffDays
   `eo.diffDays(date, otherDate)` Calculates the difference in days between two dates.

   **Features**
   * **Date Difference Calculation:** Calculates the difference in days between two dates.
   * **Handles Various Date Formats:** Can accept Date objects, timestamp in milliseconds, or any other format that JavaScript's Date constructor can handle.
   * **Accurate Calculation:** Uses Math.abs and Math.ceil to ensure accurate and non-negative results.

   #### Parameters
   | Parameters | Type | Description |
   | --- | --- | --- |
   | `date` | `Date`, `number`, `string` | The first date to compare. Can be a Date object, a timestamp in milliseconds, or a string representation of a date. |
   | `otherDate` | `Date` or `number` or `string` | The second date to compare. Can be a Date object, a timestamp in milliseconds, or a string representation of a date. |
   
   #### Returns
    `number` The difference in days between the two dates.

   #### Example Usage
   ```javascript
   const date1 = new Date('2022-01-01');
   const date2 = new Date('2022-01-10');
   console.log(eo.diffDays(date1, date2)); // Outputs: 9

   const timestamp1 = Date.now();
   const timestamp2 = timestamp1 + (1000 * 60 * 60 * 24 * 7); // 7 days later
   console.log(eo.diffDays(timestamp1, timestamp2)); // Outputs: 7

   const dateStr1 = '2022-01-01';
   const dateStr2 = '2022-01-05';
   console.log(eo.diffDays(new Date(dateStr1), new Date(dateStr2))); // Outputs: 4
   ```

   ## DOM Manipulation
   ### eo.moveHtmlElement(fromSelector, toSelector)
   `eo.moveHtmlElement(fromSelector, toSelector)` moves the inner HTML from one element to another. This is useful for dynamically repositioning content within a webpage.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `fromSelector` | `string` | **CSS selector** of the element whose content will be moved. |
   | `toSelector` | `string` | **CSS selector** of the element where the content will be placed. |

   #### Returns
   `void` Does not return a value. It modifies the DOM directly.

   #### Example Usage
   * **Move Content from One Element to Another**
   ```html
   <div id="source">
       <p>Hello, World!</p>
   </div>

   <div id="destination">
       <!-- Content will be moved here -->
   </div>
   ```
   ```javascript
   eo.moveHtmlElement('#source', '#destination');
   ```
   * **Output**
   ```html
   <div id="source">
       <!-- Empty after move -->
   </div>

   <div id="destination">
       <p>Hello, World!</p>
   </div>
   ```

   ### eo.createElements
   `eo.createElements(tag, attributes, children)` dynamically creates an HTML element, applies attributes, and appends child elements or text nodes. Ensures data sanitization before inserting into the DOM.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `tag` | `string` | The **HTML tag name** (e.g., `'div'`, `'span'`). |
   | `attributes` | `object` (optional) | An object containing **attribute key-value pairs** (e.g., `{ class: 'btn', id: 'my-button' }`). |
   | `children` | `array` (optional) | An array of **child elements or strings** (text content). |

   #### Returns
   `HTMLElement` Returns a newly created DOM element with the specified attributes and children.

   #### Example Usage
   **Creating a Simple** `<div>`
   ```javascript
   const div = eo.createElements('div', { class: 'container', id: 'main' }, ['Hello, world!']);
   document.body.appendChild(div);
   ```
   **Output**
   ```html
   <div class="container" id="main">Hello, world!</div>
   ```

   **Creating a Nested Structure**
   ```javascript
   const button = eo.createElements('button', { class: 'btn', type: 'button' }, ['Click Me']);
   const wrapper = eo.createElements('div', { class: 'wrapper' }, [button]);

   document.body.appendChild(wrapper);
   ```
   **Output**
   ```html
   <div class="wrapper">
       <button class="btn" type="button">Click Me</button>
   </div>
   ```

   #### Error Handling
   | Error Condition | Thrown Error |
   | --- | --- |
   | `tag` is **not a string** or empty | `"Invalid tag name"` |
   | `attributes` is not an object | `"Attributes must be an object"` |
   | `children` is not an array | `"Children must be an array"` |

   ### eo.createHiddenInput
   `eo.createHiddenInput(name, value)` creates a hidden input field with a specified name and value. This is useful for storing data in forms without displaying it to the user.
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `name` | `string` | The **name attribute** of the hidden input. |
   | `value` | `string` | The **value to be stored** in the hidden input. |

   #### Returns
   `HTMLElement` A hidden <input> element with the provided name and value.

   #### Example Usage
   **Creating a Hidden Input**
   ```javascript
   const hiddenInput = eo.createHiddenInput('user_id', '12345');
   document.body.appendChild(hiddenInput);
   ```
   **Output**
   ```html
   <input type="hidden" name="user_id" value="12345">
   ```

   #### Error Handling
   | Error Condition | Thrown Error |
   | --- | --- |
   | `name` is **not a string** or empty | `"Invalid name"` |
   | `value` is **not a string** | `"Invalid value"` |

   ### eo.getYoutubeVideoData
   `eo.getYoutubeVideoData(url)` extracts YouTube video details from a given URL.
   It retrieves:  
   * **The video ID**
   * **Thumbnail URLs** in various resolutions
   * The **direct watch URL**
   * The **embed URL**

   If the URL is invalid, an error alert is triggered.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The YouTube video URL to extract details from. |

   #### Returns
   | Type	| Description |
   | --- | --- |
   | `Object`	| Returns an object with video details (**if the URL is valid**). |
   | `null`	| Returns null and triggers an alert if the URL is invalid. |

   #### Example Usage
   * **Valid Youtube URL**
      ```javascript
      const videoData = eo.getYoutubeVideoData("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      console.log(videoData);
      /* {
      id: "dQw4w9WgXcQ",
      thumbnail: {
         default: "http://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg",
         hq: "http://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
         mq: "http://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
         sd: "http://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg",
         maxres: "http://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      },
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      } */
      ```

   * **Invalid YouTube URL**
      ```javascript
      const videoData = eo.getYoutubeVideoData("https://example.com/video");
      console.log(videoData); // null
      // ⚠️ Alert: "Invalid YouTube URL"
      ```

   #### Supported Youtube URL Formats
   | Format Type | Example |
   | --- | --- |
   | Standard URL | https://www.youtube.com/watch?v=**VIDEO_ID** |
   | Shortened URL | https://youtu.be/**VIDEO_ID** |
   | Embed URL | https://www.youtube.com/embed/**VIDEO_ID** |
   | Other Variants | https://www.youtube.com/v/**VIDEO_ID**, https://www.youtube.com/watch?v=**VIDEO_ID**&feature=share |

   ## Network Requests
   ### eo.post
   The `eo.post` function **performs an HTTP POST request** to a specified `url` using the Fetch API. It supports **different data types** (`FormData`, `JSON`, `array`, or plain objects), **allows custom content types**, and provides **callback hooks** for different stages of the request.

   #### Syntax
   ```javascript
   eo.post(url, data, {
       onBeforeSend,
       onSuccess,
       onError,
       onComplete,
       contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
   });
   ```
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The API endpoint where the request is sent. |
   | `data` | `FormData`, `Object`, `Array` | The data to be sent in the request body. |
   | `options` | `object` | Optional configuration options (see below). |

   **Options Object**
   | Option | Type | Description |
   | --- | --- | --- |
   | `onBeforeSend` | `function` | **Callback function** executed before the request is sent. |
   | `onSuccess` | `function` | **Callback function** executed when the request is successful. |
   | `onError` | `function` | **Callback function** executed when the request fails. |
   | `onComplete` | `function` | **Callback function** executed when the request completes (whether successful or not). |
   | `contentType` | `string` | The `Content-Type` of the request (`application/json`, `application/x-www-form-urlencoded`, etc.). |
   
   #### Returns
   `void` Does not return a value. Instead, it executes the provided callback functions.
   
   #### Example Usage
   **Send Form Data**
   ```javascript
   const formData = new FormData();
   formData.append('username', 'john_doe');
   formData.append('password', 'securePass123');

   eo.post('/login', formData, {
       onSuccess: (response) => console.log('Login Success:', response),
       onError: (xhr, status, error) => console.error('Error:', status, error)
   });
   ```

   **Send JSON Data**
   ```javascript
   const userData = { username: 'john_doe', age: 30 };

   eo.post('/update-profile', userData, {
       contentType: 'application/json',
       onSuccess: (response) => console.log('Profile Updated:', response),
       onError: (xhr, status, error) => console.error('Profile Update Failed:', error)
   });
   ```

   **Note**
   You can integrate the CSRFToken (Optional) [Please read CSRFToken Implementation](#eocsrftoken)
   ```html
   <meta name="csrf-token" content="{{ csrf_token() }}">
   ```

   ### eo.get
   The `eo.get` function is an asynchronous utility to make HTTP GET requests using the Fetch API. It allows for optional query parameters, customizable data type handling, and optional success callbacks.
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The API endpoint from which data is fetched. |
   | `data` | `Object` / `Function` *Optional* | An object containing query parameters or a `callback function`. |
   | `success` | `Function` *Optional* | A `callback function` to handle the response data. |
   | `dataType` | `String` *Optional* | The expected data type of the response (e.g., '`json`'). |

   #### Returns
   `Promise<any>` A promise that resolves with the response data or logs an error.
   
   #### Example Usage
   ```javascript
   // Making a GET request with query parameters and handling JSON response
   const data = await get('/api/data');

   // GET with query params
   const userData = await get('/api/user', { id: 123 });

   // With success callback
   get('/api/data', { id: 123 }, (data) => console.log(data));

   // Explicit JSON response handling
   const jsonData = await get('/api/data', { id: 123 }, null, 'json');
   ```

   #### Error Handling
   Any fetch error is logged to the console and re-thrown for further handling.
   ```javascript
   get('/api/user', { id: 456 })
      .then((response) => console.log('User Data:', response.data))
      .catch((error) => console.error('Error:', error));
   ```

   ### eo.redirect
   `eo.redirect(url)` navigates the browser to the specified URL by setting window.location.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `String` | The URL to which the browser should be redirected. |
   
   #### Returns
   `void` This function does not return anything. It redirects the user immediately.
   #### Example Usage
   ```javascript
   eo.redirect("https://example.com");
   // The browser navigates to "https://example.com"
   ```

   ### eo.userClient
   The `eo.userClient` collects and manages client-related data, including:
   * User Agent: The client's browser user agent string.
   * Geo Information: The client's location data (retrieved from ipinfo.io).
   * Browser Detection: Determines the browser name based on the user agent.
   
   This information is cached in localStorage to avoid redundant API calls.
   
   #### Example Usage
   ```javascript
   console.log(eo.userClient.userAgent); // e.g., "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
   console.log(eo.userClient.geo); // e.g., { country: "US", city: "New York", ... }
   console.log(eo.userClient.browser); // e.g., "Google Chrome"
   ```

   #### Properties
   `eo.userClient` **Object**
   | Property | Type | Description |
   | --- | --- | --- |
   | `userAgent` | `string` | The browser's user agent string. |
   | `geo` | `Object` | null |
   | `browser` | `string` | string |

   #### Implementation Details
   **Fetching Geolocation Data**
   * If geolocation data isn't stored, userClient calls https://ipinfo.io/json to retrieve location details.
   * The response is cached in localStorage for future use.

   **Browser Detection**
   * Uses navigator.userAgent to determine the browser name.
   * Compares the user agent string against common browser signatures.

   #### Error Handling
   * Geo Fetch Failure: Logs an error (Error getting geo info:).
   * Unknown Browser: Defaults to "Unknown Browser" if no match is found.

   ### eo.listener
   `eo.listener` is a modular utility for subscribing to server-sent messages in real time. It supports WebSocket, Server-Sent Events (SSE), or custom dispatch systems, allowing your frontend to react to backend events without polling.

   **Features**
   * Persistent connection to server via WebSocket or SSE
   * Automatic message parsing and dispatch
   * Customizable onMessage and onError hooks
   * Lightweight and framework-agnostic

   #### Example Usage
   ```javascript
   eo.listener.create('wss://your-server.com/ws', {
      onMessage: (data) => {
         console.log('Received:', data);
         eo.toast(data.message, { type: 'info' });
      },
      onError: (err) => console.warn('Listener error:', err)
   });
   ```
   
   #### Methods
   1. eo.listener.create(url, options)
   ```javascript
   eo.listener.create(url, {
      onMessage: (data) => {},
      onError: (error) => {}
   });
   ```
   2. eo.listener.send(data) - Send message to server
   3. eo.listener.close() - Close connection

   ### eo._CSRFToken
   `eo._CSRFToken` Automatically retrieves the CSRF token from the meta tags.
   
   **Features**
   * **Automatic CSRF Token Retrieval:** Automatically retrieves the CSRF token from the meta tags.
   * **Error Logging:** Logs an error to the console if the CSRF token is not found.

   #### Setup
   Ensure the CSRF token is generated and validated on the server side:

   **Server-Side: Generating and Validating CSRF Token**
   1. **Generate CSRF Token:**
      * Generate a CSRF token on the server side and include it in the meta tags of your HTML document.
      * Example in PHP:
      ```php
      session_start();
      if (empty($_SESSION['csrf_token'])) {
         $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
      }
      $csrf_token = $_SESSION['csrf_token'];
      ?>
      <meta name="csrf-token" content="<?= $csrf_token ?>">
      ```
   2. **Validate CSRF Token:**
      * Validate the CSRF token on the server side when processing form submissions or AJAX requests.
      * Example in PHP:
      ```php
      session_start();
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
         $csrf_token = $_POST['csrf_token'] ?? '';
         if (!hash_equals($_SESSION['csrf_token'], $csrf_token)) {
            die('Invalid CSRF token');
         }
         // Proceed with processing the request
      }
      ```

   #### Returns
   * `string` The CSRF token if found.
   * `undefined` If the CSRF token is not found, logs an error message to the console.

   #### Example Usage
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
      if (CSRFToken) {
         console.log('CSRF Token:', CSRFToken);
         // You can use CSRFToken in your AJAX requests or forms
      } else {
         console.error('CSRF Token is missing!');
      }
   });
   ```

   ## Random Data Generation
   ### eo.getRandomChar
   `eo.getRandomChar(length)` generates a random hexadecimal string of the specified length using the Web Crypto API for cryptographic security.

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `length` | `Number` | The desired length of the output string. |
   
   #### Returns
   `String` A random hexadecimal string of the given length.
   
   #### Example Usage
   ```javascript
   console.log(eo.getRandomChar(10)); 
   // Output: "f3a9c2b4d1" (random each time)
   ```

   ### eo.getRandomNum
   `eo.getRandomNum(start, end)` generates a random integer between start and end (inclusive).
   
   #### Parameters
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `start` | `Number` | Required | The minimum value (inclusive). |
   | `end` | `Number` | Required | The maximum value (inclusive). |

   #### Returns
   `Number` A random integer between start and end (both inclusive).

   #### Example Usage
   ```javascript
   console.log(eo.getRandomNum(1, 10)); 
   // Output: Random number between 1 and 10
   ```

   ## Form Handling and Validation
   ### eo.validator
   The `eo.validator` is a lightweight data validation utility that checks objects against predefined rules. It supports nested properties using dot notation and provides customizable validation rules and error messages.

   **Features**
   * Validates objects based on predefined constraints.
   * Supports nested properties using dot notation.
   * Customizable validation rules.
   * Customizable error messages.
   * Supports asynchronous evaluation
   * Supports inline error rendering for form fields

   #### Usage Example
   ```javascript
   const rules = {
     name: { 
      required: {
         required: true,
         format: { message: "Name is required" }
      }, 
      length: { min: 3, max: 50 } },
     email: { required: true, email: true },
     age: { number: { min: 18, max: 99 } },
     "address.street": { required: true }, 
     "address.city": { required: true }, 
   };
   
   eo.validator.setConstraints(rules);
   
   const data = {
     name: "John",
     email: "invalid-email",
     age: 17,
     address: { street: "123 Main St" }
   };
   
   if (!eo.validator.validate(data)) {
     console.log(eo.validator.getErrors()); 
     // Output: [ "Email is not a valid email address.", "Age must be a number greater than 18.", "Address City is required." ]
   }
   ```

   #### Methods
   1. `validate(data, rules)`
      Validates the given data object against rules and collects errors.

      **Parameters:**
      * `data` (Object) – The object to validate.
      * `rules` (Object, optional) – The validation rules. If omitted, previously set constraints are used.

      **Returns:**
      * `true` if validation passes.
      * `false` if validation fails (errors can be retrieved using getErrors()).

      **Example:**
      ```javascript
      const isValid = eo.validator.validate({ name: "Alice" });
      console.log(isValid); // true or false
      ```

   2. `getErrors()`
      Retrieves an array of validation errors from the last `validate()` call.

      **Returns:**
      * `Array<String>` – A list of human-readable error messages.

      **Example:**
      ```javascript
      console.log(eo.validator.getErrors());
      // Output: [ "Email is not a valid email address." ]
      ```

   3. `setConstraints(rules)`
      Sets default validation rules to be used for all future validations.

      **Parameters:**
      * `rules (Object)` – The validation rules object.
      
      **Example:**
      ```javascript
      eo.validator.setConstraints({ username: { required: true } });
      ```

   4. `resetConstraints()`
      Clears all previously set validation rules.

      **Example:**
      ```javascript
      eo.validator.resetConstraints();
      ```

   5. `registerRule(name, fn)`
      Define custom validation logic.

      **Example:**
      ```javascript
      eo.validator.registerRule(name, fn);
      ```

   6. `unregisterRule(name)`
      Remove custom validation logic.

      **Example:**
      ```javascript
      eo.validator.unregisterRule(name);
      ```

   #### Validation Rules
   The validator supports various rules that can be applied to fields.

   | Rule | Parameter Type | Description |
   | --- | --- | --- |
   | `required` | `Boolean` | Ensures a value is present (not `null`, `undefined`, or empty). |
   | `length` | `{ min, max }` | Enforces string length constraints. |
   | `number` | `{ min, max }` | Ensures a value is a number and optionally within a range. |
   | `url` | `Boolean` / `Array` `{ format }` | Ensures a valid URL format (http:// or https://). |
   | `email` | `Boolean` / `Array` `{ format }` | Ensures a valid email format. |
   | `date` | `Boolean` / `Array` `{ format }` | Ensures a valid date format (`YYYY-MM-DD`). |
   | `datetime` | `Boolean` / `Array` `{ format }` | Ensures a valid datetime format. |
   | `equality` | `Any` | Ensures the value matches the given parameter exactly. |
   | `type` | `String` | Ensures the value is of the specified JavaScript type (`string`, `number`, etc.). |

   **Rules Parameter**
   `format` parameter can be added to `url`, `email`, `date` and `datetime` rules.
   | Rule | Parameter Type | Possible Value | Description |
   | --- | --- | --- | --- |
   | `format` | `Array` | `{ pattern: regex, message: string }` | |

   **format Parameters**
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `pattern` | `Regex` | regex value e.g. `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
   | `message` | `String` | The error message when the validation fails, will replace the original error message |

   **Example Rule Definition:**
   ```javascript
   const rules = {
     name: { required: true, length: { min: 3, max: 50 } },
     email: { required: true, email: true },
     age: { number: { min: 18, max: 99 } },
     brithdate: { date: true },
     address: { 
       street: { required: true }, 
       city: { required: true }
     }
   };
   ```

   **Custom Error Messages**
   Custom error messages can be defined in the rules. If a custom message is provided, it will be used instead of the default error message.

   **Example Usage with Custom Messages**
   ```javascript
   const rules = {
    first_name: {
      required: true,
      length: { min: 2, max: 50 },
    },
    email: {
      required: true,
      email: {
         format: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'must be a valid email format.'
         }
      }
    }
   };
   ```

   **Equality Rule Example**
   The equality rule should use the value of the compared field and the key must be the comparing field.

   In this validation rule structure, the `equality` rule uses the `confirm_password` field as the key, indicating the field to be compared. The value associated with this key (`data.password`) represents the value of the password field, which the `confirm_password` field must match.
   ```javascript
   const data = {
      password: 'myPasswordThatNeverFails',
      confirm_password: 'myPasswordThatNeverFails'
   };

   const rules = {
      password: {
		required: true,
		equality: {
			confirm_password: data.password
		}
      }
   };
   ```

   ### eo.submitForm
   The `eo.submitForm` simplifies handling form submissions, including validation, AJAX posting, and success/error handling. It integrates with the `eo.validator` for form validation
   
   **Features**
   * Validates form data using the `eo.validator` before submission.
   * Submits form data via AJAX (`post` function).
   * Displays alerts using the `eo.alert`.
   * Handles success and error responses.
   * Disables & enables buttons during the request to prevent multiple submissions.
   * Redirects users upon success if `redirectUrl` is provided.

   **Default**
   * Uses modal.alert by default
   * Support inline validation error for form fields
    - must have id and name attributes and should be same value
    - if the name attributes is array e.g. name[firstname] the id value must be firstname.
   
   **This method used the following:**
   * [`eo.validator`](#eovalidator)
   * [`eo.post`](#eopost)
   * [`eo.alert`](#eoalert)
   * [`eo.button`](#eobutton)
   * csrf-token in meta tag  (optional) [Please read CSRFToken](#eocsrftoken)
      ```html
      <meta name="csrf-token" content="{{ csrf_token() }}">
      ```
   
   #### Syntax
   ```javascript
   eo.submitForm(formId, { rules, callback, onBeforeSend, redirectUrl } = {})
   ```
   
   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `formId` | `string` | The ID of the form to submit (with or without `#`). |
   | `options` | `object` | Configuration options for the `eo.submitForm`. |

   **Options**
   | Options | Type | Description |
   | --- | --- | --- |
   | `rules` | `object` | The validation rules based on the [`eo.validator`](#eovalidator). |
   | `callback` | `function` | A callback function executed on a successful submission. |
   | `onBeforeSend` | `function` | A function executed before sending the form data. |
   | `redirect` | `url` | The url to redirect to on success |
   
   #### Example Usage
   ```javascript
   eo.submitForm('#myForm', {
      rules: {
          name: { required: true, min: 3 },
          email: { required: true, email: true },
      },
      callback: (formData, response) => {
          console.log('Form submitted successfully:', response);
      },
      onBeforeSend: (formData) => {
          console.log('Processing form data:', formData);
      },
      redirectUrl: '/dashboard'
   });
   ```

   ## Cookie Management
   ### eo.setCookie
   `eo.setCookie` Sets a cookie with a specified key, value, and expiration date in days.
   
   **Features**
   * **Easy Cookie Management**: Allows setting cookies with a specified key, value, and expiration date.
   * **Customizable Expiration**: Supports setting cookie expiration in days.
   * **Universal Path**: Sets the cookie's path to the root ("/") for universal accessibility across the entire site.

   #### Parameters:
   | Parameters | Type | Description |
   | --- | --- | --- |
   | `key` | `string` | The name of the cookie to be set. |
   | `value` | `string` | The value to be stored in the cookie. |
   | `days` | `number` | The number of days until the cookie expires. |

   #### Returns
   `void` This function does not return anything.

   #### Example Usage
   ```javascript
   eo.setCookie('username', 'JohnDoe', 7); // Sets a cookie "username" with value "JohnDoe" that expires in 7 days
   eo.setCookie('sessionToken', 'abc123', 1); // Sets a cookie "sessionToken" with value "abc123" that expires in 1 day
   ```

   ### eo.getCookie
   `eo.getCookie(key)` Retrieves the value of a specified cookie by its key.

   **Features**
   * **Easy Cookie Retrieval:** Allows retrieving the value of a specified cookie by its key.
   * **Trim and Find:** Efficiently trims and searches through cookies to find the desired key.
   * **Default Value:** Returns an empty string if the cookie is not found.
   
   #### Parameters
   | Parameters | Type | Description |
   | --- | --- | --- |
   | key | string | The name of the cookie to retrieve. |

   #### Returns
   `string` The value of the cookie if found, otherwise an empty string.

   #### Example Usage
   ```javascript
   const username = eo.getCookie('username'); // Retrieves the value of the "username" cookie
   console.log('Username:', username);

   const sessionToken = eo.getCookie('sessionToken'); // Retrieves the value of the "sessionToken" cookie
   console.log('Session Token:', sessionToken);
   ```

   ## UI Components
   ### eo.modal
   The `eo.modal` provides an easy way to create and manage Bootstrap modals dynamically. It supports custom modal sizes, dynamic content injection, and automatic cleanup of destroyable modals.

   **Features**
   * Dynamically create modals with custom sizes.
   * Inject content into the modal using a callback function.
   * Support for modals with status indicators.
   * Automatic destruction of modals when closed (if enabled).
   * Handles modal close events properly.

   **Notes**
   * Ensure Bootstrap is loaded for this to function properly.
   * The callback function should return a valid HTML string or a DOM element.
   * Destroyable modals are automatically removed from the DOM upon closing.
   
   #### Method
   1. `create({ id, size, callback, status = false, destroyable = true })`

   Creates and displays a Bootstrap modal.

   **Parameters**
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `id` | `String` | *required* | The unique ID of the modal. |
   | `size` | `String` | *required* | Modal size (`xs`, `sm`, `md`, `lg`, `xl`, `fullscreen`). |
   | `callback` | `Function` | *optional* | A function returning the modal content (HTML string or DOM element). |
   | `status` | `Boolean` | *optional*, `default: false` | If true, adds a status indicator inside the modal. |
   | `destroyable` | `Boolean` | *optional*, `default: true` | If true, the modal will be removed from the DOM after closing. |

   **Example Usage**
   ```javascript
   eo.modal.create({
     id: 'exampleModal',
     size: 'md',
     callback: () => '<p>This is a dynamic modal!</p>',
     status: 'success',
     destroyable: true
   });
   ```

   #### modal.alert
   Creates and displays a Bootstrap modal.
   **Parameters**
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `message` | `String` | *required* | The alert message. |

   1. `success(message)`
   2. `error(message)`
   3. `message(message)`

   **Example Usage**
   ```javascript
   eo.modal.alert.success("Successfully updated!");
   ```

   ### eo.alert
   To use the `eo.alert`, ensure the necessary HTML structure includes a container for displaying alerts.

   #### Required HTML Structure
   ```html
   <div class="response"></div>
   ```
   This will act as the default container for displaying alerts and loaders.

   #### Methods
   1. `success(message, element) and error(message, element)`

      Displays a success alert.
      | Parameter | Type | Default | Description |
      | --- | --- | --- | --- |
      | `message` | `String` | *required* | The success message. |
      | `element` | `String` | *optional*, `default: '.response'` | The container where the alert will be displayed. |

      **Example Usage**
      ```javascript
      eo.alert.success('Operation completed successfully!');
      eo.alert.error('An error occurred while processing your request.');
      ```

   2. `loader(message, element)`

      Displays a processing loader with a message.
      | Parameter | Type | Default | Description |
      | --- | --- | --- | --- |
      | `message` | `String` | *optional*, `default: 'Processing, Please wait...'` | The success message. |
      | `element` | `String` | *optional*, `default: '.response'` | The container where the alert will be displayed. |

      **Example Usage**
      ```javascript
      eo.alert.loader();
      eo.alert.loader('Uploading file, please wait...');
      ```

   ### eo.button
   The `eo.button` provides utility functions to enable or disable buttons (or any clickable elements) dynamically. It ensures a smooth user experience by preventing interactions when necessary (e.g., during form submission or loading states).

   #### Methods
   1. `disable(selector = '.btn')`

      Disables all buttons (or specified elements) by:
      * Changing the cursor to "wait".
      * Disabling pointer events.
      * Reducing opacity to indicate inactivity.
      * Disabling the button element.

      **Parameters**
      | Parameter | Type | Default | Description |
      | --- | --- | --- | --- |
      | `selector` | `String` | *optional* `defaults: '.btn'` | The CSS selector of the elements to disable.|
      **Example Usage**
      ```javascript
      eo.button.disable(); // Disables all buttons with class '.btn'
      eo.button.disable('.custom-button'); // Disables elements with class '.custom-button'
      ```
      
   2. `enable(selector = '.btn')`

      Re-enables previously disabled buttons (or elements) by:
      * Resetting the cursor to default.
      * Restoring pointer events.
      * Restoring opacity.
      * Enabling the button element.

      **Parameters**
      | Parameter | Type | Default | Description |
      | --- | --- | --- | --- |
      | `selector` | `String` | *optional* `defaults: '.btn'` | The CSS selector of the elements to enable.|

      **Example Usage**
      ```javascript
      eo.button.enable(); // Enables all buttons with class '.btn'
      eo.button.enable('.custom-button'); // Enables elements with class '.custom-button'
      ```

   ### eo.uploader
   The `eo.uploader` provides an easy-to-use interface for uploading images and documents with preview functionality. It supports both single and multiple file uploads, customizable options, and callback hooks for different stages of the upload process.
   
   **Features**
   * Supports image and document uploads.
   * Provides preview functionality for uploaded files.
   * Supports single and multiple file uploads.
   * Customizable options for upload type, file acceptance, and event callbacks.
   * Automatically handles UI creation and event binding.
   * Sequential upload 
   * File removal support
   * Supports image compression since version 2.0.0

   **Note**  
   You can use a csrf-token in meta tag. please read [`eo.CSRFToken`](#eocsrftoken)
   once implemented it will automatically added in FormData.
   ```html
   <meta name="csrf-token" content="{{ csrf_token() }}">
   ```
   
   #### Setup
   **Required HTML Structure:**
   Container for the response.
   ```html
   <div class="response"></div>
   ```

   Container for the upload button.
   ```html
   <div class="upload-container"></div>
   ```

   Initializes the uploader with specified configuration and attaches necessary event listeners.
   ```javascript
   eo.uploader.create('.upload-container', '/upload-url', {
      inputName: 'eoFileUpload',
      previewSelector: '.uploaded-photo',
      multiple: true,
      onBeforeSend: () => { console.log('Before sending the request'); },
      onSuccess: (response, files) => {
          console.log('Upload successful!', response, files);
          // Manipulate hidden input value, e.g., add a URL property
          file.url = response.url; // Assuming response contains URLs for each file
      },
      onError: (error) => { console.error('Upload failed!', error); },
      compressFile: true,
      compression: { maxWidth: 1024, maxHeight: 1024, quality: 0.7 }
   });
   ```

   #### Parameters
   | Parameters | Type | Default | Description |
   | --- | --- | --- | --- |
   | `uploadSelector` | `String` | `required` | CSS selector for the upload container. |
   | `url` | `String` | `required` | The endpoint URL where the files will be uploaded. |
   | `options` | `Object` | `optional` | Configuration options for the uploader. |

   **Options**
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `inputName` | `String` | `eoFileUpload` | The input name. |
   | `previewSelector` | `String` | `.uploaded-photo` | CSS selector for the preview container. |
   | `disablePreview` | `Boolean` | `false` | Whether to disable the preview functionality. |
   | `uploadType` | `String` | `image` | Type of upload (`image` or `document`). |
   | `accept` | `String` | `image/*` for images and `application/pdf` for documents | File types to accept. |
   | `multiple` | `Boolean` | `true` | Whether to allow multiple file uploads. |
   | `onBeforeSend` | `Function` | `optional` | Callback function before the upload request is sent. |
   | `onSuccess` | `Function` | `optional` | Callback function on successful upload. |
   | `onError` | `Function` | `optional` | Callback function on upload error. |
   | `onFileRemove` | `Function` | `optional` | Callback function when file was removed. |
   | `compressFile` | `Boolean` | `false` | Weather to allow the compression of image, Pdf's or other files not touch |
   | `compression` | `Object` | `{ maxWidth: 1024, maxHeight: 1024, quality: 0.7 }` | If compressFile is true, the compression default value will be used, you can customize the option |
   
   **onSuccess Example:**
   Executed when the upload is successful.
   ```javascript
   onSuccess: (response, files) => {
       // Manipulate hidden input value
      file.url = response.url; // Assuming response contains URLs for each file
   }
   ```

   **onBeforeSend Example**
   Triggered before the file upload starts. Returning false cancels the upload.
   ```javascript
   onBeforeSend: () => {
      console.log('Preparing file for upload');
      return true;
   }
   ```

   **onError Example**
   Executed when the upload fails.
   ```javascript
   onError: (error) => {
      console.error('Upload failed:', error);
   }
   ```

   **onFileRemove Example**
   Executed when a file is removed.
   ```javascript
   onFileRemove: (removeBtn) => {
      const filename = btn.getAttribute('data-name');
      console.log(`File ${filename} removed`);
   }
   ```

   1. `onSuccess` **Callback**: This function is called when the upload is successful.
   2. **Updating File Properties**
      * Inside the loop, a new property `url` is added to each file object.
      * The `url` property is assigned a value (e.g., `'https://your-assigned-url-from-server-response.com'`).
      * This URL can be dynamically assigned based on your requirements.
  
   **Hidden Input Creation**
   The uploader module automatically creates hidden inputs for each file property (`name`, `size`, `type`, `lastModified`, etc.).
   
   **Image-Specific Properties**
   If the upload type is `image`, the module also creates hidden inputs for the image's `width` and `height`.
   By using the onSuccess callback, you can dynamically manipulate the files array and update properties based on your requirements. This ensures that you have full control over the file objects after a successful upload.
  
   **disablePreview**
   if disablePreview is true, then the `eo.uploader` won't create the upload preview where the hidden input will be added. To create your own upload preview use the onSuccess callback to manipulate the DOM.
   
   #### Comprehensive Guide
   **First Scenario**  
   In this scenario, you upload an image, process it, move it to a temporary folder, and return the image data in JSON format. Upon a    successful response, hidden input fields are dynamically created based on the server’s response. Finally, submit your form to save the    image data to the database.

   1. **Create a `<form>` Tag**:
      ```html
      <form id="uploadForm" action="/submit-form-url" method="post">
          <div class="response"></div>
          <div class="upload-container"></div>
          <button type="submit">Submit</button>
      </form>
      ```

   2. **Initialize the Uploader:**
      ```javascript
      eo.uploader.create('.upload-container', '/upload-file-url', {
         inputName: 'eoFileUpload',
         multiple: true,
         onBeforeSend: () => { console.log('Before sending the request'); },
         onSuccess: (response, files) => {
             files.forEach((file, index) => {
                 // Manipulate hidden input value
                file.url = response[index].url; // Assuming response contains URLs for each file
             });
			 return files;
         },
         onError: (error) => { console.error('Upload failed!', error); },
         onFileRemove: function (btn) {
				const filename = btn.getAttribute('data-name');
				const container = document.querySelector(btn.getAttribute('data-container'));
				const url = `${DOMAIN}/images/${filename}/delete`;
				
            // find if an error has occured
            // the p element is the container of the error message
				if (!container.querySelector('p')) { 
					eo.post(url, {
						filename: filename,
						'csrf_token': eo.CSRFToken
					}, {
						onSuccess: function (response) {
							console.log(response);
							eo.alert.success(response.message);
						}
					});
				}
			}
      });
      ```
   3. **Uploader Creates a Form:** The uploader will create a form inside the `<body>` tag and handle file selection and submission.

   4. **Access the File on the Server Side:**
      ```php
      // upload.php
      header('Content-Type: application/json; charset=utf-8');
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
         // if multiple file upload was used, the $_FILES array has a different structure,
         // so you need first to re-structure it so it can be looped through
         $files = array(); 
         foreach ($_FILES['eoFileUpload'] as $k => $l) {
            foreach ($l as $i => $v) {
               if (!array_key_exists($i, $files)) $files[$i] = array();
               $files[$i][$k] = $v;
            }
         }
         foreach ($files as $key => $file) {
            // Move file to the desired folder
            $file_data['name'] = basename($file[$key]['name']);
            $file_data['url'] = "https://your-domain.com/images/" . $file_data['name'];
            move_uploaded_file($file[$key]['tmp_name'], '/temporary/' . $file_data['name']);
         }
         echo json_encode($file_data);
         /**
          * for single upload
          * Example: move_uploaded_file($_FILES['eoFileUpload']['tmp_name'], '/temporary/' . $file_data['name']);
         */
      }
      ```

   5. **Manipulate Hidden Input Values Based on Response:**
      ```javascript
      onSuccess: (response, files) => {
         console.log('Upload successful!', response, files);
         // Access and manipulate the hidden input values based on the response
         // Example: add URL property
         file.url = response.url; // Assuming response contains URLs for each file
         // Example: update NAME property
         file.name = response.name; // Assuming response contains Name for each file
         file.lastModifiedDate = eo.epochToTimeString((file.lastModified / 1000)); // Assuming response contains Name for each file
      }
      ```

      Created hidden input after successful upload.
      ```html
      <input type="hidden" name="upload[4CN44n6AAtK][name]" value="example.jpg">
      <input type="hidden" name="upload[4CN44n6AAtK][size]" value="102400">
      <input type="hidden" name="upload[4CN44n6AAtK][type]" value="image/jpeg">
      <input type="hidden" name="upload[4CN44n6AAtK][lastModified]" value="1633024800000">
      <input type="hidden" name="upload[4CN44n6AAtK][width]" value="800">
      <input type="hidden" name="upload[4CN44n6AAtK][height]" value="600">
      <input type="hidden" name="upload[4CN44n6AAtK][url]" value="https://your-assigned-url-from-server-response.com">
      <input type="hidden" name="upload[4CN44n6AAtK][lastModifiedDate]" value="Friday, October 1, 2021 2:00:00 AM">
      ```

   6. **Submit Your Form**

   7. **Access the Hidden Input on the Server Side:**
      After submitting the form, the hidden inputs created by the uploader module can be accessed on the server side using `$_POST['upload']`.
      ```php
      // save_image_data.php
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
          // Loop through each uploaded file's information
          foreach ($_POST['upload'] as $file_id => $file_info) {
              $name = $file_info['name'];
              $size = $file_info['size'];
              $type = $file_info['type'];
              $lastModified = $file_info['lastModified'];
              $width = isset($file_info['width']) ? $file_info['width'] : null;
              $height = isset($file_info['height']) ? $file_info['height'] : null;

              // Process the file information as needed
              echo "File ID: $file_id\n";
              echo "Name: $name\n";
              echo "Size: $size bytes\n";
              echo "Type: $type\n";
              echo "Last Modified: " . date('Y-m-d H:i:s', $lastModified / 1000) . "\n";
              echo "Width: $width px\n";
              echo "Height: $height px\n";
          }
      }
      ```

   **Second Scenario**  
   In this scenario, you upload an image, process its data, move the image to a directory, and save it in the database.
   1. **Include Required HTML Tags:**
      ```html
      <div class="response"></div>
      <div class="upload-container"></div>
      ```

   2. **Initialize the Uploader:**
      ```javascript
      eo.uploader.create('.upload-container', '/upload-file-url', {
         inputName: 'eoFileUpload', // give the input file a name
         multiple: true,
         onBeforeSend: () => { console.log('Before sending the request'); },
         onError: (error) => { console.error('Upload failed!', error); }
      });
      ```

   3. **Uploader Creates a Form:** The uploader will create a form inside the `<body>` tag and handle file selection and submission.

   4. **Access the File on the Server Side:**
      ```php
      // upload.php
      if ($_SERVER['REQUEST_METHOD'] === 'POST') {
         // if multiple file upload was used, the $_FILES array has a different structure,
         // so you need first to re-structure it so it can be looped through
         $files = array(); 
         foreach ($_FILES['eoFileUpload'] as $k => $l) {
            foreach ($l as $i => $v) {
               if (!array_key_exists($i, $files)) $files[$i] = array();
               $files[$i][$k] = $v;
            }
         }
         foreach ($files as $key => $file) {
            // Move file to the desired folder and save in the Database
            $file_data['name'] = basename($file[$key]['name']);
            $file_data['url'] = "https://your-domain.com/images/" . $file_data['name'];
            $file_data['size'] = $file[$key]['size'];
            move_uploaded_file($file[$key]['tmp_name'], '/upload/' . $file_data['name']);
            // INSERT into Database 
         }
         /**
          * for single upload
          * Example: move_uploaded_file($_FILES['eoFileUpload']['tmp_name'], '/upload/' . $file_data['name']);
         */
      }
      ```

   ### eo.compressImage
   `eo.compressImage(file, options)` is a lightweight utility for compressing image files before upload. It helps reduce bandwidth usage, improve upload speed, and optimize storage — all without requiring server-side processing.
   * it was implemented in eo.uploader for automatic optimization

   **Features**
   * Compresses JPEG, PNG, and WebP formats
   * Adjustable quality and max dimensions
   * Preserves EXIF metadata (optional)
   * Returns a Blob or File ready for upload

   #### Example Usage
   ```javascript
   const inputFile = document.querySelector('#image').files[0];

   eo.compressImage(inputFile, {
      maxWidth: 1024,
      maxHeight: 768,
      quality: 0.7
   }).then(compressed => {
      console.log('Compressed size:', compressed.size);
      uploader.send(compressed);
   });
   ```

   #### Method
   ```javascript
   eo.compressImage(file, {
      maxWidth?: number,
      maxHeight?: number,
      quality?: number,         // 0.0 to 1.0
      outputType?: 'blob' | 'file',
      preserveExif?: boolean
   }) => Promise<Blob | File>
   ```

   ### eo.video
   The Video Component is for managing YouTube videos within a web interface. It provides functionalities to:
   * Add a YouTube video by URL.
   * Play the video in a modal.
   * Remove added videos.
   * Create a hidden input dynamically.
      * `id`, `url`, `embed`, `thumbnail`, and `created_at`

   #### Parameters
   | Parameters | Type | Description |
   | --- | --- | --- |
   | `onBeforeSend` | `Function` | Callback function executed before processing the URL. It can return `false` to stop the process or a `Promise` that resolves to `true` (to proceed) or `false` (to stop).  |
   | `onSuccess` | `Function` | `Callback function` executed when the video is added successfully. |
   | `onPlayback` | `Function` | `Callback function` executed after the video displayed |
   | `onRemove` | `Function` | `Callback function` executed after the video remove |

   #### Usage
   Call `eo.video.init()` before the page loads.
   ```javascript
   window.addEventListener('load', () => {
      eo.video.init({
         onBeforeSend: (data) => console.log(data),
         onSuccess: (data) => console.log(data),
         onPlayback: (data) => console.log(data),
         onRemove: (id) => console.log(id)
      });
   });
   ```

   #### Required HTML Structure
   To integrate the video module, add the following HTML elements:
   ```html
   <div class="response"></div>
   <div id="videoInput"></div>
   <div class="video-list-container"></div>
   ```

   * ##### Description
      * **.response** - Displays messages after adding a video.
      * **#videoInput** - The container where the input field and add button will be appended.
      * **.video-list-container** - The section where added videos will be listed.
      * Clicking on an added video will play it in a fullscreen modal.
      * A delete button is provided to remove a video entry.

   ### eo.mortgageCalculator
   The `eo.mortgageCalculator` provides functionalities to calculate monthly mortgage payments, create selection elements for down payment    interest rates, and loan years, and display the results. It is designed to be embedded into a mortgage calculator form on a web page.
   
   **Notes**
   * Ensure that the form elements (#sellingPrice, #dpSelection, #interestSelection, #yearSelection, and #result) exist in your HTML.
   * The script should be included and initialized correctly to work as expected.
   * Customize the form and style as needed to fit your design.
      
   #### Required Setup
   Ensure to call the `eo.mortgageCalculator.init()` method to create the necessary selection elements and calculate the initial mortgage payment.
   **JavaScript**
   ```javascript
   window.addEventListener('load', () => {
       eo.mortgageCalculator.init();
   });
   ```
   **Html**
   ```html
   <div class="mortgage-calculator-form">
       <input type="text" id="sellingPrice" placeholder="Enter Selling Price"> /* you can change the type to hidden */
       <div id="dpSelection"></div>
       <div id="interestSelection"></div>
       <div id="yearSelection"></div>
       <div id="result"></div>
   </div>
   ```

   ## Third-Party Integrations
   ### eo.tinymce
   The TinyMCE Module provides an easy way to initialize and configure TinyMCE, a popular WYSIWYG editor, on a specified container. It ensures the script is included and allows overriding default settings.
   
   **Features**
   * **Initialize TinyMCE** on a specified `<textarea>` element.
   * **Merge default options** with custom options for flexibility.
   * **Ensure TinyMCE is removed before initialization** to prevent duplicates.
   
   #### Required Setup
   Ensure that the TinyMCE script is included in your project. If missing, an error will be thrown.
   ```html
   <script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js"></script>
   ```
   > for more information about TinyMCE, please visit their [website](https://www.tiny.cloud/docs/tinymce/latest/)
      
   #### Method
   1. `init(containerId, options)`
   Initializes TinyMCE on the specified textarea.

   **Parameters**
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `containerId` | `string` | The ID or class selector of the textarea (e.g., `#editor`). |
   | `options` | `object` | (Optional) Custom TinyMCE configuration options. |

   **Default Options**
   The module applies the following default configuration:
   ```javascript
   {
       selector: `textarea${containerId}`,
       height: 500,
       menubar: false,
       plugins: ['advlist lists link anchor', 'media table paste code'],
       content_css: [
           'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i's
       ]
   }
   ```

   If you need to customize the options, pass an object to override specific settings.
   
   #### Example Usage
   **Basic Initialization**
   ```javascript
   eo.tinyMCE.init('#editor');
   ```

   **Custom Configuration**
   ```javascript
   eo.tinyMCE.init('#editor', {
      height: 300,
      plugins: ['lists', 'table', 'code'],
      toolbar: 'bold italic | alignleft aligncenter alignright'
   });
   ```

   ### eo.googleChart
   This `eo.googleChart` simplifies the integration of Google Charts by providing methods for various chart types.
   
   * Charts are now grouped under: eo.googleChart.material and eo.googleChart.classic, Legacy access (e.g., eo.googleChart.line) is preserved via dynamic proxy redirection.

   **Supported Groups**
   * eo.googleChart.material
      - line
      - bar
   * eo.googleChart.classic
      - line
      - pie
      - bar
      - combo
      - calendar
      - geo
      - map
      - trendLine (new in version 2.0.0)

   #### Required Setup
   Ensure you have included the Google Charts script in your HTML:
   ```html
   <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
   ```
   * **Documentation**
      For DataTable and Chart Configuration please read [Google Chart Documentation](https://developers.google.com/chart/interactive/docs/quick_start)
   
   #### Common Parameters
   All chart functions accept the following parameters:
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `containerId` | `string` | The ID of the HTML element where the chart will be rendered. |
   | `data` | `function(DataTable)` | A function that returns a populated `google.visualization.DataTable` object. |
   | `options` | `object` | (Optional) Chart-specific configuration options. |
   | `apiKey` | `string` | (Optional, required for Geo and Map charts) Google API key for maps/geolocation features. |
   
   #### Available Methods
   1. `bar(params)`
      Renders a bar chart.

      **Example Usage**
      ```javascript
      eo.googleChart.bar({
          containerId: 'barChart',
          data: (dataTable) => {
              dataTable.addColumn('string', 'Year');
              dataTable.addColumn('number', 'Sales');
              dataTable.addRows([ ['2020', 1000], ['2021', 1500] ]);
              return dataTable;
          },
          options: { title: 'Annual Sales' }
      });
      ```
      
   2. `calendar(params)`
      Renders a calendar heatmap chart.

      **Example Usage**
      ```javascript
      eo.googleChart.calendar({
          containerId: 'calendarChart',
          data: (dataTable) => {
              dataTable.addColumn({ type: 'date', id: 'Date' });
              dataTable.addColumn({ type: 'number', id: 'Sales' });
              dataTable.addRows([ [new Date(2024, 0, 1), 100], [new Date(2024, 1, 14), 200] ]);
              return dataTable;
          }
      });
      ```
      
   3. `geo(params)`
      Renders a geographical map chart.
      > ⚠️ **Requires an API key for** `displayMode: 'markers'`.
      
      **Example Usage**
      ```javascript
      eo.googleChart.geo({
         containerId: 'geoChart',
         data: (dataTable) => {
            dataTable.addColumn('string', 'Country');
            dataTable.addColumn('number', 'Population');
            dataTable.addRows([ ['Germany', 83000000], ['France', 67000000] ]);
            return dataTable;
         },
         options: { displayMode: 'markers' },
         apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
      });
      ```
      
   4. `pie(params)`
      Renders a pie chart.

      **Example Usage**
      ```javascript
      eo.googleChart.pie({
          containerId: 'pieChart',
          data: (dataTable) => {
              dataTable.addColumn('string', 'Category');
              dataTable.addColumn('number', 'Value');
              dataTable.addRows([ ['Electronics', 40], ['Clothing', 25], ['Groceries', 35] ]);
              return dataTable;
          },
          options: { title: 'Sales Breakdown' }
      });
      ```
      
   5. `line(params)`
      Renders a line chart.

      **Example Usage**
      ```javascript
      eo.googleChart.line({
          containerId: 'lineChart',
          data: (dataTable) => {
              dataTable.addColumn('string', 'Month');
              dataTable.addColumn('number', 'Revenue');
              dataTable.addRows([ ['Jan', 5000], ['Feb', 7000], ['Mar', 6000] ]);
              return dataTable;
          },
          options: { title: 'Monthly Revenue' }
      });
      ```
      
   6. `map(params)`
      Renders a Google Maps visualization.
      > ⚠️ **Requires an API key.**
      **Example Usage**
      ```javascript
      eo.googleChart.map({
          containerId: 'mapChart',
          data: (dataTable) => {
              dataTable.addColumn('number', 'Lat');
              dataTable.addColumn('number', 'Lng');
              dataTable.addColumn('string', 'Label');
              dataTable.addRows([ [37.7749, -122.4194, 'San Francisco'], [40.7128, -74.0060, 'New York'] ]);
              return dataTable;
          },
          options: { showTooltip: true, showInfoWindow: true },
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
      });
      ```
      
   7. `trendLine(params)`
      Renders a scatter plot with a trend line.s
      
      **Example Usage**
      ```javascript
      eo.googleChart.trendLine({
          containerId: 'trendChart',
          data: (dataTable) => {
              dataTable.addColumn('number', 'X');
              dataTable.addColumn('number', 'Y');
              dataTable.addRows([ [1, 2], [2, 4], [3, 6], [4, 8] ]);
              return dataTable;
          },
          options: { trendlines: { 0: {} } }
      });
      ```
   
   #### Error Handling
   * If the `containerId` is invalid, the function will return `false`.
   * If `data` is missing, an error will be thrown:
      ```javascript
      Error: Set the data in table property
      ```
   * For geo and map charts, an API key is required. If missing, an error will be thrown
      ```javascript
      Error: Maps require a mapsApiKey.
      ```

   ### eo.tomSelect
   `eo.tomSelect.init(containerId, options = {})` Initializes Tom Select on a specified container with optional settings.

   **Features**
   * **Initialization of Tom Select:** Simplifies the process of initializing Tom Select on an element.
   * **Customizable Options:** Allows for customization of options while providing sensible defaults.
   * **Custom Rendering:** Supports custom rendering of dropdown items and options.

   #### Setup
   Ensure the Tom Select script is included in your HTML head:
   ```javascript
   <script src="https://cdn.jsdelivr.net/npm/tom-select@latest/dist/js/tom-select.complete.min.js"></script>
   ```
   * **Documentation**
      For Configuration please read [TomSelect Usage Documentation](https://tom-select.js.org/docs/)

   #### Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `containerId` | `string` | The CSS selector of the container element where Tom Select will be initialized. 
   | `options` | `Object` | Optional settings to customize Tom Select. |

   **Options**
   | Options | Type | Default | Description |
   | --- | --- | --- | --- |
   | `copyClassesToDropdown` | `Boolean` | `false` | Whether to copy classes to the dropdown. |
   | `dropdownParent` | `String` | `body` | The parent element of the dropdown. |
   | `controlInput` | `String` | `<input>` | The input element used for control. |
   | `render` | `Object` | Default Rendering Function | Custom rendering functions for items and options. |

   **Default Rendering Function**
   * **`_renderOption(data, escape)`** A private function that defines how to render options in the dropdown.
   ```javascript
   eo.tomSelect.init('#mySelect', {
      // ....
      render: {
         item: _renderOption,
         option: _renderOption,
      }
   });
   ```

   #### Return
   `void` This function does not return anything.

   #### Example Usage
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
      eo.tomSelect.init('#mySelect', {
         copyClassesToDropdown: true,
         render: {
               option: (data, escape) => {
                  return `<div class="custom-option">${escape(data.text)}</div>`;
               }
         }
      });
   });
   ```

# License
MIT License

Copyright (c) [2025] [Eman Olivas]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
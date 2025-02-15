
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
      const isValid = eo.validator.validate({ name: "Alice" });
      console.log(isValid); // true or false
      ```
   * ### `getErrors()`
   
      Retrieves an array of validation errors from the last `validate()` call.  
      **Returns:**
      * `Array<String>` – A list of human-readable error messages.
      
      **Example:**
      ```javascript
      console.log(eo.validator.getErrors());
      // Output: [ "Email is not a valid email address." ]
      ```
   * ### `setConstraints(rules)`
      Sets default validation rules to be used for all future validations.
      
      **Parameters:**
      * `rules (Object)` – The validation rules object.
      
      **Example:**
      ```javascript
      eo.validator.setConstraints({ username: { required: true } });
      ```
   * ### `resetConstraints()`
   
      Clears all previously set validation rules.
      
      **Example:**
      ```javascript
      eo.validator.resetConstraints();
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
`eo.redirect(url)` navigates the browser to the specified URL by setting window.location.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `String` | The URL to which the browser should be redirected. |

* ## Returns
   `void` This function does not return anything. It redirects the user immediately.
* ## Example Usage
   ```javascript
   eo.redirect("https://example.com");
   // The browser navigates to "https://example.com"
   ```

# eo.epochToTimeString(epoch)
`eo.epochToTimeString(epoch)` converts a Unix epoch timestamp (seconds since 1970-01-01 UTC) into a human-readable date string formatted in US English.
Converts an epoch time (in seconds) to a localized string in the format: "Weekday, Month Day, Year, HH:MM AM/PM"

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `epoch` | `Number` | A **Unix timestamp** in **seconds** (not milliseconds). |

* ## Returns
   `String` A formatted date string in English (US locale).

* ## Example Usage
   ```javascript
   console.log(eo.epochToTimeString(1700000000)); 
   // Output: "Sunday, November 12, 2023, 12:26 PM"
   ```

# eo.trim(stringValue, maximumLength)
`eo.trim(stringValue, maxLength)` truncates a string if it exceeds the specified maxLength and appends "...". If the string is within the limit, it remains unchanged.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `stringValue` | `String` | The input string to be trimmed. |
   | `maxLength` | `Number` | The maximum allowed length of the string (including ... if truncated). |

* ## Returns
   `String` The original string if within maxLength, otherwise a truncated version with "..." appended.

* ## Example Usage
   ```javascript
   console.log(eo.trim("Hello, world!", 10)); 
   // Output: "Hello, w..."
   
   console.log(eo.trim("Short", 10)); 
   // Output: "Short" (unchanged)
   ```

# eo.formatFileSize(bytes, decimalPlaces = 0)
`eo.formatFileSize(bytes, decimalPlaces = 0)` converts a file size in bytes into a human-readable format (e.g., KB, MB, GB). It supports up to Yottabytes (YB) and allows formatting with a specified number of decimal places.

* ## Parameters
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `bytes` | `Number` | Required | The file size in **bytes**. |
   | `decimalPlaces` | `Number` | `0` (optional) | The **number of decimal places** for formatting. |

* ## Returns
   `String` A human-readable file size with units (e.g., "1.5 MB", "500 KB").

* ## Example Usage
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

# eo.uuidv4()
`eo.uuidv4()` generates a random UUID (Universally Unique Identifier) Version 4 in the standard format:  
`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`  
where x is a random hexadecimal digit and y is one of 8, 9, A, or B (per UUID v4 specification).

* ## Returns
   `String` A randomly generated UUID v4 in the format "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".

* ## Example Usage
   ```javascript
   console.log(eo.uuidv4()); 
   // Output: "3f94a8a7-1d2b-4c19-9b2f-6de8f0ea6df0" (random each time)
   ```

# eo.getRandomChar(length)
`eo.getRandomChar(length)` generates a random hexadecimal string of the specified length using the Web Crypto API for cryptographic security.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `length` | `Number` | The desired length of the output string. |

* ## Returns
   `String` A random hexadecimal string of the given length.

* ## Example Usage
   ```javascript
   console.log(eo.getRandomChar(10)); 
   // Output: "f3a9c2b4d1" (random each time)
   ```

# eo.getRandomNum(start, end)
`eo.getRandomNum(start, end)` generates a random integer between start and end (inclusive).

* ## Parameters
   | Parameter | Type | Default | Description |
   | --- | --- | --- | --- |
   | `start` | `Number` | Required | The minimum value (inclusive). |
   | `end` | `Number` | Required | The maximum value (inclusive). |

* ## Returns
   `Number` A random integer between start and end (both inclusive).

* ## Example Usage
   ```javascript
   console.log(eo.getRandomNum(1, 10)); 
   // Output: Random number between 1 and 10
   ```


# eo.convertCurrency(amount)
`eo.convertCurrency(amount)` formats large numbers into a more readable currency notation using suffixes like K (thousand), M (million), B (billion), T (trillion), and beyond, up to Googol (1e100).

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `amount` | `Number` \| `String` | The numeric value to be formatted. Can be a number or a string that represents a number. |

* ## Returns
   `String` A formatted string representing the number with an appropriate suffix (e.g., "1.5M", "2B").

* ## Example Usage
   ```javascript
   console.log(eo.convertCurrency(1500));      // "1.5K"
   console.log(eo.convertCurrency(1000000));   // "1M"
   console.log(eo.convertCurrency(2500000000)); // "2.5B"
   console.log(eo.convertCurrency(1e100));     // "1V"  (Googol)
   console.log(eo.convertCurrency(999));       // "999"
   ```

# eo.serializeFormData(formData)
`eo.serializeFormData(formData)` converts form data into a plain JavaScript object. It supports different input types, including:
**FormData** (browser API)  
**Array of object**s (e.g., { name: "email", value: "test@example.com" })  
**Plain JavaScript objects**  

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `formData` | `FormData` \| `Array` \| `Object` | The data to be converted into a plain object. |

* ## Returns
   `Object` A JavaScript object where keys represent form field names and values represent user input.

* ## Example Usage
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

# eo.getYoutubeVideoData(url)
`eo.getYoutubeVideoData(url)` extracts YouTube video details from a given URL.
It retrieves:  
**The video ID**  
**Thumbnail URLs** in various resolutions  
The **direct watch URL**  
The **embed URL**  

If the URL is invalid, an error alert is triggered.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The YouTube video URL to extract details from. |

* ## Returns
   | Type	| Description |
   | --- | --- |
   | `Object`	| Returns an object with video details (**if the URL is valid**). |
   | `null`	| Returns null and triggers an alert if the URL is invalid. |

* ## Example Usage
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

* ## Supported Youtube URL Formats
   | Format Type | Example |
   | --- | --- |
   | Standard URL | https://www.youtube.com/watch?v=**VIDEO_ID** |
   | Shortened URL | https://youtu.be/**VIDEO_ID** |
   | Embed URL | https://www.youtube.com/embed/**VIDEO_ID** |
   | Other Variants | https://www.youtube.com/v/**VIDEO_ID**, https://www.youtube.com/watch?v=**VIDEO_ID**&feature=share |

# eo.createElements(tag, attributes = {}, children)
`eo.createElements(tag, attributes, children)` dynamically creates an HTML element, applies attributes, and appends child elements or text nodes. Ensures data sanitization before inserting into the DOM.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `tag` | `string` | The **HTML tag name** (e.g., `'div'`, `'span'`). |
   | `attributes` | `object` (optional) | An object containing **attribute key-value pairs** (e.g., `{ class: 'btn', id: 'my-button' }`). |
   | `children` | `array` (optional) | An array of **child elements or strings** (text content). |

* ## Returns
   `HTMLElement` Returns a newly created DOM element with the specified attributes and children.

* ## Example Usage
   * **Creating a Simple** `<div>`
      ```javascript
      const div = eo.createElements('div', { class: 'container', id: 'main' }, ['Hello, world!']);
      document.body.appendChild(div);
      ```
      * **Output**
         ```html
         <div class="container" id="main">Hello, world!</div>
         ```
   
   * **Creating a Nested Structure**
      ```javascript
      const button = eo.createElements('button', { class: 'btn', type: 'button' }, ['Click Me']);
      const wrapper = eo.createElements('div', { class: 'wrapper' }, [button]);
      
      document.body.appendChild(wrapper);
      ```
      * **Output**
         ```html
         <div class="wrapper">
             <button class="btn" type="button">Click Me</button>
         </div>
         ```

* ## Error Handling
   | Error Condition | Thrown Error |
   | --- | --- |
   | `tag` is **not a string** or empty | `"Invalid tag name"` |
   | `attributes` is not an object | `"Attributes must be an object"` |
   | `children` is not an array | `"Children must be an array"` |

# eo.createHiddenInput(name, value)
`eo.createHiddenInput(name, value)` creates a hidden input field with a specified name and value. This is useful for storing data in forms without displaying it to the user.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `name` | `string` | The **name attribute** of the hidden input. |
   | `value` | `string` | The **value to be stored** in the hidden input. |

* ## Returns
   `HTMLElement` A hidden <input> element with the provided name and value.

* ## Example Usage
   * **Creating a Hidden Input**
   ```javascript
   const hiddenInput = createHiddenInput('user_id', '12345');
   document.body.appendChild(hiddenInput);
   ```
   * **Output**
      ```html
      <input type="hidden" name="user_id" value="12345">
      ```

* ## Error Handling
   | Error Condition | Thrown Error |
   | --- | --- |
   | `name` is **not a string** or empty | `"Invalid name"` |
   | `value` is **not a string** | `"Invalid value"` |

# eo.moveHtmlElement(fromSelector, toSelector)
`eo.moveHtmlElement(fromSelector, toSelector)` moves the inner HTML from one element to another. This is useful for dynamically repositioning content within a webpage.

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `fromSelector` | `string` | **CSS selector** of the element whose content will be moved. |
   | `toSelector` | `string` | **CSS selector** of the element where the content will be placed. |

* ## Returns
   `void` Does not return a value. It modifies the DOM directly.

* ## Example Usage
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

# eo.post
The `eo.post` function **performs an HTTP POST request** to a specified `url` using the Fetch API. It supports **different data types** (`FormData`, `JSON`, `array`, or plain objects), **allows custom content types**, and provides **callback hooks** for different stages of the request.

* ## Syntax
   ```javascript
   eo.post(url, data, {
       onBeforeSend,
       onSuccess,
       onError,
       onComplete,
       contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
   });
   ```

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The API endpoint where the request is sent. |
   | `data` | `FormData`, `Object`, `Array` | The data to be sent in the request body. |
   | `options` | `object` | Optional configuration options (see below). |
   * **Options Object**
      | Option | Type | Description |
      | --- | --- | --- |
      | `onBeforeSend` | `function` | **Callback function** executed before the request is sent. |
      | `onSuccess` | `function` | **Callback function** executed when the request is successful. |
      | `onError` | `function` | **Callback function** executed when the request fails. |
      | `onComplete` | `function` | **Callback function** executed when the request completes (whether successful or not). |
      | `contentType` | `string` | The `Content-Type` of the request (`application/json`, `application/x-www-form-urlencoded`, etc.). |

* ## Returns
   `void` Does not return a value. Instead, it executes the provided callback functions.

* ## Example Usage
   * **Send Form Data**
      ```javascript
      const formData = new FormData();
      formData.append('username', 'john_doe');
      formData.append('password', 'securePass123');
      
      eo.post('/login', formData, {
          onSuccess: (response) => console.log('Login Success:', response),
          onError: (xhr, status, error) => console.error('Error:', status, error)
      });
      ```
   
   * **Send JSON Data**
      ```javascript
      const userData = { username: 'john_doe', age: 30 };
      
      eo.post('/update-profile', userData, {
          contentType: 'application/json',
          onSuccess: (response) => console.log('Profile Updated:', response),
          onError: (xhr, status, error) => console.error('Profile Update Failed:', error)
      });
      ```
# eo.get
The `eo.get` function **performs an HTTP GET request** to fetch data from a given `url`. It supports **callbacks for request lifecycle events**, including `beforeRequest`, `onSuccess`, and `onError`. The function **automatically detects and processes JSON responses** while handling errors gracefully.

* ## Syntax
   ```javascript
   eo.get(url, { beforeRequest, onSuccess, onError });
   ```

* ## Parameters
   | Parameter | Type | Description |
   | --- | --- | --- |
   | `url` | `string` | The API endpoint from which data is fetched. |
   | `options` | `object` | (Optional) An object containing callback functions (see below). |
   * **Options Object**
      | Option | Type | Description |
      | --- | --- | --- |
      | `beforeRequest` | `function` | **Callback function** executed before the request is made. If it returns `false`, the request is canceled. |
      | `onSuccess` | `function` | **Callback function** executed when the request is successful. Receives the response data as an argument. |
      | `onError` | `function` | **Callback function** executed when the request fails. Receives (`null`, `'error'`, `error`) as arguments. |

* ## Returns
   `Promise<any>` A promise that resolves with the response data or logs an error.

* ## Example Usage
   * **Basic GET Request**
      ```javascript
      get('/api/user', {
          onSuccess: (data) => console.log('User Data:', data),
          onError: (xhr, status, error) => console.error('Error:', status, error)
      });
      ```
   * **Cancel Request with** `beforeRequest`
      ```javascript
      get('/api/config', {
          beforeRequest: () => {
              console.log('Checking before request...');
              return false; // Request will be canceled
          },
          onSuccess: (data) => console.log('Config Loaded:', data),
      });
      ```
# EO.js Components
   * ## eo.component.video
      The Video Component is for managing YouTube videos within a web interface. It provides functionalities to:
      * Add a YouTube video by URL.
      * Play the video in a modal.
      * Remove added videos.
      * Create a hidden input dynamically.
         * `id`, `url`, `embed`, `thumbnail`, and `created_at`
      
	  * ### Usage
	     Call `eo.component.video.init()` before the page loads.
	     ```javascript
         window.addEventListener('load', () => {
            eo.component.video.init();
         });
		 ```
      * ### Required HTML Structure
         To integrate the video module, add the following HTML elements:
         ```html
         <div class="response"></div>
         <div id="videoInput"></div>
         <div class="video-list-container"></div>
         ```
         * #### Description
            * **.response** - Displays messages after adding a video.
            * **#videoInput** - The container where the input field and add button will be appended.
            * **.video-list-container** - The section where added videos will be listed.
            * Clicking on an added video will play it in a fullscreen modal.
            * A delete button is provided to remove a video entry.

   * ## eo.component.alert
   To use the `eo.commponent.alert`, ensure the necessary HTML structure includes a container for displaying alerts.
   
      * ### Required HTML Structure
         ```html
         <div class="response"></div>
         ```

         This will act as the default container for displaying alerts and loaders.

      * ### Methods
         * #### success(message, element) and error(message, element)
            Displays a success alert.
            | Parameter | Type | Default | Description |
            | --- | --- | --- | --- |
            | `message` | `String` | *required* | The success message. |
            | `element` | `String` | *optional*, `default: '.response'` | The container where the alert will be displayed. |
            * ##### Example Usage
               ```javascript
               eo.component.alert.success('Operation completed successfully!');
               eo.component.alert.error('An error occurred while processing your request.');
               ```

         * #### loader(message, element)
            Displays a processing loader with a message.
            | Parameter | Type | Default | Description |
            | --- | --- | --- | --- |
            | `message` | `String` | *optional*, `default: 'Processing, Please wait...'` | The success message. |
            | `element` | `String` | *optional*, `default: '.response'` | The container where the alert will be displayed. |
            * ##### Example Usage
               ```javascript
               eo.component.alert.loader();
               eo.component.alert.loader('Uploading file, please wait...');
               ```
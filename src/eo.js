// Copyright (c) [2025] [Emmanuel Olivas]

// eo.js

/* global define */ // For AMD
/* global module */ // For CommonJS
/* global exports */ // For CommonJS

; (function(factory) { // The IIFE (Immediately Invoked Function Expression)
	if (typeof define === 'function' && define.amd) { // Check for AMD (Asynchronous Module Definition)
		define([], factory); // Use AMD define
	} else if (typeof exports === 'object') { // Check for CommonJS
		module.exports = factory(); // Use CommonJS module.exports
	} else { // Otherwise, assume global scope (browser)
		window.eo = factory(); // Attach the module to the window object
	}
})(function() {

	'use strict';

	let DOMAIN;
	let CDN;

	const settings = ({ domain, cdn } = {}) => {
		DOMAIN = domain;
		CDN = cdn;
	};

	/**
	   * Checks if the application is in development mode by examining a meta tag.
	   *
	   * This function looks for a meta tag with the name "inDevelopment" in the document.
	   * If the content of this meta tag is "1", the function returns true, indicating
	   * that the application is in development mode. Otherwise, it returns false.
	   *
	   * @returns {boolean} True if the application is in development mode, false otherwise.
	   */
	const isInDevelopment = () => document.querySelector('meta[name="inDevelopment"]')?.content === '1';

	const _CSRFToken = (() => {
		const token = document.querySelector('meta[name="csrf-token"]')?.content;
		if (!token) {
			const message = 'CSRF Token not found in meta tags! <meta name="csrf-token" content="{{ csrf_token() }}">';
			console.error(message);
		}
		return token;
	})();

	/**
	 * Sanitizes a given string by escaping HTML special characters.
	 * Uses the browser's built-in option element to convert the string.
	 * 
	 * @param {string} str - The string to be sanitized.
	 * @returns {string} - The sanitized string with HTML special characters escaped.
	 */
	const _sanitize = str => new Option(str).innerHTML;

	/**
	 * Calculates the absolute difference between two dates in days.
	 *
	 * The function takes two arguments, `date` and `otherDate`, and returns the number
	 * of days between them. The result is always positive, regardless of the order of
	 * the arguments.
	 *
	 * @param {Date} date
	 * @param {Date} otherDate
	 * @returns {number} The absolute difference in days between the two dates.
	 */
	const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
	
	/**
	 * Removes all elements from the given array that are either empty strings, null, false, undefined, or booleans.
	 * @param {array} arr - The array to be filtered.
	 * @returns {array} The filtered array.
	 */
	const removeFalseArray = (arr) => arr.filter(item => item !== '' && item !== null && item !== false && item !== undefined && typeof item !== 'boolean');
	
	/**
	 * Removes all duplicate elements from the given array.
	 * @param {array} arr - The array to be filtered.
	 * @returns {array} The filtered array.
	 */
	const removeDuplicatesArray = (arr) => [...new Set(arr)];

	/**
	 * Retrieves the value of a cookie by its key.
	 *
	 * This function searches the document's cookies for a key-value pair that matches
	 * the given key. If found, it returns the value associated with the key. If no
	 * matching key is found, it returns an empty string.
	 *
	 * @param {string} key - The name of the cookie to retrieve.
	 * @returns {string} The value of the cookie, or an empty string if the key is not found.
	 */
	const getCookie = (key) => {
		return document.cookie
			.split(';')
			.map(cookie => cookie.trim())
			.find(cookie => cookie.startsWith(key + '='))
			?.split('=')[1] || '';
	};

	/**
	 * Sets a cookie with the given key and value, expiring in the specified number of days.
	 *
	 * The function takes three arguments: `key`, `value`, and `days`. The `key` is the name
	 * of the cookie, the `value` is the string value to be stored, and `days` is the number
	 * of days until the cookie expires. The cookie is set with the path set to '/', making
	 * it accessible to all pages on the current domain.
	 *
	 * @param {string} key - The name of the cookie.
	 * @param {string} value - The value to be stored in the cookie.
	 * @param {number} days - The number of days until the cookie expires.
	 */
	const setCookie = (key, value, days) => {
		const expires = new Date(Date.now() + days * 864e5).toUTCString();
		document.cookie = `${key}=${value}; expires=${expires}; path=/`;
	};

	/**
	 * Formats a given timestamp into a human-readable string.
	 *
	 * This function converts a timestamp into a string representation with varying
	 * formats based on the date's relation to the current date:
	 * - If the date is today, returns the time in 'HH:MM' format.
	 * - If the date is yesterday, returns "Yesterday at HH:MM".
	 * - If the date is within the current year, returns 'MMM DD, HH:MM'.
	 * - Otherwise, returns 'MMM DD, YYYY'.
	 *
	 * @param {number|string|Date} timestamp - The timestamp to format, which can be 
	 *                                         a number (seconds/milliseconds since epoch),
	 *                                         a string representation of a date, 
	 *                                         or a Date object.
	 * @returns {string} A formatted date string.
	 */
	const readableDate = (timestamp) => {
		const date = 
        typeof timestamp === 'number' ? new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp) :
        typeof timestamp === 'string' || timestamp instanceof Date ? new Date(timestamp) :
        (() => { throw new Error('Invalid timestamp type. Expected number, string, or Date object.'); })();

		const now = new Date();
		const [isToday, isYesterday, isSameYear] = [
			date.toDateString() === now.toDateString(),
			date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString(),
			date.getFullYear() === now.getFullYear()
		];

		if (isToday) {
			return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		} else if (isYesterday) {
			return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
		} else if (isSameYear) {
			return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
		} else {
			return date.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
		}
	};

	/**
     * Redirects the browser to a given URL.
     *
     * @param {string} url - The URL to redirect to
     */
	const redirect = (url) => window.location = url;

	/**
	 * Converts an epoch time (in seconds/milliseconds) to a localized string in the format:
	 * "Weekday, Month Day, Year, HH:MM AM/PM"
	 *
	 * @param {number} epoch - The epoch time, in seconds/milliseconds
	 * @returns {string} A localized string representation of the date and time
	 */
	const epochToTimeString = (epoch) => {
		const isMilliseconds = epoch > 10000000000;
		const date = new Date(isMilliseconds ? epoch : epoch * 1000);
		return date.toLocaleString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	/**
	 * Trims a given string to a maximum length, appending an ellipsis (...) if the string is longer than the maximum length.
	 *
	 * @param {string} stringValue - The string to trim
	 * @param {number} maximumLength - The maximum allowed length of the string
	 * @returns {string} The trimmed string
	 */
	const trim = (stringValue, maxLength) => 
    	stringValue.length > maxLength ? `${stringValue.slice(0, maxLength - 3)}...` : stringValue;

	/**
	 * Converts a given number of bytes to a human-readable string,
	 * appending the appropriate unit (Bytes, KB, MB, etc.).
	 *
	 * @param {number} bytes - The number of bytes to convert
	 * @param {number} [decimalPlaces=2] - The number of decimal places to include
	 * @returns {string} A human-readable string representation of the given number of bytes
	 */
	const formatFileSize = (bytes, decimalPlaces = 0) => {
		if (bytes === 0) return '0 Bytes';

		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log2(bytes) / Math.log2(1000));
		const size = (bytes / Math.pow(1000, i)).toFixed(decimalPlaces);

		return `${size} ${sizes[i]}`;
	};

	/**
	 * Generates a random UUID (Universally Unique Identifier) version 4.
	 *
	 * This function uses the Web Cryptography API to generate a random UUID.
	 * The UUID is in the standard format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
	 *
	 * @returns {string} A randomly generated UUID version 4
	 */
	const uuidv4 = () => {
		return '00000000-0000-0000-0000-000000000000'.replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	};

	/**
	 * Generates a random alphanumeric string of the specified length.
	 *
	 * This function uses the Web Cryptography API to generate cryptographically
	 * secure random values, which are then used to select characters from a
	 * set of uppercase and lowercase letters and digits.
	 *
	 * @param {number} length - The length of the random alphanumeric string to generate
	 * @returns {string} A random alphanumeric string of the specified length
	 */
	const getRandomChar = (length) => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let result = '';
		const randomValues = new Uint8Array(length);

		window.crypto.getRandomValues(randomValues);

		for (let i = 0; i < length; i++) {
			const randomIndex = randomValues[i] % charactersLength;
			result += characters.charAt(randomIndex);
		}

		return result;
	};

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
	const getRandomNum = (start, end) => {
    if (start > end) throw new Error('Start must be ≤ End');
		return start + Math.floor(Math.random() * (end - start + 1));
	};


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
	const convertCurrency = (amount) => {
		const num = Math.abs(Number(amount));
		const suffixes = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'Oc', 'Nn', 'Dc', 'Ud', 'Dd', 'Td', 'Qdd', 'Qnd', 'Sxd', 'Spd', 'Od', 'Nd', 'V']; // Added suffixes for larger numbers up to Googol
		const factor = [
			1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21, 1e24, 1e27, 1e30, 1e33,
			1e36, 1e39, 1e42, 1e45, 1e48, 1e51, 1e54, 1e57, 1e60, 1e63, 1e100
		];

		for (let i = factor.length - 1; i >= 0; i--) {
			if (num >= factor[i]) {
			return (num / factor[i]).toFixed(num % factor[i] === 0 ? 0 : 2) + suffixes[i];
			}
		}

		return num.toString();
	};

	/**
	 * Serializes a given input into a plain JavaScript object.
	 *
	 * This function accepts either a native FormData object, an array of objects
	 * with 'name' and 'value' properties, or a regular object. It processes the input
	 * to produce a plain JavaScript object with key-value pairs.
	 *
	 * - If the input is a FormData object, it converts the entries to an object.
	 * - If the input is an array, it reduces the array to an object using the 'name'
	 *   and 'value' properties of each item.
	 * - If the input is already a regular object, it is returned as is.
	 *
	 * @param {FormData|Array|object} formData - The input to serialize
	 * @returns {object} A plain JavaScript object containing the serialized data
	 */
	const serializeFormData = (formData) => {
		if (formData instanceof FormData) {
			return Object.fromEntries(formData.entries());
		} else if (Array.isArray(formData) && formData.every(item => typeof item === 'object' && item !== null && 'name' in item && 'value' in item)) {
			return formData.reduce((acc, item) => {
				acc[item.name] = item.value;
				return acc;
			}, {});
		} else if (typeof formData === 'object' && formData !== null) {
			return Object.keys(formData).reduce((acc, key) => {
				acc[key] = formData[key];
				return acc;
			}, {});
		}

		return formData;
	};

	/**
	 * Returns a YouTube video object given a YouTube video URL.
	 *
	 * The returned object contains the YouTube video ID, thumbnail URLs, video URL, and embed URL.
	 *
	 * The supported YouTube URL formats are:
	 * - http://www.youtube.com/watch?v=VIDEO_ID
	 * - http://www.youtube.com/watch?v=VIDEO_ID&feature=player_embedded
	 * - http://www.youtube.com/watch?v=VIDEO_ID&feature=feedrec_grec_index
	 * - http://www.youtube.com/user/USER_NAME#p/a/u/1/VIDEO_ID
	 * - http://www.youtube.com/v/VIDEO_ID?fs=1&hl=en_US&rel=0
	 * - http://www.youtube.com/watch?v=VIDEO_ID#t=0m10s
	 * - http://www.youtube.com/embed/VIDEO_ID?rel=0
	 * - http://youtu.be/VIDEO_ID
	 *
	 * If the given URL is not a supported YouTube URL format, an alert is shown with an error message.
	 *
	 * @param {string} url - The YouTube video URL to parse
	 * @returns {object} The parsed YouTube video object, or an error alert if the given URL is invalid
	 */
	const getYoutubeVideoData = (url) => {
		const urlRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(urlRegex);
		const id = match && match[7].length === 11 ? match[7] : null;

		if (id) {
			return {
				id,
				thumbnail: {
					default: `http://img.youtube.com/vi/${id}/default.jpg`,
					hq: `http://img.youtube.com/vi/${id}/hqdefault.jpg`,
					mq: `http://img.youtube.com/vi/${id}/mqdefault.jpg`,
					sd: `http://img.youtube.com/vi/${id}/sddefault.jpg`,
					maxres: `http://img.youtube.com/vi/${id}/maxresdefault.jpg`,
				},
				url: `https://www.youtube.com/watch?v=${id}`,
				embed: `https://www.youtube.com/embed/${id}`,
			};
		}

		alert.error('Invalid YouTube URL');
	};

	/**
	 * Creates an HTML element with a specified tag name, attributes, and children.
	 *
	 * The function performs type checking and sanitization on the inputs to ensure
	 * safe and valid element creation. The tag name is sanitized, and attributes
	 * are set securely. Children can be strings or DOM nodes and are appended
	 * to the created element after sanitization.
	 *
	 * @param {string} tag - The HTML tag name for the element to be created.
	 * @param {object} [attributes={}] - An object representing key-value pairs of attributes for the element.
	 * @param {Array} [children=[]] - An array of children to append to the created element. Children can be strings or DOM nodes.
	 * @returns {HTMLElement} The created and configured HTML element.
	 * @throws {Error} If the tag is not a valid string, attributes is not an object, or children is not an array.
	 */
	const createElements = (tag, attributes = {}, children = []) => {
		if (typeof tag !== 'string' || !tag.trim()) throw new Error('Invalid tag name');
		if (typeof attributes !== 'object' || attributes === null) throw new Error('Attributes must be an object');
		if (!Array.isArray(children)) throw new Error('Children must be an array');

		const element = document.createElement(_sanitize(tag));
		Object.entries(attributes).forEach(([key, value]) => element.setAttribute(_sanitize(key), _sanitize(String(value))));
		children.forEach(child => {
			element.appendChild(typeof child === 'string' ? document.createTextNode(_sanitize(child)) : child);
		});

		return element;
	};

	const createHiddenInput = (name, value) => {
		if (typeof name !== 'string' || !name.trim()) throw new Error('Invalid name');
		if (typeof value !== 'string') throw new Error('Invalid value');

		return createElements('input', {
			type: 'hidden',
			name: _sanitize(name),
			value: _sanitize(value)
		});
	};

	/**
	 * Move the innerHTML of the element matching fromSelector to the element matching toSelector.
	 *
	 * @param {string} fromSelector - The CSS selector for the element to move the content from.
	 * @param {string} toSelector - The CSS selector for the element to move the content to.
	 */
	const moveHtmlElement = (fromSelector, toSelector) => {
		const fromElement = document.querySelector(_sanitize(fromSelector));
		const toElement = document.querySelector(_sanitize(toSelector));

		if (!fromElement || !toElement) {
			if (isInDevelopment()) console.log('Element not found');
			return;
		}

		toElement.innerHTML = fromElement.innerHTML;
		fromElement.innerHTML = '';
	};

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
	 * @param {function} [options.onBeforeSend] - Called before the request is sent
	 * @param {function} [options.onSuccess] - Called when the request returns a JSON response
	 * @param {function} [options.onError] - Called when the request fails
	 * @param {function} [options.onComplete] - Called after the request has completed
	 * @param {boolean} [options.processData=true] - Whether to process the data before sending it
	 * @param {string} [options.contentType='application/x-www-form-urlencoded; charset=UTF-8'] - The content type of the request
	 */
	const post = (url, data, {
		onBeforeSend,
		onSuccess,
		onError,
		onComplete,
		contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
	} = {}) => {

		if (onBeforeSend) onBeforeSend();

		const headers = {
			'X-Requested-With': 'XMLHttpRequest'
		};

		let body = data;

		if ((data instanceof FormData || Array.isArray(data) || (typeof data === 'object' && data !== null))) {
			body = serializeFormData(data);

			if (contentType.includes('application/json')) {
				body = JSON.stringify(body);
				headers['Content-Type'] = contentType;
			} else {
				headers['Content-Type'] = contentType;
				body = Object.keys(body).map(key => {
					const value = body[key];
					if (Array.isArray(value)) {
						return value.map(item => `${encodeURIComponent(key + '[]')}=${encodeURIComponent(item)}`).join('&');
					} else {
						return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
					}
				}).join('&');
			}
		}

		fetch(url, {
			method: 'POST',
			headers,
			body
		})
			.then(async response => { // Make sure the function is async
				if (!response.ok) {
					const errorMessage = await response.text();
					throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
				}
				return response.text().then(text => {
					try {
						const jsonData = JSON.parse(text);
						return { data: jsonData, type: 'json' };
					} catch (jsonError) {
						console.log(jsonError);
						return { data: text, type: 'html' };
					}
				});
			})
			.then(result => {
				(result.type === 'json' ? onSuccess : onSuccess)?.(result.data);
			})
			.catch(error => {
				onError?.(null, 'error', error);
				console.error('Fetch Error:', error);
			})
			.finally(onComplete);
	};

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
	const get = async (url, { beforeRequest, onSuccess, onError } = {}) => {
		if (beforeRequest?.() === false) return;

		try {
			const response = await fetch(url);
			const contentType = response.headers.get('Content-Type');
			const responseData = contentType?.includes('application/json') 
				? await response.json()
				: await response.text();

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseData}`);
			}

			onSuccess?.(responseData);
			button.enable();
			return responseData;

		} catch (error) {
			onError?.(null, 'error', error);
			alert.error(error);
			console.error('Fetch Error:', error);
			button.enable();
		}
	};

	/**
	 * Gets the user client information from local storage or fetches it from IPInfo and determines the browser.
	 * @returns {object} The client information, with the following properties:
	 * - `userAgent`: The user agent string
	 * - `geo`: The geo information from IPInfo
	 * - `browser`: The browser name
	 */
	const userClient = (() => {
		const clientInfo = JSON.parse(localStorage.getItem('EOclient')) || {
			userAgent: navigator.userAgent,
			geo: null,
			browser: null
		};

		const getGeoInfo = async () => {
			try {
				clientInfo.geo = await get('https://ipinfo.io/json');
				localStorage.setItem('EOclient', JSON.stringify(clientInfo));
			} catch (error) {
				console.error('Error getting geo info:', error);
			}
		};

		const detectBrowser = () => {
			const browsers = {
				'Opera|Opr': 'Opera',
				'Edg': 'Microsoft Edge',
				'EdgA': 'Microsoft Edge (Chromium)',
				'MSIE|Trident': 'Microsoft IE',
				'Chrome': 'Google Chrome',
				'Safari': 'Apple Safari',
				'Firefox': 'Mozilla Firefox'
			};

			clientInfo.browser = Object.entries(browsers).find(([key]) => 
				new RegExp(key).test(navigator.userAgent)
			)?.[1] || 'Unknown Browser';
		};

		if (!localStorage.getItem('EOclient')) {
			getGeoInfo();
			detectBrowser();
		}

		return clientInfo;
	})();

	const _slider = function() {

		const inputFromElementId = 'sliderFrom';
		const inputToElementId = 'sliderTo';
		const minValue = 1000;
		const maxValue = 10000;
		const stepValue = 1000;

		const defaultOptions = {
			start: [minValue, maxValue],
			connect: true,
			step: stepValue,
			range: {
				min: minValue,
				max: maxValue
			}
		};

		const create = (rangeContainerSelector, options = {}) => {
			const rangeContainer = document.createElement('div');
			rangeContainer.classList.add('range');
			document.querySelector(rangeContainerSelector).appendChild(rangeContainer);

			if (rangeContainer === null) {
				return;
			}

			const mergedOptions = { ...defaultOptions, ...options };
			noUiSlider.create(rangeContainer, mergedOptions);

			const sliderValueDisplay = document.createElement('div');
			sliderValueDisplay.classList.add('slider-non-linear-step-value');
			rangeContainer.parentNode.insertBefore(sliderValueDisplay, rangeContainer.nextSibling);

			_createSliderInputElement(rangeContainerSelector, rangeContainer);
		};

		const _createSliderInputElement = (sliderElement, rangeContainer) => {
			let inputFromId = document.querySelector(sliderElement)
				.dataset.inputFromId || inputFromElementId;
			let inputToId = document.querySelector(sliderElement).dataset.inputToId || inputToElementId;

			const inputFrom = createElements('input', {
				type: 'hidden',
				name: inputFromId,
				id: inputFromId,
				value: ''
			});

			const inputTo = createElements('input', {
				type: 'hidden',
				name: inputToId,
				id: inputToId,
				value: ''
			});

			document.querySelector(sliderElement).prepend(inputFrom);
			document.querySelector(sliderElement).prepend(inputTo);

			rangeContainer.noUiSlider.on('update', (values) => {
				const sliderValueDisplay = document.querySelector('.slider-non-linear-step-value');
				sliderValueDisplay.innerHTML = `<span class="text-muted">Range:</span> P${convertCurrency(values[0])} - P${convertCurrency(values[1])}`;

				document.getElementById(inputFromId).value = values[0];
				document.getElementById(inputToId).value = values[1];
			});
		};

		const _initSLider = () => {
			const rangeContainerSelector = '.slider-display';
			const rangeContainer = document.querySelector(rangeContainerSelector);
			if (rangeContainer === null) {
				return;
			}

			const min = Number(document.querySelector(rangeContainerSelector).dataset.min) || minValue;
			const max = Number(document.querySelector(rangeContainerSelector).dataset.max) || maxValue;
			const step = Number(document.querySelector(rangeContainerSelector).dataset.step) || stepValue;

			defaultOptions.start = [min, max];
			defaultOptions.range.min = min;
			defaultOptions.range.max = max;
			defaultOptions.step = step;
			defaultOptions.format = wNumb({
				decimals: 2
			});

			create(rangeContainerSelector, defaultOptions);
		};

		return {
			_initAfterLoad: () => {
				_initSLider();
			},

			_initBeforeLoad: () => {
			},

			create
		};
	}();

	const slider = function() {
		return { create: _slider.create };
	}();

	const video = (() => {
		const _resetForm = (input, btnSpinner, btnText) => {
			btnSpinner.classList.add('d-none');
			btnText.classList.remove('d-none');
			input.disabled = false;
		};

		const _invalidResponse = (input, btnSpinner, btnText, message) => {
			input.classList.add('is-invalid');
			_resetForm(input, btnSpinner, btnText);
			alert.error(message);
		};

		const _handleVideoAdd = () => {
			document.addEventListener('click', (event) => {
				const btn = event.target.closest('.btn-add-video');
				if (!btn) return;
				
				const input = document.querySelector('.youtubeUrl');
				if (!input) return;
				
				const btnSpinner = btn.querySelector('.spinner-border');
				const btnText = btn.querySelector('.btn-text');
				const videoUrl = input.value.trim();
				
				if (!videoUrl) return _invalidResponse(input, btnSpinner, btnText, 'YouTube URL is required!');
				
				const videoData = getYoutubeVideoData(videoUrl);
				
				btnSpinner.classList.remove('d-none');
				btnText.classList.add('d-none');
				input.disabled = true;
				
				if (!videoData || !videoData.id) return _invalidResponse(input, btnSpinner, btnText, videoData?.message || 'Invalid YouTube URL!');
				if (document.querySelector(`.${CSS.escape(videoData.id)}`)) return _invalidResponse(input, btnSpinner, btnText, 'Video already added!');
				
				const videoContainer = createElements('div', { class: videoData.id, 'data-id': videoData.id }, [
					...Object.entries(videoData.thumbnail || {}).map(([key, value]) => createHiddenInput(`videos[${videoData.id}][thumbnail][${key}]`, value)),
					createHiddenInput(`videos[${videoData.id}][id]`, videoData.id),
					createHiddenInput(`videos[${videoData.id}][url]`, videoData.url),
					createHiddenInput(`videos[${videoData.id}][embed]`, videoData.embed),
					createHiddenInput(`videos[${videoData.id}][created_at]`, Date.now().toString()),
					createElements('div', { class: 'btn-delete-container w-100 text-end p-1' }, [
						createElements('span', { class: 'btn btn-danger btn-remove-video', 'data-id': videoData.id }, [
							createElements('i', { class: 'ti ti-trash' })
						])
					]),
					createElements('div', {
						class: 'avatar avatar-xxxl p-2 btn-playback cursor-pointer text-white',
						'data-id': videoData.id,
						'data-url': videoData.url,
						'data-embed': videoData.embed,
						style: `background-image: url(${videoData.thumbnail?.sd || ''}); height: 120px;`
					}, [
						createElements('i', { class: 'ti ti-brand-youtube fs-32' })
					])
				]);

				document.querySelector('.video-list-container')?.prepend(videoContainer);
				input.value = '';
				input.classList.remove('is-invalid');
				_resetForm(input, btnSpinner, btnText);
			});
		};

		const _handleVideoPlayback = () => {
			document.addEventListener('click', (event) => {
				const btn = event.target.closest('.btn-playback');
				if (!btn) return;

				modal.create({
					id: btn.dataset.id,
					size: 'fullscreen',
					callback: () => createElements('div', { class: 'row justify-content-center' }, [
						createElements('div', { class: 'col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12' }, [
							createElements('iframe', {
								class: 'w-100', height: '560', src: btn.dataset.embed,
								title: 'YouTube video player', frameborder: '0',
								allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;',
								referrerpolicy: 'strict-origin-when-cross-origin', allowfullscreen: ''
							}),
							createElements('div', { class: 'text-center' }, [
								createElements('span', { class: 'btn mt-3', 'data-bs-dismiss': 'modal' }, [
									createElements('i', { class: 'ti ti-x me-1' }),
									document.createTextNode(' Close')
								])
							])
						])
					]),
					status: 'info',
					destroyable: true
				});

				document.getElementById(btn.dataset.id).querySelector('.modal-content').style.backgroundColor = 'rgba(0, 0, 0, 1)';
			});
		};

		const _handleVideoDeletion = () => {
			document.addEventListener('click', (event) => {
				const btn = event.target.closest('.btn-remove-video');
				if (btn) document.querySelector(`.${CSS.escape(btn.dataset.id)}`)?.remove();
			});
		};

		const _createVideoForm = () => {
			const container = document.getElementById('videoInput');
			if (!container) return;

			container.appendChild(createElements('div', { class: 'd-flex gap-1' }, [
				createElements('div', { class: 'form-floating flex-fill' }, [
					createElements('input', {
						type: 'text', id: 'youtubeUrl', class: 'form-control youtubeUrl',
						placeholder: '', 'aria-label': 'YouTube URL', 'aria-describedby': 'basic-addon1'
					}),
					createElements('label', { for: 'youtubeUrl' }, [
						createElements('i', { class: 'ti ti-brand-youtube' }),
						document.createTextNode(' Paste YouTube URL')
					])
				]),
				createElements('span', { class: 'btn btn-primary btn-add-video' }, [
					createElements('span', { class: 'spinner-border spinner-border-sm d-none', role: 'status', 'aria-hidden': 'true' }),
					createElements('span', { class: 'btn-text fs-18' }, [
						createElements('i', { class: 'ti ti-plus me-1' }),
						document.createTextNode(' Add Video')
					])
				])
			]));
		};

		return {
			_initBeforeLoad: () => {
				_handleVideoAdd();
				_handleVideoDeletion();
				_handleVideoPlayback();
			},
			init: () => {
				_createVideoForm();
			}
		};
	})();

	const alert = function() {
		const _display = (message, element) => {
			const messageContainer = document.querySelector(element);

			if (!messageContainer) {
				document.body.prepend(createElements('div', { class: 'response' }));
			}

			document.querySelector(element).innerHTML = message;
		};

		const _createAlert = (message, type = 'success', element = '.response') => {  // Combined function
			const alertClasses = `message alert alert-${type} alert-dismissible show`; // Dynamic class
			const alertDiv = createElements('div', { class: alertClasses, role: 'alert' }, [
				createElements('span', {}, [document.createTextNode(message)]),
				createElements('button', {
					type: 'button', class: 'btn-close',
					'data-bs-dismiss': 'alert', 'aria-label': 'Close'
				})
			]);

			_display(alertDiv.outerHTML, element);
		};

		const success = (message, element = '.response') => _createAlert(message, 'success', element);
		const error = (message, element = '.response') => _createAlert(message, 'danger', element);

		const loader = (message = 'Processing, Please wait...', element = '.response') => {
			const loaderDiv = createElements('div', { class: 'bg-white p-3 mt-3 rounded border' }, [
				createElements('div', { class: 'd-flex gap-3 align-items-center' }, [
					createElements('div', { class: 'loader' }),
					createElements('p', { class: 'mb-0' }, [ document.createTextNode(message) ])
				])
			]);

			_display(loaderDiv.outerHTML, element);
		};

		const message = (message, type, element = '.response') => {
			_createAlert(message, type, element);
		};

		return {
			success,
			error,
			loader,
			message
		};
	}();

	const button = (() => {
		const setState = (selector, disabled) => {
			document.querySelectorAll(selector).forEach(el => {
				Object.assign(el.style, {
					cursor: disabled ? 'wait' : '',
					pointerEvents: disabled ? 'none' : '',
					opacity: disabled ? 0.5 : '',
				});
				el.disabled = disabled;
			});
		};

		return {
			disable: (selector = '.btn') => setState(selector, true),
			enable: (selector = '.btn') => setState(selector, false)
		};
	})();

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
	const submitForm = (formId, { validation, callback, onBeforeSend, redirectUrl } = {}) => {
		formId = formId.replace('#', '');
		const form = document.getElementById(formId);

		if (!form) {
			console.error(`Form with ID '${formId}' not found!`);
			return;
		}

		document.addEventListener('submit', (event) => {
			if (event.target.id === formId) event.preventDefault();
		});

		const formData = new FormData(form);
		formData.append('csrf_token', _CSRFToken);

		onBeforeSend?.(formData);

		return post(form.getAttribute('action'), formData, {
			onBeforeSend: () => {
				alert.loader();
				button.disable();

				if (typeof validation === 'object') {
					const validation = validator.validate(serializeFormData(formData), validation);
					if (! validation) {
						alert.error(validator.getErrors().join('<br /> '));
					}
				}

			},
			onSuccess: (responseData) => {
				try {
					const response = typeof responseData === 'object' ? responseData : JSON.parse(responseData);
					alert.message(response.message);
					if (response.status === 1) {
						callback?.(serializeFormData(formData), response);
					}
				} catch (e) {
					alert.message('');
					callback?.(serializeFormData(formData), responseData);
					if (isInDevelopment()) console.log(e);
				}

				if (redirectUrl) {
					alert.loader('Redirecting...');
					setTimeout(() => redirect(redirectUrl), 10);
				}
				
			},
			onComplete: button.enable
		});
	};

	const modal = (() => {
		const create = ({ id, size, callback, status = false, destroyable = true } = {}) => {
			const _modal = createElements('div', {
				class: `modal ${destroyable ? 'modal-destroyable' : ''}`,
				id,
				'aria-labelledby': 'modal',
				'aria-hidden': 'true'
			}, [
				createElements('div', { class: `modal-dialog modal-${size}` }, [
					createElements('div', { class: 'modal-content' }, [
						...(status ? [createElements('div', { class: `modal-status bg-${status}` })] : []),
						createElements('div', { class: 'modal-body' }, [
							createElements('span', {
								class: 'btn-close',
								'data-bs-dismiss': 'modal',
								'aria-label': 'Close'
							}),
							createElements('div', { class: 'response-modal' }, [
								..._parseCallback(callback)
							])
						])
					])
				])
			]);

			document.body.appendChild(_modal);
			new bootstrap.Modal(_modal, { keyboard: false }).show();
		};

		const _parseCallback = (callback) => {
			if (!callback) return [];
			const content = callback();
			if (typeof content === 'string') {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = content;
				return [...tempDiv.childNodes];
			}
			return content instanceof Element ? [content] : [];
		};

		const _handleModalClose = () => {
			document.addEventListener('click', (event) => {
				const _modal = event.target.closest('.modal');
				if (event.target.classList.contains('btn-close') && _modal) {
					bootstrap.Modal.getInstance(modal)?.hide();
				}
			});
		};

		const _destroyModalOnClose = () => {
			document.addEventListener('hidden.bs.modal', (event) => {
				const _modal = document.getElementById(event.target.id);
				if (_modal?.classList.contains('modal-destroyable')) _modal.remove();
			});
		};

		return {
			_initAfterLoad: () => {
				_destroyModalOnClose();
				_handleModalClose();
			},
			create
		};
	})();

	const uploader = function () {

		let defaultUploadType = 'image';
		const defaultImageSingleUploadIcon = 'https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg';
		const defaultDocumentSingleUploadIcon = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiqCCMGSzWTOHM5Cs4eQXx6nPL_fWBuPprhw&s';
		const defaultDocumentIcon = 'https://cdn-icons-png.flaticon.com/512/4726/4726010.png';

		const create = (uploadSelector = '.upload-container', url, options = {}) => {
			const {
				inputName = 'eoFileUpload',
				previewSelector = '.uploaded-photo',
				disablePreview = false,
				uploadType = 'image',
				accept = uploadType === 'document' ? 'application/pdf' : 'image/*',
				multiple = true,
				onBeforeSend,
				onSuccess,
				onError
			} = options;

			if (!['image', 'document'].includes(uploadType)) throw new Error('Invalid upload type.');

			defaultUploadType = uploadType;
			const inputId = 'a' + getRandomChar(6);

			_createUI(uploadSelector, previewSelector, inputName, inputId, accept, multiple);
			_handleEvents(uploadSelector, previewSelector, multiple, inputId, url, onBeforeSend, onSuccess, onError, disablePreview);
		};

		const _createUI = (selector, previewSelector, inputName, inputId, accept, multiple) => {
			const container = document.querySelector(selector) || document.body.prepend(createElements('div', { class: 'upload-container' }));
			
			if (multiple) {
				container.innerHTML = `
					<span class="btn btn-dark btn-eo-uploader-browse">
						<i class="ti ti-upload me-2"></i> Upload
					</span>
				`;
			}

			document.body.prepend(createElements('form', {
				id: `uploadForm_${inputId}`,
				class: 'd-none',
				enctype: 'multipart/form-data'
			}, [
				createElements('input', {
					type: 'file',
					id: inputId,
					accept,
					name: multiple ? `${inputName}[]` : inputName,
					...(multiple ? { multiple: true } : {})
				})
			]));

			const bg = defaultUploadType == 'image' ? defaultImageSingleUploadIcon : defaultDocumentSingleUploadIcon;
			const previewElement = document.querySelector(previewSelector);
			previewElement.innerHTML = multiple
				? '<div class="multiple-preview d-flex flex-wrap gap-2"></div>'
				: '<div class="photo-preview position-relative" style="width: 150px; height: 150px; background-size: cover; background-position: center; background-image: url(' + bg + ');"></div>';
			
			if (!multiple) document.querySelector('.photo-preview').classList.add('btn-eo-uploader-browse');
		};

		const _createPreviewUI = (previewSelector, multiple, files) => {
			const previewContainer = document.querySelector(multiple ? `${previewSelector} .multiple-preview` : `${previewSelector} .photo-preview`);
			if (!previewContainer) return console.error(`Element '${previewSelector}' not found.`);

			files.forEach((file) => {
				const reader = new FileReader();
				reader.onload = (e) => {
					const id = getRandomChar(11);
					const bg = defaultUploadType == 'image' ? e.target.result : defaultDocumentIcon;
					let container;

					if (multiple) {
						container = createElements('div', {
							class: 'file-container position-relative',
							id,
							style: `width: 150px; height: 150px; background-size: cover; background-position: center; background-image: url(${bg});`
						}, [
							createElements('span', {
								class: 'btn btn-danger btn-sm remove-btn position-absolute top-0 end-0 m-2',
								'data-id': id
							}, ['X']),
							createElements('span', {
								class: 'text-white position-absolute bottom-0 overflow-auto w-100 px-2 py-1 bg-dark text-nowrap small'
							}, [file.name])
						]);
					} else {

						previewContainer.style.backgroundImage = `url(${bg})`;
						container = previewContainer;
						container.innerHTML = '';

						previewContainer.appendChild(
							createElements('div', {
								class: 'text-white position-absolute bottom-0 overflow-auto w-100 px-2 py-1 bg-dark text-nowrap small'
							}, [file.name])
						);
					}

					const hiddenInputsContainer = multiple ? container : previewContainer;
					hiddenInputsContainer.appendChild(createHiddenInput(`upload[${id}][id]`, id.toString()));

					if (defaultUploadType === 'image') {
						const img = new Image();
						img.src = e.target.result;
						img.onload = () => {
							hiddenInputsContainer.appendChild(createHiddenInput(`upload[${id}][width]`, img.width.toString()));
							hiddenInputsContainer.appendChild(createHiddenInput(`upload[${id}][height]`, img.height.toString()));
						};
					}

					['name', 'size', 'type', 'lastModified'].forEach((prop) => {
						hiddenInputsContainer.appendChild(createHiddenInput(`upload[${id}][${prop}]`, file[prop].toString()));
					});

					if (multiple) previewContainer.appendChild(container);
				};
				reader.readAsDataURL(file);
			});
		};

		const _handleEvents = (selector, previewSelector, multiple, inputId, url, onBeforeSend, onSuccess, onError, disablePreview) => {
			document.addEventListener('click', (e) => {
				if (e.target.closest('.btn-eo-uploader-browse')) document.getElementById(inputId).click();
			});

			document.addEventListener('change', (e) => {
				if (!e.target.matches(`#${inputId}`)) return;

				const files = [...e.target.files];
				const formData = new FormData();
				files.forEach((file) => formData.append(inputId, file));
				formData.append('csrf_token', _CSRFToken);

				post(url, formData, {
					beforeSend: () => {
						alert.loader('Uploading...');
						if (onBeforeSend?.() === false) return false;
					},
					onSuccess: (response) => {
						onSuccess?.(response, files);
						if (!disablePreview) _createPreviewUI(previewSelector, multiple, files);
					},
					onError
				});

				e.target.value = '';
			});

			document.addEventListener('click', (e) => {
				const removeBtn = e.target.closest(`${previewSelector} .remove-btn`);
				if (removeBtn) document.getElementById(removeBtn.getAttribute('data-id')).remove();
			});
		};

		return {
			create
		};

	}();

	const tinymce = function() {
		const init = (containerId, options = {}) => {
			const textarea = document.querySelector(containerId);
			if (!textarea) return;

			if (typeof tinyMCE !== 'object') {
				throw new Error('TinyMCE script is not inlcuded in head.');
			}

			const defaultOptions = {
				selector: 'textarea' + containerId,
				height: 500,
				menubar: false,
				plugins: [
					'advlist lists link anchor',
					'media table paste code'
				],
				toolbar: '',
				content_css: [
					'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
				]
			};

			const mergedOptions = { ...defaultOptions, ...options };

			tinyMCE.remove();
			tinyMCE.init(mergedOptions);
		};

		return { init };

	}();

	const tomSelect = (() => {
		const init = (containerId, options = {}) => {
			if (!window.TomSelect) {
				throw new Error('TomSelect script is not included in head.');
			}

			const element = document.querySelector(containerId);
			if (!element) return;

			const defaultOptions = {
				copyClassesToDropdown: false,
				dropdownParent: 'body',
				controlInput: '<input>',
				render: {
					item: _renderOption,
					option: _renderOption,
				}
			};

			const mergedOptions = { ...defaultOptions, ...options };
			new TomSelect(element, mergedOptions);
		};

		const _renderOption = (data, escape) => {
			return createElements('div', {}, [
				...(data.customProperties ? [
					createElements('span', { class: 'dropdown-item-indicator' }, [
						document.createTextNode(data.customProperties)
					])
				] : []),
				document.createTextNode(escape(data.text))
			]);
		};

		return { init };
	})();

	const googleChart = (() => {
		const _createChart = ({ containerId, data, options = {}, packageType, chartType, apiKey }) => {
			const container = document.getElementById(containerId);
			if (!container) return false;

			google.charts.load('current', { packages: [packageType], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(() => {
				if (!data) throw new Error('Set the data in table property');

				const dataTable = data(new google.visualization.DataTable());
				const chart = new chartType(container);
				chart.draw(dataTable, options);
			});

			return true;
		};

		return {
			bar: (params) => _createChart({ ...params, packageType: 'bar', chartType: google.charts.Bar, options: google.charts.Bar.convertOptions(params.options) }),
			calendar: (params) => _createChart({ ...params, packageType: 'calendar', chartType: google.visualization.Calendar }),
			geo: (params) => {
				if (params.options?.displayMode === 'markers' && !params.apiKey) {
					throw new Error('Markers require geocoding, you\'ll need an ApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
				}
				return _createChart({ ...params, packageType: 'corechart', chartType: google.visualization.GeoChart });
			},
			pie: (params) => _createChart({ ...params, packageType: 'corechart', chartType: google.visualization.PieChart }),
			line: (params) => _createChart({ ...params, packageType: 'line', chartType: google.charts.Line, options: google.charts.Line.convertOptions(params.options) }),
			map: (params) => {
				if (!params.apiKey) {
					throw new Error('Maps require a mapsApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
				}
				return _createChart({ ...params, packageType: 'map', chartType: google.visualization.Map });
			},
			trendLine: (params) => _createChart({
				...params,
				packageType: 'corechart',
				chartType: google.visualization.ScatterChart,
				options: { trendlines: { 0: {} }, ...params.options }
			})
		};
	})();

	const mortgageCalculator = (() => {
		const _calculateMortgage = () => {
			const resultContainer = document.querySelector('.mortgage-calculator-form #result');
			if (!resultContainer) return;

			const { monthlyPayment, formattedMonthlyPayment } = _getAmortization();

			resultContainer.setAttribute('monthlyPayment', monthlyPayment);
			resultContainer.innerHTML = `&#8369;${formattedMonthlyPayment}`;
		};

		const _calculateMortgageOnChange = () => {
			document.addEventListener('change', (event) => {
				const targets = ['#mortgageDownpayment', '#mortgageInterest', '#mortgageYear'];
				if (targets.some(selector => event.target.matches(`.mortgage-calculator-form ${selector}`))) {
					_calculateMortgage();

					
				}
			});
		};

		const _createSelectElement = (id, options, selectedValue) => {
			return createElements('select', { id, class: 'form-select' }, 
				options.map(option =>
					createElements('option', { value: option, ...(option === selectedValue ? { selected: true } : {}) }, [document.createTextNode(`${option}%`)])
				)
			);
		};

		const _createDownPaymentSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #dpSelection');
			if (container) {
				const downPaymentOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
				const select = _createSelectElement('mortgageDownpayment', downPaymentOptions, 20);
				container.insertAdjacentElement('afterend', select);
				container.remove();
			}
		};

		const _createInterestSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #interestSelection');
			if (container) {
				const interestOptions = Array.from({ length: 81 }, (_, i) => (i * 0.25).toFixed(2));
				const select = _createSelectElement('mortgageInterest', interestOptions, '3.75');
				container.insertAdjacentElement('afterend', select);
				container.remove();
			}
		};

		const _createYearsSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #yearSelection');
			if (container) {
				const yearsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
				const select = _createSelectElement('mortgageYear', yearsOptions, 3);
				container.insertAdjacentElement('afterend', select);
				container.remove();
			}
		};

		const _pmt = ({ rate, nper, presentValue }) => {
			const presentValueInterestFactor = Math.pow(1 + rate, nper);
			const payment = rate / (presentValueInterestFactor - 1) * -(presentValue * presentValueInterestFactor);
			return payment;
		};

		const _computeSchedule = ({ loanAmount, interestRate, paymentsPerYear, years, monthlyPayment }) => {
			const schedule = [];
			let remaining = loanAmount;
			const numberOfPayments = paymentsPerYear * years;

			for (let i = 0; i <= numberOfPayments; i++) {
				const interest = remaining * (interestRate / 100 / paymentsPerYear);
				const principle = monthlyPayment - interest;
				schedule.push([i, Math.max(0, principle), Math.max(0, interest), Math.max(0, remaining)]);
				remaining -= principle;
			}

			return schedule;
		};

		const _getAmortization = () => {
			const getValue = selector => document.querySelector(selector)?.value;

			const sellingPrice = parseInt(getValue('#sellingPrice'), 10);
			const downPaymentPercent = parseInt(getValue('#mortgageDownpayment option:checked'), 10);
			const downPayment = sellingPrice * (downPaymentPercent / 100);
			const loanAmount = sellingPrice - downPayment;

			const interestRate = parseFloat(getValue('#mortgageInterest option:checked'));
			const years = parseInt(getValue('#mortgageYear option:checked'), 10);
			const paymentsPerYear = 12;

			const monthlyPayment = _pmt({
				rate: (interestRate / 100) / paymentsPerYear,
				nper: paymentsPerYear * (years + 1),
				presentValue: -loanAmount
			});

			return {
				monthlyPayment,
				formattedMonthlyPayment: parseFloat(monthlyPayment.toFixed(2)).toLocaleString(),
				schedule: _computeSchedule({
					loanAmount,
					interestRate,
					paymentsPerYear,
					years,
					monthlyPayment
				})
			};
		};

		return {
			_initBeforeLoad: _calculateMortgageOnChange,
			init: () => {
				_createDownPaymentSelection();
				_createInterestSelection();
				_createYearsSelection();
				_calculateMortgage();
			}
		};
	})();

	const validator = function() {
		let constraints = {};
		let errors = [];

		const validate = (data, rules = constraints) => {
			if (typeof rules !== 'object') throw new Error('rules must be an object.');
			if (typeof data !== 'object' || data instanceof FormData) throw new Error('data must be an object. Use eo.serializeFormData(data) instead.');
			errors = [];
			Object.entries(rules).forEach(([field, ruleset]) => {
				const value = getValue(data, field);
				Object.entries(ruleset).forEach(([rule, param]) => {
					if (validators[rule] && !validators[rule](value, param)) {
						const customMessage = param.message || errorMessages[rule](param);
						errors.push(`${formatField(field)} ${customMessage}`);
					}
				});
			});
			return errors.length === 0;
		};

		const getValue = (data, field) =>
			field.split('.').reduce((obj, key) => obj?.[key], data);

		const formatField = (name) => {
			const parts = name.split('.');
			const fieldName = parts.pop();
			return fieldName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
		};

		const errorMessages = {
			required: () => 'is required.',
			length: ({ min, max }) => `must be between ${min} and ${max} characters.`,
			number: ({ min, max }) => `must be a number${min ? ` greater than ${min}` : ''}${max ? ` and less than ${max}` : ''}.`,
			url: () => 'is not a valid URL.',
			email: () => 'is not a valid email address.',
			date: () => 'is not a valid date.',
			datetime: () => 'is not a valid datetime.',
			equality: (param) => `must be equal to ${param}.`,
			type: (param) => `must be of type ${param}.`
		};

		const validators = {
			required: (value, param) => param && (value !== null && value !== undefined && value !== ''),
			length: (value, { min, max }) => typeof value === 'string' && value.length >= min && value.length <= max,
			number: (value, { min, max }) => {
				if (isNaN(value)) return false;
				const num = parseFloat(value);
				return (min === undefined || num > min) && (max === undefined || num < max);
			},
			url: (value) => typeof value === 'string' && /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value),
			email: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
			date: (value) => !isNaN(Date.parse(value)),
			datetime: (value) => !isNaN(new Date(value).getTime()),
			equality: (value, param) => value === param,
			type: (value, param) => typeof value === param
		};

		return {
			validate,
			getErrors: () => errors,
			setConstraints: (rules) => (constraints = rules),
			resetConstraints: () => (constraints = {})
		};

	}();

	const arrayToDotNotation = (obj, prefix = '') =>
		Object.keys(obj).reduce((res, key) => {
			const prop = prefix ? `${prefix}.${key}` : key;
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				Object.assign(res, arrayToDotNotation(obj[key], prop));
			} else {
				res[prop] = obj[key];
			}
			return res;
		}, {});

	const dotNotationToArray = (obj) => {
		let result = {};
		Object.keys(obj).forEach(key => {
			key.split('.').reduce((res, part, index, arr) =>
				res[part] || (res[part] = arr.length - 1 === index ? obj[key] : {}), result);
		});
		return result;
	};

	const eo = {
		initBeforeLoad: function() {
			/* Address.initBeforeLoad(); */
			video._initBeforeLoad();
			_slider._initBeforeLoad();
			mortgageCalculator._initBeforeLoad();
		},

		initAfterLoad: () => {
			/* Address.initAfterLoad(); */
			_slider._initAfterLoad();
			modal._initAfterLoad();

			let resizeTO;

			window.addEventListener('resize', function() {
				if (resizeTO) {
					clearTimeout(resizeTO);
				}
				resizeTO = setTimeout(function() {
					window.dispatchEvent(new Event('resizeEnd'));
				}, 500);
			});
		},

		userClient,
		_CSRFToken,
		settings,
		moveHtmlElement,
		createElements,
		createHiddenInput,
		epochToTimeString,
		trim,
		formatFileSize,
		uuidv4,
		getRandomChar,
		getRandomNum,
		convertCurrency,
		serializeFormData,
		getYoutubeVideoData,
		post,
		get,
		redirect,
		arrayToDotNotation,
		dotNotationToArray,
		diffDays,
		removeFalseArray,
		removeDuplicatesArray,
		getCookie,
		setCookie,
		readableDate,
		validator,
		video,
		modal,
		alert,
		button,
		tinymce,
		googleChart,
		slider,
		tomSelect,

		/** COMPONENTS */
		submitForm,
		uploader,
		mortgageCalculator,

	};

	return eo;

});

document.addEventListener('DOMContentLoaded', function() {
	window.eo.initBeforeLoad();
});

window.addEventListener('load', function() {
	window.eo.initAfterLoad();
});

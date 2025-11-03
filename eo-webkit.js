/*!
 * eo-webkit.js 2.0.0
 * Copyright (c) 2025 Eman Olivas
 * eo-webkit.js may be freely distributed under the MIT license.
*/

/* global define */
/* global module */
/* global exports */

/* eo-webkit.js */

; (function (factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		window.eo = factory();
	}
})(function () {

	'use strict';

	let document = window.document;
	const version = 'v2.0.0';

	const CSRFToken = (() => {
		const token = document.querySelector('meta[name="csrf_token"]')?.content;
		
		if (!token) {
			console.error('CSRF Token not found in meta tags! <meta name="csrf_token" content="{{ csrf_token() }}">');
			return false;
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
	const redirect = (url) => {
		alert.loader('Redirecting...');
		window.location = url;
	};

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

		return `${size}${sizes[i]}`;
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
		return '00000000-0000-4000-8000-000000000000'.replace(/[018]/g, c =>
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
	 * Formats large numbers into a more readable currency notation
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
	const formatCurrency = (amount) => {
		const num = Math.abs(Number(amount));
		const suffixes = ['', 'K', 'M', 'B', 'T', 'Qd', 'Qn', 'Sx', 'Sp', 'Oc', 'Nn', 'Dc', 'Ud', 'Dd', 'Td', 'Qdd', 'Qnd', 'Sxd', 'Spd', 'Od', 'Nd', 'V'];
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

	const retry = async function (fn, options = {}) {
		const {
			maxAttempts = 3,
			delay = 500,
			backoff = true,
			onRetry = () => {}
		} = options;

		let attempt = 0;
		while (attempt < maxAttempts) {
			try {
				return await fn();
			} catch (err) {
				attempt++;
				if (attempt >= maxAttempts) throw err;

				onRetry(err, attempt);
				await new Promise(res => setTimeout(res, backoff ? delay * attempt : delay));
			}
		}
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
				embed: `https://www.youtube.com/embed/${id}`
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

	const createHiddenInput = (name, value, id = null) => {
		if (typeof name !== 'string' || !name.trim()) throw new Error('Invalid name');
		if (typeof value !== 'string') throw new Error('Invalid value');

		return createElements('input', {
			type: 'hidden',
			name: _sanitize(name),
			value: _sanitize(value),
			id: id ? _sanitize(id) : null,
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
			console.error('Element not found');
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

		if (onBeforeSend?.() === false) return;

		let headers = {
			'X-Requested-With': 'XMLHttpRequest',
			'X-CSRF-TOKEN': CSRFToken
		};

		let body = data;

		if (data instanceof FormData) {
			body = data;
		} else if (contentType.includes('application/json')) {
			body = JSON.stringify(serializeFormData(data));
			headers['Content-Type'] = contentType;
		} else {
			headers['Content-Type'] = contentType;
			body = serializeFormData(data);
			body = Object.keys(body).map(key => {
				const value = body[key];
				if (Array.isArray(value)) {
					return value.map(item => `${encodeURIComponent(key + '[]')}=${encodeURIComponent(item)}`).join('&');
				} else {
					return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
				}
			}).join('&');
		}
		

		fetch(url, {
			method: 'POST',
			headers,
			body,
			credentials: 'same-origin',
		})
			.then(async response => {
				return response.text().then(text => {
					try {
						return { data: JSON.parse(text), response };
					} catch  {
						return { data: text, response };
					}
				});
			})
			.then(({ data, response }) => {
				if (!response.ok) {
					const status = response.status;
					const message = data?.message || `Request failed with status ${status}`;
					const errors = data?.errors || data;

					onError?.(message, errors, status);
					return;
				}
				
				// Validate the content for potential fatal errors
				if (typeof data === 'string' && (data.includes('Fatal error') || data.includes('ErrorException'))) {
					throw new Error('Server encountered a fatal error: ' + data);
				}

				onSuccess?.(data);
			})
			.catch(error => {
			})
			.finally(onComplete);
	};

	/**
	 * Sends an asynchronous GET request to the specified URL with optional data.
	 *
	 * If `data` is a function, it is treated as the `success` callback, and `dataType` is optional.
	 * If `data` is an object, it is converted to URL search parameters and appended to the URL.
	 *
	 * The function attempts to parse JSON responses if the `dataType` is 'json' or the response
	 * Content-Type includes 'application/json'. Otherwise, it returns the response text.
	 *
	 * The `success` callback is invoked with the parsed result when the request is successful.
	 *
	 * If the request fails, the error is logged to the console and re-thrown.
	 *
	 * @param {string} url - The URL to send the GET request to.
	 * @param {object|function} data - Optional data to be sent as query parameters, or the success callback function.
	 * @param {function} success - The callback function invoked with the response data on success.
	 * @param {string} dataType - The type of data expected in the response ('json' or others).
	 * @throws Will log an error to the console and re-throw if the request fails.
	 */
	const get = async (url, data, success, dataType, options = {}) => {
		if (typeof data === 'function') [success, dataType, options, data] = [data, success, options, undefined];

		if (data && typeof data === 'object' && Object.keys(data).length > 0) {
			const params = new URLSearchParams(data).toString();
			if (params) url += (url.includes('?') ? '&' : '?') + params;
		}

		const defaultHeaders = {
			'Accept': dataType === 'json' ? 'application/json' :
				dataType === 'blob' ? 'image/png' : 'text/html',
			'X-Requested-With': 'XMLHttpRequest'
		};

		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: { ...defaultHeaders, ...(options.headers || {}) }
			});
			
			const contentType = response.headers.get('Content-Type') || '';
			const isJson = dataType === 'json' || contentType.includes('application/json');
			const isBlob = dataType === 'blob' || contentType.includes('image/') || contentType.includes('application/octet-stream');
			
			let result;
			if (response.status === 204) {
				// No Content
				result = null;
			} else if (isBlob) {
            	result = await response.blob();
        	} else if (isJson) {
				const text = await response.text();
				result = text ? JSON.parse(text) : null;
			} else {
				result = await response.text();
			}
			
			if (!response.ok) {
				success?.(result, response);
           		return { success: false, status: response.status, data: result };
			}
			
			success?.(result, response);
			return { success: true, status: response.status, data: result };
			
		} catch (error) {
			console.error('Fetch Error:', error);
			return { success: false, status: 0, data: null, error };
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

		/**
		 * Asynchronously retrieves the user's geographical information from the IPInfo service.
		 * Updates the clientInfo object with the retrieved geo data and stores it in local storage.
		 * In case of an error during the fetch process, logs an error message to the console.
		 * @private
		 * @throws Will log an error to the console if the request fails.
		 */
		const _getGeoInfo = async () => {
			try {
				const geo = await get('https://ipinfo.io/json');
				clientInfo.geo = geo.data;
				
				localStorage.setItem('EOclient', JSON.stringify(clientInfo));
			} catch (error) {
				console.error('Error getting geo info:', error);
			}
		};

		/**
		 * Detects the browser name from the user agent string.
		 * Tries to match the user agent string against the given browsers.
		 * If a match is found, the corresponding browser name is assigned to the clientInfo object.
		 * If no match is found, assigns 'Unknown Browser' to the clientInfo object.
		 * @private
		 * @returns {void}
		 */
		const _detectBrowser = () => {
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
			_getGeoInfo();
			_detectBrowser();
		}

		return clientInfo;
	})();

	const video = (() => {
		/**
		 * Resets the form and shows an error message to the user when the response from the server
		 * is invalid (e.g. the video URL is not valid or the video is already added).
		 * @param {HTMLInputElement} input - The input element to add the is-invalid class to.
		 * @param {HTMLSpanElement} btnSpinner - The spinner button element to hide.
		 * @param {HTMLSpanElement} btnText - The text button element to show.
		 */
		const _resetForm = (input, btnSpinner, btnText) => {
			btnSpinner.classList.add('d-none');
			btnText.classList.remove('d-none');
			input.disabled = false;
		};

		/**
		 * Resets the form and shows an error message to the user when the response from the server
		 * is invalid (e.g. the video URL is not valid or the video is already added).
		 * @param {HTMLInputElement} input - The input element to add the is-invalid class to.
		 * @param {HTMLSpanElement} btnSpinner - The spinner element to hide.
		 * @param {HTMLSpanElement} btnText - The text element to show.
		 * @param {string} message - The error message to show to the user.
		 */
		const _invalidResponse = (input, btnSpinner, btnText, message) => {
			input.classList.add('is-invalid');
			_resetForm(input, btnSpinner, btnText);
			alert.error(message);
		};

		/**
		 * Handles the click event of the add video button and adds the video to the
		 * video list container if the YouTube URL is valid and the video is not already
		 * added.
		 * @private
		 */
		const _handleVideoAdd = (onBeforeSend, onSuccess) => {
			document.addEventListener('click', (event) => {

				const btn = event.target.closest('.btn-add-video');
				if (!btn) return;
				
				const input = document.querySelector('.youtubeUrl');
				if (!input) return;
				
				const btnSpinner = btn.querySelector('.spinner-border');
				const btnText = btn.querySelector('.btn-text');
				const videoUrl = input.value.trim();
				
				btnSpinner.classList.remove('d-none');
				btnText.classList.add('d-none');
				input.disabled = true;

				if (!videoUrl) return _invalidResponse(input, btnSpinner, btnText, 'YouTube URL is required!');
				
				const videoData = getYoutubeVideoData(videoUrl);

				const _handleBeforeSend = async () => {
					if (typeof onBeforeSend === "function") {
						const result = await onBeforeSend(videoData);
						if (result instanceof Promise) {
							return result.then((resolvedResult) => {
								if (resolvedResult === false) {
									_resetForm(input, btnSpinner, btnText);
									return false;
								}
								return true;
							});
						} else {
							// Handle synchronous return
							if (result === false) {
								_resetForm(input, btnSpinner, btnText);
								return false;
							}
						}
					}
					return true;
				};

				_handleBeforeSend().then((shouldProceed) => {
					if (!shouldProceed) return;
					
					if (!videoData || !videoData.id) return _invalidResponse(input, btnSpinner, btnText, videoData?.message || 'Invalid YouTube URL!');
					if (document.querySelector(`.${CSS.escape(videoData.id)}`)) return _invalidResponse(input, btnSpinner, btnText, 'Video already added!');
					
					const videoContainer = createElements('div', { class: videoData.id, 'data-id': videoData.id }, [
						createHiddenInput(`videos[${videoData.id}][id]`, videoData.id),
						createHiddenInput(`videos[${videoData.id}][url]`, videoData.url),
						createHiddenInput(`videos[${videoData.id}][embed]`, videoData.embed),
						...Object.entries(videoData.thumbnail || {}).map(([key, value]) => createHiddenInput(`videos[${videoData.id}][thumbnail][${key}]`, value)),
						createHiddenInput(`videos[${videoData.id}][created_at]`, Date.now().toString()),
						createElements('div', {
							class: 'position-relative p-2 cursor-pointer text-white',
							style: `width: 15rem; height: 9.5rem; background-size: cover; background-position: center; background-image: url(${videoData.thumbnail?.sd || ''});`
						}, [
							createElements('div', { class: 'position-absolute top-0 end-0 btn-delete-container p-2' }, [
								createElements('span', { class: 'btn btn-danger btn-sm btn-remove-video', 'data-id': videoData.id }, [ document.createTextNode('X') ])
							]),
							createElements('div', {
								class: 'btn-playback position-absolute top-50 start-50 translate-middle text-center',
								'data-id': videoData.id,
								'data-url': videoData.url,
								'data-embed': videoData.embed,
							}, [
								createElements('i', { class: 'ti ti-brand-youtube fs-48' })
							])
						])
					]);

					document.querySelector('.video-list-container')?.prepend(videoContainer);
					input.value = '';
					input.classList.remove('is-invalid');
					onSuccess?.(videoData);
					_resetForm(input, btnSpinner, btnText);
				});

			});
		};

		/**
		 * Handles video playback by listening for clicks on the video thumbnails and
		 * opening a modal with the video player.
		 *
		 * @private
		 * @function
		 */
		const _handleVideoPlayback = (onPlayBack) => {
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
				onPlayBack?.({
					id: btn.dataset.id,
					url: btn.dataset.url,
					embed: btn.dataset.embed
				});
			});
		};

		/**
		 * Attaches a click event listener to the document to handle video deletion.
		 * 
		 * This function listens for clicks on elements with the class 'btn-remove-video'.
		 * When clicked, it removes the corresponding video element from the DOM using 
		 * the data-id attribute of the clicked button.
		 * 
		 * @private
		 */
		const _handleVideoDeletion = (onRemove) => {
			document.addEventListener('click', (event) => {
				const btn = event.target.closest('.btn-remove-video');
				if (btn) document.querySelector(`.${CSS.escape(btn.dataset.id)}`)?.remove();
				if (btn) onRemove?.(btn.dataset.id);
			});
		};

		/**
		 * Creates the video form element.
		 *
		 * @private
		 * @function
		 */
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
			
			/**
			 * Initializes the video module by creating the form elements for inputting
			 * YouTube URLs and adding them to the page.
			 * @function
			 */
			init: ({ onBeforeSend, onSuccess, onRemove, onPlayback } = {}) => {
				_createVideoForm();
				_handleVideoAdd(onBeforeSend, onSuccess);
				_handleVideoPlayback(onPlayback);
				_handleVideoDeletion(onRemove);
			}
		};
	})();

	const alert = function () {
		/**
		 * Displays a message in the specified container element on the webpage.
		 *
		 * @param {string} message - The message to be displayed.
		 * @param {string} element - The CSS selector of the container where the message will be displayed.
		 *                           If the container does not exist, a new one will be created.
		 */
		const _display = (message, element) => {
			const messageContainer = document.querySelector(element);

			if (!messageContainer) {
				document.body.prepend(createElements('div', { class: 'response' }));
			}

			document.querySelector(element).innerHTML = message;
		};

		/**
		 * Creates and displays an alert message on the webpage.
		 * 
		 * @param {string} message - The message to be displayed in the alert.
		 * @param {string} [type='success'] - The type of alert, which determines its styling (e.g., 'success', 'danger').
		 * @param {string} [element='.response'] - The CSS selector of the container where the alert will be displayed.
		 */
		const _createAlert = (message, type = 'success', element = '.response') => {
			const alertIcons = {
				success: createElements('i', { class: 'ti ti-check' }),
				info: createElements('i', { class: 'ti ti-info-circle' }),
				warning: createElements('i', { class: 'ti ti-alert-triangle' }),
				danger: createElements('i', { class: 'ti ti-x' })
			};
			const alertClasses = `message alert alert-${type} alert-dismissible show`;
			const alertDiv = createElements('div', { class: alertClasses, role: 'alert' }, [
				createElements('div', { class: 'alert-icon float-start w-1', style: 'margin-top: 1px' }, [ alertIcons[type] ]),
				createElements('span', { class: `alert-description text-${type}` }, [document.createTextNode(message)]),
				createElements('button', {
					type: 'button', class: 'btn-close',
					'data-bs-dismiss': 'alert', 'aria-label': 'Close'
				})
			]);

			_display(alertDiv.outerHTML, element);
		};

		const success = (message, element = '.response') => _createAlert(message, 'success', element);
		const error = (message, element = '.response') => _createAlert(message, 'danger', element);

		/**
		 * Displays a processing loader with a message in the specified container element on the webpage.
		 *
		 * @param {string} [message='Processing, Please wait...'] - The message to be displayed with the loader.
		 * @param {string} [element='.response'] - The CSS selector of the container where the loader will be displayed.
		 */
		const loader = (message = 'Processing, Please wait...', element = '.response') => {
			const loaderDiv = createElements('div', { class: 'bg-white p-3 mt-3 rounded border' }, [
				createElements('div', { class: 'd-flex gap-3 align-items-center' }, [
					createElements('div', { class: 'loader' }),
					createElements('p', { class: 'mb-0' }, [document.createTextNode(message)])
				])
			]);

			_display(loaderDiv.outerHTML, element);
		};

		/**
		 * Creates and displays an alert message on the webpage.
		 * 
		 * @param {string} message - The message to be displayed in the alert.
		 * @param {string} type - The type of alert, which determines its styling (e.g., 'success', 'danger').
		 * @param {string} [element='.response'] - The CSS selector of the container where the alert will be displayed.
		 */
		const message = (message, type, element = '.response') => {
			_createAlert(message, type, element);
		};

		const destroy = (element) => {
			document.querySelector(element).innerHTML = '';
		}

		return {
			success,
			error,
			loader,
			message,
			destroy
		};
	}();

	const button = (() => {
		/**
		 * Sets the state of a set of buttons or clickable elements identified by the given selector.
		 * @param {string} selector - The CSS selector to identify the elements to modify.
		 * @param {boolean} disabled - Whether to disable the elements or not.
		 * @returns {undefined}
		 */
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
	 * @param {{ rules: Object, callback: Function, onBeforeSend: Function, redirectUrl: String  }} [options] - options for the submission
	 * @param {{ rules: Object }} [options.rules] - the rules object
	 * @param {Function} [options.callback] - the callback function to call on success
	 * @param {Function} [options.onBeforeSend] - the callback function to call before sending
	 * @param {String} [options.redirectUrl] - the url to redirect to on success
	 * @returns {JQueryPromise} - the promise returned by $.post
	 */
	const submitForm = (formId, { rules, callback, onBeforeSend, redirectUrl, onError, onComplete, redirectTimeout = 3000, alertContainerType = 'modal' } = {}) => {
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
		CSRFToken ? formData.append('csrf_token', CSRFToken) : null;

		onBeforeSend?.(formData);

		const isAlert = alertContainerType === 'alert';

		return post(form.getAttribute('action'), formData, {
			onBeforeSend: () => {
				isAlert ? alert.loader() : modal.alert.loader();
				button.disable();

				if (typeof rules === 'object') {
					const validation = validator.validate(serializeFormData(formData), rules);
					if (!validation) {

						modal.alert.close();
						isAlert
							? alert.error(validator.getErrors().join(', '))
							: (() => {
								modal.alert.error('');

								const modalElement = document.querySelector('.response-modal .message-container');
								if (!modalElement) return;

								const list = createElements('ul', { class: '' }, 
									validator.getErrors().map(msg => createElements('li', {}, [msg]))
								);

								const container = createElements('div', { class: 'error-container' }, [list]);

								modalElement.appendChild(container);
							})(); 
						
						button.enable();
						return false;
					}
				}
			},
			onSuccess: (responseData) => {
				try {
					const response = typeof responseData === 'object' ? responseData : JSON.parse(responseData);
					isAlert
						? alert.message(response.message)
						: modal.alert.message(response.message);
					
					callback?.(serializeFormData(formData), response);
				} catch (e) {
					alert.destroy('.response');
					callback?.(serializeFormData(formData), responseData, e);
				}

				if (redirectUrl || (responseData && responseData.redirect)) {
					setTimeout(() => redirect(redirectUrl ?? responseData.redirect), redirectTimeout);
				}
			},
			onError: (message, rawResponse) => {
				if ((rawResponse && rawResponse.redirect)) {
					setTimeout(() => redirect(rawResponse.redirect), redirectTimeout);
				}

				isAlert
					? alert.error(message)
					: modal.alert.error(message);

				onError?.(message, rawResponse);
			},
			onComplete: () => {
				modal.alert.close();
				button.enable();
				onComplete?.();
			}
		});
	};

	const modal = (() => {
		/**
		 * Creates a modal element with a given id, size, content, status and destroyable flag.
		 * @param {string} id - The id of the modal element.
		 * @param {string} size - The size of the modal element. Can be "xs", "sm", "md", "lg", "xl", "fullscreen".
		 * @param {function} [callback] - A callback function to be called to generate the modal content.
		 * @param {boolean} [status=false] - Whether to add a modal status element to the modal element.
		 * @param {boolean} [destroyable=true] - Whether to add a modal destroyable class to the modal element.
		 */
		const create = ({ id, size, callback, status = false, destroyable = true, centered = false } = {}) => {
			const _modal = createElements('div', {
				class: `modal ${destroyable ? 'modal-destroyable' : ''}`,
				id,
				'aria-labelledby': 'modal',
				'aria-hidden': 'true'
			}, [
				createElements('div', { class: `modal-dialog modal-${size} ${centered ? 'modal-dialog-centered' : ''}` }, [
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

		/**
		 * Parses the result of a callback function into an array of DOM elements.
		 * 
		 * @param {Function} callback - A callback function that returns either an HTML string or a DOM Element.
		 * @returns {Array} An array of DOM elements derived from the callback's return value.
		 *                  Returns an empty array if no callback is provided, or the result is not a string or Element.
		 */
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

		/**
		 * Handles the click event of the close button for the modal.
		 * 
		 * When the close button is clicked, the modal is closed using the
		 * Bootstrap Modal instance. If the modal is not found, nothing will
		 * happen.
		 */
		const _handleModalClose = () => {
			document.addEventListener('click', (event) => {
				const _modal = event.target.closest('.modal');
				if (event.target.classList.contains('btn-close') && _modal) {
					bootstrap.Modal.getInstance(_modal)?.hide();
				}
			});
		};

		/**
		 * Attaches an event listener to the document to listen for the 'hidden.bs.modal' event,
		 * which is triggered when a Bootstrap modal is fully hidden. If the modal has the class
		 * 'modal-destroyable', it will be removed from the DOM upon closure.
		 * This helps manage dynamic modal elements and prevents clutter in the DOM.
		 */
		const _destroyModalOnClose = () => {
			document.addEventListener('hidden.bs.modal', (event) => {
				const _modal = document.getElementById(event.target.id);
				if (_modal?.classList.contains('modal-destroyable')) _modal.remove();
			});
		};

		const alert = (() => {
			const _create = (element, status = 'info') => {
				create({
					id: 'modalAlertMessage',
					size: 'sm',
					status,
					centered: true,
					callback: () => element.outerHTML
				});
			};

			const success = (message) => {
				_create(createElements('div', { class: 'text-center py-2' }, [
					createElements('i', { class: 'ti ti-circle-check text-success', style: 'font-size: 80px' }, []),
					createElements('h3', { class: 'mt-2 mb-0' }, []),
					createElements('div', { class: 'message-container text-start' }, [message]),
				]), 'success');
			};

			const error = (message) => {
				_create(createElements('div', { class: 'text-center py-2' }, [
					createElements('i', { class: 'ti ti-alert-triangle text-danger', style: 'font-size: 50px' }, []),
					createElements('h3', { class: 'mt-2 mb-2' }, [document.createTextNode('Correct the following error(s):')]),
					createElements('div', { class: 'message-container text-start' }, [message]),
				]), 'danger');
			};

			const message = (message) => {
				_create(createElements('div', { class: 'text-center py-2' }, [
					createElements('i', { class: 'ti ti-alert-square-rounded text-info', style: 'font-size: 50px' }, []),
					createElements('h3', { class: 'mt-2 mb-0' }, [document.createTextNode('Information')]),
					createElements('div', { class: 'message-container text-start' }, [message]),
				]), 'info');
			};

			const loader = (message = 'Processing, Please wait...') => {
				_create(createElements('div', { class: 'p-3 mt-3 ' }, [
					createElements('div', { class: 'd-flex gap-3 align-items-center' }, [
						createElements('div', { class: 'loader' }),
						createElements('p', { class: 'mb-0' }, [message])
					])
				]), 'info');
			};

			const close = () => {
				const element = document.getElementById('modalAlertMessage');
				const modalInstance = bootstrap.Modal.getInstance(element);
				modalInstance?.hide();
			};

			return {
				loader,
				success,
				error,
				close,
				message
			};
		})();

		return {
			/**
			 * Initializes the modal after the page has finished loading.
			 * 
			 * This method is called when the page has finished loading and is responsible
			 * for attaching an event listener to the document to listen for the
			 * 'hidden.bs.modal' event, which is triggered when a Bootstrap modal is
			 * fully hidden. Additionally, this method will attach an event listener to
			 * the document to listen for the click event of the close button for the
			 * modal.
			 */
			_initBeforeLoad: () => {
				_destroyModalOnClose();
				_handleModalClose();
			},
			create,
			alert
		};
	})();

	const toast = (message, options = {}) => {
		const {
			type = 'info', // 'success', 'error', 'warning', 'info'
			duration = 3000,
			class: customClass = ''
		} = options;

		// Bootstrap contextual classes
		const _typeClass = {
			success: 'bg-success text-white',
			error: 'bg-danger text-white',
			warning: 'bg-warning text-dark',
			info: 'bg-primary text-white'
		}[type] || 'bg-secondary text-white';

		const _toastElement = createElements('div', {
			class: `toast align-items-center ${_typeClass} ${customClass}`,
			role: 'alert',
			'aria-live': 'assertive',
			'aria-atomic': 'true'
		}, [
			createElements('div', {
				class: 'd-flex'
			}, [
				createElements('div', {
					class: 'toast-body'
				}, [message]),
				createElements('button', {
					type: 'button',
					class: 'btn-close btn-close-white me-2 m-auto',
					'data-bs-dismiss': 'toast',
					'aria-label': 'Close'
				}, [])
			])
		]);

		// Create container if needed
		let _container = document.querySelector('.toast-container');
		if (!_container) {
			_container = createElements('div', {
				class: 'toast-container position-fixed bottom-0 end-0 p-3',
				style: 'z-index: 1080'
			}, []);
			document.body.appendChild(_container);
		}
		_container.appendChild(_toastElement);

		// Initialize and show toast
		const _bootstrapToast = new bootstrap.Toast(_toastElement, { delay: duration });
		_bootstrapToast.show();

		// Cleanup after duration
		setTimeout(() => {
			_toastElement.remove();
			if (_container.children.length === 0) _container.remove();
		}, duration + 200); // buffer for animation
	};

	const uploader = function () {
		let defaultUploadType = 'image';
		const defaultIcons = {
			image: 'https://static.vecteezy.com/system/resources/previews/020/213/738/non_2x/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg',
			document: 'https://cdn-icons-png.flaticon.com/512/4208/4208479.png',
			docPreview: 'https://cdn-icons-png.flaticon.com/512/4208/4208479.png'
		};

		const setDefaultIcon = (type, value) => {
			if (type in defaultIcons) {
				defaultIcons[type] = value;
			}
		};

		/**
		 * Creates a new file uploader instance.
		 * 
		 * @param {string} [uploadSelector='.upload-container'] - The CSS selector of the container element where the uploader will be created.
		 * @param {string} url - The URL to which the files will be uploaded.
		 * @param {Object} [options={}] - Additional configuration options for the uploader.
		 * @param {string} [options.inputName='eoFileUpload'] - The name attribute for the file input.
		 * @param {string} [options.previewSelector='.uploaded-photo'] - The CSS selector for the preview container.
		 * @param {boolean} [options.disablePreview=false] - Whether to disable the preview functionality.
		 * @param {string} [options.uploadType='image'] - The type of upload, either "image" or "document".
		 * @param {string} [options.accept] - The MIME type of files to accept. Defaults to "image/*" or "application/pdf" based on the uploadType.
		 * @param {boolean} [options.multiple=true] - Whether to allow multiple file uploads.
		 * @param {Function} [options.onBeforeSend] - Callback function to be called before the upload request is sent.
		 * @param {Function} [options.onSuccess] - Callback function to be called when the upload is successful.
		 * @param {Function} [options.onError] - Callback function to be called when the upload fails.
		 * @param {Function} [options.onFileRemove] - Callback function to be called when a file is removed.
		 * @param {Function} [options.compressFile] - bolean to enable/disable file compression.
		 * @param {Function} [options.compression] - compression options { maxWidth: 1024, maxHeight: 1024, quality: 0.7 }.
		 * 
		 * @throws {Error} Throws an error if an invalid upload type is provided.
		 */
		const create = (uploadSelector = '.upload-container', url, options = {}) => {
			let {
				inputName = 'eoFileUpload', previewSelector = '.uploaded-photo',
				disablePreview = false, uploadType = 'image',
				accept = uploadType === 'document' ? 'application/pdf' : 'image/*',
				multiple = true, onBeforeSend, onSuccess, onError, onFileRemove, compressFile = false, compression = {}
			} = options;

			if (!['image', 'document'].includes(uploadType)) throw new Error('Invalid upload type.');

			defaultUploadType = uploadType;
			const inputId = '_' + getRandomChar(11);
			const newInputName = inputName === 'eoFileUpload' ? `${inputName}_${inputId}` : inputName;

			if (!multiple) { 
				previewSelector = previewSelector == '.uploaded-photo' ? uploadSelector : previewSelector;
				defaultIcons.image = document.querySelector(previewSelector).getAttribute('data-image') || defaultIcons.image;
			}

			_createUI(uploadSelector, previewSelector, newInputName, inputId, accept, multiple);
			_handleEvents(previewSelector, uploadType, multiple, newInputName, inputId, url, onBeforeSend, onSuccess, onError, disablePreview, onFileRemove, compressFile, compression);
		};

		/**
		 * Creates the UI elements for the file uploader.
		 * 
		 * @param {string} selector - The CSS selector of the container element to create the uploader in.
		 * @param {string} previewSelector - The CSS selector of the preview container element.
		 * @param {string} inputName - The input name.
		 * @param {string} inputId - The ID of the input element.
		 * @param {string} accept - The MIME type of the file to accept.
		 * @param {boolean} multiple - Whether to allow multiple files to be uploaded.
		 * @returns {void}
		 */
		const _createUI = (selector, previewSelector, inputName, inputId, accept, multiple) => {
			const container = document.querySelector(selector) || document.body.prepend(createElements('div', { class: 'upload-container' }));
			if (multiple) container.innerHTML = `<span class="btn btn-dark btn-eo-uploader-browse_${inputId}"><i class="ti ti-upload me-2"></i> Upload</span>`;

			document.body.prepend(createElements('form', {
				id: `uploadForm_${inputId}`, class: 'd-none', enctype: 'multipart/form-data'
			}, [createElements('input', { type: 'file', id: inputId, accept, name: multiple ? `${inputName}[]` : inputName, ...(multiple ? { multiple: true } : {}) })]));

			const appendUI = multiple
				? createElements('div', { class: 'multiple-preview d-flex flex-wrap gap-2' })
				: createElements('div', {
					id: 'photo-preview', class: `photo-preview position-relative btn-eo-uploader-browse_${inputId}`,
					style: `width: 13rem; height: 13rem; background-image: url(${defaultIcons[defaultUploadType]});`
				});
			
			document.querySelector(previewSelector).prepend(appendUI);
		};

		/**
		 * Creates a preview UI for a given file, rendering it as an image or document icon.
		 * 
		 * @param {boolean} multiple - Indicates if multiple file previews are supported.
		 * @param {File} file - The file object to be previewed.
		 * @returns {HTMLElement|string} - Returns a div element containing the file preview UI
		 *                                 if multiple is true, otherwise sets the background
		 *                                 image of an existing photo preview.
		 * 
		 * The function dynamically generates an HTML element to display a preview of the file. 
		 * For images, it creates a data URL using the File object and uses it as a background 
		 * image. For documents, it uses a default document icon. The preview UI includes a 
		 * remove button and a loading spinner. For single file previews, it directly sets the 
		 * background image of an existing photo preview element.
		 */
		const _createPreviewUI = (multiple, file) => {
			const bg = defaultUploadType === 'image' ? URL.createObjectURL(file) : defaultIcons.docPreview;
			const ext = (file.name.split('.')[1]).toLowerCase();

			return multiple ? createElements('div', {
				class: `file-container position-relative rounded border ${file.id}`, id: file.id,
				style: `width: 13rem; height: 13rem; background-size: cover; background-position: center; background-image: url(${bg}); opacity: 0.5; transition: opacity 0.3s ease-in-out;`,
			}, [
				createElements('span', { class: 'btn btn-danger btn-sm remove-btn position-absolute top-0 end-0 m-2', 'data-id': file.id, 'data-name': `${CSS.escape(file.id)}.${CSS.escape(ext)}`, 'data-container': `.${file.id}` }, ['X']),
				(defaultUploadType === 'document' ? createElements('span', { class: 'text-white position-absolute bottom-0 overflow-auto w-100 px-2 py-1 bg-dark text-nowrap small' }, [file.name.toString()]) : ''),
				createElements('div', { class: 'spinner-container d-flex justify-content-center align-items-center w-100 h-100' }, [
					createElements('div', { class: 'spinner-border text-white', style: 'width:50px; height:50px; --tblr-spinner-border-width: 5px !important;' })
				])
			]) : (document.querySelector('.photo-preview').style.backgroundImage = `url(${bg})`);
		};

		/**
		 * Creates hidden input fields for each property of a file and appends them to the appropriate container.
		 *
		 * @param {boolean} multiple - Indicates if multiple file previews are supported.
		 * @param {HTMLElement} fileContainer - The container element for file previews when multiple is true.
		 * @param {HTMLElement} previewContainer - The container element for single file preview or appending multiple file containers.
		 * @param {number} id - The unique identifier for the file.
		 * @param {File} file - The file object for which the hidden inputs are created.
		 *
		 * This function dynamically creates hidden input elements for each property of the file, including its size.
		 * It appends these inputs to the file container if multiple files are allowed; otherwise, to the preview container.
		 * The function also updates the remove button's dataset attributes and the container's id.
		 */
		const _createUploadHiddenInput = (multiple, fileContainer, previewContainer, id, file) => {
			const container = multiple ? fileContainer : previewContainer;
			const hiddenInputName = defaultUploadType === 'document' ? 'documents' : 'images';
			container.appendChild(createHiddenInput(`${hiddenInputName}[${id}][size]`, file.size.toString()));
			const ext = (file.name.split('.')[1]).toLowerCase();

			if (multiple) {
				const removeBtn = document.querySelector(`.${container.id} .remove-btn`);
				if (removeBtn) removeBtn.dataset.id = file.id; removeBtn.dataset.name = `${file.id}.${ext}`;
			}
			
			container.id = file.id;
			
			Object.entries(file).forEach(([key, value]) => {
				container.appendChild(createHiddenInput(`${hiddenInputName}[${id}][${key}]`, value?.toString() || ''));
			});
			if (multiple) previewContainer.appendChild(container);
		};

		/**
		 * Uploads an array of files sequentially. It loops through the array, awaiting the result of each upload attempt before moving on to the next.
		 * 
		 * @param {File[]} files - The array of files to be uploaded sequentially.
		 * @param {HTMLElement} previewContainer - The container element for the photo preview UI.
		 * @param {string} url - The URL to send the POST request to.
		 * @param {string} inputName - The input name.
		 * @param {boolean} multiple - Indicates if multiple file previews are supported.
		 * @param {Function} [onBeforeSend] - Callback function to be called before the upload request is sent.
		 * @param {Function} [onSuccess] - Callback function to be called when the upload is successful.
		 * @param {Function} [onError] - Callback function to be called when the upload fails.
		 * @returns {Promise<void>} - A promise that resolves when all the files have been uploaded.
		 */
		const _uploadFilesSequentially = async (files, previewContainer, url, inputName, multiple, onBeforeSend, onSuccess, onError) => {
			for (let file of files) await uploadFile(file, previewContainer, url, inputName, multiple, onBeforeSend, onSuccess, onError);
		};

		/**
		 * Uploads a single file to the given URL.
		 * 
		 * @param {File} file - The file to be uploaded.
		 * @param {HTMLElement} previewContainer - The container element for the photo preview UI.
		 * @param {string} url - The URL to send the POST request to.
		 * @param {string} inputName - The input name.
		 * @param {boolean} multiple - Indicates if multiple file previews are supported.
		 * @param {Function} [onBeforeSend] - Callback function to be called before the upload request is sent.
		 * @param {Function} [onSuccess] - Callback function to be called when the upload is successful.
		 * @param {Function} [onError] - Callback function to be called when the upload fails.
		 * @returns {Promise<void>} - A promise that resolves when the upload is complete.
		 */
		const uploadFile = (file, previewContainer, url, inputName, multiple, onBeforeSend, onSuccess, onError) => {
			return new Promise((resolve) => {
				const fileContainer = document.querySelector(multiple ? `.${CSS.escape(file.id)}` : '.photo-preview');
				const formData = new FormData();
				formData.append(multiple ? `${inputName}[]` : inputName, file);
				if (CSRFToken) formData.append('csrf_token', CSRFToken);

				post(url, formData, {
					contentType: null,
					beforeSend: () => onBeforeSend?.() === false ? false : null,
					onSuccess: (response) => {
						fileContainer.style.opacity = '1';
						document.querySelector(`#${CSS.escape(file.id)} .spinner-container`)?.remove();
						onSuccess?.(response, file, fileContainer);
						_createUploadHiddenInput(multiple, fileContainer, previewContainer, file.id, file);
						resolve();
					},
					onError: (error) => {
						onError?.(error, fileContainer);
						Object.assign(fileContainer.style, { opacity: '1', backgroundImage: '' });
						document.querySelector(`#${CSS.escape(file.id)} .spinner-container`)?.remove();

						fileContainer.appendChild(
							createElements('div', { }, [
								createElements('p', { class: 'p-2 text-danger' }, [error.toString()])
							])
						);
						resolve();
					}
				});
			});
		};

		/**
		 * Handles events for the uploader.
		 * 
		 * @param {string} previewSelector - The CSS selector for the container which contains the preview.
		 * @param {string} uploadType - The type of upload, either "image" or "document".
		 * @param {boolean} multiple - Whether multiple files can be uploaded.
		 * @param {string} newInputName - The new input name.
		 * @param {string} inputId - The id of the file input.
		 * @param {string} url - The url to post the file to.
		 * @param {function} onBeforeSend - A callback function which is called before sending the request.
		 *                                  Returning false will cancel the request.
		 * @param {function} onSuccess - A callback function which is called when the request is successful.
		 * @param {function} onError - A callback function which is called when the request fails.
		 * @param {boolean} disablePreview - Whether to disable the preview UI.
		 * @param {boolean} compressFile - enable or disable the file compression.
		 */
		const _handleEvents = (previewSelector, uploadType, multiple, newInputName, inputId, url, onBeforeSend, onSuccess, onError, disablePreview, onFileRemove, compressFile = false, compression = {}) => {
			document.addEventListener('click', (e) => {
				if (e.target.closest(`.btn-eo-uploader-browse_${inputId}`)) document.getElementById(inputId).click();
			});

			document.addEventListener('change', async (e) => {
				if (!e.target.matches(`#${inputId}`)) return;
				const previewContainer = document.querySelector(multiple ? `${previewSelector} .multiple-preview` : `${previewSelector} .photo-preview`);
				if (!previewContainer) return console.error(`Element '${previewSelector}' not found.`);
				
				button.disable();
				defaultUploadType = uploadType;
				let files = [...e.target.files];

				const compressedFiles = await Promise.all(files.map(async (file) => {
					file.id = '_' + getRandomChar(11);
					if (compressFile && uploadType === 'image') {
						try {
							const compressed = await compressImage(file, compression);
							compressed.id = file.id;
							return compressed;
						} catch (err) {
							console.warn('Compression failed:', err);
							return file;
						}
					}

					return file;
				}));

				compressedFiles.forEach(file => {
					disablePreview
						? null : multiple
							? previewContainer.prepend(_createPreviewUI(multiple, file)) : _createPreviewUI(multiple, file);
				});

				_uploadFilesSequentially(compressedFiles, previewContainer, url, newInputName, multiple, onBeforeSend, onSuccess, onError).then(() => button.enable());
				e.target.value = '';
			});

			document.addEventListener('click', (e) => {
				const removeBtn = e.target.closest(`${previewSelector} .remove-btn`);
				if (!removeBtn) return;

				const fileId = removeBtn.getAttribute('data-id');
				const fileElement = document.getElementById(fileId);
				
				onFileRemove?.(removeBtn);
				if (fileElement) fileElement.remove();
			});
		};

		return { create, setDefaultIcon };
	}();

	const compressImage = async (file, options = {}) => {
		if (!(file instanceof File) || !file.type.startsWith('image/')) throw new Error('Invalid image file');

		const {
			maxWidth = 1024,
			maxHeight = 1024,
			quality = 0.7,
			type = 'image/jpeg'
		} = options;

		const img = await new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = reject;
			image.src = URL.createObjectURL(file);
		});

		const canvas = document.createElement('canvas');
		const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
		canvas.width = img.width * ratio;
		canvas.height = img.height * ratio;

		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				resolve(new File([blob], file.name, { type }));
			}, type, quality);
		});
	};


	const tinyMCE = function() {
		/**
		 * Initializes a TinyMCE editor in a given container.
		 * 
		 * @param {string} containerId - The id of the container which contains the textarea to be converted to a TinyMCE editor.
		 * @param {Object} options - An object of options to be passed to TinyMCE's init function. For more details, refer to the TinyMCE documentation.
		 * 
		 * The function creates a TinyMCE editor in the specified container. It uses a default set of options which can be overridden by the options argument.
		 * If the specified container is not found, it does nothing. If the TinyMCE script is not included in the head, it throws an error.
		 */
		const init = (containerId, options = {}) => {
			const textarea = document.querySelector(containerId);
			if (!textarea) return;

			if (typeof tinymce !== 'object') {
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

			tinymce.remove();
			tinymce.init(mergedOptions);
		};

		return { init };

	}();

	const tomSelect = (() => {
		/**
		 * Initializes a TomSelect dropdown component in a specified container.
		 *
		 * @param {string} containerId - The CSS selector of the container element to initialize TomSelect in.
		 * @param {Object} [options={}] - Optional configuration object to customize TomSelect behavior.
		 * @throws {Error} If the TomSelect script is not included in the head.
		 *
		 * The function checks for the presence of the TomSelect library and initializes a dropdown
		 * component in the specified container using default options that can be overridden by the
		 * provided options argument. If the specified container is not found, the function does nothing.
		 */
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

		/**
		 * A private function that defines how to render options in the dropdown.
		 * @param {Object} data - The object which contains the option data.
		 * @param {function} escape - A function which escapes the text of the option.
		 * @return {HTMLDivElement} A div element which contains the option.
		 */
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
		/**
		 * Creates a Google Chart in the specified container.
		 * 
		 * @param {Object} params - An object of parameters to create the chart.
		 * @param {string} params.containerId - The id of the container element to contain the chart.
		 * @param {function} params.data - A function which returns a populated google.visualization.DataTable.
		 * @param {Object} [params.options={}] - An object of options to customize the chart behavior.
		 * @param {string} params.packageType - The package type of the chart.
		 * @param {function} params.chartType - The constructor function of the chart type.
		 * @param {string} [params.apiKey=null] - The Google Maps API key.
		 * @return {boolean} True if the chart is created successfully, false otherwise.
		 * @throws {Error} If the container element is not found, or data is not set, or the chart type is not supported.
		 */
		const _createChart = ({ containerId, data, options = {}, packageType, chartTypeLoader, apiKey }) => {
			const container = document.getElementById(containerId);
			if (!container) return false;

			google.charts.load('current', { packages: [packageType], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(() => {
				if (!data) throw new Error('Set the data in table property');

				const dataTable = data(new google.visualization.DataTable());

				const ChartClass = chartTypeLoader();
				if (!ChartClass) throw new Error('Invalid chart type.');

				const customOptions = {
					hAxis: {
						format: 'MM d',
					},
					tooltip: {
						trigger: 'focus'
					},
					focusTarget: 'datum',
					crosshair: {
						trigger: 'both',
						orientation: 'vertical'
					},
				};
				
				const finalOptions = typeof ChartClass.convertOptions === 'function'
				? ChartClass.convertOptions({ ...customOptions, ...options })
				: { ...customOptions, ...options };

				const chart = new ChartClass(container);
				
				chart.draw(dataTable, finalOptions);
			});

			return true;
		};

		const material = (() => { 
			return {
				line: (params) => _createChart({ ...params, packageType: 'line', chartTypeLoader: () => google.charts.Line }),
				bar: (params) => _createChart({ ...params, packageType: 'bar', chartTypeLoader: () => google.charts.Bar })
			};
		})();

		const classic = (() => { 
			return {
				combo: (params) => _createChart({ ...params, packageType: 'corechart', chartTypeLoader: () => google.visualization.ComboChart }),
				bar: (params) => _createChart({ ...params, packageType: 'corechart', chartTypeLoader: () => google.visualization.BarChart }),
				calendar: (params) => _createChart({ ...params, packageType: 'calendar', chartTypeLoader: () => google.visualization.Calendar }),
				geo: (params) => {
					if (params.options?.displayMode === 'markers' && !params.apiKey) {
						throw new Error('Markers require geocoding, you\'ll need an ApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
					}
					return _createChart({ ...params, packageType: 'corechart', chartTypeLoader: () => google.visualization.GeoChart });
				},
				pie: (params) => _createChart({ ...params, packageType: 'corechart', chartTypeLoader: () => google.visualization.PieChart }),
				line: (params) => _createChart({ ...params, packageType: 'corechart', chartTypeLoader: () => google.visualization.LineChart }),
				map: (params) => {
					if (!params.apiKey) {
						throw new Error('Maps require a mapsApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
					}
					return _createChart({ ...params, packageType: 'map', chartTypeLoader: () => google.visualization.Map });
				},
				trendLine: (params) => _createChart({
					...params,
					packageType: 'corechart',
					chartTypeLoader: () => google.visualization.ScatterChart,
					options: { trendlines: { 0: {} }, ...params.options }
				})
			};
		})();

		return new Proxy({ material, classic }, {
			get(target, prop) {
				// Direct access (material/classic)
				if (prop in target) return target[prop];

				// Legacy chart type redirection
				const legacyMap = {
					line: 'classic',
					pie: 'classic',
					bar: 'material',
					combo: 'classic',
					calendar: 'classic',
					geo: 'classic',
					map: 'classic',
					trendLine: 'classic'
				};

				const style = legacyMap[prop];
				if (style && target[style] && typeof target[style][prop] === 'function') {
					console.warn(`[googleChart] Deprecated access: use googleChart.${style}.${prop} instead.`);
					return target[style][prop];
				}

				console.warn(`[googleChart] Unknown chart type: ${prop}`);
				return undefined;
			}
		});

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
			const appendtext  = id === 'mortgageYear' ? ' years' : ' %';
			return createElements('select', { id, class: 'form-select' }, 
				options.map(option =>
					createElements('option', { value: option, ...(option === selectedValue ? { selected: true } : {}) }, [document.createTextNode(`${option}${appendtext}`)])
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
		let _constraints = {};
		let _errors = [];

		/**
		 * Validates the given data against the given rules.
		 * @param {Object} data The object to validate.
		 * @param {Object} [rules] The validation rules. If omitted, previously set _constraints are used.
		 * @returns {Boolean} true if validation passes, false if validation fails (_errors can be retrieved using getErrors()).
		 */
		const validate = async (data, rules = _constraints, isAsync = false) => {
			if (typeof rules !== 'object') throw new Error('rules must be an object.');
			if (typeof data !== 'object' || data instanceof FormData) throw new Error('data must be an object. Use eo.serializeFormData(data) instead.');
			_errors = [];

			for (const [field, ruleset] of Object.entries(rules)) {
				const domField = _dotToBracket(field);
				const value = _getValue(data, domField);
				
				for (const [rule, param] of Object.entries(ruleset)) {
					const validatorFn = _validators[rule];
					if (!validatorFn) continue;

					const ruleParam = typeof param === 'object' && param.required !== undefined ? param.required : param;
					const formatMessage = param?.format?.message;
					const input = document.getElementById(_lastDotSegment(field));
					if (input) input.classList.remove('is-invalid');

					const isValid = isAsync ? await validatorFn(value, ruleParam) : validatorFn(value, ruleParam);
					if (!isValid) {
						if (input) input.classList.add('is-invalid');
						const message = formatMessage || `${_formatField(field)} ${_errorMessages[rule](ruleParam)}`;

						_showFieldError(_lastDotSegment(field), message);
						_errors.push(_escapeHTML(message));
					}
				};
			};

			return _errors.length === 0;
		};

		/**
		 * Retrieves the value of a nested property in an object.
		 * @param {Object} data The object to retrieve the value from.
		 * @param {String} field The dot-separated path to the nested property.
		 * @returns {*} The value of the nested property, or undefined if the property does not exist.
		 */
		const _getValue = (data, field) =>
			field.split('.').reduce((obj, key) => obj?.[key], data);

		const _dotToBracket = (field) =>
  			field.replace(/\.(\w+)/g, '[$1]'); // names.firstname → names[firstname]

		/**
		 * Retrieves the last segment of a dot-separated field name.
		 * @param {string} field The dot-separated field name.
		 * @returns {string} The last segment of the field name.
		 */
		const _lastDotSegment = (field) =>
			field.split('.').pop();

		/**
		 * Formats a field name by replacing underscores with spaces and capitalizing the first letter of each word.
		 * @param {String} name The field name to format.
		 * @returns {String} The formatted field name.
		 */
		const _formatField = (name) => {
			const parts = name.split('.');
			const fieldName = parts.pop();
			return fieldName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
		};

		const _showFieldError = (fieldId, message) => {
			const el = document.getElementById(fieldId);
			if (!el) return;

			// Remove existing feedback
			const existing = el.parentNode.querySelector('.invalid-feedback');
			if (existing) existing.remove();

			// Create feedback element using eo.createElements
			const feedback = createElements('div', {
				class: 'invalid-feedback',
				role: 'alert',
				'aria-live': 'polite'
			}, [message]);

			// Insert after input
			el.parentNode.insertBefore(feedback, el.nextSibling);
		};

		const _escapeHTML = (str) =>
			String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');

		const _errorMessages = {
			required: () => 'is required.',
			length: ({ min, max }) => `must be ${min ? `at least ${min} ` : ''} ${max ? `and at most ${max} ` : ''} characters.`,
			number: ({ min, max }) => `must be a number${min ? ` greater than ${min}` : ''}${max ? ` and less than ${max}` : ''}.`,
			url: () => 'is not a valid URL.',
			email: () => 'is not a valid email address.',
			date: () => 'is not a valid date.',
			datetime: () => 'is not a valid datetime.',
			equality: (param) => `must be equal to ${param}.`,
			type: (param) => `must be of type ${param}.`
		};

		const _validators = {
			required: (value, param) => param && (value !== null && value !== undefined && value !== ''),
			length: (value, { min, max = 120 }) => typeof value === 'string' && value.length >= min && value.length <= max,
			number: (value, { min, max = 9999 }) => {
				if (isNaN(value)) return false;
				const num = parseFloat(value);
				return (min === undefined || num > min) && (max === undefined || num < max);
			},
			url: (value, param) => {
				if (param.format?.pattern) return param.format.pattern.test(value);
				return typeof value === 'string' && /^https?:\/\/[^\s/$.?#].[^\s]*$/.test(value)
			},
			email: (value, param) => {
				if (param.format?.pattern) return param.format.pattern.test(value);
				return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
			},
			date: (value, param) => {
				if (param.format?.pattern) return param.format.pattern.test(value);
				return !isNaN(Date.parse(value))
			},
			datetime: (value, param) => {
				if (param.format?.pattern) return param.format.pattern.test(value);
				return !isNaN(new Date(value).getTime())
			},
			equality: (value, param) => value === param,
			type: (value, param) => typeof value === param
		};

		return {
			validate,
			getErrors: () => _errors,
			setConstraints: (rules) => (_constraints = rules),
			resetConstraints: () => (_constraints = {}),
			registerRule: (name, fn) => {
				if (typeof name !== 'string' || typeof fn !== 'function') {
					throw new Error('Invalid rule registration: name must be a string and fn must be a function.');
				}
				_validators[name] = fn;
			},
			unregisterRule: (name) => {
				if (_validators[name]) delete _validators[name];
			}
		};

	}();

	/**
	 * Converts a nested object into a flat object with dot notation keys.
	 *
	 * @param {Object} obj - The nested object to be converted.
	 * @param {string} [prefix=''] - An optional prefix for the keys in the resulting flat object.
	 * @returns {Object} A new flat object with dot notation keys.
	 */
	const objectToDotNotation = (obj, prefix = '') =>
		Object.keys(obj).reduce((res, key) => {
			const prop = prefix ? `${prefix}.${key}` : key;
			if (typeof obj[key] === 'object' && obj[key] !== null) {
				Object.assign(res, objectToDotNotation(obj[key], prop));
			} else {
				res[prop] = obj[key];
			}
			return res;
		}, {});

	/**
	 * Converts a flat object with dot notation keys into a nested object.
	 *
	 * @param {Object} obj - The flat object to be converted.
	 * @returns {Object} A new nested object.
	 */
	const dotNotationToObject = (obj) => {
		let result = {};
		Object.keys(obj).forEach(key => {
			key.split('.').reduce((res, part, index, arr) =>
				res[part] || (res[part] = arr.length - 1 === index ? obj[key] : {}), result);
		});
		return result;
	};

	const history = function () {
		let history = [];

		function pushState(state) {
			history.push(state);
			localStorage.setItem('history', JSON.stringify(history));
		}

		function replaceState(state) {
			history[history.length - 1] = state;
			localStorage.setItem('history', JSON.stringify(history));
		}

		function goBack() {
			if (history.length > 1) { // Prevent going back from the initial state
				history.pop(); // Remove current state
				const previousState = history[history.length - 1]; // Get the previous state
				localStorage.setItem('history', JSON.stringify(history));
				retraceState(previousState);
				changeHash(previousState.hash);
			}
		}

		function loadHistory() {
			const storedHistory = localStorage.getItem('history');
			if (storedHistory) {
				history = JSON.parse(storedHistory);
			}
		}

		function retraceState(state) {
			if (!state) return;

			// Restore scroll position (example)
			if (state.scrollPosition) {
				window.scrollTo(state.scrollPosition.x, state.scrollPosition.y);
				console.log(state.scrollPosition);
			}

			// Restore element visibility (example)
			if (state.elementVisibility) {
				for (const selector in state.elementVisibility) {
					const elements = document.querySelectorAll(selector);
					elements.forEach(el => {
						el.style.display = state.elementVisibility[selector] || ''; // Handle undefined
					});
				}
			}

			// ... restore other aspects of your application state ...
			if (state.elementContent) {
				for (const selector in state.elementContent) {
					const elements = document.querySelectorAll(selector);
					elements.forEach(el => {
						el.textContent = state.elementContent[selector];
					});
				}
			}

			if (state.elementClasses) {
				for (const selector in state.elementClasses) {
					const elements = document.querySelectorAll(selector);
					elements.forEach(el => {
						el.className = state.elementClasses[selector];
					});
				}
			}
		}

		function changeHash(hash) {
			if (hash) {
				window.location.hash = hash;
			}
		}

		window.addEventListener('popstate', () => {
			goBack();
		});

		return {
			pushState: pushState,
			replaceState: replaceState,
			goBack: goBack,
			load: loadHistory
		};
	}();

	const listener = (() => {
		let socket;

		const create = (url, onMessage, onError) => {
			socket = new WebSocket(url);
			socket.onmessage = (e) => onMessage(JSON.parse(e.data));
			socket.onerror = onError || ((err) => console.error('Listener error:', err));
		};

		const send = (data) => socket?.send(JSON.stringify(data));
		const close = () => socket?.close();

		return { create, send, close };
	})();


	return {
		initBeforeLoad: function() {
			mortgageCalculator._initBeforeLoad();
			modal._initBeforeLoad();
		},

		initAfterLoad: () => {
			let resizeTO;

			window.addEventListener('resize', () => {
				clearTimeout(resizeTO);
				resizeTO = setTimeout(() => {
					window.dispatchEvent(new Event('resizeEnd'));
				}, 500);
			});
		},
		getVersion: () => version,

		userClient,
		CSRFToken,
		moveHtmlElement,
		createElements,
		epochToTimeString,
		trim,
		formatFileSize,
		uuidv4,
		getRandomChar,
		getRandomNum,
		formatCurrency,
		serializeFormData,
		getYoutubeVideoData,
		post,
		get,
		redirect,
		objectToDotNotation,
		dotNotationToObject,
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
		tinyMCE,
		googleChart,
		tomSelect,
		history,
		compressImage,
		toast,
		listener,

		submitForm,
		uploader,
		mortgageCalculator
	};
});

document.addEventListener('DOMContentLoaded', function() {
	window.eo.initBeforeLoad();
});

window.addEventListener('load', function() {
	window.eo.initAfterLoad();
});

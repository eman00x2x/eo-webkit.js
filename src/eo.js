// eo.js

/* global define */ // For AMD
/* global module */ // For CommonJS
/* global exports */ // For CommonJS

/* import tinyMCE from '../node_modules/tinymce/tinymce.js';
import '../node_modules/tinymce/themes/silver/theme'; // And plugins
import google from 'google-charts'; // Google Charts usually attaches to the window object
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css'; // Import noUiSlider CSS
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css'; // Import Tom Select CSS
import wNumb from 'wnumb';
import validate from 'validate.js'; */

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

	const _sanitize = str => new Option(str).innerHTML;

	/**
	   * Redirects the browser to a given URL.
	   *
	   * @param {string} url - The URL to redirect to
	   */
	const redirect = (url) => window.location = url;

	/**
	   * Converts an epoch time (in seconds) to a localized string in the format:
	   * "Weekday, Month Day, Year, HH:MM AM/PM"
	   *
	   * @param {number} epoch - The epoch time, in seconds
	   * @returns {string} A localized string representation of the date and time
	   */
	const epochToTimeString = (epoch) => new Date(epoch * 1000).toLocaleString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

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
	   * Generates a random hexadecimal string of the specified length.
	   *
	   * The function uses the Web Cryptography API to generate cryptographically
	   * secure random values, which are then converted to a hexadecimal string.
	   *
	   * @param {number} length - The length of the random hexadecimal string to generate
	   * @returns {string} A random hexadecimal string of the specified length
	   */
	const getRandomChar = (length) => {
		const array = new Uint8Array(length - 3);
		window.crypto.getRandomValues(array);
		return Array.from(array, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
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
			init: () => {
				_handleVideoAdd();
				_handleVideoDeletion();
				_handleVideoPlayback();
				document.addEventListener('DOMContentLoaded', _createVideoForm());
			}
		};
	})();


	const tinymce = function() {
		const init = (containerId, options = {}) => {
			const textarea = document.querySelector(containerId);
			if (textarea === null || textarea === undefined) {
				return;
			}

			if (typeof tinyMCE !== 'object') {
				throw new Error(`tinymce script is not inlcuded in head. ${CDN}/vendor/tinymce/tinymce.min.js`);
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
					'https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
					CDN + '/css/global.style.css'
				]
			};

			const mergedOptions = { ...defaultOptions, ...options };

			tinyMCE.remove();
			tinyMCE.init(mergedOptions);
		};

		return {
			init
		};

	}();

	const tomSelect = function() {
		const init = (containerId) => {
			if (window.TomSelect) {
				new TomSelect(document.querySelector(containerId), {
					copyClassesToDropdown: false,
					dropdownParent: 'body',
					controlInput: '<input>',
					render: {
						item: function(data, escape) {
							if (data.customProperties) {
								return createElements('div', {}, [
									createElements('span', { class: 'dropdown-item-indicator' }, [
										document.createTextNode(data.customProperties)
									]),
									document.createTextNode(escape(data.text))
								]);
							} else {
								return createElements('div', {}, [
									document.createTextNode(escape(data.text))
								]);
							}
						},
						option: function(data, escape) {
							if (data.customProperties) {
								return createElements('div', {}, [
									createElements('span', { class: 'dropdown-item-indicator' }, [
										document.createTextNode(data.customProperties)
									]),
									document.createTextNode(escape(data.text))
								]);
							} else {
								return createElements('div', {}, [
									document.createTextNode(escape(data.text))
								]);
							}
						},
					},
				});
			} else {
				throw new Error(`TomSelect script is not inlcuded in head. ${CDN}/vendor/tom-select/tom-select.min.js`);
			}
		};

		return {
			init
		};
	}();

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

	const uploader = function() {

		/**
			 * Creates a new file uploader.
			 * @param {Object} options - Options to configure the uploader.
			 * @param {string} [options.uploadContainerSelector] - The CSS selector of the container element to create the uploader in.
			 * @param {string} options.url - The URL to send the upload to.
			 * @param {string} [options.inputId] - The ID of the input element to use as the file input.
			 * @param {string} [options.uploadType] - The type of upload. Either "image" or "document". Default is "image".
			 * @param {string} [options.accept] - The MIME type of the file to accept. Default is "image/*".
			 * @param {boolean} [options.multiple] - Whether to allow multiple files to be uploaded. Default is true.
			 * @param {function} [options.success] - A callback to call when the upload is successful.
			 * @param {function} [options.error] - A callback to call when the upload fails.
			 * @returns {void}
			 */
		const _create = ({ uploadContainerSelector, url, inputId = 'browseFile', uploadType = 'image', accept = 'image/*', multiple = true, success = false, error = false }) => {

			if (uploadType !== 'image' && uploadType !== 'document') {
				throw new Error('Invalid upload type. Must be "image" or "document"');
			}

			const containerSelector = uploadContainerSelector || '.upload-container';
			const input = inputId;
			const onSuccessCallback = success;
			const onErrorCallback = error;

			if (uploadType == 'document') {
				accept = 'application/pdf';
				_initFileUploaderEvents();
			} else {
				_initImageUploaderEvents();
			}

			_createUploadContainer(containerSelector);
			_createUploadForm(url, input, accept, multiple, containerSelector);
			_initUploaderEvents(containerSelector, input, onSuccessCallback, onErrorCallback);
		};

		const _createUploadContainer = (uploadContainerSelector) => {
			let container = document.querySelector(uploadContainerSelector);

			if (!container) {
				container = createElements('div', { class: 'upload-container' });
				document.body.prepend(container);
				uploadContainerSelector = '.upload-container';
			}

			const uploadButton = createElements('span', { class: 'btn btn-dark btn-browse' }, [
				createElements('i', { class: 'ti ti-upload me-2' }),
				document.createTextNode(' Upload')
			]);

			container.innerHTML = '';
			container.appendChild(uploadButton);
		};

		const _createUploadForm = (url, inputId, accept, multiple, containerSelector) => {
			const containerDiv = createElements('div', {
				class: containerSelector.replace('.', '') // Remove the .
			}, [
				createElements('form', {
					id: 'uploadForm_' + inputId,
					class: 'd-none',
					action: url,
					method: 'POST',
					enctype: 'multipart/form-data'
				}, [
					createElements('center', {}, [
						createElements('input', {
							type: 'file',
							id: inputId,
							accept: accept,
							name: multiple ? `${inputId}[]` : inputId, // Conditional name
							...(multiple ? { multiple: true } : { value: '' }) // Conditional multiple/value
						})
					])
				])
			]);

			document.body.prepend(containerDiv);
		};

		/**
			 * Generates HTML elements for displaying and manipulating image uploads.
			 *
			 * @param {Object} image - An objects containing image upload information.
			 * @param {string} [uploader="properties"] - The uploader from which the images are being uploaded.
			 * @param {Object} [settings] - Additional settings for the image elements.
			 * @return {string} - The HTML elements as a string.
			 */
		const _setMultipleImageUploadContainer = (image, uploadedContainerSelector = 'images-container') => {
			const container = document.querySelector(uploadedContainerSelector);

			if (!container) {
				console.log(`Container with selector '${uploadedContainerSelector}' not found.`);
				return;
			}

			let div = createElements('div', {
				class: `${image.id} image_${image.id} me-2 mb-3 flex-grow-1`
			}, [
				createHiddenInput(`upload[${image.id}][image_id]`, image.id),
				createHiddenInput(`upload[${image.id}][height]`, image.height),
				createHiddenInput(`upload[${image.id}][width]`, image.width),
				createHiddenInput(`upload[${image.id}][filename]`, image.filename),
				createHiddenInput(`upload[${image.id}][url]`, image.final_url),

				createElements('div', {}, [
					createElements('span', {
						class: 'avatar avatar-xxxl',
						style: `background-image: url('${image.temp_url}')`
					})
				]),
				createElements('div', { class: 'btn-list mt-2 text-center' }, [
					createElements('span', {
						class: 'btn btn-md btn-outline-secondary btn-remove-image',
						title: 'Remove image',
						'data-container': image.id,
						'data-filename': image.filename,
						'data-url': `${DOMAIN}/properties/images/${image.id}/delete`
					}, [
						createElements('i', { class: 'ti ti-trash' })
					]),
					createElements('span', {
						class: 'btn btn-md btn-outline-primary btn-set-thumbnail',
						title: 'Set image as thumbnail',
						'data-container': image.id,
						'data-final-url': image.final_url
					}, [
						createElements('i', { class: 'ti ti-click me-2' }),
						document.createTextNode(' Thumbnail')
					])
				]),

				...(image.status == 2 ? [
					createElements('div', { class: 'alert alert-danger alert-dismissible' }, [
						createElements('i', { class: 'ti ti-alert-triangle me-2', 'aria-hidden': 'true' }),
						createElements('span', { class: 'p-0 m-0' }, [document.createTextNode(image.message)]),
						createElements('button', {
							type: 'button',
							class: 'btn-close',
							'data-bs-dismiss': 'alert'
						})
					])
				] : [])

			]);

			if (container) {
				container.prepend(div);
			} else {
				console.error('Container element not found.');
			}
		};

		const _setSingleUploadContainer = (image, uploadedContainerSelector = '.photo-preview') => {
			const containerSelector = uploadedContainerSelector.replace('.', '');
			const previewElement = document.querySelector(containerSelector);

			if (!previewElement) {
				console.error(`Element with selector '${uploadedContainerSelector}' not found.`);
				return;
			}

			if (image.status == 1) {
				previewElement.style.backgroundImage = `url(${image.temp_url})`;
				alert.message('');

				const photoInput = document.getElementById('photo');
				if (photoInput) {
					photoInput.value = image.final_url;
				} else {
					console.error('Element with ID \'photo\' not found.');
				}

			} else {
				alert.message(image.message);
			}

			const browseButton = document.querySelector(`${uploadedContainerSelector} .btn-browse`);
			if (browseButton) {
				browseButton.style.display = 'block';
			} else {
				console.error(`Element with selector '${uploadedContainerSelector} .btn-browse' not found.`);
			}
		};

		const _setMultipleFileUploadContainer = (file, uploadedContainerSelector = '.files-container') => {
			const container = document.querySelector(uploadedContainerSelector);
			if (!container) {
				console.error(`Container with selector '${uploadedContainerSelector}' not found.`);
				return;
			}

			let fileElement = createElements('div', { class: 'flex-grow-1' }, [

				createHiddenInput(`documents[${file.id}][id]`, file.id),
				createHiddenInput(`documents[${file.id}][filename]`, file.filename),
				createHiddenInput(`documents[${file.id}][size]`, file.size),
				createHiddenInput(`documents[${file.id}][finalUrl]`, file.final_url),

				createElements('div', { class: 'd-flex p-y align-items-center' }, [
					createElements('span', { class: 'avatar me-2' }, [
						createElements('i', { class: 'ti ti-pdf fs-18' })
					]),
					createElements('div', { class: 'flex-fill' }, [
						createElements('div', { class: 'font-weight-medium' }, [
							createElements('input', {
								type: 'text',
								name: `documents[${file.id}][alias]`,
								value: file.alias,
								class: 'border-0 w-100'
							})
						]),
						createElements('div', { class: 'text-secondary small' }, [
							document.createTextNode(file.size)
						])
					])
				]),
				/* createElements('div', { class: 'btn-list' }, [
							createElements('span', {
								class: 'btn-remove-document cursor-pointer p-2',
								'data-id': file.id,
								'data-filename': file.filename
							}, [
								createElements('i', { class: 'ti ti-trash me-1' }),
								document.createTextNode(" Remove")
							])
						]) */
			]);

			let listItem;
			if (file.status == 2) {
				listItem = createElements('div', { class: 'alert alert-danger alert-dismissible', id: file.id }, [
					createElements('i', { class: 'ti ti-alert-triangle me-2', 'aria-hidden': 'true' }),
					createElements('span', { class: 'p-0 m-0' }, [document.createTextNode(file.message)]),
					createElements('button', { type: 'button', class: 'btn-close', 'data-bs-dismiss': 'alert' })
				]);
			} else {
				listItem = createElements('li', {
					class: `list-group-item d-flex gap-3 justify-content-between align-items-center py-3 file_${file.id}`
				}, [fileElement]); // Append fileElement to the list item
			}

			container.prepend(listItem);
		};

		const _initFileUploaderEvents = () => {
			document.addEventListener('click', function(event) {
				if (event.target.closest('.btn-remove-document')) {
					const btn = event.target.closest('.btn-remove-document');
					const id = btn.dataset.id;
					/* const filename = btn.dataset.filename;
							  const property_id = btn.dataset.property_id; */

					const remove_url = btn.dataset.remove_url;

					get(remove_url, {
						onSuccess: function(response) {
							if (response.status == 2) {
								alert.error(response.message);
							}
							const fileElement = document.querySelector(`.file_${id}`);
							if (fileElement) {
								fileElement.remove();
							} else {
								console.error(`File element with class 'file_${id}' not found.`);
							}
						}
					});
				}
			});
		};

		const _initImageUploaderEvents = () => {
			document.addEventListener('click', function(event) {

				if (event.target.closest('.btn-set-thumbnail')) {
					const btn = event.target.closest('.btn-set-thumbnail');
					const finalUrl = btn.dataset.finalUrl;

					const thumbnailButtons = document.querySelectorAll('.btn-set-thumbnail');
					thumbnailButtons.forEach(button => {
						button.classList.remove('btn-success');
						button.classList.add('btn-outline-primary');
						button.innerHTML = '<i class=\'ti ti-click me-2\'></i> Thumbnail';
					});

					btn.classList.add('btn-success');
					btn.classList.remove('btn-outline-primary');
					btn.innerHTML = '<i class=\'ti ti-check me-2\'></i> Thumbnail';

					const thumbImgInput = document.getElementById('thumb_img');
					if (thumbImgInput) {
						thumbImgInput.value = finalUrl;
					} else {
						console.error('Element with ID \'thumb_img\' not found.');
					}
				} else if (event.target.closest('.btn-remove-image')) {
					const btn = event.target.closest('.btn-remove-image');
					const container = btn.dataset.container;
					const filename = btn.dataset.filename;
					const url = btn.dataset.url;

					post(url, {
						csrf_token: _CSRFToken,
						filename: filename
					}, {
						onSuccess: function(response) {
							if (response.status == 1) {
								const elementToRemove = document.querySelector(container);
								if (elementToRemove) {
									elementToRemove.remove();
								} else {
									console.error(`Element with selector '${container}' not found.`);
								}
							}
							alert.message(response.message);
							console.log(response);
						}
					});
				}
			});
		};

		const _initUploaderEvents = (containerSelector, input, success, error) => {

			document.addEventListener('click', function(event) {
				if (event.target.closest(`${containerSelector} .btn-browse`)) {
					const inputElement = document.querySelector(`${containerSelector} #${input}`);
					if (inputElement) {
						inputElement.click();
					} else {
						console.error(`Input element with selector '${containerSelector} #${input}' not found.`);
					}
				}
			});

			document.addEventListener('change', function(event) {
				if (event.target.matches(`${containerSelector} #${input}`)) {
					const form = document.querySelector(`${containerSelector} #uploadForm_${input}`);

					if (!form) {
						console.error(`Form element with selector '${containerSelector} #uploadForm_${input}' not found.`);
						return;
					}

					const formData = new FormData(form);
					formData.append('csrf_token', _CSRFToken);

					const urlElement = document.querySelector(`${containerSelector} #uploadForm_${input}`);
					if (!urlElement) {
						console.error(`Form element with selector '${containerSelector} #uploadForm_${input}' not found.`);
						return;
					}
					const url = urlElement.action;

					post(url, formData, {
						processData: false,
						contentType: false,
						beforeSend: () => {
							alert.loader('Please wait while you are uploading...');
							button.disable();
						},
						onSuccess: (response) => {
							alert.message('');
							button.enable();
							if (response.status == 2) {
								alert.error(response.message);
								return;
							}

							if (success) {
								return success(response);
							}
						},
						onError: (args) => {
							if (error) {
								return error(args);
							}
						}
					});

					const inputElementToClear = document.querySelector(`${containerSelector} #${input}`);
					if (inputElementToClear) {
						inputElementToClear.value = '';
					} else {
						console.error(`Input element with selector '${containerSelector} #${input}' not found.`);
					}
				}
			});
		};

		return {
			create: _create,
			setMultipleImageUploadContainer: _setMultipleImageUploadContainer,
			setSingleUploadContainer: _setSingleUploadContainer,
			setMultipleFileUploadContainer: _setMultipleFileUploadContainer,
			initFileUploaderEvents: _initFileUploaderEvents,
			initImageUploaderEvents: _initImageUploaderEvents
		};

	}();

	const googleChart = function() {

		const bar = ({ containerId, data = null, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['bar'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.charts.Bar(container);
				chart.draw(dataTable, google.charts.Bar.convertOptions(options));
			}

			return drawChart;
		};

		const calendar = ({ containerId, data, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['calendar'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.Calendar(container);
				chart.draw(dataTable, options);
			}

			return drawChart;
		};

		const geo = ({ containerId, data, options = {}, apiKey = null } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['corechart'], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.GeoChart(container);

				if (options.displayMode !== undefined && options.displayMode == 'markers') {
					if (apiKey === null) {
						throw new Error('Markers require geocoding, you\'ll need a ApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
					}
				}

				chart.draw(dataTable, options);
			}

			return drawChart;
		};

		const pie = ({ containerId, data, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.PieChart(container);
				chart.draw(dataTable, options);
			}

			return drawChart;
		};

		const line = ({ containerId, data, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['line'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.charts.Line(container);
				chart.draw(dataTable, google.charts.Line.convertOptions(options));
			}

			return drawChart;
		};

		const map = ({ containerId, data, options = {}, apiKey = null } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['map'], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.Map(container);

				if (apiKey === null) {
					throw new Error('Maps require a mapsApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings');
				}

				chart.draw(dataTable, options);
			}

			return drawChart;
		};

		const trendLine = ({ containerId, data, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load('current', { packages: ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error('Set the data in table property');
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.ScatterChart(container);

				const defaultOptions = { trendlines: { 0: {} } };
				const mergeOptions = { ...defaultOptions, ...options };

				chart.draw(dataTable, mergeOptions);
			}

			return drawChart;
		};

		return {
			bar,
			calendar,
			geo,
			pie,
			line,
			map,
			trendLine
		};
	}();

	const _mortgageCalculator = function() {

		const _calculateMortgage = () => {
			const resultContainer = document.querySelector('.mortgage-calculator-form #result');
			if (!resultContainer) {
				return;
			}

			const result = _getAmortization();

			resultContainer.setAttribute('monthlyPayment', result.monthlyPayment);
			resultContainer.innerHTML = `&#8369;${result.formattedMonthlyPayment}`;
		};

		const _calculateMortgageOnChange = () => {
			document.addEventListener('change', function(event) {
				if (event.target.matches('.mortgage-calculator-form #mortgageDownpayment') ||
					event.target.matches('.mortgage-calculator-form #mortgageInterest') ||
					event.target.matches('.mortgage-calculator-form #mortgageYear')) {
					_calculateMortgage();
				}
			});
		};

		const _createDownPaymentSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #dpSelection');
			if (!container) {
				return;
			}

			const downPaymentOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
			const select = createElements('select', { id: 'mortgageDownpayment', class: 'form-select' },
				downPaymentOptions.map(option =>
					createElements('option', { value: option, ...(option === 20 ? { selected: true } : {}) }, [
						document.createTextNode(`${option}%`)
					])
				)
			);

			container.insertAdjacentElement('afterend', select);
			container.remove();
		};

		const _createInterestSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #interestSelection');
			if (!container) {
				return;
			}

			const select = createElements('select', { id: 'mortgageInterest', class: 'form-select' },
				Array.from({ length: 81 }, (_, i) => i * 0.25).map(rate => // More efficient way to generate the array
					createElements('option', { value: rate, ...(rate === 3.75 ? { selected: true } : {}) }, [
						document.createTextNode(`${rate}%`)
					])
				)
			);

			container.insertAdjacentElement('afterend', select);
			container.remove();
		};

		const _createYearsSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #yearSelection');
			if (!container) {
				return;
			}

			const yearsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
			const select = createElements('select', { id: 'mortgageYear', class: 'form-select' },
				yearsOptions.map(year =>
					createElements('option', { value: year, ...(year === 3 ? { selected: true } : {}) }, [
						document.createTextNode(`${year} Years`)
					])
				)
			);

			container.insertAdjacentElement('afterend', select);
			container.remove();
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
				const row = [i, principle > 0 ?
					(principle < monthlyPayment ?
						principle : monthlyPayment) : 0, interest > 0 ?
						interest : 0, remaining > 0 ? remaining : 0];
				schedule.push(row);
				remaining -= principle;
			}

			return schedule;
		};

		const _getAmortization = () => {
			const sellingPriceElement = document.getElementById('sellingPrice');
			if (!sellingPriceElement) {
				console.error('Selling price element not found.');
				return;
			}

			const sellingPrice = parseInt(sellingPriceElement.value, 10);

			const downPaymentPercentElement = document.querySelector('#mortgageDownpayment option:checked');
			if (!downPaymentPercentElement) {
				console.error('Down payment percentage element not found.');
				return;
			}

			const downPaymentPercent = parseInt(downPaymentPercentElement.value, 10);
			const downPayment = sellingPrice * (downPaymentPercent / 100);
			const loanAmount = sellingPrice - downPayment;

			const interestRateElement = document.querySelector('#mortgageInterest option:checked');
			if (!interestRateElement) {
				console.error('Interest rate element not found.');
				return;
			}

			const interestRate = parseFloat(interestRateElement.value);
			const yearsElement = document.querySelector('#mortgageYear option:checked');

			if (!yearsElement) {
				console.error('Loan term element not found.');
				return;
			}

			const years = parseInt(yearsElement.value, 10) + 1;
			const paymentsPerYear = 12;

			const monthlyPayment = _pmt({
				rate: (interestRate / 100) / paymentsPerYear,
				nper: paymentsPerYear * years,
				presentValue: - loanAmount
			});

			const formattedMonthlyPayment = parseFloat(monthlyPayment.toFixed(2)).toLocaleString();

			const schedule = _computeSchedule({
				loanAmount: loanAmount,
				interestRate: interestRate,
				paymentsPerYear: paymentsPerYear,
				years: years,
				monthlyPayment: monthlyPayment
			});

			return {
				monthlyPayment,
				formattedMonthlyPayment,
				schedule
			};
		};

		return {
			_initBeforeLoad: () => {
				_calculateMortgageOnChange();
			},

			_initAfterLoad: () => {
				_createDownPaymentSelection();
				_createInterestSelection();
				_createYearsSelection();
				_calculateMortgage();
			}
		};

	}();

	const validator = function() {
		let constraints = {};
		let errors = [];

		const validate = (data, rules = constraints) => {
			if (typeof rules !== 'object') throw new Error('rules must be an object.');
			if (typeof data !== 'object' || data instanceof FormData) throw new Error('data must be an object. Use eo.serializeFormData(data) instead.');
			errors = []; // Reset errors
			Object.entries(rules).forEach(([field, ruleset]) => {
				const value = getValue(data, field);
				Object.entries(ruleset).forEach(([rule, param]) => {
					if (validators[rule] && !validators[rule](value, param)) {
						errors.push(`${formatField(field)} ${errorMessages[rule](param)}`);
					}
				});
			});
			return errors.length === 0;
		};

		const getValue = (data, field) =>
			field.split('.').reduce((obj, key) => obj?.[key], data);

		const formatField = (name) =>
			name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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
			/* _video._initBeforeLoad(); */
			_slider._initBeforeLoad();
			_mortgageCalculator._initBeforeLoad();
		},

		initAfterLoad: () => {
			/* Address.initAfterLoad(); */
			/* _video._initAfterLoad(); */
			_slider._initAfterLoad();
			modal._initAfterLoad();
			_mortgageCalculator._initAfterLoad();

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
		
		validator,
		arrayToDotNotation,
		dotNotationToArray,

		video,
		modal,
		alert,
		button,

		component: {
			submitForm,
			tinymce,
			slider,
			tomSelect,
			uploader,
			googleChart,
		},
	};

	return eo;

});

document.addEventListener('DOMContentLoaded', function() {
	window.eo.initBeforeLoad();
});

window.addEventListener('load', function() {
	window.eo.initAfterLoad();
});

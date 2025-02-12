// eo.js

/* global define */ // For AMD
/* global module */ // For CommonJS
/* global exports */ // For CommonJS


import tinyMCE from 'tinymce';
import 'tinymce/themes/silver/theme'; // And plugins
import google from 'google-charts'; // Google Charts usually attaches to the window object
import noUiSlider from 'nouislider';
import 'nouislider/dist/nouislider.css'; // Import noUiSlider CSS
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css'; // Import Tom Select CSS
import wNumb from 'wnumb';
import validate from 'validate.js';
import bootstrap from 'bootstrap'; // Bootstrap CSS is usually included in HTML or imported via CSS import


; (function (factory) { // The IIFE (Immediately Invoked Function Expression)
	if (typeof define === "function" && define.amd) { // Check for AMD (Asynchronous Module Definition)
		define([], factory); // Use AMD define
	} else if (typeof exports === "object") { // Check for CommonJS
		module.exports = factory(); // Use CommonJS module.exports
	} else { // Otherwise, assume global scope (browser)
		window.eo = factory(); // Attach the module to the window object
	}
})(function () {

	"use strict";

	let DOMAIN;
	let CDN;
	let API_KEY = {};

	const settings = ({ domain, cdn, apiKey = {} } = {}) => {
		DOMAIN = domain;
		CDN = cdn;
		API_KEY = apiKey;
	};

	const eoSettings = () => {
		return {
			domain: DOMAIN,
			cdn: CDN,
			apiKey: API_KEY
		}
	};

	const isInDevelopment = () => {
		const inDevelopmentMetaTag = document.querySelector('meta[name="inDevelopment"]');
		if (inDevelopmentMetaTag.content == 1) {
			return true;
		}

		return false;
	};

	const _CSRFToken = function () {
		const metaTagToken = document.querySelector('meta[name="csrf-token"]');
		if (metaTagToken === null) {
			const message = "CSRF Token not found in meta tags! <meta name=\"csrf-token\" content=\"{{ csrf_token() }}\">";
			alert.error(message);
			throw new Error(message);
		}
		return metaTagToken.content
	}();

	const redirect = (url) => {
		window.location = url;
	};

	/**
	 * Converts an epoch time (in seconds) to a localized string in the format:
	 * "Weekday, Month Day, Year, HH:MM AM/PM"
	 *
	 * @param {number} epoch - The epoch time, in seconds
	 * @returns {string} A localized string representation of the date and time
	 */
	const epochToTimeString = (epoch) => {
		const date = new Date(0);
		date.setUTCSeconds(epoch);
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
	const trim = (stringValue, maximumLength) => {
		if (stringValue.length <= maximumLength) {
			return stringValue;
		}

		return `${stringValue.slice(0, maximumLength - 3)}...`;
	};

	/**
	 * Converts a given number of bytes to a human-readable string,
	 * appending the appropriate unit (Bytes, KB, MB, etc.).
	 *
	 * @param {number} bytes - The number of bytes to convert
	 * @param {number} [decimalPlaces=2] - The number of decimal places to include
	 * @returns {string} A human-readable string representation of the given number of bytes
	 */
	const formatFileSize = (bytes, decimalPlaces = 2) => {
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
		return "00000000-0000-0000-0000-000000000000".replace(/[018]/g, c =>
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
		const array = new Uint8Array(length);
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
		return Math.floor(Math.random() * (end - start + 1)) + start;
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
		return Math.abs(Number(amount)) >= 1.0e+9

			? Math.abs(Number(amount)) / 1.0e+9 + "B"
			: Math.abs(Number(amount)) >= 1.0e+6
				? Math.abs(Number(amount)) / 1.0e+6 + "M"
				: Math.abs(Number(amount)) >= 1.0e+3
					? Math.abs(Number(amount)) / 1.0e+3 + "K"
					: Math.abs(Number(amount));
	};

	/**
	 * Serializes a given FormData object into a plain JavaScript object.
	 *
	 * @param {FormData} formData - The FormData object to serialize
	 * @returns {object} A plain JavaScript object containing the same key-value pairs as the given FormData object
	 */
	const serializeFormData = (formData) => {
		const data = formData.reduce(function (obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
		return data;
	};

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

		return {
			"status": 2,
			"message": "Invalid youtube url format!"
		};
	};

	/**
	 * Creates an HTML element with the given tag name and attributes, and appends the given children to it.
	 *
	 * @param {string} tag - The HTML tag name of the element to create
	 * @param {object} [attributes] - An object containing key-value pairs of attributes to set on the element
	 * @param {array} [children] - An array of elements to append to the created element
	 * @returns {HTMLElement} The created element
	 */
	const createElements = (tag, attributes = {}, children = []) => {
		const element = document.createElement(tag);
		for (const [key, value] of Object.entries(attributes)) {
			element.setAttribute(key, value);
		}
		children.forEach(child => element.appendChild(child));
		return element;
	};

	/**
	 * Moves the HTML from the first element matching the fromElementSelector to the first element matching the toElementSelector.
	 * If either element is not found, the function does nothing.
	 * @param {string} fromElementSelector - CSS selector for the element to move the HTML from
	 * @param {string} toElementSelector - CSS selector for the element to move the HTML to
	 */
	const moveHtmlElement = function (fromElementSelector, toElementSelector) {
		const fromElements = document.querySelectorAll(fromElementSelector);
		const toElement = document.querySelector(toElementSelector);

		if (fromElements.length === 0 || toElement === null) {
			if (isInDevelopment() == 1) {
				console.log("Element not found");
			}
			return;
		}

		// Get the FIRST element from the NodeList (if it exists)
		const fromElement = fromElements[0]; // Access the first element

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
	 * @param {function} [options.beforeSend] - Called before the request is sent
	 * @param {function} [options.onSuccess] - Called when the request returns a JSON response
	 * @param {function} [options.onError] - Called when the request fails
	 * @param {function} [options.onComplete] - Called after the request has completed
	 * @param {boolean} [options.processData=true] - Whether to process the data before sending it
	 * @param {string} [options.contentType='application/x-www-form-urlencoded; charset=UTF-8'] - The content type of the request
	 */
	const post = (url, data, {
		beforeSend,
		onSuccess,
		onError,
		onComplete,
		processData = true,
		contentType = 'application/x-www-form-urlencoded; charset=UTF-8'
	} = {}) => {

		if (beforeSend) beforeSend();

		let body;
		let headers = {
			'X-Requested-With': 'XMLHttpRequest'
		};

		if (Array.isArray(data) && data.every(item => 'name' in item && 'value' in item)) {
			body = new URLSearchParams();
			data.forEach(({ name, value }) => {
				body.append(name, value);
			});
			body = body.toString();
			headers['Content-Type'] = contentType;
		} else if (data instanceof FormData) {
			body = data;
		} else if (processData && typeof data === 'object') {
			if (contentType.includes('application/json')) {
				body = JSON.stringify(data);
				headers['Content-Type'] = contentType;
			} else {
				body = new URLSearchParams();
				Object.keys(data).forEach(key => {
					if (Array.isArray(data[key])) {
						data[key].forEach(value => body.append(`${key}[]`, value));
					} else {
						body.append(key, data[key]);
					}
				});
				body = body.toString();
				headers['Content-Type'] = contentType;
			}
		} else {
			body = data;
		}

		fetch(url, {
			method: 'POST',
			headers,
			body
		})
			.then(response => {
				if (!response.ok) {
					return response.text().then(errorMessage => {
						throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
					});
				}

				return response.text().then(text => {
					try {
						const jsonData = JSON.parse(text);
						return { data: jsonData, type: 'json' };
					} catch (jsonError) {
						/* If JSON parsing fails, assume it's HTML or text */
						if (isInDevelopment() == 1) {
							console.log("JSON Parse Error:", jsonError);
						}
						return { data: text, type: 'html' };
					}
				});
			})
			.then(result => {
				if (result.type === 'json') {
					onSuccess?.(result.data);
					if (isInDevelopment() == 1) {
						console.log("JSON Response:", result.data);
					}
				} else if (result.type === 'html') {
					onSuccess?.(result.data);
					if (isInDevelopment() == 1) {
						console.log("HTML/Text Response:", result.data);
					}
				}
			})
			.catch(error => {
				onError?.(null, error.message, error); // Pass the actual error object
				console.error("Fetch or Parse Error:", error); // Log the error object
			})
			.finally(() => {
				onComplete?.();
			});
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
	const get = (url, { beforeRequest, onSuccess, onError } = {}) => {
		const shouldProceed = beforeRequest?.();

		if (shouldProceed === false) return;

		fetch(url)
			.then(async response => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const responseData = await response.text();

				onSuccess?.(responseData);
				button.enable();
				return responseData;
			})
			.catch(error => {
				onError?.(null, "error", error);

				alert.error(error);
				button.enable();

				if (isInDevelopment() == 1) {
					button.enable();
					throw error;
				}
			});
	};

	/**
	 * Gets the user client information from local storage or fetches it from IPInfo and determines the browser.
	 * @returns {object} The client information, with the following properties:
	 * - `userAgent`: The user agent string
	 * - `geo`: The geo information from IPInfo
	 * - `browser`: The browser name
	 */
	const userClient = function () {
		return function () {
			const clientInfo = {
				userAgent: null,
				geo: null,
				browser: null
			};

			/**
			 * Gets the user's geo information from IPInfo and stores it in the user client information.
			 * @private
			 * @throws {Error} If there is an error getting the geo information
			 */
			const _getGeoInfo = async () => {
				try {
					const response = await get('https://ipinfo.io/json');
					clientInfo.geo = response;
					localStorage.setItem('EOclient', JSON.stringify(clientInfo));
				} catch (error) {
					console.error('Error getting geo info:', error);
				}
			};

			/**
			 * Determines the browser name from the user agent string.
			 * @private
			 * @returns {void}
			 */
			const _determineBrowser = () => {
				const browserNames = {
					opera: 'Opera',
					firefox: 'Mozilla Firefox',
					safari: 'Apple Safari',
					ie: 'Microsoft IE',
					edge: 'Microsoft Edge',
					chrome: 'Google Chrome',
					blink: 'Blink'
				};

				const isOpera = navigator.userAgent.includes("Opera") || navigator.userAgent.includes('Opr')
				const isEdge = navigator.userAgent.includes('Edg');
				const isEdgeChromium = navigator.userAgent.includes('EdgA');
				const isIE = /MSIE|Trident/.test(navigator.userAgent);
				const isChrome = navigator.userAgent.indexOf("Chrome");
				const isSafari = navigator.userAgent.includes('Safari');
				const isFirefox = navigator.userAgent.includes("Firefox");
				const isBlink = (isChrome || isOpera) && !!window.CSS;

				clientInfo.browser = browserNames[
					isOpera ? 'opera' :
						isEdge ? 'edge' :
							isEdgeChromium ? 'edge' :
								isIE ? 'ie' :
									isChrome ? 'chrome' :
										isSafari ? 'safari' :
											isFirefox ? 'firefox' :
												isBlink ? 'blink' :
													'Unknown Browser'
				];
			};

			/**
			 * Retrieves the client info from local storage, if it exists.
			 * If no data is found, it will gather the user agent, geo info, and browser name.
			 * @returns {void}
			 */
			const _getClientFromLocalStorage = () => {
				const storedClient = localStorage.getItem('EOclient');

				if (storedClient === null) {
					clientInfo.userAgent = navigator.userAgent;
					_getGeoInfo();
					_determineBrowser();
				} else {
					const { userAgent, geo, browser } = JSON.parse(storedClient);

					clientInfo.userAgent = userAgent;
					clientInfo.geo = geo;
					clientInfo.browser = browser;
				}
			};

			_getClientFromLocalStorage();
			return clientInfo;
		}();
	}();

	const _slider = function () {

		const inputFromElementId = "sliderFrom";
		const inputToElementId = "sliderTo";
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
			let inputFromId = document.querySelector(sliderElement).dataset.inputFromId || inputFromElementId;
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

	const slider = function () {
		return { create: _slider.create }
	}();

	const _video = function () {
		const _handleVideoAdd = () => {
			document.addEventListener('click', function (event) {
				if (event.target.closest('.btn-add-video')) {
					const input = document.getElementById('youtubeUrl');
					const btnSpinner = document.querySelector('.btn-add-video .spinner-border');
					const btnText = document.querySelector('.btn-add-video .btn-text');
					const video = getYoutubeVideoData(input.value);

					const _resetForm = () => {
						btnSpinner.classList.add("d-none");
						btnText.classList.remove("d-none");
						input.disabled = false;
					};

					const _invalidResponse = (error) => {
						input.classList.add('is-invalid');
						_resetForm();
						alert.error(error);
						return false;
					};

					btnSpinner.classList.remove("d-none");
					btnText.classList.add("d-none");
					input.disabled = true;

					if (input.value === "") {
						return _invalidResponse("Youtube Url is required!");
					} else if (video.id === undefined) {
						return _invalidResponse(video.message);
					} else if (document.querySelector(`.${CSS.escape(video.id)}`)) {
						return _invalidResponse("Video already added!");
					} else {
						const videoContainer = createElements('div', { class: video.id, 'data-id': video.id });

						const createHiddenInput = (name, value) => {
							return createElements('input', {
								type: 'hidden',
								name: `videos[${video.id}]${name}`,
								value: value
							});
						};

						videoContainer.appendChild(createHiddenInput('[id]', video.id));
						videoContainer.appendChild(createHiddenInput('[thumbnail][default]', video.thumbnail.default));
						videoContainer.appendChild(createHiddenInput('[thumbnail][hq]', video.thumbnail.hq));
						videoContainer.appendChild(createHiddenInput('[thumbnail][mq]', video.thumbnail.mq));
						videoContainer.appendChild(createHiddenInput('[thumbnail][sd]', video.thumbnail.sd));
						videoContainer.appendChild(createHiddenInput('[thumbnail][maxres]', video.thumbnail.maxres));
						videoContainer.appendChild(createHiddenInput('[url]', video.url));
						videoContainer.appendChild(createHiddenInput('[embed]', video.embed));
						videoContainer.appendChild(createHiddenInput('[created_at]', Date.now()));

						const btnDeleteContainer = createElements('div', { class: 'btn-delete-container w-100 text-end p-1' }, [
							createElements('span', { class: 'btn btn-danger btn-remove-video', 'data-id': video.id }, [
								createElements('i', { class: 'ti ti-trash' })
							])
						]);

						videoContainer.appendChild(btnDeleteContainer);

						const btnPlayback = createElements('div', {
							class: 'avatar avatar-xxxl p-2 btn-playback cursor-pointer text-white',
							'data-id': video.id,
							'data-url': video.url,
							'data-embed': video.embed,
							style: `background-image: url(${video.thumbnail.sd}); height: 120px;`
						}, [
							createElements('i', { class: 'ti ti-brand-youtube fs-32' })
						]);

						videoContainer.appendChild(btnPlayback);

						const videoListContainer = document.querySelector('.video-list-container');
						videoListContainer.prepend(videoContainer);

						input.value = "";
						input.classList.remove('is-invalid');
						_resetForm();
					}
				}
			});
		};

		const _handleVideoPlayback = () => {
			document.addEventListener('click', function (event) {
				if (event.target.closest('.btn-playback')) {
					const btn = event.target.closest('.btn-playback');
					const embed = btn.dataset.embed;
					const id = btn.dataset.id;
					
					_modal.create({
						id: id,
						size: 'fullscreen',
						callback: function () {
							return createElements('div', { class: 'row justify-content-center' }, [
								createElements('div', { class: 'col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12' }, [
									createElements('iframe', {
										class: 'w-100',
										height: '560',
										src: embed,
										title: 'YouTube video player',
										frameborder: '0',
										allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;',
										referrerpolicy: 'strict-origin-when-cross-origin',
										allowfullscreen: ''
									}),
									createElements('div', { class: 'text-center' }, [
										createElements('span', { class: 'btn mt-3', 'data-bs-dismiss': 'modal' }, [
											createElements('i', { class: 'ti ti-x me-1' }),
											document.createTextNode(' Close')
										])
									])
								])
							]);
						},
						status: "info",
						destroyable: true
					});

					const modalElement = document.getElementById(id);
					modalElement.querySelector('.modal-content').style.backgroundColor = 'rgba(0, 0, 0, 1)';
				}
			});
		};

		const _handleVideoDeletion = () => {
			document.addEventListener('click', function (event) {
				if (event.target.closest('.btn-remove-video')) {
					const btn = event.target.closest('.btn-remove-video');
					const id = btn.dataset.id;
					const videoElement = document.querySelector(`.${CSS.escape(id)}`);
					if (videoElement) {
						videoElement.remove();
					}
				}
			});
		};

		const _createVideoformId = () => {
			const container = document.getElementById('videoInput');
			if (!container) {
				return false;
			}

			const formGroup = createElements('div', { class: 'd-flex gap-1' }, [
				createElements('div', { class: 'form-floating flex-fill' }, [
					createElements('input', {
						type: 'text',
						id: 'youtubeUrl',
						class: 'form-control',
						placeholder: '',
						'aria-label': 'Youtube Url',
						'aria-describedby': 'basic-addon1'
					}),
					createElements('label', { for: 'youtubeUrl' }, [
						createElements('i', { class: 'ti ti-brand-youtube' }),
						document.createTextNode(' Paste Youtube Url')
					])
				]),
				createElements('span', { class: 'btn btn-primary btn-add-video' }, [
					createElements('span', {
						class: 'spinner-border spinner-border-sm d-none',
						role: 'status',
						'aria-hidden': 'true'
					}),
					createElements('span', { class: 'btn-text fs-18' }, [
						createElements('i', { class: 'ti ti-plus me-1' }),
						document.createTextNode(' Add Video')
					])
				])
			]);

			container.appendChild(formGroup);
		};

		return {
			_initAfterLoad: () => {
				_createVideoformId();
			},
			_initBeforeLoad: () => {
				_handleVideoAdd();
				_handleVideoDeletion();
				_handleVideoPlayback();
			}
		};
	}();

	const tinymce = function () {
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
			}

			const mergedOptions = { ...defaultOptions, ...options };

			tinyMCE.remove();
			tinyMCE.init(mergedOptions);
		}

		return {
			init
		}

	}();

	const tomSelect = function () {
		const init = (containerId) => {
			if (window.TomSelect) {
				new TomSelect(document.querySelector(containerId), {
					copyClassesToDropdown: false,
					dropdownParent: 'body',
					controlInput: '<input>',
					render: {
						item: function (data, escape) {
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
						option: function (data, escape) {
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

	const alert = function () {

		const _display = (message, element) => {
			const messageContainer = document.querySelector(element);

			if (!messageContainer) {
				const newDiv = document.createElement('div');
				newDiv.classList.add('response');
				document.body.prepend(newDiv);
			}

			document.querySelector(element).innerHTML = message;
		};

		const _displayAlert = (message, type = 'success', element = '.response') => {  // Combined function
			const alertClasses = `message alert alert-${type} alert-dismissible show`; // Dynamic class
			const alertDiv = createElements('div', {
				class: alertClasses,
				role: 'alert'
			}, [
				createElements('span', {}, [document.createTextNode(message)]),
				createElements('button', {
					type: 'button',
					class: 'btn-close',
					'data-bs-dismiss': 'alert',
					'aria-label': 'Close'
				})
			]);

			_display(alertDiv.outerHTML, element);
		};

		const success = (message, element = '.response') => _displayAlert(message, 'success', element);

		const error = (message, element = '.response') => _displayAlert(message, 'danger', element);

		const loader = (message = "Processing, Please wait...", element = '.response') => {
			const loaderDiv = createElements('div', {
				class: 'bg-white p-3 mt-3 rounded border'
			}, [
				createElements('div', {
					class: 'd-flex gap-3 align-items-center'
				}, [
					createElements('div', {
						class: 'loader'
					}),
					createElements('p', {
						class: 'mb-0'
					}, [
						document.createTextNode(message)
					])
				])
			]);

			_display(loaderDiv.outerHTML, element);
		};

		const message = (message, element = '.response') => {
			_display(message, element);
		};

		return {
			success,
			error,
			loader,
			message
		};
	}();

	const button = function () {
		/**
		 * Disable all buttons on the page, visually and interactively
		 */
		const disable = (element = ".btn") => {
			const elements = document.querySelectorAll(element);

			elements.forEach(el => {
				el.style.cursor = 'wait';
				el.style.pointerEvents = 'none';
				el.style.opacity = 0.5;
				el.disabled = true;
			});
		};

		const enable = (element = ".btn") => {
			const elements = document.querySelectorAll(element);

			elements.forEach(el => {
				el.style.cursor = 'pointer';
				el.style.pointerEvents = 'auto';
				el.style.opacity = 1;
				el.disabled = false;
			});
		};

		return {
			disable,
			enable
		};
	}();

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

		document.addEventListener('submit', function (event) {
			console.log(event.target.id);
			if (event.target.id === formId) {
				event.preventDefault();
			}
		});

		const _validatorResponse = (validator) => {
			const messages = [];

			if (validator) {
				Object.keys(validator).forEach((key) => {
					messages.push(validator[key]);
				});
				return messages.join(', ');
			}

			return false;
		};

		const form = document.getElementById(formId);

		if (!form) {
			console.error(`Form with ID '${formId}' not found!`);
			return;
		}

		const formData = Array.from(form.elements)
			.filter(element => element.name)
			.map(element => ({
				name: element.name,
				value: element.value
			}));

		formData.push({ name: 'csrf_token', value: _CSRFToken });

		if (onBeforeSend) {
			onBeforeSend(formData);
		}

		return post(form.getAttribute('action'), formData, {
			beforeSend: () => {
				alert.loader();

				if (typeof validation === 'object') {
					if (typeof validate !== 'undefined') {
						const validationErrors = _validatorResponse(validate(serializeFormData(formData), validation));
						if (validationErrors) {
							alert.error(validationErrors);
							return false;
						}
					} else {
						console.log("validate.js is not included in the head. Include it from " + CDN + "/js/vendor/validatejs-0.13.1/validate.min.js or https://validatejs.org/#validatejs-download");
					}
				}

				button.disable();
			},
			onSuccess: (responseData) => {
				try {
					const response = typeof responseData === 'object' ? responseData : JSON.parse(responseData);
					alert.message(response.message);
					if (response.status === 1) {
						if (callback) {
							callback(serializeFormData(formData), response);
						}

						if (redirectUrl) {
							alert.loader("Please wait while you are redirecting...");
							setTimeout(() => {
								redirect(redirectUrl);
							}, 10);
						}
					}
				} catch (e) {
					if (callback) {
						alert.message("");
						callback(serializeFormData(formData), responseData);

						if (isInDevelopment() == 1) { 
							console.log(e);
						}
					}

					if (redirectUrl) {
						alert.loader("Please wait while you are redirecting...");
						setTimeout(() => {
							redirect(redirectUrl);
						}, 10);
					}
				}
			},
			onComplete: () => {
				button.enable();
			}
		});
	};

	const _modal = function () {
		/**
		 * Creates a modal element with a given id, size, content, status and destroyable flag.
		 * @param {string} id - The id of the modal element.
		 * @param {string} size - The size of the modal element. Can be "xs", "sm", "md", "lg", "xl", "fullscreen".
		 * @param {function} [callback] - A callback function to be called to generate the modal content.
		 * @param {boolean} [status=false] - Whether to add a modal status element to the modal element.
		 * @param {boolean} [destroyable=false] - Whether to add a modal destroyable class to the modal element.
		 */
		const create = ({ id, size, callback, status = false, destroyable = true } = {}) => {
			const destroyableClass = destroyable ? "modal-destroyable" : "";

			const modal = createElements('div', {
				class: `modal ${destroyableClass}`,
				id: id,
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
								...(callback ? (() => {
									const callbackContent = callback();

									if (typeof callbackContent === 'string') {
										// Treat as HTML and parse:
										const tempDiv = document.createElement('div');
										tempDiv.innerHTML = callbackContent; // Parse HTML string
										const elements = Array.from(tempDiv.childNodes); // Get the parsed elements

										// Check if there is only one element.
										if (elements.length === 1) {
											return [elements[0]];
										} else {
											return elements; // Return an array of parsed elements
										}

									} else if (callbackContent instanceof Element) {
										return [callbackContent]; // Return the Element directly
									} else {
										console.warn('Callback should return either a string or an Element');
										return [];
									}
								})() : [])
							])
						])
					])
				])
			]);

			document.body.appendChild(modal);

			new bootstrap.Modal(document.getElementById(id), {
				keyboard: false
			}).show(document.getElementById(id));
		};

		const _handleModalClose = () => {
			document.addEventListener('click', function (event) {
				if (event.target.classList.contains('btn-close')) {
					const modal = event.target.closest('.modal');
					if (modal) {
						const bsModal = bootstrap.Modal.getInstance(modal);
						if (bsModal) {
							bsModal.hide();
						} else {
							console.error("Modal element not associated with a Bootstrap Modal instance.");
						}
					}
				}
			});
		};

		/**
		 * Destroys a modal element after it has been closed if it has the "modal-destroyable" class.
		 * This is a private function and should not be used directly.
		 */
		const _destroyModalOnClose = () => {
			document.addEventListener('hidden.bs.modal', function (event) {
				const modal = document.getElementById(event.target.id);
				if (modal && modal.classList.contains("modal-destroyable")) {
					modal.remove();
				}
			});
		};

		return {
			_initAfterLoad: () => {
				_destroyModalOnClose();
				_handleModalClose();
			},
			create
		};
	}();

	const modal = function () {
		return {
			create: _modal.create
		}
	}();

	const uploader = function () {

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
				class: containerSelector.replace(".", "") // Remove the .
			}, [
				createElements('form', {
					id: 'uploadForm',
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
				createElements('input', {
					type: 'hidden',
					name: `upload[${image.id}][image_id]`,
					value: image.id
				}),
				createElements('input', {
					type: 'hidden',
					name: `upload[${image.id}][height]`,
					value: image.height
				}),
				createElements('input', {
					type: 'hidden',
					name: `upload[${image.id}][width]`,
					value: image.width
				}),
				createElements('input', {
					type: 'hidden',
					name: `upload[${image.id}][filename]`,
					value: image.filename
				}),
				createElements('input', {
					type: 'hidden',
					name: `upload[${image.id}][url]`,
					value: image.final_url
				}),
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
						document.createTextNode(" Thumbnail")
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
				console.error("Container element not found.");
			}
		};

		const _setSingleUploadContainer = (image, uploadedContainerSelector = '.photo-preview') => {
			const containerSelector = uploadedContainerSelector.replace(".", "");
			const previewElement = document.querySelector(containerSelector);

			if (!previewElement) {
				console.error(`Element with selector '${uploadedContainerSelector}' not found.`);
				return;
			}


			if (image.status == 1) {
				previewElement.style.backgroundImage = `url(${image.temp_url})`;
				alert.message("");

				const photoInput = document.getElementById('photo');
				if (photoInput) {
					photoInput.value = image.final_url;
				} else {
					console.error("Element with ID 'photo' not found.");
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
			const containerSelector = uploadedContainerSelector.replace(".", "");
			const container = document.querySelector(containerSelector);
			if (!container) {
				console.error(`Container with selector '${uploadedContainerSelector}' not found.`);
				return;
			}

			let fileElement = createElements('div', { class: 'flex-grow-1' }, [
				createElements('input', {
					type: 'hidden',
					name: `documents[${file.id}][id]`,
					value: file.id
				}),
				createElements('input', {
					type: 'hidden',
					name: `documents[${file.id}][filename]`,
					value: file.filename
				}),
				createElements('input', {
					type: 'hidden',
					name: `documents[${file.id}][size]`,
					value: file.size
				}),
				createElements('input', {
					type: 'hidden',
					name: `documents[${file.id}][finalUrl]`,
					value: file.final_url
				}),
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
				createElements('div', { class: 'btn-list' }, [
					createElements('span', {
						class: 'btn-remove-document cursor-pointer p-2',
						'data-id': file.id,
						'data-filename': file.filename
					}, [
						createElements('i', { class: 'ti ti-trash me-1' }),
						document.createTextNode(" Remove")
					])
				])
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
			document.addEventListener('click', function (event) {
				if (event.target.closest('.btn-remove-document')) {
					const btn = event.target.closest('.btn-remove-document');
					const id = btn.dataset.id;
					const filename = btn.dataset.filename;

					get(`${DOMAIN}/properties/removeDocument/${filename}`, {
						onSuccess: function (response) {
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
			document.addEventListener('click', function (event) {

				if (event.target.closest('.btn-set-thumbnail')) {
					const btn = event.target.closest('.btn-set-thumbnail');
					const finalUrl = btn.dataset.finalUrl;

					const thumbnailButtons = document.querySelectorAll('.btn-set-thumbnail');
					thumbnailButtons.forEach(button => {
						button.classList.remove('btn-success');
						button.classList.add('btn-outline-primary');
						button.innerHTML = "<i class='ti ti-click me-2'></i> Thumbnail";
					});

					btn.classList.add('btn-success');
					btn.classList.remove('btn-outline-primary');
					btn.innerHTML = "<i class='ti ti-check me-2'></i> Thumbnail";

					const thumbImgInput = document.getElementById('thumb_img');
					if (thumbImgInput) {
						thumbImgInput.value = finalUrl;
					} else {
						console.error("Element with ID 'thumb_img' not found.");
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
						onSuccess: function (response) {
							if (response.status == 1) {
								const elementToRemove = document.querySelector(container);
								if (elementToRemove) {
									elementToRemove.remove();
								} else {
									console.error(`Element with selector '${container}' not found.`);
								}
							}
							alert.message(response.message);
						}
					});
				}
			});
		};

		const _initUploaderEvents = (containerSelector, input, success, error) => {

			document.addEventListener('click', function (event) {
				if (event.target.closest(`${containerSelector} .btn-browse`)) {
					const inputElement = document.querySelector(`${containerSelector} #${input}`);
					if (inputElement) {
						inputElement.click();
					} else {
						console.error(`Input element with selector '${containerSelector} #${input}' not found.`);
					}
				}
			});

			document.addEventListener('change', function (event) {
				if (event.target.matches(`${containerSelector} #${input}`)) {
					const form = document.querySelector(`${containerSelector} #uploadForm`);

					if (!form) {
						console.error(`Form element with selector '${containerSelector} #uploadForm' not found.`);
						return;
					}

					const formData = new FormData(form);

					const urlElement = document.querySelector(`${containerSelector} #uploadForm`);
					if (!urlElement) {
						console.error(`Form element with selector '${containerSelector} #uploadForm' not found.`);
						return;
					}
					const url = urlElement.action;

					formData.append('csrf_token', _CSRFToken);

					post(url, formData, {
						processData: false,
						contentType: false,
						beforeSend: () => {
							alert.loader("Please wait while you are uploading...");
							button.disable();
						},
						onSuccess: (response) => {
							alert.message("");
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

	const googleChart = function () {

		const bar = ({ containerId, data = null, options = {} } = {}) => {
			const container = document.getElementById(containerId);
			if (container === null || container === undefined) {
				return false;
			}

			google.charts.load("current", { packages: ['bar'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
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

			google.charts.load("current", { packages: ['calendar'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
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

			google.charts.load("current", { packages: ['corechart'], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.GeoChart(container);

				if (options.displayMode !== undefined && options.displayMode == 'markers') {
					if (apiKey === null) {
						throw new Error("Markers require geocoding, you'll need a ApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings");
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

			google.charts.load("current", { packages: ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
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

			google.charts.load("current", { packages: ['line'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
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

			google.charts.load("current", { packages: ['map'], mapsApiKey: apiKey });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.Map(container);

				if (apiKey === null) {
					throw new Error("Maps require a mapsApiKey. See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings");
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

			google.charts.load("current", { packages: ['corechart'] });
			google.charts.setOnLoadCallback(drawChart);

			function drawChart() {
				if (data === null) {
					throw new Error("Set the data in table property");
				}

				const dataTable = data(new google.visualization.DataTable());
				const chart = new google.visualization.ScatterChart(container);

				const defaultOptions = { trendlines: { 0: {} } };
				const mergeOptions = { ...defaultOptions, ...options }

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

	const _mortgageCalculator = function () {

		const _calculateMortgage = () => {
			const resultContainer = document.querySelector('.mortgage-calculator-form #result');
			if (!resultContainer) {
				return;
			}

			const result = _getAmortization();

			resultContainer.setAttribute("monthlyPayment", result.monthlyPayment);
			resultContainer.innerHTML = `&#8369;${result.formattedMonthlyPayment}`;
		};

		const _calculateMortgageOnChange = () => {
			document.addEventListener('change', function (event) {
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
			const select = createElements('select', { id: "mortgageDownpayment", class: "form-select" },
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

			const select = createElements('select', { id: "mortgageInterest", class: "form-select" },
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
			const select = createElements('select', { id: "mortgageYear", class: "form-select" },
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
				const row = [i, principle > 0 ? (principle < monthlyPayment ? principle : monthlyPayment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0];
				schedule.push(row);
				remaining -= principle;
			}

			return schedule;
		};

		const _getAmortization = () => {
			const sellingPriceElement = document.getElementById('sellingPrice');
			if (!sellingPriceElement) {
				console.error("Selling price element not found.");
				return;
			}

			const sellingPrice = parseInt(sellingPriceElement.value, 10);

			const downPaymentPercentElement = document.querySelector('#mortgageDownpayment option:checked');
			if (!downPaymentPercentElement) {
				console.error("Down payment percentage element not found.");
				return;
			}

			const downPaymentPercent = parseInt(downPaymentPercentElement.value, 10);
			const downPayment = sellingPrice * (downPaymentPercent / 100);
			const loanAmount = sellingPrice - downPayment;

			const interestRateElement = document.querySelector('#mortgageInterest option:checked');
			if (!interestRateElement) {
				console.error("Interest rate element not found.");
				return;
			}

			const interestRate = parseFloat(interestRateElement.value);
			const yearsElement = document.querySelector('#mortgageYear option:checked');

			if (!yearsElement) {
				console.error("Loan term element not found.");
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

	const eo = {
		initBeforeLoad: function () {
			/* Address.initBeforeLoad(); */
			_video._initBeforeLoad();
			_slider._initBeforeLoad();
			_mortgageCalculator._initBeforeLoad();
		},

		initAfterLoad: () => {
			/* Address.initAfterLoad(); */
			_video._initAfterLoad();
			_slider._initAfterLoad();
			_modal._initAfterLoad();
			_mortgageCalculator._initAfterLoad();

			let resizeTO;

			window.addEventListener('resize', function () {
				if (resizeTO) {
					clearTimeout(resizeTO);
				}
				resizeTO = setTimeout(function () {
					window.dispatchEvent(new Event('resizeEnd'));
				}, 500);
			});

		},

		eoSettings,
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
		submitForm,
		moveHtmlElement,
		userClient,
		_CSRFToken,
		settings,

		component: {
			tinymce,
			slider,
			tomSelect,
			modal,
			alert,
			button,
			uploader,
			googleChart
		},
	}

	return eo;
});

document.addEventListener('DOMContentLoaded', function () {
	window.eo.initBeforeLoad();
});

window.addEventListener('load', function () {
	window.eo.initAfterLoad();
});

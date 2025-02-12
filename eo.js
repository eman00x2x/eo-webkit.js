// eo.js
; (function (factory) {
	if (typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		window.eo = factory();
	}
})(function () {

	"use strict";

	const DOMAIN = "";
	const CDN = "";
	const API_KEY = {};

	const settings = ({ domain, cdn, apiKey = {} } = {}) => {
		eo.DOMAIN = domain;
		eo.CDN = cdn;
		eo.API_KEY = apiKey;
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
		const urlRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
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
	 * Send a POST request to the given URL with the given data.
	 *
	 * This function returns a promise object that resolves to the response from the server.
	 *
	 * The function takes an optional object with the following properties as its last argument:
	 *
	 * - `beforeSend`: a function called before the request is sent.
	 * - `onSuccess`: a function called when the request is successful.
	 * - `onError`: a function called when the request fails.
	 * - `onComplete`: a function called when the request is complete.
	 *
	 * @param {string} url - The URL to send the request to
	 * @param {object} data - The data to send with the request
	 * @param {object} [options] - The options object
	 * @returns {Promise} The promise object
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
		let headers = {};

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
			.then(async response => {
				const responseData = await response.json();

				if (response.ok) {
					onSuccess?.(responseData);
					if (isInDevelopment() == 1) {
						console.log(responseData);
					}
				} else {
					const error = new Error(response.statusText);
					onError?.(response, response.statusText, error);
					if (response.statusText === "error") {
						alert.error(error);
						button.enable();
					}

					if (isInDevelopment() == 1) {
						button.enable();
						throw { response, textStatus: response.statusText, errorThrown: error };
					}

					console.log(response, response.statusText, error);
				}
			})
			.catch(error => {
				onError?.(null, error.message, error);
				console.log(error);
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

			const inputFrom = document.createElement('input');
			inputFrom.type = 'hidden';
			inputFrom.name = inputFromId;
			inputFrom.id = inputFromId;
			inputFrom.value = '';
			document.querySelector(sliderElement).prepend(inputFrom);

			const inputTo = document.createElement('input');
			inputTo.type = 'hidden';
			inputTo.name = inputToId;
			inputTo.id = inputToId;
			inputTo.value = '';
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
						const videoContainer = document.createElement('div');
						videoContainer.classList.add(video.id);
						videoContainer.dataset.id = video.id;

						const createHiddenInput = (name, value) => {
							const input = document.createElement('input');
							input.type = 'hidden';
							input.name = `videos[${video.id}]${name}`;
							input.value = value;
							return input;
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

						const btnDeleteContainer = document.createElement('div');
						btnDeleteContainer.classList.add('btn-delete-container', 'w-100', 'text-end', 'p-1');

						const btnRemoveVideo = document.createElement('span');
						btnRemoveVideo.classList.add('btn', 'btn-danger', 'btn-remove-video');
						btnRemoveVideo.dataset.id = video.id;

						const deleteIcon = document.createElement('i');
						deleteIcon.classList.add('ti', 'ti-trash');
						btnRemoveVideo.appendChild(deleteIcon);
						btnDeleteContainer.appendChild(btnRemoveVideo);
						videoContainer.appendChild(btnDeleteContainer);

						const btnPlayback = document.createElement('div');
						btnPlayback.classList.add('avatar', 'avatar-xxxl', 'p-2', 'btn-playback', 'cursor-pointer', 'text-white');
						btnPlayback.dataset.id = video.id;
						btnPlayback.dataset.url = video.url;
						btnPlayback.dataset.embed = video.embed;
						btnPlayback.style.backgroundImage = `url(${video.thumbnail.sd})`;
						btnPlayback.style.height = '120px';
						const playIcon = document.createElement('i');
						playIcon.classList.add('ti', 'ti-brand-youtube', 'fs-32');
						btnPlayback.appendChild(playIcon);
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
					const url = btn.dataset.url;
					const id = btn.dataset.id;
					let html = ``;
					_modal.create({
						id: id,
						size: 'fullscreen',
						callback: function () {
							html += `<div class='row justify-content-center'>`;
							html += `<div class='col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12'>`;
							html += `<iframe class='w-100' height='560' src='${embed}' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>`;
							html += `<div class='text-center'>`;
							html += `<span class='btn mt-3' data-bs-dismiss='modal'><i class='ti ti-x me-1'></i> Close</span>`;
							html += `</div>`;
							html += `</div>`;
							html += `</div>`;
							return html;
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

			const createElements = (tag, attributes = {}, children = []) => {
				const element = document.createElement(tag);
				for (const [key, value] of Object.entries(attributes)) {
					element.setAttribute(key, value);
				}
				children.forEach(child => element.appendChild(child));
				return element;
			};

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
								const div = document.createElement('div');
								const span = document.createElement('span');
								span.classList.add('dropdown-item-indicator');
								span.textContent = data.customProperties;
								div.appendChild(span);
								div.appendChild(document.createTextNode(escape(data.text)));
								return div;
							}
							const div = document.createElement('div');
							div.textContent = escape(data.text);
							return div;

						},
						option: function (data, escape) {
							if (data.customProperties) {
								const div = document.createElement('div');
								const span = document.createElement('span');
								span.classList.add('dropdown-item-indicator');
								span.textContent = data.customProperties;
								div.appendChild(span);
								div.appendChild(document.createTextNode(escape(data.text)));
								return div;
							}
							const div = document.createElement('div');
							div.textContent = escape(data.text);
							return div;
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

		const success = (message, element = '.response') => {
			const alertDiv = document.createElement('div');
			alertDiv.classList.add('message', 'alert', 'alert-success', 'alert-dismissible', 'show');
			alertDiv.setAttribute('role', 'alert');

			const messageSpan = document.createElement('span');
			messageSpan.textContent = message;
			alertDiv.appendChild(messageSpan);

			const closeButton = document.createElement('button');
			closeButton.type = 'button';
			closeButton.classList.add('btn-close');
			closeButton.setAttribute('data-bs-dismiss', 'alert');
			closeButton.setAttribute('aria-label', 'Close');
			alertDiv.appendChild(closeButton);

			_display(alertDiv.outerHTML, element); 
		};

		const error = (message, element = '.response') => {
			const alertDiv = document.createElement('div');
			alertDiv.classList.add('message', 'alert', 'alert-danger', 'alert-dismissible', 'show');
			alertDiv.setAttribute('role', 'alert');

			const messageSpan = document.createElement('span');
			messageSpan.textContent = message;
			alertDiv.appendChild(messageSpan);

			const closeButton = document.createElement('button');
			closeButton.type = 'button';
			closeButton.classList.add('btn-close');
			closeButton.setAttribute('data-bs-dismiss', 'alert');
			closeButton.setAttribute('aria-label', 'Close');
			alertDiv.appendChild(closeButton);

			_display(alertDiv.outerHTML, element); 
		};

		const loader = (message = "Processing, Please wait...", element = '.response') => {
			const loaderDiv = document.createElement('div');
			loaderDiv.classList.add('bg-white', 'p-3', 'mt-3', 'rounded', 'border');

			const innerDiv = document.createElement('div');
			innerDiv.classList.add('d-flex', 'gap-3', 'align-items-center');

			const loaderSpinner = document.createElement('div');
			loaderSpinner.classList.add('loader');
			innerDiv.appendChild(loaderSpinner);

			const messageParagraph = document.createElement('p');
			messageParagraph.classList.add('mb-0');
			messageParagraph.textContent = message;
			innerDiv.appendChild(messageParagraph);

			loaderDiv.appendChild(innerDiv);

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
			consosle.log(event.target.id);
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

		return post(form.action, formData, {
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

	/**
	 * Moves an HTML element from one location to another within the DOM.
	 * 
	 * @param {string} fromElementId - The ID of the element to be moved.
	 * @param {string} toElementId - The ID of the element where the `fromElement` will be appended.
	 * 
	 * The function selects the element specified by `fromElementId` and appends it 
	 * to the element specified by `toElementId`. If either element is not found, 
	 * the function returns without making any changes.
	 */
	const moveHtmlElement = function (fromElementId, toElementId) {
		const fromElement = document.getElementById(fromElementId);
		const toElement = document.getElementById(toElementId);

		if (fromElement === null || toElement === null) {
			return;
		}

		toElement.innerHTML = fromElement.innerHTML;
		fromElement.innerHTML = '';
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

			let html = document.createElement('div');
			html.classList.add('modal', destroyableClass); 
			html.id = id;
			html.setAttribute('aria-labelledby', 'modal');
			html.setAttribute('aria-hidden', 'true');

			const modalDialog = document.createElement('div');
			modalDialog.classList.add('modal-dialog', `modal-${size}`);
			html.appendChild(modalDialog);

			const modalContent = document.createElement('div');
			modalContent.classList.add('modal-content');
			modalDialog.appendChild(modalContent);

			if (status) {
				const modalStatus = document.createElement('div');
				modalStatus.classList.add('modal-status', `bg-${status}`);
				modalContent.appendChild(modalStatus);
			}

			const modalBody = document.createElement('div');
			modalBody.classList.add('modal-body');
			modalContent.appendChild(modalBody);

			const closeButton = document.createElement('span');
			closeButton.classList.add('btn-close');
			closeButton.setAttribute('data-bs-dismiss', 'modal');
			closeButton.setAttribute('aria-label', 'Close');
			modalBody.appendChild(closeButton);

			const responseModal = document.createElement('div');
			responseModal.classList.add('response-modal');
			modalBody.appendChild(responseModal);

			if (callback !== undefined) {
				const callbackContent = callback(); 
				if (typeof callbackContent === 'string') {
					responseModal.innerHTML = callbackContent; 
				} else if (callbackContent instanceof Element) {
					responseModal.appendChild(callbackContent); 
				} else {
					console.warn('Callback function should return either a string or an Element')
				}
			}

			const htmlString = html.outerHTML;

			document.body.appendChild(html);

			new bootstrap.Modal(document.getElementById(id), {
				keyboard: false
			}).show(document.getElementById(id))
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

		const _createUploadContainer = (uploadContainerSelector ) => {
			const container = document.querySelector(uploadContainerSelector);

			if (!container) {
				const newDiv = document.createElement('div');
				newDiv.classList.add('upload-container');
				document.body.prepend(newDiv);
				container = document.querySelector('.upload-container'); 
				uploadContainerSelector = '.upload-container'; 
			}

			const html = `<span class='btn btn-dark btn-browse'><i class='ti ti-upload me-2'></i> Upload</span>`;
			container.innerHTML = html;
		};

		const _createUploadForm = (url, inputId, accept, multiple, containerSelector) => {
			const containerDiv = document.createElement('div');
			containerDiv.classList.add(containerSelector.replace(".", "")); 

			const form = document.createElement('form');
			form.id = 'uploadForm';
			form.classList.add('d-none');
			form.action = url;
			form.method = 'POST';
			form.enctype = 'multipart/form-data';

			const center = document.createElement('center');

			const input = document.createElement('input');
			input.type = 'file';
			input.id = inputId;
			input.accept = accept;

			if (multiple) {
				input.name = `${inputId}[]`;
				input.multiple = true;
			} else {
				input.name = inputId;
				input.value = '';
			}

			center.appendChild(input);
			form.appendChild(center);
			containerDiv.appendChild(form);

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
			uploadedContainerSelector.replace(".", "");
			const container = document.querySelector(uploadedContainerSelector);

			if (!container) {
				console.log(`Container with selector '${uploadedContainerSelector}' not found.`);
				return; 
			}

			let div = document.createElement('div');
			div.classList.add(image.id, `image_${image.id}`, 'me-2', 'mb-3', 'flex-grow-1');

			/* Create hidden inputs */
			let inputImageId = document.createElement('input');
			inputImageId.type = 'hidden';
			inputImageId.name = `upload[${image.id}][image_id]`;
			inputImageId.value = image.id;
			div.appendChild(inputImageId);

			let inputHeight = document.createElement('input');
			inputHeight.type = 'hidden';
			inputHeight.name = `upload[${image.id}][height]`;
			inputHeight.value = image.height;
			div.appendChild(inputHeight);

			let inputWidth = document.createElement('input');
			inputWidth.type = 'hidden';
			inputWidth.name = `upload[${image.id}][width]`;
			inputWidth.value = image.width;
			div.appendChild(inputWidth);

			let inputFilename = document.createElement('input');
			inputFilename.type = 'hidden';
			inputFilename.name = `upload[${image.id}][filename]`;
			inputFilename.value = image.filename;
			div.appendChild(inputFilename);

			let inputUrl = document.createElement('input');
			inputUrl.type = 'hidden';
			inputUrl.name = `upload[${image.id}][url]`;
			inputUrl.value = image.final_url;
			div.appendChild(inputUrl);

			/* Create image element */
			let imageDiv = document.createElement('div');
			let imageSpan = document.createElement('span');
			imageSpan.classList.add('avatar', 'avatar-xxxl');
			imageSpan.style.backgroundImage = `url('${image.temp_url}')`;
			imageDiv.appendChild(imageSpan);
			div.appendChild(imageDiv);

			/* Create button group */
			let buttonDiv = document.createElement('div');
			buttonDiv.classList.add('btn-list', 'mt-2', 'text-center');

			let removeButton = document.createElement('span');
			removeButton.classList.add('btn', 'btn-md', 'btn-outline-secondary', 'btn-remove-image');
			removeButton.title = 'Remove image';
			removeButton.dataset.container = image.id;
			removeButton.dataset.filename = image.filename;
			removeButton.dataset.url = `${DOMAIN}/properties/images/${image.id}/delete`;
			
			let removeIcon = document.createElement('i');
			removeIcon.classList.add('ti', 'ti-trash');
			removeButton.appendChild(removeIcon);
			buttonDiv.appendChild(removeButton);

			let thumbnailButton = document.createElement('span');
			thumbnailButton.classList.add('btn', 'btn-md', 'btn-outline-primary', 'btn-set-thumbnail');
			thumbnailButton.title = 'Set image as thumbnail';
			thumbnailButton.dataset.container = image.id;
			thumbnailButton.dataset.finalUrl = image.final_url;

			let thumbnailIcon = document.createElement('i');
			thumbnailIcon.classList.add('ti', 'ti-click', 'me-2');
			thumbnailButton.appendChild(thumbnailIcon);
			thumbnailButton.appendChild(document.createTextNode(" Thumbnail"));
			buttonDiv.appendChild(thumbnailButton);

			div.appendChild(buttonDiv);

			/* Handle error state */
			if (image.status == 2) {
				let alertDiv = document.createElement('div');
				alertDiv.classList.add('alert', 'alert-danger', 'alert-dismissible');

				let alertIcon = document.createElement('i');
				alertIcon.classList.add('ti', 'ti-alert-triangle', 'me-2');
				alertIcon.setAttribute('aria-hidden', 'true');
				alertDiv.appendChild(alertIcon);

				let messageSpan = document.createElement('span');
				messageSpan.classList.add('p-0', 'm-0');
				messageSpan.textContent = image.message;
				alertDiv.appendChild(messageSpan);

				let closeButton = document.createElement('button');
				closeButton.type = 'button';
				closeButton.classList.add('btn-close');
				closeButton.dataset.bsDismiss = 'alert';
				alertDiv.appendChild(closeButton);

				div = alertDiv; 
			}

			if (container) {
				container.prepend(div);
			} else {
				console.error("Container element not found.");
			}
		};

		const _setSingleUploadContainer = (image, uploadedContainerSelector = '.photo-preview') => {
			const previewElement = document.querySelector(uploadedContainerSelector);

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
			const container = document.querySelector(uploadedContainerSelector);
			if (!container) {
				console.error(`Container with selector '${uploadedContainerSelector}' not found.`);
				return;
			}

			let html = "";

			/* Create the file element */
			const fileElement = document.createElement('div');
			fileElement.classList.add('flex-grow-1');

			const inputId = document.createElement('input');
			inputId.type = 'hidden';
			inputId.name = `documents[${file.id}][id]`;
			inputId.value = file.id;
			fileElement.appendChild(inputId);

			const inputFilename = document.createElement('input');
			inputFilename.type = 'hidden';
			inputFilename.name = `documents[${file.id}][filename]`;
			inputFilename.value = file.filename;
			fileElement.appendChild(inputFilename);

			const inputSize = document.createElement('input');
			inputSize.type = 'hidden';
			inputSize.name = `documents[${file.id}][size]`;
			inputSize.value = file.size;
			fileElement.appendChild(inputSize);

			const inputFinalUrl = document.createElement('input');
			inputFinalUrl.type = 'hidden';
			inputFinalUrl.name = `documents[${file.id}][finalUrl]`;
			inputFinalUrl.value = file.final_url;
			fileElement.appendChild(inputFinalUrl);

			const fileInfoDiv = document.createElement('div');
			fileInfoDiv.classList.add('d-flex', 'p-y', 'align-items-center');

			const avatarSpan = document.createElement('span');
			avatarSpan.classList.add('avatar', 'me-2');
			const pdfIcon = document.createElement('i');
			pdfIcon.classList.add('ti', 'ti-pdf', 'fs-18');
			avatarSpan.appendChild(pdfIcon);
			fileInfoDiv.appendChild(avatarSpan);

			const fileDetailsDiv = document.createElement('div');
			fileDetailsDiv.classList.add('flex-fill');

			const aliasInputDiv = document.createElement('div');
			aliasInputDiv.classList.add('font-weight-medium');
			const aliasInput = document.createElement('input');
			aliasInput.type = 'text';
			aliasInput.name = `documents[${file.id}][alias]`;
			aliasInput.value = file.alias;
			aliasInput.classList.add('border-0', 'w-100');
			aliasInputDiv.appendChild(aliasInput);
			fileDetailsDiv.appendChild(aliasInputDiv);

			const sizeDiv = document.createElement('div');
			sizeDiv.classList.add('text-secondary', 'small');
			sizeDiv.textContent = file.size;
			fileDetailsDiv.appendChild(sizeDiv);
			fileInfoDiv.appendChild(fileDetailsDiv);
			fileElement.appendChild(fileInfoDiv);

			/* Create the button */
			const buttonDiv = document.createElement('div');
			buttonDiv.classList.add('btn-list');

			const removeButton = document.createElement('span');
			removeButton.classList.add('btn-remove-document', 'cursor-pointer', 'p-2');
			removeButton.dataset.id = file.id;
			removeButton.dataset.filename = file.filename;
			const removeIcon = document.createElement('i');
			removeIcon.classList.add('ti', 'ti-trash', 'me-1');
			removeButton.appendChild(removeIcon);
			removeButton.appendChild(document.createTextNode(" Remove"));
			buttonDiv.appendChild(removeButton);

			/* Handle error or append the content */
			if (file.status == 2) {
				const alertDiv = document.createElement('div');
				alertDiv.classList.add('alert', 'alert-danger', 'alert-dismissible');
				alertDiv.id = file.id;

				const alertIcon = document.createElement('i');
				alertIcon.classList.add('ti', 'ti-alert-triangle', 'me-2');
				alertIcon.setAttribute('aria-hidden', 'true');
				alertDiv.appendChild(alertIcon);

				const messageSpan = document.createElement('span');
				messageSpan.classList.add('p-0', 'm-0');
				messageSpan.textContent = file.message;
				alertDiv.appendChild(messageSpan);

				const closeButton = document.createElement('button');
				closeButton.type = 'button';
				closeButton.classList.add('btn-close');
				closeButton.dataset.bsDismiss = 'alert';
				alertDiv.appendChild(closeButton);

				html = alertDiv.outerHTML; 
			} else {
				const listItem = document.createElement('li');
				listItem.classList.add('list-group-item', 'd-flex', 'gap-3', 'justify-content-between', 'align-items-center', 'py-3', `file_${file.id}`);
				listItem.appendChild(fileElement);
				listItem.appendChild(buttonDiv);
				html = listItem.outerHTML; 
			}

			container.prepend(html);
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
			const select = document.createElement('select');
			select.id = "mortgageDownpayment";
			select.classList.add("form-select");

			downPaymentOptions.forEach(option => {
				const optionElement = document.createElement('option');
				optionElement.value = option;
				optionElement.textContent = `${option}%`;
				if (option === 20) {
					optionElement.selected = true;
				}
				select.appendChild(optionElement);
			});

			container.insertAdjacentElement('afterend', select); 
			container.remove(); 
		};

		const _createInterestSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #interestSelection');
			if (!container) {
				return;
			}

			const select = document.createElement('select');
			select.id = "mortgageInterest";
			select.classList.add("form-select");

			for (let rate = 0; rate <= 20; rate += 0.25) {
				const option = document.createElement('option');
				option.value = rate;
				option.textContent = `${rate}%`;
				if (rate === 3.75) {
					option.selected = true;
				}
				select.appendChild(option);
			}

			container.insertAdjacentElement('afterend', select);
			container.remove();
		};

		const _createYearsSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #yearSelection');
			if (!container) {
				return;
			}

			const yearsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
			const select = document.createElement('select');
			select.id = "mortgageYear";
			select.classList.add("form-select");

			yearsOptions.forEach(year => {
				const option = document.createElement('option');
				option.value = year;
				option.textContent = `${year} Years`;
				if (year === 3) {
					option.selected = true;
				}
				select.appendChild(option);
			});

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

	return {
		initBeforeLoad: function() {
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
});

document.addEventListener('DOMContentLoaded', function () {
	eo.initBeforeLoad();
});

window.addEventListener('load', function () {
	eo.initAfterLoad();
});

// eo.js
; (function (factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === "object") {
		// Node/CommonJS
		module.exports = factory();
	} else {
		// Browser globals
		window.eo = factory();
	}
})(function () {

	"use strict";

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
	 * Generates a random string of hexadecimal characters, given a string pattern.
	 *
	 * The given string pattern should contain 'x' characters, which will be replaced with a random
	 * hexadecimal character (0-9, A-F). The resulting string will have the same length as the
	 * given pattern.
	 *
	 * @param {string} [text='xxxxxx'] - The string pattern to generate a random string from
	 * @returns {string} A randomly generated string of hexadecimal characters
	 */
	const getRandomChar = (text = 'xxxxxx') => {
		return text.replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
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
		// Nine Zeroes for Billions
		return Math.abs(Number(amount)) >= 1.0e+9

			? Math.abs(Number(amount)) / 1.0e+9 + "B"
			// Six Zeroes for Millions 
			: Math.abs(Number(amount)) >= 1.0e+6

				? Math.abs(Number(amount)) / 1.0e+6 + "M"
				// Three Zeroes for Thousands
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
	const post = (url, data, { beforeSend, onSuccess, onError, onComplete, processData = true, contentType = 'application/x-www-form-urlencoded; charset=UTF-8' } = {}) => {
		return $.ajax({
			type: 'POST',
			url,
			data,
			processData,
			contentType,
			beforeSend,
			success(response) {
				onSuccess?.(response);
				if (isInDevelopment() == 1) {
					console.log(response);
				}
			},
			error(jqXHR, textStatus, errorThrown) {
				onError?.(jqXHR, textStatus, errorThrown);
				if (textStatus == "error") {
					alert.error(errorThrown);
					button.enable();
				}
				
				if (isInDevelopment() == 1) {
					button.enable();
					throw { jqXHR, textStatus, errorThrown };
				}

				console.log(jqXHR, textStatus, errorThrown);
			},
			complete(jqXHR, textStatus) {
				onComplete?.(jqXHR, textStatus);
			}
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
	const get = (url, { beforeRequest, onSuccess, onError, async = false } = {}) => {
		const x = beforeRequest?.();
		if (x === false) { return; }
		return $.ajax({
			url,
			async,
			success(response) {
				onSuccess?.(response);
				return response;
			},
			error(jqXHR, textStatus, errorThrown) {
				const inDevelopment = document.querySelector('meta[name="inDevelopment"]').content;
				onError?.(jqXHR, textStatus, errorThrown);
				if (textStatus == "error") {
					alert.error(errorThrown);
					button.enable();
				}

				if (inDevelopment == 1) {
					button.enable();
					throw { jqXHR, textStatus, errorThrown };
				}
				
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
			$(`<div class='range'></div>`).appendTo(rangeContainerSelector);

			const rangeContainer = document.querySelector('.range');
			if (rangeContainer === null || rangeContainer === undefined) {
				return;
			}

			const mergedOptions = { ...defaultOptions, ...options };
			noUiSlider.create(rangeContainer, mergedOptions);
			$(`<div class='slider-non-linear-step-value'></div>`).insertAfter('.range');

			_createSliderInputElement(rangeContainerSelector, rangeContainer);
		};

		const _createSliderInputElement = (sliderElement, rangeContainer) => {
			let inputFromId = $(sliderElement).data('input-from-id') || inputFromElementId;
			let inputToId = $(sliderElement).data('input-to-id') || inputToElementId;

			$(sliderElement).prepend(`<input type='hidden' name='${inputFromId}' id='${inputFromId}' value=''>`);
			$(sliderElement).prepend(`<input type='hidden' name='${inputToId}' id='${inputToId}' value=''>`);

			rangeContainer.noUiSlider.on('update', (values) => {
				$('.slider-non-linear-step-value').html(`<span class="text-muted">Range:</span> P${convertCurrency(values[0])} - P${convertCurrency(values[1])}`);
				$('#' + inputFromId + '').val(values[0]);
				$('#' + inputToId + '').val(values[1]);
			});
		};

		const _initSLider = () => {
			const rangeContainerSelector = '.slider-display';
			const rangeContainer = document.querySelector(rangeContainerSelector);
			if (rangeContainer === null || rangeContainer === undefined) {
				return;
			}

			const min = $(rangeContainerSelector).data('min') || minValue;
			const max = $(rangeContainerSelector).data('max') || maxValue;;
			const step = $(rangeContainerSelector).data('min') || stepValue;;

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
			$(document).on('click', '.btn-add-video', function () {
				const input = $('#youtubeUrl');
				const btnSpinner = $('.btn-add-video .spinner-border');
				const btnText = $('.btn-add-video .btn-text');
				const video = getYoutubeVideoData(input.val());

				const _resetForm = () => {
					btnSpinner.addClass("d-none");
					btnText.removeClass("d-none");
					input.prop("disabled", false);
				};

				const _invalidResponse = (error) => {
					input.addClass('is-invalid');
					_resetForm();
					alert.error(error);
					return false;;
				}

				btnSpinner.removeClass("d-none");
				btnText.addClass("d-none");
				input.prop("disabled", true);

				if (input.val() === "") {
					return _invalidResponse("Youtube Url is required!");
				} else if (video.id === undefined) {
					return _invalidResponse(video.message);
				} else if ($(`.${video.id}`)[0]) {
					return _invalidResponse("Video already added!");
				} else {
					const videoContainer = $("<div>", {
						class: video.id,
						"data-id": video.id
					}).append(
						// Hidden input elements
						$("<input>", { type: "hidden", name: `videos[${video.id}][id]`, value: video.id }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][thumbnail][default]`, value: video.thumbnail.default }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][thumbnail][hq]`, value: video.thumbnail.hq }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][thumbnail][mq]`, value: video.thumbnail.mq }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][thumbnail][sd]`, value: video.thumbnail.sd }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][thumbnail][maxres]`, value: video.thumbnail.maxres }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][url]`, value: video.url }),
						$("<input>", { type: "hidden", name: `videos[${video.id}][embed]`, value: video.embed }),

						// Delete button container
						$("<div>", { class: "btn-delete-container w-100 text-end p-1" }).append(
							$("<span>", {
								class: "btn btn-danger btn-remove-video",
								"data-id": video.id
							}).append($("<i>", { class: "ti ti-trash" }))
						),

						// Video thumbnail with playback
						$("<div>", {
							class: "avatar avatar-xxxl p-2 btn-playback cursor-pointer text-white",
							"data-id": video.id,
							"data-url": video.url,
							"data-embed": video.embed,
							style: `background-image: url(${video.thumbnail.sd}); height:120px !important;`
						}).append($("<i>", { class: "ti ti-brand-youtube fs-32" }))
					);

					// Prepend the video container to the video list container
					$(".video-list-container").prepend(videoContainer);

					// Apply CSS to the delete button container
					$(`.${video.id} .btn-delete-container`).css({
						position: "relative",
						top: "40px",
						right: 0,
						width: "3rem",
						height: "2.5rem",
						"z-index": 1
					});

					input.val("");
					input.removeClass('is-invalid');
					_resetForm();
				}
			});
		};

		const _handleVideoPlayback = () => {
			$(document).on('click', '.btn-playback', function () {
				const embed = $(this).data('embed');
				const url = $(this).data('url');
				const id = $(this).data('id');
				let html = ``;
				modal.create({
					id: id,
					size: 'fullscreen',
					callback: function () {
						html += `<div class='row justify-content-center'>`;
						html += `<div class='col-xl-8 col-lg-8 col-md-8 col-sm-12 col-12'>`;
						html += `<h4 class='fw-normal'>${url}</h4>`;
						/* html += `<div id='player-youtube' data-plyr-provider='youtube' data-plyr-embed-id='${id}'></div>`; */
						html += `<iframe class='w-100' height='560' src='${embed}' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>`;
						html += `</div>`;
						html += `</div>`;
						return html;
					},
					status: "info",
					destroyable: true
				});
				/* window.Plyr && (new Plyr('#player-youtube')); */
				$(`#${id}`).modal('show');
			});
		};

		const _handleVideoDeletion = () => {
			$(document).on('click', '.btn-remove-video', function () {
				const $this = $(this);
				const id = $this.data('id');
				$(`.${id}`).remove();
			});
		};

		const _createVideoformId = () => {
			$('.btn-delete-container').css({
				position: "relative",
				top: "40px",
				right: 0,
				width: "3rem",
				height: "2.5rem",
				"z-index": 1
			});

			// Append HTML structure to #videoInput
			$('#videoInput').append(
				$("<div>", { class: "d-flex gap-1" }).append(
					$("<div>", { class: "form-floating flex-fill" }).append(
						$("<input>", {
							type: "text",
							id: "youtubeUrl",
							class: "form-control",
							placeholder: "",
							"aria-label": "Youtube Url",
							"aria-describedby": "basic-addon1"
						}),
						$("<label>", { for: "youtubeUrl" }).append(
							$("<i>", { class: "ti ti-brand-youtube" }),
							" Paste Youtube Url"
						)
					),
					$("<span>", { class: "btn btn-primary btn-add-video" }).append(
						$("<span>", {
							class: "spinner-border spinner-border-sm d-none",
							role: "status",
							"aria-hidden": "true"
						}),
						$("<span>", { class: "btn-text fs-18" }).append(
							$("<i>", { class: "ti ti-plus me-1" }),
							" Add Video"
						)
					)
				)
			);
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
			window.TomSelect && (new TomSelect(`${containerId}`, {
				copyClassesToDropdown: false,
				dropdownParent: 'body',
				controlInput: '<input>',
				render: {
					item: function (data, escape) {
						if (data.customProperties) {
							return `<div><span class='dropdown-item-indicator'>${data.customProperties}</span>${escape(data.text)}</div>`;
						}
						return `<div>${escape(data.text)}</div>`;
					},
					option: function (data, escape) {
						if (data.customProperties) {
							return `<div><span class='dropdown-item-indicator'>${data.customProperties}</span>${escape(data.text)}</div>`;
						}
						return `<div>${escape(data.text)}</div>`;
					},
				},
			}));
		};

		return {
			init
		};
	}();

	const alert = function () {

		const _display = (message, element) => {
			const messageContainer = $(element);

			if (!messageContainer[0]) {
				$(`<div>`, {
					class: 'response'
				}).prependTo('body');
			}

			$(`${element}`).html(message);
		};

		const success = (message, element = '.response') => {
			const html = $("<div>", {
				class: "message alert alert-success alert-dismissible show",
				role: "alert"
			}).append(
				$("<span>", { text: message }),
				$("<button>", {
					type: "button",
					class: "btn-close",
					"data-bs-dismiss": "alert",
					"aria-label": "Close"
				})
			);
			_display(html, element);
		};

		const error = (message, element = '.response') => {
			const html = $("<div>", {
				class: "message alert alert-danger alert-dismissible show",
				role: "alert"
			}).append(
				$("<span>", { text: message }),
				$("<button>", {
					type: "button",
					class: "btn-close",
					"data-bs-dismiss": "alert",
					"aria-label": "Close"
				})
			);
			_display(html, element);
		};

		const loader = (message = "Processing, Please wait...", element = '.response') => {
			const html = $("<div>", {
				class: "bg-white p-3 mt-3 rounded border"
			}).append(
				$("<div>", {
					class: "d-flex gap-3 align-items-center"
				}).append(
					$("<div>", { class: "loader" }),
					$("<p>", { class: "mb-0", text: message })
				)
			);
			_display(html, element);
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
			$(`${element}`).css({
				cursor: 'wait',
				pointerEvents: 'none',
				opacity: 0.5
			}).prop('disabled', true);
		};

		/**
		 * Enable all buttons on the page, visually and interactively
		 */
		const enable = (element = ".btn") => {
			$(`${element}`).css({
				cursor: 'pointer',
				pointerEvents: 'auto',
				opacity: 1
			}).prop('disabled', false);
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
	function submitForm(formId, { validation, callback, onBeforeSend, redirectUrl } = {}) {

		$(document).on('submit', `${formId}`, function (event) {
			event.preventDefault();
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

		const form = $(formId);
		const formData = form.serializeArray();

		formData.push({ name: 'csrf_token', value: _CSRFToken });

		if (onBeforeSend) {
			onBeforeSend(formData);
		}

		return post(form.attr('action'), formData, {
			beforeSend: () => {
				alert.loader();
				$('html, body').animate({ scrollTop: 0 }, 'slow');

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
	}

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
		const fromElement = $(fromElementId);
		const toElement = $(toElementId);

		if (fromElement === null || toElement === null) {
			return;
		}

		toElement.html(fromElement.html());
		fromElement.html('');
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

			let html = $("<div>", {
				class: `modal ${destroyableClass}`,
				id: id,
				"aria-labelledby": "modal",
				"aria-hidden": "true"
			}).append(
				$("<div>", {
					class: `modal-dialog modal-${size}`
				}).append(
					$("<div>", {
						class: "modal-content"
					}).append(
						status ? $("<div>", {
							class: `modal-status bg-${status}`
						}) : "",
						$("<div>", {
							class: "modal-body"
						}).append(
							$("<span>", {
								class: "btn-close",
								"data-bs-dismiss": "modal",
								"aria-label": "Close"
							}),
							$("<div>", {
								class: "response-modal"
							}).append(
								callback !== undefined ? callback() : ""
							)
						)
					)
				)
			);

			$("body").append(html);

			new bootstrap.Modal(document.getElementById(id), {
				keyboard: false
			}).show(document.getElementById(id))
		};

		const _handleModalClose = () => {
			$(document).on('click', '.btn-close', function () {
				$(this).closest('.modal').modal('hide');
			});
		}

		/**
		 * Destroys a modal element after it has been closed if it has the "modal-destroyable" class.
		 * This is a private function and should not be used directly.
		 */
		const _destroyModalOnClose = () => {
			$(document).on('hidden.bs.modal', '.modal', function (event) {
				const modal = $(`#${event.target.id}`);
				if (modal.hasClass("modal-destroyable")) {
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
			const container = $(uploadContainerSelector);
			if (!container[0]) {
				$('body').prepend(`<div class='upload-container'></div>`);
				containerSelector = '.upload-container';
			}

			let html = `<span class='btn btn-dark btn-browse'><i class='ti ti-upload me-2'></i> Upload</span>`;
			container.html(html);
		};

		const _createUploadForm = (url, inputId, accept, multiple, containerSelector) => {
			let html = $("<div>", {
				class: containerSelector.replace(".", "")
			}).append(
				$("<form>", {
					id: 'uploadForm',
					class: 'd-none',
					action: url,
					method: 'POST',
					enctype: 'multipart/form-data'
				}).append(
					$("<center>").append(
						multiple ? $("<input>", {
							type: 'file',
							name: `${inputId}[]`,
							id: inputId,
							multiple: 'multiple',
							accept: accept
						}) : $("<input>", {
							type: 'file',
							name: inputId,
							id: inputId,
							accept: accept,
							value: ''
						})
					)
				)
			);

			$("body").prepend(html);
		};

		/**
		 * Generates HTML elements for displaying and manipulating image uploads.
		 *
		 * @param {Object} image - An objects containing image upload information.
		 * @param {string} [uploader="properties"] - The uploader from which the images are being uploaded.
		 * @param {Object} [settings] - Additional settings for the image elements.
		 * @return {string} - The HTML elements as a string.
		 */
		const _setMultipleImageUploadContainer = (image, uploadedContainerSelector = '.images-container') => {
			let html = $("<div>", {
				class: `${image.id} image_${image.id} me-2 mb-3 flex-grow-1`
			});

			// Create hidden inputs
			html.append(
				$("<input>", {
					type: 'hidden',
					name: `upload[${image.id}][image_id]`,
					value: image.id
				}),
				$("<input>", {
					type: 'hidden',
					name: `upload[${image.id}][height]`,
					value: image.height
				}),
				$("<input>", {
					type: 'hidden',
					name: `upload[${image.id}][width]`,
					value: image.width
				}),
				$("<input>", {
					type: 'hidden',
					name: `upload[${image.id}][filename]`,
					value: image.filename
				}),
				$("<input>", {
					type: 'hidden',
					name: `upload[${image.id}][url]`,
					value: image.final_url
				})
			);

			// Create image element
			html.append(
				$("<div>").append(
					$("<span>", {
						class: 'avatar avatar-xxxl',
						style: `background-image:url('${image.temp_url}');`
					})
				)
			);

			// Create button group
			html.append(
				$("<div>", {
					class: 'btn-list mt-2 text-center'
				}).append(
					$("<span>", {
						class: 'btn btn-md btn-outline-secondary btn-remove-image',
						title: 'Remove image',
						"data-container": `.${image.id}`,
						"data-filename": image.filename,
						"data-url": `${DOMAIN}/properties/images/${image.id}/delete`
					}).append(
						$("<i>", { class: 'ti ti-trash' })
					),
					$("<span>", {
						class: 'btn btn-md btn-outline-primary btn-set-thumbnail',
						title: 'Set image as thumbnail',
						"data-container": `.${image.id}`,
						"data-final-url": image.final_url
					}).append(
						$("<i>", { class: 'ti ti-click me-2' }),
						" Thumbnail"
					)
				)
			);

			// Handle error state
			if (image.status == 2) {
				html = $("<div>", {
					class: 'alert alert-danger alert-dismissible'
				}).append(
					$("<i>", {
						class: 'ti ti-alert-triangle me-2',
						"aria-hidden": 'true'
					}),
					$("<span>", {
						class: 'p-0 m-0',
						text: image.message
					}),
					$("<button>", {
						type: 'button',
						class: 'btn-close',
						"data-bs-dismiss": 'alert'
					})
				);
			}

			$(`${uploadedContainerSelector}`).prepend(html);
		}

		function _setSingleUploadContainer(image, uploadedContainerSelector = '.photo-preview') {
			if (image.status == 1) {
				const previewElement = $(uploadedContainerSelector);

				previewElement.css("background-image", "url(" + image.temp_url + ")");
				alert.message("");

				$('#photo').val(image.final_url);
			} else {
				alert.message(image.message);
			}

			$(`${uploadedContainerSelector} .btn-browse`).show();
		}

		const _setMultipleFileUploadContainer = (file, uploadedContainerSelector = '.files-container') => {
			let html = "";

			// Create the file element
			const fileElement = $("<div>", { class: 'flex-grow-1' }).append(
				$("<input>", {
					type: 'hidden',
					name: `documents[${file.id}][id]`,
					value: file.id
				}),
				$("<input>", {
					type: 'hidden',
					name: `documents[${file.id}][filename]`,
					value: file.filename
				}),
				$("<input>", {
					type: 'hidden',
					name: `documents[${file.id}][size]`,
					value: file.size
				}),
				$("<input>", {
					type: 'hidden',
					name: `documents[${file.id}][finalUrl]`,
					value: file.final_url
				}),
				$("<div>", { class: 'd-flex p-y align-items-center' }).append(
					$("<span>", { class: 'avatar me-2' }).append(
						$("<i>", { class: 'ti ti-pdf fs-18' })
					),
					$("<div>", { class: 'flex-fill' }).append(
						$("<div>", { class: 'font-weight-medium' }).append(
							$("<input>", {
								type: 'text',
								name: `documents[${file.id}][alias]`,
								value: file.alias,
								class: 'border-0 w-100'
							})
						),
						$("<div>", { class: 'text-secondary small', text: file.size })
					)
				)
			);

			// Create the button
			const button = $("<div>", { class: 'btn-list' }).append(
				$("<span>", {
					class: 'btn-remove-document cursor-pointer p-2',
					"data-id": file.id,
					"data-filename": file.filename
				}).append(
					$("<i>", { class: 'ti ti-trash me-1' }),
					" Remove"
				)
			);

			// Handle error or append the content
			if (file.status == 2) {
				html = $("<div>", {
					class: 'alert alert-danger alert-dismissible',
					id: file.id
				}).append(
					$("<i>", { class: 'ti ti-alert-triangle me-2', "aria-hidden": 'true' }),
					$("<span>", { class: 'p-0 m-0', text: file.message }),
					$("<button>", {
						type: 'button',
						class: 'btn-close',
						"data-bs-dismiss": 'alert'
					})
				).prop('outerHTML'); // Convert the jQuery object to HTML string
			} else {
				html = $("<li>", {
					class: `list-group-item d-flex gap-3 justify-content-between align-items-center py-3 file_${file.id}`
				}).append(
					fileElement,
					button
				).prop('outerHTML'); // Convert the jQuery object to HTML string
			}

			// Prepend the generated HTML
			$(`${uploadedContainerSelector}`).prepend(html);
		}

		const _initFileUploaderEvents = () => {
			$(document).on('click', '.btn-remove-document', function () {
				const btn = $(this);
				const id = btn.data('id');
				const filename = btn.data('filename');

				get(`${DOMAIN}/properties/removeDocument/${filename}`, {
					onSuccess: function (response) {
						if (response.status == 2) {
							alert.error(response.message);
						}
						$(`.file_${id}`).remove();
					}
				});
			});	
		};

		const _initImageUploaderEvents = () => {
			$(document).on('click', '.btn-set-thumbnail', function () {
				const btn = $(this);
				const finalUrl = btn.data('final-url');
				$(`.btn-set-thumbnail`).removeClass('btn-success').addClass('btn-outline-primary').html("<i class='ti ti-click me-2'></i> Thumbnail");
				btn.addClass('btn-success').removeClass('btn-outline-primary').html("<i class='ti ti-check me-2'></i> Thumbnail");
				$('#thumb_img').val(finalUrl);
			});

			$(document).on('click', '.btn-remove-image', function () {
				const btn = $(this);
				const container = btn.data('container');
				const filename = btn.data('filename');
				const url = btn.data('url');

				post(url, {
					csrf_token: _CSRFToken,
					filename: filename
				}, {
					onSuccess: function (response) {
						if (response.status == 1) {
							$(`${container}`).remove();
						}
						alert.message(response.message);
					}
				});
			});	
		};

		const _initUploaderEvents = (containerSelector, input, success, error) => {

			$(document).on('click', `${containerSelector} .btn-browse`, function () {
				$(`${containerSelector} #${input}`).click();
			});

			$(document).on('change', `${containerSelector} #${input}`, function () {
				const form = document.querySelector(`${containerSelector} #uploadForm`);
				const formData = new FormData(form);

				const url = $(`${containerSelector} #uploadForm`).attr('action')
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

				$(`${containerSelector} #${input}`).val('');
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
			if (resultContainer === null || resultContainer === undefined) { return; }

			const result = _getAmortization();
			$('.mortgage-calculator-form #result').attr("monthlyPayment", result.monthlyPayment);
			$('.mortgage-calculator-form #result').html("&#8369;" + result.formattedMonthlyPayment);
		};

		const _calculateMortgageOnChange = () => {
			$(document).on(
				'change',
				'.mortgage-calculator-form #mortgageDownpayment, .mortgage-calculator-form #mortgageInterest, .mortgage-calculator-form #mortgageYear',
				function () {
					_calculateMortgage();
			});
		};

		const _createDownPaymentSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #dpSelection');
			if (container === null || container === undefined) { return; }

			const downPaymentOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
			const downPaymentSelectionHtml = downPaymentOptions
				.map((option) => `<option value="${option}" ${option === 20 ? "selected" : ""}>${option}%</option>`)
				.join("");
			
			$(".mortgage-calculator-form #dpSelection").after(
				$("<select>", {
					id: "mortgageDownpayment",
					class: "form-select"
				}).append(downPaymentSelectionHtml)
			);

			$(".mortgage-calculator-form #dpSelection").remove();
		};


		const _createInterestSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #interestSelection');
			if (container === null || container === undefined) { return; }

			let interestSelectionHtml = "";
			let isSelected = "";
			for (let rate = 0; rate <= 20; rate += 0.25) {
				isSelected = rate === 3.75 ? "selected" : "";
				interestSelectionHtml += `<option value="${rate}" ${isSelected}>${rate}%</option>`;
			}

			$(".mortgage-calculator-form #interestSelection").after(
				$("<select>", {
					id: "mortgageInterest",
					class: "form-select"
				}).append(interestSelectionHtml)
			);

			$(".mortgage-calculator-form #interestSelection").remove();
		};

		const _createYearsSelection = () => {
			const container = document.querySelector('.mortgage-calculator-form #yearSelection');
			if (container === null || container === undefined) { return; }

			const yearsOptions = Array.from({ length: 30 }, (_, i) => i + 1);
			const yearsSelectionHtml = yearsOptions
				.map((year) => `<option value="${year}" ${year === 3 ? "selected" : ""}>${year} Years</option>`)
				.join("");

			$(".mortgage-calculator-form #yearSelection").after(
				$("<select>", {
					id: "mortgageYear",
					class: "form-select"
				}).append(yearsSelectionHtml)
			);

			$(".mortgage-calculator-form #yearSelection").remove();
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
			const container = document.querySelector('#sellingPrice');
			if (container === null || container === undefined) { return; }

			const sellingPrice = parseInt($('#sellingPrice').val(), 10);
			const downPaymentPercent = parseInt($('#mortgageDownpayment option:selected').val(), 10);
			const downPayment = sellingPrice * (downPaymentPercent / 100);

			const loanAmount = sellingPrice - downPayment;
			const interestRate = parseFloat($('#mortgageInterest option:selected').val());
			const years = parseInt($('#mortgageYear option:selected').val(), 10) + 1;
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

			$(window).resize(function () {
				if (this.resizeTO) clearTimeout(this.resizeTO);
				this.resizeTO = setTimeout(function () {
					$(this).trigger('resizeEnd');
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

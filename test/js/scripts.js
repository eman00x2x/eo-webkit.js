
'use strict';

const epochToTime = () => {
    const id = document.getElementById('epoch');
	let result = eo.epochToTimeString(id.value);
	document.querySelector('.epochResult').innerHTML = result;

	id.addEventListener('input', function(e) {
		result = eo.epochToTimeString(e.target.value);
		document.querySelector('.epochResult').innerHTML = result;
	});
};

const trimLongText = () => {
	const longText = document.querySelector('.trimLongText').textContent;
	const id = document.getElementById('trim');
	let result = eo.trim(longText, id.value);
	document.querySelector('.trimResult').innerHTML = result;

	id.addEventListener('input', function(e) {
		result = eo.trim(longText, e.target.value);
		document.querySelector('.trimResult').innerHTML = result;
	});
};

const formatFileSize = () => {
	const id = document.getElementById('formatFileSize');
	let result = eo.formatFileSize(id.value);
	document.querySelector('.formatFileSizeResult').innerHTML = result;

	id.addEventListener('input', function(e) {
		result = eo.formatFileSize(e.target.value);
		document.querySelector('.formatFileSizeResult').innerHTML = result;
	});
};

const uuidv4 = () => {
	const btn = document.querySelector('.btn-generateUUID');
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		const result = eo.uuidv4();
		document.querySelector('.uuidv4Result').innerHTML = result;
	});

	const result = eo.uuidv4();
	document.querySelector('.uuidv4Result').innerHTML = result;
};

const getRandomChar = () => {
	const id = document.getElementById('getRandomCharLength');
	let result = eo.getRandomChar(id.value);
	document.querySelector('.getRandomCharResult').innerHTML = result;

	id.addEventListener('input', function(e) {
		result = eo.getRandomChar(e.target.value);
		document.querySelector('.getRandomCharResult').innerHTML = result;
	});
};

const getRandomNum = () => {
	const startNum = document.getElementById('getRandomNumStart');
	const endNum = document.getElementById('getRandomNumEnd');
	let result = eo.getRandomNum(parseInt(startNum.value), parseInt(endNum.value));
	document.querySelector('.getRandomNumResult').innerHTML = result;

	const btn = document.querySelector('.btn-getRandomNum');
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		let result = eo.getRandomNum(parseInt(startNum.value), parseInt(endNum.value));
		document.querySelector('.getRandomNumResult').innerHTML = result;
	});
};

const convertCurrency = () => {
	const amount = document.getElementById('amount');
	let result = eo.convertCurrency(amount.value);
	document.querySelector('.convertCurrencyResult').innerHTML = result;

	amount.addEventListener('input', function(e) {
		result = eo.convertCurrency(e.target.value);
		document.querySelector('.convertCurrencyResult').innerHTML = result;
	});
};

const getYoutubeVideoData = () => {
	const id = document.getElementById('youtubeUrl');
	let result = eo.getYoutubeVideoData(id.value);

	let text = iterateObject(result);
	document.querySelector('.youtubeVideoDataResult').innerHTML = text;

	id.addEventListener('input', function(e) {
		result = eo.getYoutubeVideoData(e.target.value);
		let text = iterateObject(result);
		document.querySelector('.youtubeVideoDataResult').innerHTML = text;
	});
};

const serializeFormDataResult = () => {
    const btn = document.querySelector('.btn-serializeFormData');
	btn.addEventListener('click', function(e) {
		e.preventDefault();

		const form = document.getElementById('serializeFormDataForm');
		const formData = new FormData(form);
		const result = eo.serializeFormData(formData);

		let text = iterateObject(result);
		document.querySelector('.serializeFormDataFormResult').innerHTML = text;
	});
};


function iterateObject(obj, indent = 2) {
	let result = '';

	function recurse(currObj, level) {
		const indentSpace = ' '.repeat(level * indent);
		if (typeof currObj === 'object' && currObj !== null) {
			if (Array.isArray(currObj)) {
				result += `${indentSpace}[\n`;
				currObj.forEach(item => recurse(item, level + 1));
				result += `${indentSpace}]\n`;
			} else {
				result += `${indentSpace}{\n`;
				for (let key in currObj) {
					if (currObj.hasOwnProperty(key)) {
						result += `${indentSpace}  "${key}": `;
						recurse(currObj[key], level + 1);
					}
				}
				result += `${indentSpace}}\n`;
			}
		} else {
			if (typeof currObj === 'string') {
				result += `"${currObj}"\n`;
			} else {
				result += `${currObj}\n`;
			}
		}
	}
	recurse(obj, 0);
	return result;
}

const testCase = () => {

	// Sample test cases for eo.validator
	const testCases = [
		{
			description: "✅ Valid Data - Should return an empty array",
			data: {
				name: "John Doe",
				email: "johndoe@example.com",
				age: 25,
				website: "https://example.com",
				address: {
					street: "123 Main St",
					city: "New York",
					zipcode: "10001"
				},
				created_at: "2025-02-15",
			},
			constraints: {
				name: { presence: true },
				email: { presence: true, email: true },
				age: { presence: true, number: { min: 18, max: 60 } },
				website: { url: true },
				"address.street": { presence: true },
				"address.city": { presence: true },
				"address.zipcode": { presence: true, length: { min: 5, max: 5 } },
				created_at: { date: true }
			},
			expected: []
		},
		{
			description: "❌ Invalid Email, Missing Name - Should return errors",
			data: {
				email: "invalid-email",
				age: 17,
				address: {
					street: "",
					city: "Los Angeles",
					zipcode: "1234"
				},
				created_at: "invalid-date"
			},
			constraints: {
				name: { presence: true },
				email: { presence: true, email: true },
				age: { presence: true, number: { min: 18, max: 60 } },
				website: { url: true },
				"address.street": { presence: true },
				"address.city": { presence: true },
				"address.zipcode": { presence: true, length: { min: 5, max: 5 } },
				created_at: { date: true }
			},
			expected: [
				"Name is required.",
				"Email is not a valid email address.",
				"Age must be at least 18.",
				"Address Street is required.",
				"Address Zipcode must be at least 5 characters long.",
				"Created At must be a valid date."
			]
		}
	];

	// Run tests
	testCases.forEach(({ description, data, constraints, expected }) => {
		const errors = eo.validator.validate(data, constraints);
		console.log(description);
		console.log(!errors ? eo.validator.getErrors() : "✅ Passed!");
		console.log("--------------------");
	});
	
};

window.addEventListener('load', function () {
	testCase();
	epochToTime();
	uuidv4();
	getRandomChar();
	getRandomNum();
	convertCurrency();
	formatFileSize();
	trimLongText();
	serializeFormDataResult();
	getYoutubeVideoData();
});

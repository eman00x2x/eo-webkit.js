// eo.test.js
const eo = require('../eo'); // Adjust path as needed

describe('eo.trim', () => {
  it('should remove leading and trailing whitespace', () => {
    expect(eo.trim('hello world', 5)).toBe('he...');
    expect(eo.trim('hello world', 6)).toBe('hel...');
    expect(eo.trim('hello world', 12)).toBe('hello world');
  });
});

describe('eo.formatFileSize', () => {
  it('should format file sizes correctly', () => {
    expect(eo.formatFileSize(1024)).toBe('1KB');
    expect(eo.formatFileSize(1048576)).toBe('1MB');
    expect(eo.formatFileSize(1073741824)).toBe('1GB');
  });
});

describe('eo.uuidv4', () => {
  it('should generate a valid UUIDv4', () => {
	expect(eo.uuidv4()).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  });
});

describe('eo.epochToTimeString', () => {
  it('should convert epoch to a human-readable time string', () => {
	expect(eo.epochToTimeString(1234567890)).toBe('Saturday, February 14, 2009 at 07:31 AM');
  });
});

describe('eo.arrayToDotNotation', () => {
  it('should convert object to dot notation', () => {
	  expect(eo.arrayToDotNotation({
		  a: {
			  b: {
				  c: 1
			  }
		  }
	  })).toEqual({ 'a.b.c': 1 });
  });
});

describe('eo.dotNotationToArray', () => {
  it('should convert dot notation to array', () => {
	expect(eo.dotNotationToArray({ 'a.b.c': 1 })).toEqual({
		  a: {
			  b: {
				  c: 1
			  }
		  }
	  });
  });
});

describe('eo.diffDays', () => {
  it('should calculate the number of days between two dates', () => {
	expect(eo.diffDays(new Date('2021-01-01'), new Date('2021-01-10'))).toBe(9);
  });
});

describe('eo.readableDate', () => {
  it('should format a timestamp into a human-readable date', () => {
	expect(eo.readableDate(1610000000)).toBe('Jan 7, 2021');
  });
});

describe('eo.formatCurrency', () => {
  it('should format a number into a human-readable currency notation', () => {
	expect(eo.formatCurrency(1234)).toBe('1.23K');
  });
});

describe('eo.getRandomChar', () => {
  it('should generate a random character', () => {
	expect(eo.getRandomChar(6)).toMatch(/[A-Za-z0-9]/);
  });
});

describe(eo.removeDuplicatesArray, () => {
  it('should remove duplicate elements from an array', () => {
	expect(eo.removeDuplicatesArray([1, 2, 3, 1, 2, 3])).toEqual([1, 2, 3]);
  });
});

describe(eo.removeFalseArray, () => {
  it('should remove falsey elements from an array', () => {
	  expect(eo.removeFalseArray([1, 2, false, null, undefined, 0])).toEqual([1, 2, 0]);
  });
});

describe(eo.getRandomNum, () => {
  it('should generate a random number between start and end', () => {
	  expect(eo.getRandomNum(1, 10)).toBeGreaterThanOrEqual(1);
	  expect(eo.getRandomNum(1, 10)).toBeLessThanOrEqual(10);
  });
});

describe(eo.serializeFormData, () => {
  it('should serialize a FormData object', () => {
	const formData = new FormData();
	formData.append('name', 'John Doe');
	formData.append('age', '30');	
	  expect(eo.serializeFormData(formData)).toEqual({
		name: 'John Doe',
		age: '30'
	  });
  });
});

describe(eo.getYoutubeVideoData, () => {
	it('should return a valid YouTube video object', () => {
		const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
		const videoData = eo.getYoutubeVideoData(url);
		expect(videoData).toEqual({
			id: 'dQw4w9WgXcQ',
			thumbnail: {
				default: 'http://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg',
				hq: 'http://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
				mq: 'http://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
				sd: 'http://img.youtube.com/vi/dQw4w9WgXcQ/sddefault.jpg',
				maxres: 'http://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
			},
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
		});
	});
});

describe(eo.createElements, () => {
	it('should create an HTML element with a specified tag name, attributes, and children.', () => {
		const result = eo.createElements('div', { class: 'test-class' }, ['Hello, world!']);
		expect(result).toEqual(expect.any(HTMLElement));
		expect(result.tagName).toBe('DIV');
		expect(result.classList.contains('test-class')).toBe(true);
		expect(result.textContent).toBe('Hello, world!');
	});
});

describe(eo.createHiddenInput, () => {
	it('should create a hidden input element with the specified name and value', () => {
		const input = eo.createHiddenInput('testName', 'testValue');
		expect(input).toHaveProperty('name', 'testName');
		expect(input).toHaveProperty('value', 'testValue');
		expect(input).toHaveProperty('type', 'hidden');
		expect(input).toHaveProperty('tagName', 'INPUT');
	});
});

describe(eo.moveHtmlElement, () => {
	it('should move the innerHTML of the element matching fromSelector to the element matching toSelector', () => {
		const fromSelector = '.from';
		const toSelector = '.to';

		const fromElement = document.createElement('div');
		fromElement.className = 'from';
		fromElement.innerHTML = '<p>From</p>';
		document.body.appendChild(fromElement);

		const toElement = document.createElement('div');
		toElement.className = 'to';
		document.body.appendChild(toElement);
		
		eo.moveHtmlElement(fromSelector, toSelector);
		
		expect(toElement.innerHTML).toBe('<p>From</p>');
		expect(fromElement.innerHTML).toBe('');

	});
});

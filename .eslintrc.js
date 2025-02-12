module.exports = {
	"env": {
		"browser": true,  // For browser globals like window, document
		"es2021": true,   // Or the appropriate ES version
		"amd": true,      // If you're using AMD modules (define)
		"node": true       // If you're using Node.js modules (module, exports, require)
	},
	"extends": [
		"eslint:recommended", // Or any other extends you want (e.g., 'airbnb-base')
		"plugin:prettier/recommended"
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module" // If you're using ES modules (import/export)
	},
	"rules": {
		"indent": ["error", 2],       // Enforce 2-space indentation
		"quotes": ["error", "single"],// Enforce single quotes
		"semi": ["error", "always"]  // Enforce semicolons
	}
};
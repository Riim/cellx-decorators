(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cellx"));
	else if(typeof define === 'function' && define.amd)
		define(["cellx"], factory);
	else if(typeof exports === 'object')
		exports["cellx-decorators"] = factory(require("cellx"));
	else
		root["cellx-decorators"] = factory(root["cellx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var cellx = __webpack_require__(1);

	function observable(target, name, desc, opts) {
		if (arguments.length == 1) {
			opts = target;

			return function(target, name, desc) {
				return observable(target, name, desc, opts);
			};
		}

		if (!opts) {
			opts = {};
		}

		var value = desc.initializer();

		if (typeof value == 'function') {
			throw new TypeError('Property value cannot be a function');
		}

		var privateName = '_' + name;

		target[privateName] = cellx(value, opts);

		return {
			configurable: true,
			enumerable: desc.enumerable,

			get: function() {
				return this[privateName]();
			},
			set: function(value) {
				this[privateName](value);
			}
		};
	}

	function computed(target, name, desc, opts) {
		if (arguments.length == 1) {
			opts = target;

			return function(target, name, desc) {
				return computed(target, name, desc, opts);
			};
		}

		var value = desc.initializer();

		if (typeof value != 'function') {
			throw new TypeError('Property value must be a function');
		}

		if (!opts) {
			opts = {};
		}

		var privateName = '_' + name;

		target[privateName] = cellx(value, opts);

		var descriptor = {
			configurable: true,
			enumerable: desc.enumerable,

			get: function() {
				return this[privateName]();
			}
		};

		if (opts.put) {
			descriptor.set = function(value) {
				this[privateName](value);
			};
		}

		return descriptor;
	}

	exports.observable = observable;
	exports.computed = computed;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }
/******/ ])
});
;
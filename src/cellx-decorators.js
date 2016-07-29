var cellx = require('cellx');

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

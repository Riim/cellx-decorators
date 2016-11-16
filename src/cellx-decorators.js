var cellx = require('cellx');

function optionifyCellDecorator(decorator) {
	return function(target, name, desc, opts) {
		if (arguments.length == 1) {
			opts = target;

			return function(target, name, desc) {
				return decorator(target, name, desc, opts);
			};
		}

		return decorator(target, name, desc, opts);
	};
}

function createCellDescriptor(target, privateName, desc, value, opts) {
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

exports.observable = optionifyCellDecorator(function observable(target, name, desc, opts) {
	var value = desc.initializer();

	if (typeof value == 'function') {
		throw new TypeError('Property value cannot be a function');
	}

	return createCellDescriptor(target, '_' + name, desc, value, opts || {});
});

exports.computed = optionifyCellDecorator(function computed(target, name, desc, opts) {
	var value = desc.initializer();

	if (typeof value != 'function') {
		throw new TypeError('Property value must be a function');
	}

	return createCellDescriptor(target, '_' + name, desc, value, opts || {});
});

exports.cell = optionifyCellDecorator(function cell(target, name, desc, opts) {
	return createCellDescriptor(target, '_' + name, desc, desc.initializer(), opts || {});
});

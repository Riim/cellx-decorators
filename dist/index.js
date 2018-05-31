"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_assign_polyfill_1 = require("@riim/object-assign-polyfill");
var cellx_1 = require("cellx");
function NonEnumerableDecorator(target, propertyName, propertyDesc) {
    if (propertyDesc) {
        propertyDesc.enumerable = false;
        return propertyDesc;
    }
    return {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
    };
}
exports.NonEnumerable = NonEnumerableDecorator;
exports.nonEnumerable = NonEnumerableDecorator;
function EnumerableDecorator(target, propertyName, propertyDesc) {
    if (propertyDesc) {
        propertyDesc.enumerable = true;
        return propertyDesc;
    }
    return {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined
    };
}
exports.Enumerable = EnumerableDecorator;
exports.enumerable = EnumerableDecorator;
function CellDecorator(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return function (target, propertyName, propertyDesc) {
            return CellDecorator(target, propertyName, propertyDesc, targetOrOptions);
        };
    }
    var cellName = propertyName + 'Cell';
    Object.defineProperty(targetOrOptions, cellName, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
    });
    return {
        configurable: true,
        enumerable: propertyDesc ? propertyDesc.enumerable : true,
        get: function () {
            return (this[cellName] ||
                (this[cellName] = new cellx_1.Cell(propertyDesc &&
                    (propertyDesc.get ||
                        (propertyDesc.initializer
                            ? propertyDesc.initializer()
                            : propertyDesc.value)), options
                    ? options.context === undefined
                        ? object_assign_polyfill_1.assign({ context: this }, options)
                        : options
                    : { context: this }))).get();
        },
        set: (propertyDesc && propertyDesc.set) ||
            function (value) {
                if (this[cellName]) {
                    this[cellName].set(value);
                }
                else if (propertyDesc) {
                    (this[cellName] = new cellx_1.Cell(propertyDesc.get ||
                        (propertyDesc.initializer
                            ? propertyDesc.initializer()
                            : propertyDesc.value), options
                        ? options.context === undefined
                            ? object_assign_polyfill_1.assign({ context: this }, options)
                            : options
                        : { context: this })).set(value);
                }
                else {
                    var isFunction = typeof value == 'function';
                    this[cellName] = new cellx_1.Cell(isFunction ? value : undefined, options
                        ? options.context === undefined
                            ? object_assign_polyfill_1.assign({ context: this }, options)
                            : options
                        : { context: this });
                    if (!isFunction) {
                        this[cellName].set(value);
                    }
                }
            }
    };
}
exports.Cell = CellDecorator;
exports.cell = CellDecorator;
function ObservableDecorator(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return function (target, propertyName, propertyDesc) {
            return ObservableDecorator(target, propertyName, propertyDesc, targetOrOptions);
        };
    }
    if (propertyDesc &&
        (propertyDesc.get ||
            (propertyDesc.value !== undefined && typeof propertyDesc.value == 'function'))) {
        throw new TypeError('Invalid descriptor of observable property');
    }
    return CellDecorator(targetOrOptions, propertyName, propertyDesc, options);
}
exports.Observable = ObservableDecorator;
exports.observable = ObservableDecorator;
function ComputedDecorator(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return function (target, propertyName, propertyDesc) {
            return ComputedDecorator(target, propertyName, propertyDesc, targetOrOptions);
        };
    }
    if (propertyDesc &&
        propertyDesc.value !== undefined &&
        typeof propertyDesc.value != 'function') {
        throw new TypeError('Invalid descriptor of computed property');
    }
    propertyDesc = CellDecorator(targetOrOptions, propertyName, propertyDesc, options);
    propertyDesc.enumerable = false;
    return propertyDesc;
}
exports.Computed = ComputedDecorator;
exports.computed = ComputedDecorator;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const object_assign_polyfill_1 = require("@riim/object-assign-polyfill");
const cellx_1 = require("cellx");
function NonEnumerable(_target, _propertyName, propertyDesc) {
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
exports.NonEnumerable = NonEnumerable;
exports.nonEnumerable = NonEnumerable;
function Enumerable(_target, _propertyName, propertyDesc) {
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
exports.Enumerable = Enumerable;
exports.enumerable = Enumerable;
function Cell(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return (target, propertyName, propertyDesc) => Cell(target, propertyName, propertyDesc, targetOrOptions);
    }
    let cellName = propertyName + 'Cell';
    Object.defineProperty(targetOrOptions, cellName, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
    });
    return {
        configurable: true,
        enumerable: propertyDesc ? propertyDesc.enumerable : true,
        get() {
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
                    let isFunction = typeof value == 'function';
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
exports.Cell = Cell;
exports.cell = Cell;
function Observable(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return (target, propertyName, propertyDesc) => Observable(target, propertyName, propertyDesc, targetOrOptions);
    }
    if (propertyDesc &&
        (propertyDesc.get ||
            (propertyDesc.value !== undefined && typeof propertyDesc.value == 'function'))) {
        throw new TypeError('Invalid descriptor of observable property');
    }
    return Cell(targetOrOptions, propertyName, propertyDesc, options);
}
exports.Observable = Observable;
exports.observable = Observable;
function Computed(targetOrOptions, propertyName, propertyDesc, options) {
    if (arguments.length == 1) {
        return (target, propertyName, propertyDesc) => Computed(target, propertyName, propertyDesc, targetOrOptions);
    }
    if (propertyDesc &&
        propertyDesc.value !== undefined &&
        typeof propertyDesc.value != 'function') {
        throw new TypeError('Invalid descriptor of computed property');
    }
    propertyDesc = Cell(targetOrOptions, propertyName, propertyDesc, options);
    propertyDesc.enumerable = false;
    return propertyDesc;
}
exports.Computed = Computed;
exports.computed = Computed;

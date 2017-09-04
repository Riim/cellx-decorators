"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_assign_polyfill_1 = require("@riim/object-assign-polyfill");
var cellx_1 = require("cellx");
function enumerableDecorator(target, name, desc) {
    if (desc) {
        desc.enumerable = true;
        return desc;
    }
    return {
        configurable: true,
        enumerable: true,
        writable: true,
        value: undefined
    };
}
exports.enumerable = enumerableDecorator;
function nonEnumerableDecorator(target, name, desc) {
    if (desc) {
        desc.enumerable = false;
        return desc;
    }
    return {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
    };
}
exports.nonEnumerable = nonEnumerableDecorator;
function CellDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return CellDecorator(target, name, desc, targetOrOptions);
        };
    }
    var cellName = name + 'Cell';
    Object.defineProperty(targetOrOptions, cellName, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: undefined
    });
    return {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get: function () {
            return (this[cellName] || (this[cellName] = new cellx_1.Cell(desc && (desc.get || (desc.initializer ? desc.initializer() : desc.value)), opts ? (opts.context === undefined ? object_assign_polyfill_1.assign({ context: this }, opts) : opts) : { context: this }))).get();
        },
        set: desc && desc.set || function (value) {
            if (this[cellName]) {
                this[cellName].set(value);
            }
            else if (desc) {
                (this[cellName] = new cellx_1.Cell(desc.get || (desc.initializer ? desc.initializer() : desc.value), opts ? (opts.context === undefined ? object_assign_polyfill_1.assign({ context: this }, opts) : opts) : { context: this })).set(value);
            }
            else {
                var isFn = typeof value == 'function';
                this[cellName] = new cellx_1.Cell(isFn ? value : undefined, opts ? (opts.context === undefined ? object_assign_polyfill_1.assign({ context: this }, opts) : opts) : { context: this });
                if (!isFn) {
                    this[cellName].set(value);
                }
            }
        }
    };
}
exports.Cell = CellDecorator;
function observableDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return observableDecorator(target, name, desc, targetOrOptions);
        };
    }
    if (desc && (desc.get || (desc.value !== undefined && typeof desc.value == 'function'))) {
        throw new TypeError('Invalid descriptor of observable property');
    }
    return CellDecorator(targetOrOptions, name, desc, opts);
}
exports.observable = observableDecorator;
function computedDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return computedDecorator(target, name, desc, targetOrOptions);
        };
    }
    if (desc && desc.value !== undefined && typeof desc.value != 'function') {
        throw new TypeError('Invalid descriptor of computed property');
    }
    desc = CellDecorator(targetOrOptions, name, desc, opts);
    desc.enumerable = false;
    return desc;
}
exports.computed = computedDecorator;

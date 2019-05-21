"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cellx_1 = require("cellx");
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
    let constr = targetOrOptions.constructor;
    let debugKey = (constr != Object && constr != Function && constr.name ? constr.name + '#' : '') +
        propertyName;
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
                    ? Object.assign({
                        debugKey,
                        context: options.context !== undefined ? options.context : this
                    }, options)
                    : {
                        debugKey,
                        context: this
                    }))).get();
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
                        ? Object.assign({
                            debugKey,
                            context: options.context !== undefined ? options.context : this
                        }, options)
                        : {
                            debugKey,
                            context: this
                        })).set(value);
                }
                else {
                    let isFunction = typeof value == 'function';
                    this[cellName] = new cellx_1.Cell(isFunction ? value : undefined, options
                        ? Object.assign({
                            debugKey,
                            context: options.context !== undefined ? options.context : this
                        }, options)
                        : {
                            debugKey,
                            context: this
                        });
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

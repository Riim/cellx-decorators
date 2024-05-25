"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computed = exports.Computed = exports.observable = exports.Observable = exports.reactive = exports.Reactive = void 0;
const cellx_1 = require("cellx");
function Reactive(targetOrOptions, propName, propDesc, options) {
    if (arguments.length == 1) {
        return (target, propName, propDesc) => Reactive(target, propName, propDesc, targetOrOptions);
    }
    let ctor = targetOrOptions.constructor;
    let debugKey = (ctor != Object && ctor != Function && ctor.name ? ctor.name + '#' : '') + propName;
    return {
        configurable: true,
        enumerable: propDesc ? propDesc.enumerable : true,
        get() {
            if (!(this[cellx_1.KEY_VALUE_CELLS] ?? (this[cellx_1.KEY_VALUE_CELLS] = new Map())).has(propName)) {
                let propCellValue = this[propName + 'Cell'];
                let valueCell = propCellValue instanceof cellx_1.Cell
                    ? propCellValue
                    : new cellx_1.Cell(propDesc && (propDesc.get || propDesc.value), options
                        ? {
                            debugKey,
                            context: options.context ?? this,
                            ...options
                        }
                        : {
                            debugKey,
                            context: this
                        });
                if (propCellValue === null) {
                    this[propName + 'Cell'] = valueCell;
                }
                this[cellx_1.KEY_VALUE_CELLS].set(propName, valueCell);
            }
            return this[cellx_1.KEY_VALUE_CELLS].get(propName).get();
        },
        set: propDesc?.set ??
            function (value) {
                if ((this[cellx_1.KEY_VALUE_CELLS] ?? (this[cellx_1.KEY_VALUE_CELLS] = new Map())).has(propName)) {
                    this[cellx_1.KEY_VALUE_CELLS].get(propName).set(value);
                }
                else {
                    let propCellValue = this[propName + 'Cell'];
                    let valueCell;
                    if (propCellValue instanceof cellx_1.Cell) {
                        valueCell = propCellValue.set(value);
                    }
                    else {
                        valueCell = new cellx_1.Cell(propDesc ? propDesc.get ?? propDesc.value : value, options
                            ? {
                                debugKey,
                                context: options.context ?? this,
                                ...options
                            }
                            : {
                                debugKey,
                                context: this
                            });
                        if (propDesc?.get) {
                            valueCell.set(value);
                        }
                    }
                    if (propCellValue === null) {
                        this[propName + 'Cell'] = valueCell;
                    }
                    this[cellx_1.KEY_VALUE_CELLS].set(propName, valueCell);
                }
            }
    };
}
exports.Reactive = Reactive;
exports.reactive = Reactive;
function Observable(targetOrOptions, propName, propDesc, options) {
    if (arguments.length == 1) {
        return (target, propName, propDesc) => Observable(target, propName, propDesc, targetOrOptions);
    }
    if (propDesc && (propDesc.get || typeof propDesc.value == 'function')) {
        throw TypeError('Invalid descriptor of observable property');
    }
    return Reactive(targetOrOptions, propName, propDesc, options);
}
exports.Observable = Observable;
exports.observable = Observable;
function Computed(targetOrOptions, propName, propDesc, options) {
    if (arguments.length == 1) {
        return (target, propName, propDesc) => Computed(target, propName, propDesc, targetOrOptions);
    }
    if (propDesc?.value !== undefined) {
        throw TypeError('Invalid descriptor of computed property');
    }
    propDesc = Reactive(targetOrOptions, propName, propDesc, options);
    propDesc.enumerable = false;
    return propDesc;
}
exports.Computed = Computed;
exports.computed = Computed;

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cellx')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cellx'], factory) :
	(global = global || self, factory(global['cellx-decorators'] = {}, global.cellx));
}(this, (function (exports, cellx) { 'use strict';

	function Cell(targetOrOptions, propName, propDesc, options) {
	    if (arguments.length == 1) {
	        return (target, propName, propDesc) => Cell(target, propName, propDesc, targetOrOptions);
	    }
	    let constr = targetOrOptions.constructor;
	    let debugKey = (constr != Object && constr != Function && constr.name ? constr.name + '#' : '') + propName;
	    return {
	        configurable: true,
	        enumerable: propDesc ? propDesc.enumerable : true,
	        get() {
	            if (!(this[cellx.KEY_VALUE_CELLS] ||
	                (this[cellx.KEY_VALUE_CELLS] = new Map())).has(propName)) {
	                this[cellx.KEY_VALUE_CELLS].set(propName, this[propName + 'Cell'] instanceof cellx.Cell
	                    ? this[propName + 'Cell']
	                    : new cellx.Cell(propDesc &&
	                        (propDesc.get ||
	                            (propDesc.initializer
	                                ? propDesc.initializer()
	                                : propDesc.value)), options
	                        ? Object.assign({
	                            debugKey,
	                            context: options.context !== undefined
	                                ? options.context
	                                : this
	                        }, options)
	                        : {
	                            debugKey,
	                            context: this
	                        }));
	            }
	            return this[cellx.KEY_VALUE_CELLS].get(propName).get();
	        },
	        set: (propDesc && propDesc.set) ||
	            function (value) {
	                if ((this[cellx.KEY_VALUE_CELLS] ||
	                    (this[cellx.KEY_VALUE_CELLS] = new Map())).has(propName)) {
	                    this[cellx.KEY_VALUE_CELLS].get(propName).set(value);
	                }
	                else if (propDesc) {
	                    this[cellx.KEY_VALUE_CELLS].set(propName, (this[propName + 'Cell'] instanceof cellx.Cell
	                        ? this[propName + 'Cell']
	                        : new cellx.Cell(propDesc.get ||
	                            (propDesc.initializer
	                                ? propDesc.initializer()
	                                : propDesc.value), options
	                            ? Object.assign({
	                                debugKey,
	                                context: options.context !== undefined
	                                    ? options.context
	                                    : this
	                            }, options)
	                            : {
	                                debugKey,
	                                context: this
	                            })).set(value));
	                }
	                else {
	                    let isFunction = typeof value == 'function';
	                    let valueCell = this[propName + 'Cell'] instanceof cellx.Cell
	                        ? this[propName + 'Cell']
	                        : new cellx.Cell(isFunction ? value : undefined, options
	                            ? Object.assign({
	                                debugKey,
	                                context: options.context !== undefined
	                                    ? options.context
	                                    : this
	                            }, options)
	                            : {
	                                debugKey,
	                                context: this
	                            });
	                    if (!isFunction) {
	                        valueCell.set(value);
	                    }
	                    this[cellx.KEY_VALUE_CELLS].set(propName, valueCell);
	                }
	            }
	    };
	}
	function Observable(targetOrOptions, propName, propDesc, options) {
	    if (arguments.length == 1) {
	        return (target, propName, propDesc) => Observable(target, propName, propDesc, targetOrOptions);
	    }
	    if (propDesc &&
	        (propDesc.get || (propDesc.value !== undefined && typeof propDesc.value == 'function'))) {
	        throw new TypeError('Invalid descriptor of observable property');
	    }
	    return Cell(targetOrOptions, propName, propDesc, options);
	}
	function Computed(targetOrOptions, propName, propDesc, options) {
	    if (arguments.length == 1) {
	        return (target, propName, propDesc) => Computed(target, propName, propDesc, targetOrOptions);
	    }
	    if (propDesc && propDesc.value !== undefined && typeof propDesc.value != 'function') {
	        throw new TypeError('Invalid descriptor of computed property');
	    }
	    propDesc = Cell(targetOrOptions, propName, propDesc, options);
	    propDesc.enumerable = false;
	    return propDesc;
	}

	exports.Cell = Cell;
	exports.Computed = Computed;
	exports.Observable = Observable;
	exports.cell = Cell;
	exports.computed = Computed;
	exports.observable = Observable;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

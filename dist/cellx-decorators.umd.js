(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cellx')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cellx'], factory) :
	(global = global || self, factory(global['cellx-decorators'] = {}, global.cellx));
}(this, (function (exports, cellx) { 'use strict';

	function Reactive(targetOrOptions, propName, propDesc, options) {
	    if (arguments.length == 1) {
	        return (target, propName, propDesc) => Reactive(target, propName, propDesc, targetOrOptions);
	    }
	    let constr = targetOrOptions.constructor;
	    let debugKey = (constr != Object && constr != Function && constr.name ? constr.name + '#' : '') + propName;
	    return {
	        configurable: true,
	        enumerable: propDesc ? propDesc.enumerable : true,
	        get() {
	            if (!(this[cellx.KEY_VALUE_CELLS] || (this[cellx.KEY_VALUE_CELLS] = new Map())).has(propName)) {
	                let valueCell = this[propName + 'Cell'];
	                let valueCell_ = valueCell instanceof cellx.Cell
	                    ? valueCell
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
	                        });
	                if (valueCell === null) {
	                    this[propName + 'Cell'] = valueCell_;
	                }
	                this[cellx.KEY_VALUE_CELLS].set(propName, valueCell_);
	            }
	            return this[cellx.KEY_VALUE_CELLS].get(propName).get();
	        },
	        set: (propDesc && propDesc.set) ||
	            function (value) {
	                if ((this[cellx.KEY_VALUE_CELLS] || (this[cellx.KEY_VALUE_CELLS] = new Map())).has(propName)) {
	                    this[cellx.KEY_VALUE_CELLS].get(propName).set(value);
	                }
	                else if (propDesc) {
	                    let valueCell = this[propName + 'Cell'];
	                    let valueCell_ = valueCell instanceof cellx.Cell
	                        ? valueCell
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
	                            });
	                    valueCell_.set(value);
	                    if (valueCell === null) {
	                        this[propName + 'Cell'] = valueCell_;
	                    }
	                    this[cellx.KEY_VALUE_CELLS].set(propName, valueCell_);
	                }
	                else {
	                    let isFunction = typeof value == 'function';
	                    let valueCell = this[propName + 'Cell'];
	                    let valueCell_ = valueCell instanceof cellx.Cell
	                        ? valueCell
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
	                        valueCell_.set(value);
	                    }
	                    if (valueCell === null) {
	                        this[propName + 'Cell'] = valueCell_;
	                    }
	                    this[cellx.KEY_VALUE_CELLS].set(propName, valueCell_);
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
	    return Reactive(targetOrOptions, propName, propDesc, options);
	}
	function Computed(targetOrOptions, propName, propDesc, options) {
	    if (arguments.length == 1) {
	        return (target, propName, propDesc) => Computed(target, propName, propDesc, targetOrOptions);
	    }
	    if (propDesc && propDesc.value !== undefined && typeof propDesc.value != 'function') {
	        throw new TypeError('Invalid descriptor of computed property');
	    }
	    propDesc = Reactive(targetOrOptions, propName, propDesc, options);
	    propDesc.enumerable = false;
	    return propDesc;
	}

	exports.Computed = Computed;
	exports.Observable = Observable;
	exports.Reactive = Reactive;
	exports.computed = Computed;
	exports.observable = Observable;
	exports.reactive = Reactive;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

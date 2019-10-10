(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cellx')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cellx'], factory) :
	(global = global || self, factory(global['cellx-decorators'] = {}, global.cellx));
}(this, function (exports, cellx) { 'use strict';

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
	                (this[cellName] = new cellx.Cell(propertyDesc &&
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
	                    (this[cellName] = new cellx.Cell(propertyDesc.get ||
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
	                    this[cellName] = new cellx.Cell(isFunction ? value : undefined, options
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

	exports.Cell = Cell;
	exports.Computed = Computed;
	exports.Observable = Observable;
	exports.cell = Cell;
	exports.computed = Computed;
	exports.observable = Observable;

	Object.defineProperty(exports, '__esModule', { value: true });

}));

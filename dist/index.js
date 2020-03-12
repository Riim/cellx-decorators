import { Cell as CellxCell, KEY_VALUE_CELLS } from 'cellx';
export function Cell(targetOrOptions, propName, propDesc, options) {
    if (arguments.length == 1) {
        return (target, propName, propDesc) => Cell(target, propName, propDesc, targetOrOptions);
    }
    let constr = targetOrOptions.constructor;
    let debugKey = (constr != Object && constr != Function && constr.name ? constr.name + '#' : '') + propName;
    return {
        configurable: true,
        enumerable: propDesc ? propDesc.enumerable : true,
        get() {
            if (!(this[KEY_VALUE_CELLS] ||
                (this[KEY_VALUE_CELLS] = new Map())).has(propName)) {
                this[KEY_VALUE_CELLS].set(propName, this[propName + 'Cell'] instanceof CellxCell
                    ? this[propName + 'Cell']
                    : new CellxCell(propDesc &&
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
            return this[KEY_VALUE_CELLS].get(propName).get();
        },
        set: (propDesc && propDesc.set) ||
            function (value) {
                if ((this[KEY_VALUE_CELLS] ||
                    (this[KEY_VALUE_CELLS] = new Map())).has(propName)) {
                    this[KEY_VALUE_CELLS].get(propName).set(value);
                }
                else if (propDesc) {
                    this[KEY_VALUE_CELLS].set(propName, (this[propName + 'Cell'] instanceof CellxCell
                        ? this[propName + 'Cell']
                        : new CellxCell(propDesc.get ||
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
                    let valueCell = this[propName + 'Cell'] instanceof CellxCell
                        ? this[propName + 'Cell']
                        : new CellxCell(isFunction ? value : undefined, options
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
                    this[KEY_VALUE_CELLS].set(propName, valueCell);
                }
            }
    };
}
export { Cell as cell };
export function Observable(targetOrOptions, propName, propDesc, options) {
    if (arguments.length == 1) {
        return (target, propName, propDesc) => Observable(target, propName, propDesc, targetOrOptions);
    }
    if (propDesc &&
        (propDesc.get || (propDesc.value !== undefined && typeof propDesc.value == 'function'))) {
        throw new TypeError('Invalid descriptor of observable property');
    }
    return Cell(targetOrOptions, propName, propDesc, options);
}
export { Observable as observable };
export function Computed(targetOrOptions, propName, propDesc, options) {
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
export { Computed as computed };

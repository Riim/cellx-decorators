import { Cell as CellxCell } from 'cellx';
export function Cell(targetOrOptions, propertyName, propertyDesc, options) {
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
                (this[cellName] = new CellxCell(propertyDesc &&
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
                    (this[cellName] = new CellxCell(propertyDesc.get ||
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
                    this[cellName] = new CellxCell(isFunction ? value : undefined, options
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
export { Cell as cell };
export function Observable(targetOrOptions, propertyName, propertyDesc, options) {
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
export { Observable as observable };
export function Computed(targetOrOptions, propertyName, propertyDesc, options) {
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
export { Computed as computed };

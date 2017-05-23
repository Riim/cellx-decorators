"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cellx_1 = require("cellx");
var assign = Object.assign || function (target, source) {
    for (var name_1 in source) {
        target[name_1] = source[name_1];
    }
    return target;
};
function cellDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return cellDecorator(target, name, desc, targetOrOptions);
        };
    }
    var privateName = '_' + name;
    targetOrOptions[privateName] = undefined;
    return {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get: function () {
            return (this[privateName] || (this[privateName] = new cellx_1.Cell(desc && (desc.initializer ?
                desc.initializer() :
                // Если initializer нет, то это либо babel с initializer == null,
                // либо typescript с desc предудущего декоратора.
                // В обоих случаях читаем value, при babel прочитаем undefined,
                // при typescript значение desc предыдущего декоратора
                // (desc предыдущего декоратора должен быть именно DataDescriptor-ом).
                desc.value), opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }))).get();
        },
        set: function (value) {
            if (desc && desc.initializer !== undefined) {
                if (!this[privateName]) {
                    this[privateName] = new cellx_1.Cell(desc.initializer ? desc.initializer() : undefined, opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this });
                }
                this[privateName].set(value);
            }
            else {
                if (this[privateName]) {
                    this[privateName].set(value);
                }
                else {
                    var isFn = typeof value == 'function';
                    this[privateName] = new cellx_1.Cell(isFn ? value : undefined, opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this });
                    if (!isFn) {
                        this[privateName].set(value);
                    }
                }
            }
        }
    };
}
exports.observable = cellDecorator;
exports.computed = cellDecorator;
exports.cell = cellDecorator;

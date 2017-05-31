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
    var cellName = '_' + name;
    targetOrOptions[cellName] = undefined;
    return {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get: function () {
            return (this[cellName] || (this[cellName] = new cellx_1.Cell(desc && (desc.get || (desc.initializer ? desc.initializer() : desc.value)), opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }))).get();
        },
        set: desc && desc.set || function (value) {
            if (this[cellName]) {
                this[cellName].set(value);
            }
            else if (desc) {
                (this[cellName] = new cellx_1.Cell(desc.get || (desc.initializer ? desc.initializer() : desc.value), opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this })).set(value);
            }
            else {
                var isFn = typeof value == 'function';
                this[cellName] = new cellx_1.Cell(isFn ? value : undefined, opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this });
                if (!isFn) {
                    this[cellName].set(value);
                }
            }
        }
    };
}
exports.observable = cellDecorator;
exports.computed = cellDecorator;
exports.cell = cellDecorator;

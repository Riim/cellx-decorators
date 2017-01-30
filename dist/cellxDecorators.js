"use strict";
var cellx_1 = require("cellx");
/**
 * Babel:
 * desc с добавленным initializer.
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `any | void`: https://github.com/Microsoft/TypeScript/issues/8063
 */
function cellDecorator(targetOrOptions, name, desc, opts) {
    if (arguments.length == 1) {
        return function (target, name, desc) {
            return cellDecorator(target, name, desc, targetOrOptions);
        };
    }
    var privateName = '_' + name;
    return {
        configurable: true,
        enumerable: desc ? desc.enumerable : true,
        get: function () {
            var cell = this[privateName];
            if (cell) {
                return cell.get();
            }
            if (opts) {
                if (opts['owner'] === undefined) {
                    opts = { __proto__: opts, owner: this };
                }
            }
            else {
                opts = { owner: this };
            }
            return (this[privateName] = new cellx_1.Cell(desc.initializer(), opts)).get();
        },
        set: function (value) {
            var cell = this[privateName];
            if (cell) {
                cell.set(value);
            }
            else {
                if (opts) {
                    if (opts['owner'] === undefined) {
                        opts = { __proto__: opts, owner: this };
                    }
                }
                else {
                    opts = { owner: this };
                }
                this[privateName] = new cellx_1.Cell(value, opts);
            }
        }
    };
}
exports.observable = cellDecorator;
exports.computed = cellDecorator;
exports.cell = cellDecorator;

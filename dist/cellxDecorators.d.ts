import { ICellOptions } from 'cellx';
/**
 * Babel PropertyDecorator arguments:
 * prototype
 * 'name'
 * { configurable: false
 *   enumerable: true
 *   initializer: function initializer() | null
 *   writable: true }
 *
 * Eсли значение декарируемого свойства не задано, то initializer будет null.
 *
 * Typescript PropertyDecorator arguments:
 * prototype
 * 'name'
 * undefined | (результат предыдущего декоратора)
 *
 * Результат `'void' or 'any'`: https://github.com/Microsoft/TypeScript/issues/8063.
 *
 * AccessorDecorator arguments:
 * prototype
 * 'name'
 * { configurable: true
 *   enumerable: true
 *   get: function ()
 *   set: undefined }
 */
declare function cellDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function cellDecorator<T = any>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
export { cellDecorator as observable, cellDecorator as computed, cellDecorator as cell };

import { ICellOptions } from 'cellx';
declare function enumerableDecorator(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function nonEnumerableDecorator(target: Object, name: string, desc?: PropertyDescriptor): any;
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
declare function CellDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function CellDecorator<T = any>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
declare function observableDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function observableDecorator<T = any>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
declare function computedDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function computedDecorator<T = any>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
export { enumerableDecorator as enumerable, nonEnumerableDecorator as nonEnumerable, CellDecorator as Cell, observableDecorator as observable, computedDecorator as computed };

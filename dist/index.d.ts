import { ICellOptions } from 'cellx';
/**
 * Babel PropertyDecorator arguments:
 * prototype
 * 'propName'
 * { configurable: false
 *   enumerable: true
 *   initializer: function initializer() | null
 *   writable: true }
 *
 * Eсли значение декарируемого свойства не задано, то initializer будет null.
 *
 * Typescript PropertyDecorator arguments:
 * prototype
 * 'propName'
 * undefined | результат предыдущего декоратора
 *
 * https://github.com/Microsoft/TypeScript/issues/8063.
 *
 * AccessorDecorator arguments:
 * prototype
 * 'propName'
 * { configurable: true
 *   enumerable: true
 *   get: function ()
 *   set: undefined }
 */
export declare function Reactive<T = any>(target: Object, propName: string, propDesc?: PropertyDescriptor): any;
export declare function Reactive<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export { Reactive as reactive };
export declare function Observable<T = any>(target: Object, propName: string, propDesc?: PropertyDescriptor): any;
export declare function Observable<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export { Observable as observable };
export declare function Computed<T = any>(target: Object, propName: string, propDesc?: PropertyDescriptor): any;
export declare function Computed<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export { Computed as computed };

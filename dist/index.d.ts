import { ICellOptions } from 'cellx';
export declare function NonEnumerable(_target: Object, _propertyName: string, propertyDesc?: PropertyDescriptor): any;
export { NonEnumerable as nonEnumerable };
export declare function Enumerable(_target: Object, _propertyName: string, propertyDesc?: PropertyDescriptor): any;
export { Enumerable as enumerable };
/**
 * Babel PropertyDecorator arguments:
 * prototype
 * 'propertyName'
 * { configurable: false
 *   enumerable: true
 *   initializer: function initializer() | null
 *   writable: true }
 *
 * Eсли значение декарируемого свойства не задано, то initializer будет null.
 *
 * Typescript PropertyDecorator arguments:
 * prototype
 * 'propertyName'
 * undefined | результат предыдущего декоратора
 *
 * https://github.com/Microsoft/TypeScript/issues/8063.
 *
 * AccessorDecorator arguments:
 * prototype
 * 'propertyName'
 * { configurable: true
 *   enumerable: true
 *   get: function ()
 *   set: undefined }
 */
export declare function Cell<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
export declare function Cell<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export { Cell as cell };
export declare function Observable<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
export declare function Observable<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export { Observable as observable };
export declare function Computed<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
export declare function Computed<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export { Computed as computed };

import { ICellOptions } from 'cellx';
declare function NonEnumerableDecorator(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
declare function EnumerableDecorator(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
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
declare function CellDecorator<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
declare function CellDecorator<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
declare function ObservableDecorator<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
declare function ObservableDecorator<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
declare function ComputedDecorator<T = any>(target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any;
declare function ComputedDecorator<T = any, M = any>(options: ICellOptions<T, M>): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export { NonEnumerableDecorator as NonEnumerable, NonEnumerableDecorator as nonEnumerable, EnumerableDecorator as Enumerable, EnumerableDecorator as enumerable, CellDecorator as Cell, CellDecorator as cell, ObservableDecorator as Observable, ObservableDecorator as observable, ComputedDecorator as Computed, ComputedDecorator as computed };

import { ICellOptions } from 'cellx';
/**
 * Babel:
 * desc с добавленным initializer (если значение декарируемого свойства не задано, то initializer равен null).
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `'void' or 'any'`: https://github.com/Microsoft/TypeScript/issues/8063.
 */
declare function cellDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
declare function cellDecorator<T = any>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
export { cellDecorator as observable, cellDecorator as computed, cellDecorator as cell };

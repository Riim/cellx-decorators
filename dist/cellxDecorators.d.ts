/**
 * Babel:
 * desc с добавленным initializer.
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `any | void`: https://github.com/Microsoft/TypeScript/issues/8063
 */
declare function cellDecorator(targetOrOptions: Object, name?: string, desc?: PropertyDescriptor, opts?: Object): any | void;
export { cellDecorator as observable, cellDecorator as computed, cellDecorator as cell };

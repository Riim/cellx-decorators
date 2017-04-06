import { ICellOptions, Cell } from 'cellx';

let assign: (target: Object, source: Object) => Object = (Object as any).assign || function(target, source) {
	for (let name in source) {
		target[name] = source[name];
	}

	return target;
};

/**
 * Babel:
 * desc с добавленным initializer (если значение декарируемого свойства не задано, то initializer равен null).
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `'void' or 'any'`: https://github.com/Microsoft/TypeScript/issues/8063.
 */
function cellDecorator<T>(target: Object, name: string, desc?: PropertyDescriptor): any;
function cellDecorator<T>(opts: ICellOptions<T>): (target: Object, name: string, desc?: PropertyDescriptor) => any;
function cellDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	name?: string,
	desc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): any =>
			(cellDecorator as any)(target, name, desc, targetOrOptions);
	}

	let privateName = '_' + name;

	return {
		configurable: true,
		enumerable: desc ? desc.enumerable : true,

		get(): any {
			return (this[privateName] || (this[privateName] = new Cell(
				desc && ( // При typescript desc будет undefined, если это первый декоратор свойства.
					(desc as any).initializer ?
						(desc as any).initializer() : // Если initializer есть, то просто вызываем его.

						// Если initializer нет, то это либо babel с initializer == null,
						// либо typescript с desc предудущего декоратора.
						// В обоих случаях читаем value, при babel прочитаем undefined,
						// при typescript значение desc предыдущего декоратора
						// (desc предыдущего декоратора должен быть именно DataDescriptor-ом.
						desc.value
				),
				opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
			))).get();
		},

		set(value: any) {
			if (desc && (desc as any).initializer !== undefined) { // babel
				if (!this[privateName]) {
					this[privateName] = new Cell(
						(desc as any).initializer ? (desc as any).initializer() : undefined,
						opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
					);
				}

				this[privateName].set(value);
			} else { // typescript
				if (this[privateName]) {
					this[privateName].set(value);
				} else {
					this[privateName] = new Cell(
						value,
						opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
					);
				}
			}
		}
	};
}

export {
	cellDecorator as observable,
	cellDecorator as computed,
	cellDecorator as cell
};

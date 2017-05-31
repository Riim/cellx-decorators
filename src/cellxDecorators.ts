import { ICellOptions, Cell } from 'cellx';

let assign: (target: Object, source: Object) => Object = (Object as any).assign || function(target, source) {
	for (let name in source) {
		target[name] = source[name];
	}

	return target;
};

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
function cellDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
function cellDecorator<T = any>(opts: ICellOptions<T>):
	(target: Object, name: string, desc?: PropertyDescriptor) => any;
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

	let cellName = '_' + name;

	targetOrOptions[cellName] = undefined;

	return {
		configurable: true,
		enumerable: desc ? desc.enumerable : true,

		get(): any {
			return (this[cellName] || (this[cellName] = new Cell(
				desc && (desc.get || ((desc as any).initializer ? (desc as any).initializer() : desc.value)),
				opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
			))).get();
		},

		set: desc && desc.set || function(value: any) {
			if (this[cellName]) {
				this[cellName].set(value);
			} else if (desc) {
				(this[cellName] = new Cell(
					desc.get || ((desc as any).initializer ? (desc as any).initializer() : desc.value),
					opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
				)).set(value);
			} else {
				let isFn = typeof value == 'function';

				this[cellName] = new Cell(
					isFn ? value : undefined,
					opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
				);

				if (!isFn) {
					this[cellName].set(value);
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

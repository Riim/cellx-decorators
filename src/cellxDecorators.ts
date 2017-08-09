import { Cell, ICellOptions } from 'cellx';

let assign: (target: { [name: string]: any }, source: { [name: string]: any }) => Object =
	(Object as any).assign || function(target, source) {
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
function CellDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
function CellDecorator<T = any>(opts: ICellOptions<T>):
	(target: Object, name: string, desc?: PropertyDescriptor) => any;
function CellDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	name?: string,
	desc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): any =>
			(CellDecorator as any)(target, name, desc, targetOrOptions);
	}

	let cellName = name + 'Cell';

	(targetOrOptions as any)[cellName] = undefined;

	return {
		configurable: true,
		enumerable: desc ? desc.enumerable : true,

		get(): any {
			return (this[cellName] || (this[cellName] = new Cell(
				desc && (desc.get || ((desc as any).initializer ? (desc as any).initializer() : desc.value)),
				opts ? (opts.context === undefined ? assign({ context: this }, opts) : opts) : { context: this }
			))).get();
		},

		set: desc && desc.set || function(value: any) {
			if (this[cellName]) {
				this[cellName].set(value);
			} else if (desc) {
				(this[cellName] = new Cell(
					desc.get || ((desc as any).initializer ? (desc as any).initializer() : desc.value),
					opts ? (opts.context === undefined ? assign({ context: this }, opts) : opts) : { context: this }
				)).set(value);
			} else {
				let isFn = typeof value == 'function';

				this[cellName] = new Cell(
					isFn ? value : undefined,
					opts ? (opts.context === undefined ? assign({ context: this }, opts) : opts) : { context: this }
				);

				if (!isFn) {
					this[cellName].set(value);
				}
			}
		}
	};
}

function observableDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
function observableDecorator<T = any>(opts: ICellOptions<T>):
	(target: Object, name: string, desc?: PropertyDescriptor) => any;
function observableDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	name?: string,
	desc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): any =>
			(observableDecorator as any)(target, name, desc, targetOrOptions);
	}

	if (desc && (desc.get || (desc.value !== undefined && typeof desc.value == 'function'))) {
		throw new TypeError('Invalid descriptor of observable property');
	}

	return (CellDecorator as any)(targetOrOptions, name as string, desc, opts);
}

function computedDecorator<T = any>(target: Object, name: string, desc?: PropertyDescriptor): any;
function computedDecorator<T = any>(opts: ICellOptions<T>):
	(target: Object, name: string, desc?: PropertyDescriptor) => any;
function computedDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	name?: string,
	desc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): any =>
			(computedDecorator as any)(target, name, desc, targetOrOptions);
	}

	if (desc && desc.value !== undefined && typeof desc.value != 'function') {
		throw new TypeError('Invalid descriptor of computed property');
	}

	desc = (CellDecorator as any)(targetOrOptions, name as string, desc, opts);
	(desc as PropertyDescriptor).enumerable = false;

	return desc;
}

function enumerableDecorator(target: Object, name: string, desc?: PropertyDescriptor): any {
	if (desc) {
		desc.enumerable = true;
		return desc;
	}

	return {
		configurable: true,
		enumerable: true,
		writable: true,
		value: undefined
	};
}

function nonEnumerableDecorator(target: Object, name: string, desc?: PropertyDescriptor): any {
	if (desc) {
		desc.enumerable = false;
		return desc;
	}

	return {
		configurable: true,
		enumerable: false,
		writable: true,
		value: undefined
	};
}

export {
	CellDecorator as Cell,
	observableDecorator as observable,
	computedDecorator as computed,
	enumerableDecorator as enumerable,
	nonEnumerableDecorator as nonEnumerable
};

import { assign } from '@riim/object-assign-polyfill';
import { Cell, ICellOptions } from 'cellx';

function enumerableDecorator(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any {
	if (propertyDesc) {
		propertyDesc.enumerable = true;
		return propertyDesc;
	}

	return {
		configurable: true,
		enumerable: true,
		writable: true,
		value: undefined
	};
}

function nonEnumerableDecorator(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any {
	if (propertyDesc) {
		propertyDesc.enumerable = false;
		return propertyDesc;
	}

	return {
		configurable: true,
		enumerable: false,
		writable: true,
		value: undefined
	};
}

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
 * Результат `'void' or 'any'`: https://github.com/Microsoft/TypeScript/issues/8063.
 *
 * AccessorDecorator arguments:
 * prototype
 * 'propertyName'
 * { configurable: true
 *   enumerable: true
 *   get: function ()
 *   set: undefined }
 */
function CellDecorator<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
function CellDecorator<T = any>(
	opts: ICellOptions<T>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
function CellDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(CellDecorator as any)(target, propertyName, propertyDesc, targetOrOptions);
	}

	let cellName = propertyName + 'Cell';

	Object.defineProperty(targetOrOptions, cellName, {
		configurable: true,
		enumerable: false,
		writable: true,
		value: undefined
	});

	return {
		configurable: true,
		enumerable: propertyDesc ? propertyDesc.enumerable : true,

		get(): any {
			return (this[cellName] ||
				(this[cellName] = new Cell(
					propertyDesc &&
						(propertyDesc.get ||
							((propertyDesc as any).initializer
								? (propertyDesc as any).initializer()
								: propertyDesc.value)),
					opts
						? opts.context === undefined ? assign({ context: this }, opts) : opts
						: { context: this }
				))
			).get();
		},

		set:
			(propertyDesc && propertyDesc.set) ||
			function(value: any) {
				if (this[cellName]) {
					this[cellName].set(value);
				} else if (propertyDesc) {
					(this[cellName] = new Cell(
						propertyDesc.get ||
							((propertyDesc as any).initializer
								? (propertyDesc as any).initializer()
								: propertyDesc.value),
						opts
							? opts.context === undefined ? assign({ context: this }, opts) : opts
							: { context: this }
					)).set(value);
				} else {
					let isFn = typeof value == 'function';

					this[cellName] = new Cell(
						isFn ? value : undefined,
						opts
							? opts.context === undefined ? assign({ context: this }, opts) : opts
							: { context: this }
					);

					if (!isFn) {
						this[cellName].set(value);
					}
				}
			}
	};
}

function observableDecorator<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
function observableDecorator<T = any>(
	opts: ICellOptions<T>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
function observableDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(observableDecorator as any)(target, propertyName, propertyDesc, targetOrOptions);
	}

	if (
		propertyDesc &&
		(propertyDesc.get ||
			(propertyDesc.value !== undefined && typeof propertyDesc.value == 'function'))
	) {
		throw new TypeError('Invalid descriptor of observable property');
	}

	return (CellDecorator as any)(targetOrOptions, propertyName as string, propertyDesc, opts);
}

function computedDecorator<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
function computedDecorator<T = any>(
	opts: ICellOptions<T>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
function computedDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(computedDecorator as any)(target, propertyName, propertyDesc, targetOrOptions);
	}

	if (
		propertyDesc &&
		propertyDesc.value !== undefined &&
		typeof propertyDesc.value != 'function'
	) {
		throw new TypeError('Invalid descriptor of computed property');
	}

	propertyDesc = (CellDecorator as any)(
		targetOrOptions,
		propertyName as string,
		propertyDesc,
		opts
	);
	(propertyDesc as PropertyDescriptor).enumerable = false;

	return propertyDesc;
}

export {
	enumerableDecorator as enumerable,
	nonEnumerableDecorator as nonEnumerable,
	CellDecorator as Cell,
	observableDecorator as observable,
	computedDecorator as computed
};

import { assign } from '@riim/object-assign-polyfill';
import { Cell, ICellOptions } from 'cellx';

function NonEnumerableDecorator(
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

function EnumerableDecorator(
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
			return (
				this[cellName] ||
				(this[cellName] = new Cell(
					propertyDesc &&
						(propertyDesc.get ||
							((propertyDesc as any).initializer
								? (propertyDesc as any).initializer()
								: propertyDesc.value)),
					opts
						? opts.context === undefined
							? assign({ context: this }, opts)
							: opts
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
							? opts.context === undefined
								? assign({ context: this }, opts)
								: opts
							: { context: this }
					)).set(value);
				} else {
					let isFunction = typeof value == 'function';

					this[cellName] = new Cell(
						isFunction ? value : undefined,
						opts
							? opts.context === undefined
								? assign({ context: this }, opts)
								: opts
							: { context: this }
					);

					if (!isFunction) {
						this[cellName].set(value);
					}
				}
			}
	};
}

function ObservableDecorator<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
function ObservableDecorator<T = any>(
	opts: ICellOptions<T>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
function ObservableDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(ObservableDecorator as any)(target, propertyName, propertyDesc, targetOrOptions);
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

function ComputedDecorator<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
function ComputedDecorator<T = any>(
	opts: ICellOptions<T>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
function ComputedDecorator<T>(
	targetOrOptions: Object | ICellOptions<T>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	opts?: ICellOptions<T>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(ComputedDecorator as any)(target, propertyName, propertyDesc, targetOrOptions);
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

// prettier-ignore
export {
	NonEnumerableDecorator as NonEnumerable,
	NonEnumerableDecorator as nonEnumerable,

	EnumerableDecorator as Enumerable,
	EnumerableDecorator as enumerable,

	CellDecorator as Cell,
	CellDecorator as cell,

	ObservableDecorator as Observable,
	ObservableDecorator as observable,

	ComputedDecorator as Computed,
	ComputedDecorator as computed
};

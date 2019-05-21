import { Cell as CellxCell, ICellOptions } from 'cellx';

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
export function Cell<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
export function Cell<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export function Cell<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(Cell as any)(target, propertyName, propertyDesc, targetOrOptions);
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
				(this[cellName] = new CellxCell(
					propertyDesc &&
						(propertyDesc.get ||
							((propertyDesc as any).initializer
								? (propertyDesc as any).initializer()
								: propertyDesc.value)),
					options
						? options.context === undefined
							? Object.assign({ context: this }, options)
							: options
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
					(this[cellName] = new CellxCell(
						propertyDesc.get ||
							((propertyDesc as any).initializer
								? (propertyDesc as any).initializer()
								: propertyDesc.value),
						options
							? options.context === undefined
								? Object.assign({ context: this }, options)
								: options
							: { context: this }
					)).set(value);
				} else {
					let isFunction = typeof value == 'function';

					this[cellName] = new CellxCell(
						isFunction ? value : undefined,
						options
							? options.context === undefined
								? Object.assign({ context: this }, options)
								: options
							: { context: this }
					);

					if (!isFunction) {
						this[cellName].set(value);
					}
				}
			}
	};
}

export { Cell as cell };

export function Observable<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
export function Observable<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export function Observable<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(Observable as any)(target, propertyName, propertyDesc, targetOrOptions);
	}

	if (
		propertyDesc &&
		(propertyDesc.get ||
			(propertyDesc.value !== undefined && typeof propertyDesc.value == 'function'))
	) {
		throw new TypeError('Invalid descriptor of observable property');
	}

	return (Cell as any)(targetOrOptions, propertyName as string, propertyDesc, options);
}

export { Observable as observable };

export function Computed<T = any>(
	target: Object,
	propertyName: string,
	propertyDesc?: PropertyDescriptor
): any;
export function Computed<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor) => any;
export function Computed<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propertyName?: string,
	propertyDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propertyName: string, propertyDesc?: PropertyDescriptor): any =>
			(Computed as any)(target, propertyName, propertyDesc, targetOrOptions);
	}

	if (
		propertyDesc &&
		propertyDesc.value !== undefined &&
		typeof propertyDesc.value != 'function'
	) {
		throw new TypeError('Invalid descriptor of computed property');
	}

	propertyDesc = (Cell as any)(targetOrOptions, propertyName as string, propertyDesc, options);
	(propertyDesc as PropertyDescriptor).enumerable = false;

	return propertyDesc;
}

export { Computed as computed };

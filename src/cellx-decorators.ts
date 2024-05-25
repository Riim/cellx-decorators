import { Cell, ICellOptions, KEY_VALUE_CELLS } from 'cellx';

export function Reactive<TValue = any>(
	target: object,
	propName: string,
	propDesc?: PropertyDescriptor
): any;
export function Reactive<TValue = any, TContext = any, TMeta = any>(
	options: ICellOptions<TValue, TContext, TMeta>
): (target: object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Reactive<TValue, TContext, TMeta>(
	targetOrOptions: object | ICellOptions<TValue, TContext, TMeta>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<TValue, TContext, TMeta>
): any {
	if (arguments.length == 1) {
		return (target: object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Reactive as any)(target, propName, propDesc, targetOrOptions);
	}

	let ctor = targetOrOptions.constructor;
	let debugKey =
		(ctor != Object && ctor != Function && ctor.name ? ctor.name + '#' : '') + propName;

	return {
		configurable: true,
		enumerable: propDesc ? propDesc.enumerable : true,

		get(this: { [KEY_VALUE_CELLS]?: Map<string, Cell> }): any {
			if (!(this[KEY_VALUE_CELLS] ?? (this[KEY_VALUE_CELLS] = new Map())).has(propName!)) {
				let propCellValue = this[propName + 'Cell'];
				let valueCell =
					propCellValue instanceof Cell
						? propCellValue
						: new Cell(
								propDesc && (propDesc.get || propDesc.value),
								options
									? ({
											debugKey,
											context: options.context ?? this,
											...options
										} as any)
									: {
											debugKey,
											context: this
										}
							);

				if (propCellValue === null) {
					this[propName + 'Cell'] = valueCell;
				}

				this[KEY_VALUE_CELLS].set(propName!, valueCell);
			}

			return this[KEY_VALUE_CELLS].get(propName!)!.get();
		},

		set:
			propDesc?.set ??
			function (this: { [KEY_VALUE_CELLS]?: Map<string, Cell> }, value: TValue) {
				if ((this[KEY_VALUE_CELLS] ?? (this[KEY_VALUE_CELLS] = new Map())).has(propName!)) {
					this[KEY_VALUE_CELLS].get(propName!)!.set(value);
				} else {
					let propCellValue = this[propName + 'Cell'];
					let valueCell: Cell;

					if (propCellValue instanceof Cell) {
						valueCell = propCellValue.set(value);
					} else {
						valueCell = new Cell(
							propDesc ? propDesc.get ?? propDesc.value : value,
							options
								? ({
										debugKey,
										context: options.context ?? this,
										...options
									} as any)
								: {
										debugKey,
										context: this
									}
						);

						if (propDesc?.get) {
							valueCell.set(value);
						}
					}

					if (propCellValue === null) {
						this[propName + 'Cell'] = valueCell;
					}

					this[KEY_VALUE_CELLS].set(propName!, valueCell);
				}
			}
	};
}

export { Reactive as reactive };

export function Observable<TValue = any>(
	target: object,
	propName: string,
	propDesc?: PropertyDescriptor
): any;
export function Observable<TValue = any, TContext = any, TMeta = any>(
	options: ICellOptions<TValue, TContext, TMeta>
): (target: object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Observable<TValue, TContext, TMeta>(
	targetOrOptions: object | ICellOptions<TValue, TContext, TMeta>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<TValue, TContext, TMeta>
): any {
	if (arguments.length == 1) {
		return (target: object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Observable as any)(target, propName, propDesc, targetOrOptions);
	}

	if (propDesc && (propDesc.get || typeof propDesc.value == 'function')) {
		throw TypeError('Invalid descriptor of observable property');
	}

	return (Reactive as any)(targetOrOptions, propName!, propDesc, options);
}

export { Observable as observable };

export function Computed<TValue = any>(
	target: object,
	propName: string,
	propDesc?: PropertyDescriptor
): any;
export function Computed<TValue = any, TContext = any, TMeta = any>(
	options: ICellOptions<TValue, TContext, TMeta>
): (target: object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Computed<TValue, TContext, TMeta>(
	targetOrOptions: object | ICellOptions<TValue, TContext, TMeta>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<TValue, TContext, TMeta>
): any {
	if (arguments.length == 1) {
		return (target: object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Computed as any)(target, propName, propDesc, targetOrOptions);
	}

	if (propDesc?.value !== undefined) {
		throw TypeError('Invalid descriptor of computed property');
	}

	propDesc = (Reactive as any)(targetOrOptions, propName!, propDesc, options);
	(propDesc as PropertyDescriptor).enumerable = false;

	return propDesc;
}

export { Computed as computed };

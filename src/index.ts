import { Cell as CellxCell, ICellOptions, KEY_VALUE_CELLS } from 'cellx';

/**
 * Babel PropertyDecorator arguments:
 * prototype
 * 'propName'
 * { configurable: false
 *   enumerable: true
 *   initializer: function initializer() | null
 *   writable: true }
 *
 * Eсли значение декарируемого свойства не задано, то initializer будет null.
 *
 * Typescript PropertyDecorator arguments:
 * prototype
 * 'propName'
 * undefined | результат предыдущего декоратора
 *
 * https://github.com/Microsoft/TypeScript/issues/8063.
 *
 * AccessorDecorator arguments:
 * prototype
 * 'propName'
 * { configurable: true
 *   enumerable: true
 *   get: function ()
 *   set: undefined }
 */
export function Cell<T = any>(target: Object, propName: string, propDesc?: PropertyDescriptor): any;
export function Cell<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Cell<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Cell as any)(target, propName, propDesc, targetOrOptions);
	}

	let constr = targetOrOptions.constructor;
	let debugKey =
		(constr != Object && constr != Function && constr.name ? constr.name + '#' : '') + propName;

	return {
		configurable: true,
		enumerable: propDesc ? propDesc.enumerable : true,

		get(): any {
			if (
				!(
					(this[KEY_VALUE_CELLS] as Map<string, CellxCell>) ||
					(this[KEY_VALUE_CELLS] = new Map())
				).has(propName!)
			) {
				(this[KEY_VALUE_CELLS] as Map<string, CellxCell>).set(
					propName!,
					this[propName + 'Cell'] instanceof CellxCell
						? this[propName + 'Cell']
						: new CellxCell(
								propDesc &&
									(propDesc.get ||
										((propDesc as any).initializer
											? (propDesc as any).initializer()
											: propDesc.value)),
								options
									? Object.assign(
											{
												debugKey,
												context:
													options.context !== undefined
														? options.context
														: this
											},
											options
									  )
									: {
											debugKey,
											context: this
									  }
						  )
				);
			}

			return (this[KEY_VALUE_CELLS] as Map<string, CellxCell>).get(propName!)!.get();
		},

		set:
			(propDesc && propDesc.set) ||
			function(value: any) {
				if (
					(
						(this[KEY_VALUE_CELLS] as Map<string, CellxCell>) ||
						(this[KEY_VALUE_CELLS] = new Map())
					).has(propName!)
				) {
					(this[KEY_VALUE_CELLS] as Map<string, CellxCell>).get(propName!)!.set(value);
				} else if (propDesc) {
					(this[KEY_VALUE_CELLS] as Map<string, CellxCell>).set(
						propName!,
						(this[propName + 'Cell'] instanceof CellxCell
							? this[propName + 'Cell']
							: new CellxCell(
									propDesc.get ||
										((propDesc as any).initializer
											? (propDesc as any).initializer()
											: propDesc.value),
									options
										? Object.assign(
												{
													debugKey,
													context:
														options.context !== undefined
															? options.context
															: this
												},
												options
										  )
										: {
												debugKey,
												context: this
										  }
							  )
						).set(value)
					);
				} else {
					let isFunction = typeof value == 'function';
					let valueCell =
						this[propName + 'Cell'] instanceof CellxCell
							? this[propName + 'Cell']
							: new CellxCell(
									isFunction ? value : undefined,
									options
										? Object.assign(
												{
													debugKey,
													context:
														options.context !== undefined
															? options.context
															: this
												},
												options
										  )
										: {
												debugKey,
												context: this
										  }
							  );

					if (!isFunction) {
						valueCell.set(value);
					}

					(this[KEY_VALUE_CELLS] as Map<string, CellxCell>).set(propName!, valueCell);
				}
			}
	};
}

export { Cell as cell };

export function Observable<T = any>(
	target: Object,
	propName: string,
	propDesc?: PropertyDescriptor
): any;
export function Observable<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Observable<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Observable as any)(target, propName, propDesc, targetOrOptions);
	}

	if (
		propDesc &&
		(propDesc.get || (propDesc.value !== undefined && typeof propDesc.value == 'function'))
	) {
		throw new TypeError('Invalid descriptor of observable property');
	}

	return (Cell as any)(targetOrOptions, propName as string, propDesc, options);
}

export { Observable as observable };

export function Computed<T = any>(
	target: Object,
	propName: string,
	propDesc?: PropertyDescriptor
): any;
export function Computed<T = any, M = any>(
	options: ICellOptions<T, M>
): (target: Object, propName: string, propDesc?: PropertyDescriptor) => any;
export function Computed<T, M>(
	targetOrOptions: Object | ICellOptions<T, M>,
	propName?: string,
	propDesc?: PropertyDescriptor,
	options?: ICellOptions<T, M>
): any {
	if (arguments.length == 1) {
		return (target: Object, propName: string, propDesc?: PropertyDescriptor): any =>
			(Computed as any)(target, propName, propDesc, targetOrOptions);
	}

	if (propDesc && propDesc.value !== undefined && typeof propDesc.value != 'function') {
		throw new TypeError('Invalid descriptor of computed property');
	}

	propDesc = (Cell as any)(targetOrOptions, propName as string, propDesc, options);
	(propDesc as PropertyDescriptor).enumerable = false;

	return propDesc;
}

export { Computed as computed };

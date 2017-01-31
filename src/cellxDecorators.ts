import { Cell } from 'cellx';

let assign: (target: Object, source: Object) => Object = (Object as any).assign || function(target, source) {
	for (let name in source) {
		target[name] = source[name];
	}

	return target;
};

/**
 * Babel:
 * desc с добавленным initializer.
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `'void' or 'any'`: https://github.com/Microsoft/TypeScript/issues/8063
 */
function cellDecorator(targetOrOptions: Object, name?: string, desc?: PropertyDescriptor, opts?: Object): any {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): PropertyDescriptor | void =>
			cellDecorator(target, name, desc, targetOrOptions);
	}

	let privateName = '_' + name;

	return {
		configurable: true,
		enumerable: desc ? desc.enumerable : true,

		get(): any {
			return (this[privateName] || (this[privateName] = new Cell(
				desc ? (desc as any).initializer() : undefined,
				opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
			))).get();
		},

		set(value: any) {
			if (this[privateName]) {
				this[privateName].set(value);
			} else {
				this[privateName] = new Cell(
					value,
					opts ? (opts['owner'] === undefined ? assign({ owner: this }, opts) : opts) : { owner: this }
				);
			}
		}
	};
}

export {
	cellDecorator as observable,
	cellDecorator as computed,
	cellDecorator as cell
};

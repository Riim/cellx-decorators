import { Cell } from 'cellx';

/**
 * Babel:
 * desc с добавленным initializer.
 *
 * Typescript:
 * desc - undefined или результат предыдущего декоратора.
 * Результат `any | void`: https://github.com/Microsoft/TypeScript/issues/8063
 */
function cellDecorator(targetOrOptions: Object, name?: string, desc?: PropertyDescriptor, opts?: Object): any | void {
	if (arguments.length == 1) {
		return (target: Object, name: string, desc?: PropertyDescriptor): PropertyDescriptor | void =>
			cellDecorator(target, name, desc, targetOrOptions);
	}

	let privateName = '_' + name;

	return {
		configurable: true,
		enumerable: desc ? desc.enumerable : true,

		get: function() {
			let cell = this[privateName];

			if (cell) {
				return cell.get();
			}

			if (opts) {
				if (opts['owner'] === undefined) {
					opts = { __proto__: opts, owner: this };
				}
			} else {
				opts = { owner: this };
			}

			return (this[privateName] = new Cell((desc as any).initializer(), opts)).get();
		},

		set: function(value: any) {
			let cell = this[privateName];

			if (cell) {
				cell.set(value);
			} else {
				if (opts) {
					if (opts['owner'] === undefined) {
						opts = { __proto__: opts, owner: this };
					}
				} else {
					opts = { owner: this };
				}

				this[privateName] = new Cell(value, opts);
			}
		}
	};
}

export {
	cellDecorator as observable,
	cellDecorator as computed,
	cellDecorator as cell
};

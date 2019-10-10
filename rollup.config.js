import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/index.ts',
	external: ['cellx'],

	output: {
		file: './dist/cellx-decorators.umd.js',
		format: 'umd',
		name: 'cellx-decorators',
		globals: {
			cellx: 'cellx'
		}
	},

	plugins: [
		tslint(),
		typescript({ clean: true })
	]
};

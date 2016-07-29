var webpack = require('webpack');

module.exports = {
	output: {
		library: 'cellx-decorators',
		libraryTarget: 'umd'
	},

	externals: ['cellx'],

	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	}
};

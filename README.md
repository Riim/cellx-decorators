cellx-decorators
================

[ES.Next decorators](https://github.com/wycats/javascript-decorators) for [cellx](https://github.com/Riim/cellx).

### Installation

```
npm install babel-plugin-transform-decorators-legacy --save-dev
npm install cellx-decorators --save
```

### Usage

```js
import { EventEmitter } from 'cellx';
import { observable, computed } from 'cellx-decorators';
import formatPhone from '../../utils/formatPhone';

export default class User extends EventEmitter {
	id = void 0;

	@observable firstName = void 0;
	@observable lastName = void 0;
	@computed fullName = function() {
		return [this.firstName, this.lastName].join(' ').trim() || void 0;
	};
	@computed nameInitials = function() {
		return ((this.firstName || '').charAt(0) + (this.lastName || '').charAt(0)).toUpperCase();
	};

	@observable phone = void 0;
	@computed formattedPhone = function() {
		return this.phone && formatPhone(this.phone);
	};
}
```

### Webpack config

```js
module.exports = {
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(?:node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015'],
					plugins: [
						'transform-decorators-legacy',
						'transform-class-properties'
					]
				}
			}
		]
	}
};

```

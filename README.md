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

class User extends EventEmitter {
    id = void 0;

    @observable firstName = void 0;
    @observable lastName = void 0;
    @computed get fullName() {
        return [this.firstName, this.lastName].join(' ').trim() || void 0;
    }

    @observable phone = void 0;

    @computed({
		put(value) {
			this.phone = value.replace(/\D+/g, '');
		}
	}) get formattedPhone() {
        return this.phone && formatPhone(this.phone);
    }
}

let u = new User();

u.phone = '79161234567';
console.log(u.formattedPhone);
// => '+7 (916) 123-45-67'

u.formattedPhone = '+7 (916) 765-43-21';
console.log(u.phone);
// => '79167654321'
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

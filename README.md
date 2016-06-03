# babel-plugin-stylus-compiler

Compiles .styl files into raw css for import into a javascript variables
```js
import button_css from './buttons.styl'
```

## Install

```
npm i babel-plugin-stylus-compiler --save-dev
```

## Usage
### Babel config
```
{
  "plugins": ["/home/josh/babel-plugin-stylus"]
}
```

### CLI
```
babel --plugins babel-plugin-stylus-compiler lib/ --out-dir build
```

## Change log
### 1.0.0
* Initial release


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
  "plugins": ["babel-plugin-stylus-compiler"]
}
```

### CLI
```
babel --plugins babel-plugin-stylus-compiler src/ --out-dir build
```

## Change log
### 1.0.5
* Add missing source folder

### 1.0.4
* Code and readme cleanup

### 1.0.3
* Replace new lines with spaces when inlining the css

### 1.0.2
* Add more robust support for resolving `.styl` file in node_modules

### 1.0.1
* Add .npmignore so `prepublish` works

### 1.0.0
* Initial release


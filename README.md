# babel-plugin-stylus-compiler [![Build Status](https://travis-ci.org/jbwyme/babel-plugin-stylus-compiler.svg?branch=master)](https://travis-ci.org/jbwyme/babel-plugin-stylus-compiler)


Compiles .styl files into css:
```js
// import into a javascript variable
import button_css from './buttons.styl'
```
```js
// direct injection as a <style> tag into document.head
import './buttons.styl'
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

### 1.3.0
* Add autoprefixer

### 1.2.0
* Add `./node_modules` to stylus include paths 

### 1.1.0
* Allow direct injection into document.head as a style tag + tests

### 1.0.6
* Clean up dependencies 

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

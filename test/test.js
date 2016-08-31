/* globals it describe require __dirname process */
require('mocha');
var babel = require('babel-core');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var should = require('chai').should();

var babelOptions = {
  'babelrc': false,
  'plugins': [__dirname + '/../'],
};

var createTestNodeModule = function(json, css, test) {
  fs.mkdirSync(path.resolve('./node_modules/') + '/' + json.name);

  fs.writeFileSync(
    path.resolve('./node_modules/') + '/' + json.name + '/package.json', JSON.stringify(json)
  );

  fs.writeFileSync(
    path.resolve('./node_modules/') + '/' + json.name + '/' + json.main, css
  );

  test();
};

var cleanupNodeModuleTest = function(json) {
  var command = /^win/.test(process.platform)
    ? 'RMDIR /S'
    : 'rm -r ';

  exec(command + path.resolve('./node_modules/') + '/' + json.name, function(err) {
    if (err) {
      throw Error('An error occurred cleaning up test for ' + json.name);
    }
  });
};

describe('babel-plugin-stylus-compiler', function() {
  it('should compile stylus to css and assign to a variable if specifier in import', function(done) {
    babel.transformFile(__dirname + '/import-to-variable.js', babelOptions, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      result.code.should.equal('var css = \'div {   border: 1px solid #000;   display: -webkit-box;   display: -ms-flexbox;   display: flex; } \';');
      done();
    });
  });

  it('should compile stylus to css and inject in dom if no specifier in import', function(done) {
    babel.transformFile(__dirname + '/inject-in-dom.js', babelOptions, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      result.code.should.equal('var _css = document.createElement(\'style\');\n\n_css.innerHTML = \'div {   border: 1px solid #000;   display: -webkit-box;   display: -ms-flexbox;   display: flex; } \'\ndocument.head.appendChild(_css)');
      done();
    });
  });

  it('should compile stylus to css from node_module and assign to a variable if specifier in import', function(done) {

    var json = {
      main: 'main.styl',
      name: 'node-module-for-import',
    };

    var css = '$font-size = 13px';

    createTestNodeModule(json, css, function() {

      babel.transformFile(__dirname + '/node-module-for-import.js', babelOptions, function (err, result) {
        should.not.exist(err);
        should.exist(result);
        result.code.should.equal('var css = \'div {   font-size: 13px; } \';');
        done();
        
        cleanupNodeModuleTest(json);
      });
      
    });

  });

});

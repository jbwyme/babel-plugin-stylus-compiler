require('mocha');
var babel = require("babel-core");
var should = require('chai').should();

var babelOptions = {
  'plugins': [__dirname + '/../'],
  'babelrc': false,
};

describe('babel-plugin-stylus-compiler', function() {
  it('should compile stylus to css and assign to a variable if specifier in import', function(done) {
    babel.transformFile(__dirname + '/import-to-variable.js', babelOptions, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      result.code.should.equal("var css = 'div {   border: 1px solid #000;   display: -webkit-box;   display: -ms-flexbox;   display: flex; } ';");
      done();
    });
  });

  it('should compile stylus to css and inject in dom if no specifier in import', function(done) {
    babel.transformFile(__dirname + '/inject-in-dom.js', babelOptions, function (err, result) {
      should.not.exist(err);
      should.exist(result);
      result.code.should.equal('var _css = document.createElement(\'style\');\n\n_css.innerHTML = \'div {   border: 1px solid #000;   display: -webkit-box;   display: -ms-flexbox;   display: flex; } \'\ndocument.head.appendChild(_css)')
      done();
    });
  });
});

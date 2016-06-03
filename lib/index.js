/* global process */

import fs from 'fs';
import stylus from 'stylus';
import minimist from 'minimist';

const compileStylusFile = path => {
  const stylusContent = fs.readFileSync(path, 'utf8');
  const cssContent = stylus(stylusContent).render();
  return cssContent;
};

const replaceStylusImportWithCssFn = t => {
  return (path) => {
    const argv 	= minimist(process.argv.slice(2));
    const node = path.node;
    if (node && node.source && node.source.value && node.source.type === 'StringLiteral' && node.source.value.endsWith('.styl')) {
      const id = node.specifiers[0].local.name;
      const css = compileStylusFile(argv._[0] + '/' + node.source.value);
      path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(id), t.stringLiteral(css))]));
    }
  };
};

export default ({types: t}) => {
  return {
    visitor: {
      ImportDeclaration: {
        exit: replaceStylusImportWithCssFn(t),
      },
    },
  };
};

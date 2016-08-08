/* global process */

import fs from 'fs';
import { dirname, isAbsolute, resolve } from 'path';
import stylus from 'stylus';

const fileExists = filename => {
  try {
    const stats = fs.statSync(filename);
    return stats.isFile(filename);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw Error(e);
    }
  }
};

const compileStylusFile = (jsFile, stylusFile) => {
  // try to resolve as file path
  const from = resolveModulePath(jsFile);
  let path = resolve(from, stylusFile);
  if (!fileExists(path)) {
    // try to resolve from node modules
    path = resolve('./node_modules', stylusFile);
  }

  if (!fileExists(path)) {
    throw Error('Cannot find stylus file: ' + stylusFile);
  }

  const stylusContent = fs.readFileSync(path, 'utf8');
  return stylus(stylusContent).include(dirname(path)).render().replace(/\n/g,' ');
};

const resolveModulePath = (filename) => {
  const dir = dirname(filename);
  if (isAbsolute(dir)) return dir;
  if (process.env.PWD) return resolve(process.env.PWD, dir);
  return resolve(dir);
};

export default ({types: t}) => {
  return {
    visitor: {
      ImportDeclaration: (path, state) => {
        const node = path.node;
        if (node && node.source && node.source.value && node.source.type === 'StringLiteral' && node.source.value.endsWith('.styl')) {
          const jsFile = state.file.opts.filename;
          const stylusFile = node.source.value;
          const css = compileStylusFile(jsFile, stylusFile);
          if (node.specifiers && node.specifiers.length > 0) { // import into variable
            const id = node.specifiers[0].local.name;
            path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(id), t.stringLiteral(css))]));
          } else {  // import without variable (inject into head)e

            // var _css = document.createElement('style');
            const docCreateElement = t.memberExpression(t.identifier('document'), t.identifier('createElement'));
            const createStyleTag = t.callExpression(docCreateElement, [t.stringLiteral('style')]);
            const styleTagVar = path.scope.generateUidIdentifier('css');
            const styleTagVarDeclarator = t.variableDeclarator(styleTagVar, createStyleTag);
            const declareCssVar = t.variableDeclaration('var', [styleTagVarDeclarator]);

            // _css.innerHTML = '{css from imported file}'
            const cssInnerHTML = t.memberExpression(styleTagVar, t.identifier('innerHTML'));
            const setCssFromFile = t.assignmentExpression('=', cssInnerHTML, t.stringLiteral(css));

            // document.head.appendChild(_css)
            const headAppendChild = t.memberExpression(t.identifier('document.head'), t.identifier('appendChild'));
            const appendToHead = t.callExpression(headAppendChild, [styleTagVar]);

            path.replaceWithMultiple([declareCssVar, setCssFromFile, appendToHead]);
          }
        }
      },
    },
  };
};

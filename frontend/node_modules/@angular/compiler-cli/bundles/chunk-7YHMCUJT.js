
      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
      const __ESM_IMPORT_META_URL__ = import.meta.url;
    
// bazel-out/k8-fastbuild/bin/packages/compiler-cli/src/ngtsc/ts_compatibility/src/ts_cross_version_utils.mjs
import ts from "typescript";
var IS_AFTER_TS_48 = isAfterVersion(4, 8);
var IS_AFTER_TS_47 = isAfterVersion(4, 7);
var updateTypeParameterDeclaration = IS_AFTER_TS_47 ? ts.factory.updateTypeParameterDeclaration : (node, _modifiers, name, constraint, defaultType) => ts.factory.updateTypeParameterDeclaration(node, name, constraint, defaultType);
var updateParameterDeclaration = IS_AFTER_TS_48 ? ts.factory.updateParameterDeclaration : (node, modifiers, dotDotDotToken, name, questionToken, type, initializer) => ts.factory.updateParameterDeclaration(node, ...splitModifiers(modifiers), dotDotDotToken, name, questionToken, type, initializer);
var updateImportDeclaration = IS_AFTER_TS_48 ? ts.factory.updateImportDeclaration : (node, modifiers, importClause, moduleSpecifier, assertClause) => ts.factory.updateImportDeclaration(node, void 0, modifiers, importClause, moduleSpecifier, assertClause);
var updateClassDeclaration = IS_AFTER_TS_48 ? ts.factory.updateClassDeclaration : (node, combinedModifiers, name, typeParameters, heritageClauses, members) => ts.factory.updateClassDeclaration(node, ...splitModifiers(combinedModifiers), name, typeParameters, heritageClauses, members);
var createClassDeclaration = IS_AFTER_TS_48 ? ts.factory.createClassDeclaration : (combinedModifiers, name, typeParameters, heritageClauses, members) => ts.factory.createClassDeclaration(...splitModifiers(combinedModifiers), name, typeParameters, heritageClauses, members);
var updateMethodDeclaration = IS_AFTER_TS_48 ? ts.factory.updateMethodDeclaration : (node, modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) => ts.factory.updateMethodDeclaration(node, ...splitModifiers(modifiers), asteriskToken, name, questionToken, typeParameters, parameters, type, body);
var createMethodDeclaration = IS_AFTER_TS_48 ? ts.factory.createMethodDeclaration : (modifiers, asteriskToken, name, questionToken, typeParameters, parameters, type, body) => ts.factory.createMethodDeclaration(...splitModifiers(modifiers), asteriskToken, name, questionToken, typeParameters, parameters, type, body);
var updatePropertyDeclaration = IS_AFTER_TS_48 ? ts.factory.updatePropertyDeclaration : (node, modifiers, name, questionOrExclamationToken, type, initializer) => ts.factory.updatePropertyDeclaration(node, ...splitModifiers(modifiers), name, questionOrExclamationToken, type, initializer);
var createPropertyDeclaration = IS_AFTER_TS_48 ? ts.factory.createPropertyDeclaration : (modifiers, name, questionOrExclamationToken, type, initializer) => ts.factory.createPropertyDeclaration(...splitModifiers(modifiers), name, questionOrExclamationToken, type, initializer);
var updateGetAccessorDeclaration = IS_AFTER_TS_48 ? ts.factory.updateGetAccessorDeclaration : (node, modifiers, name, parameters, type, body) => ts.factory.updateGetAccessorDeclaration(node, ...splitModifiers(modifiers), name, parameters, type, body);
var createGetAccessorDeclaration = IS_AFTER_TS_48 ? ts.factory.createGetAccessorDeclaration : (modifiers, name, parameters, type, body) => ts.factory.createGetAccessorDeclaration(...splitModifiers(modifiers), name, parameters, type, body);
var updateSetAccessorDeclaration = IS_AFTER_TS_48 ? ts.factory.updateSetAccessorDeclaration : (node, modifiers, name, parameters, body) => ts.factory.updateSetAccessorDeclaration(node, ...splitModifiers(modifiers), name, parameters, body);
var createSetAccessorDeclaration = IS_AFTER_TS_48 ? ts.factory.createSetAccessorDeclaration : (modifiers, name, parameters, body) => ts.factory.createSetAccessorDeclaration(...splitModifiers(modifiers), name, parameters, body);
var updateConstructorDeclaration = IS_AFTER_TS_48 ? ts.factory.updateConstructorDeclaration : (node, modifiers, parameters, body) => ts.factory.updateConstructorDeclaration(node, void 0, modifiers, parameters, body);
var getDecorators = IS_AFTER_TS_48 ? ts.getDecorators : (node) => node.decorators;
var getModifiers = IS_AFTER_TS_48 ? ts.getModifiers : (node) => node.modifiers;
function combineModifiers(decorators, modifiers) {
  const hasDecorators = decorators == null ? void 0 : decorators.length;
  const hasModifiers = modifiers == null ? void 0 : modifiers.length;
  if (hasDecorators && hasModifiers) {
    return [...decorators, ...modifiers];
  }
  if (hasDecorators && !hasModifiers) {
    return decorators;
  }
  if (hasModifiers && !hasDecorators) {
    return modifiers;
  }
  return void 0;
}
function splitModifiers(allModifiers) {
  if (!allModifiers) {
    return [void 0, void 0];
  }
  const decorators = [];
  const modifiers = [];
  for (const current of allModifiers) {
    if (ts.isDecorator(current)) {
      decorators.push(current);
    } else {
      modifiers.push(current);
    }
  }
  return [decorators.length ? decorators : void 0, modifiers.length ? modifiers : void 0];
}
function isAfterVersion(targetMajor, targetMinor) {
  const [major, minor] = ts.versionMajorMinor.split(".").map((part) => parseInt(part));
  if (major < targetMajor) {
    return false;
  }
  return major === targetMajor ? minor >= targetMinor : true;
}

export {
  updateTypeParameterDeclaration,
  updateParameterDeclaration,
  updateImportDeclaration,
  updateClassDeclaration,
  createClassDeclaration,
  updateMethodDeclaration,
  createMethodDeclaration,
  updatePropertyDeclaration,
  createPropertyDeclaration,
  updateGetAccessorDeclaration,
  createGetAccessorDeclaration,
  updateSetAccessorDeclaration,
  createSetAccessorDeclaration,
  updateConstructorDeclaration,
  getDecorators,
  getModifiers,
  combineModifiers
};
/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
//# sourceMappingURL=chunk-7YHMCUJT.js.map

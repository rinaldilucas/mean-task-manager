/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/ts_compatibility/src/ts_cross_version_utils" />
import ts from 'typescript';
/** Equivalent of `ts.ModifierLike` which is only present in TS 4.8+. */
export declare type ModifierLike = ts.Modifier | ts.Decorator;
/** Type of `ts.factory.updateTypeParameterDeclaration` in TS 4.7+. */
declare type Ts47UpdateTypeParameterDeclarationFn = (node: ts.TypeParameterDeclaration, modifiers: readonly ts.Modifier[] | undefined, name: ts.Identifier, constraint: ts.TypeNode | undefined, defaultType: ts.TypeNode | undefined) => ts.TypeParameterDeclaration;
/**
 * Updates a `ts.TypeParameter` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.7.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateTypeParameterDeclaration: Ts47UpdateTypeParameterDeclarationFn;
/** Type of `ts.factory.updateParameterDeclaration` in TS 4.8+. */
declare type Ts48UpdateParameterDeclarationFn = (node: ts.ParameterDeclaration, modifiers: readonly ModifierLike[] | undefined, dotDotDotToken: ts.DotDotDotToken | undefined, name: string | ts.BindingName, questionToken: ts.QuestionToken | undefined, type: ts.TypeNode | undefined, initializer: ts.Expression | undefined) => ts.ParameterDeclaration;
/**
 * Updates a `ts.ParameterDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateParameterDeclaration: Ts48UpdateParameterDeclarationFn;
/** Type of `ts.factory.updateImportDeclaration` in TS 4.8+. */
declare type Ts48UpdateImportDeclarationFn = (node: ts.ImportDeclaration, modifiers: readonly ts.Modifier[] | undefined, importClause: ts.ImportClause | undefined, moduleSpecifier: ts.Expression, assertClause: ts.AssertClause | undefined) => ts.ImportDeclaration;
/**
 * Updates a `ts.ImportDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateImportDeclaration: Ts48UpdateImportDeclarationFn;
/** Type of `ts.factory.updateClassDeclaration` in TS 4.8+. */
declare type Ts48UpdateClassDeclarationFn = (node: ts.ClassDeclaration, modifiers: readonly ModifierLike[] | undefined, name: ts.Identifier | undefined, typeParameters: readonly ts.TypeParameterDeclaration[] | undefined, heritageClauses: readonly ts.HeritageClause[] | undefined, members: readonly ts.ClassElement[]) => ts.ClassDeclaration;
/**
 * Updates a `ts.ClassDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateClassDeclaration: Ts48UpdateClassDeclarationFn;
/** Type of `ts.factory.createClassDeclaration` in TS 4.8+. */
declare type Ts48CreateClassDeclarationFn = (modifiers: readonly ModifierLike[] | undefined, name: ts.Identifier | undefined, typeParameters: readonly ts.TypeParameterDeclaration[] | undefined, heritageClauses: readonly ts.HeritageClause[] | undefined, members: readonly ts.ClassElement[]) => ts.ClassDeclaration;
/**
 * Creates a `ts.ClassDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const createClassDeclaration: Ts48CreateClassDeclarationFn;
/** Type of `ts.factory.updateMethodDeclaration` in TS 4.8+. */
declare type Ts48UpdateMethodDeclarationFn = (node: ts.MethodDeclaration, modifiers: readonly ModifierLike[] | undefined, asteriskToken: ts.AsteriskToken | undefined, name: ts.PropertyName, questionToken: ts.QuestionToken | undefined, typeParameters: readonly ts.TypeParameterDeclaration[] | undefined, parameters: readonly ts.ParameterDeclaration[], type: ts.TypeNode | undefined, body: ts.Block | undefined) => ts.MethodDeclaration;
/**
 * Updates a `ts.MethodDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateMethodDeclaration: Ts48UpdateMethodDeclarationFn;
/** Type of `ts.factory.createMethodDeclaration` in TS 4.8+. */
declare type Ts48CreateMethodDeclarationFn = (modifiers: readonly ModifierLike[] | undefined, asteriskToken: ts.AsteriskToken | undefined, name: ts.PropertyName, questionToken: ts.QuestionToken | undefined, typeParameters: readonly ts.TypeParameterDeclaration[] | undefined, parameters: readonly ts.ParameterDeclaration[], type: ts.TypeNode | undefined, body: ts.Block | undefined) => ts.MethodDeclaration;
/**
 * Creates a `ts.MethodDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const createMethodDeclaration: Ts48CreateMethodDeclarationFn;
/** Type of `ts.factory.updatePropertyDeclaration` in TS 4.8+. */
declare type Ts48UpdatePropertyDeclarationFn = (node: ts.PropertyDeclaration, modifiers: readonly ModifierLike[] | undefined, name: string | ts.PropertyName, questionOrExclamationToken: ts.QuestionToken | ts.ExclamationToken | undefined, type: ts.TypeNode | undefined, initializer: ts.Expression | undefined) => ts.PropertyDeclaration;
/**
 * Updates a `ts.PropertyDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updatePropertyDeclaration: Ts48UpdatePropertyDeclarationFn;
/** Type of `ts.factory.createPropertyDeclaration` in TS 4.8+. */
declare type Ts48CreatePropertyDeclarationFn = (modifiers: readonly ModifierLike[] | undefined, name: string | ts.PropertyName, questionOrExclamationToken: ts.QuestionToken | ts.ExclamationToken | undefined, type: ts.TypeNode | undefined, initializer: ts.Expression | undefined) => ts.PropertyDeclaration;
/**
 * Creates a `ts.PropertyDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const createPropertyDeclaration: Ts48CreatePropertyDeclarationFn;
/** Type of `ts.factory.updateGetAccessorDeclaration` in TS 4.8+. */
declare type Ts48UpdateGetAccessorDeclarationFn = (node: ts.GetAccessorDeclaration, modifiers: readonly ModifierLike[] | undefined, name: ts.PropertyName, parameters: readonly ts.ParameterDeclaration[], type: ts.TypeNode | undefined, body: ts.Block | undefined) => ts.GetAccessorDeclaration;
/**
 * Updates a `ts.GetAccessorDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateGetAccessorDeclaration: Ts48UpdateGetAccessorDeclarationFn;
/** Type of `ts.factory.createGetAccessorDeclaration` in TS 4.8+. */
declare type Ts48CreateGetAccessorDeclarationFn = (modifiers: readonly ModifierLike[] | undefined, name: ts.PropertyName, parameters: readonly ts.ParameterDeclaration[], type: ts.TypeNode | undefined, body: ts.Block | undefined) => ts.GetAccessorDeclaration;
/**
 * Creates a `ts.GetAccessorDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const createGetAccessorDeclaration: Ts48CreateGetAccessorDeclarationFn;
/** Type of `ts.factory.updateSetAccessorDeclaration` in TS 4.8+. */
declare type Ts48UpdateSetAccessorDeclarationFn = (node: ts.SetAccessorDeclaration, modifiers: readonly ModifierLike[] | undefined, name: ts.PropertyName, parameters: readonly ts.ParameterDeclaration[], body: ts.Block | undefined) => ts.SetAccessorDeclaration;
/**
 * Updates a `ts.GetAccessorDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateSetAccessorDeclaration: Ts48UpdateSetAccessorDeclarationFn;
/** Type of `ts.factory.createSetAccessorDeclaration` in TS 4.8+. */
declare type Ts48CreateSetAccessorDeclarationFn = (modifiers: readonly ModifierLike[] | undefined, name: ts.PropertyName, parameters: readonly ts.ParameterDeclaration[], body: ts.Block | undefined) => ts.SetAccessorDeclaration;
/**
 * Creates a `ts.GetAccessorDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const createSetAccessorDeclaration: Ts48CreateSetAccessorDeclarationFn;
/** Type of `ts.factory.updateConstructorDeclaration` in TS 4.8+. */
declare type Ts48UpdateConstructorDeclarationFn = (node: ts.ConstructorDeclaration, modifiers: readonly ts.Modifier[] | undefined, parameters: readonly ts.ParameterDeclaration[], body: ts.Block | undefined) => ts.ConstructorDeclaration;
/**
 * Updates a `ts.ConstructorDeclaration` declaration.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const updateConstructorDeclaration: Ts48UpdateConstructorDeclarationFn;
/**
 * Gets the decorators that have been applied to a node.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const getDecorators: (node: ts.Node) => readonly ts.Decorator[] | undefined;
/**
 * Gets the modifiers that have been set on a node.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare const getModifiers: (node: ts.Node) => readonly ts.Modifier[] | undefined;
/**
 * Combines an optional array of decorators with an optional array of modifiers into a single
 * `ts.ModifierLike` array. Used in version of TypeScript after 4.8 where the `decorators` and
 * `modifiers` arrays have been combined.
 *
 * TODO(crisbeto): this is a backwards-compatibility layer for versions of TypeScript less than 4.8.
 * We should remove it once we have dropped support for the older versions.
 */
export declare function combineModifiers(decorators: readonly ts.Decorator[] | undefined, modifiers: readonly ModifierLike[] | undefined): readonly ModifierLike[] | undefined;
export {};

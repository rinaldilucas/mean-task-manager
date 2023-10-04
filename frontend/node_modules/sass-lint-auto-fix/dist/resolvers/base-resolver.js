"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseResolver {
    constructor(ast, parser) {
        this._ast = ast;
        this._parser = parser;
    }
    get ast() {
        return this._ast;
    }
    get parser() {
        return this._parser;
    }
}
exports.default = BaseResolver;

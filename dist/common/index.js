"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomPersistenceAdapter_1 = require("./DomPersistenceAdapter");
exports.DomPersistenceAdapter = DomPersistenceAdapter_1.DomPersistenceAdapter;
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
//# sourceMappingURL=index.js.map
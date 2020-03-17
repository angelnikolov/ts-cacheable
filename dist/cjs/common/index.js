"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IStorageStrategy_1 = require("./IStorageStrategy");
exports.IStorageStrategy = IStorageStrategy_1.IStorageStrategy;
var InMemoryStorageStrategy_1 = require("./InMemoryStorageStrategy");
var IAsyncStorageStrategy_1 = require("./IAsyncStorageStrategy");
exports.IAsyncStorageStrategy = IAsyncStorageStrategy_1.IAsyncStorageStrategy;
var DOMStorageStrategy_1 = require("./DOMStorageStrategy");
exports.DOMStorageStrategy = DOMStorageStrategy_1.DOMStorageStrategy;
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.DEFAULT_HASHER = function (parameters) { return parameters.map(function (param) { return param !== undefined ? JSON.parse(JSON.stringify(param)) : param; }); };
exports.GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE',
    promiseImplementation: Promise
};
//# sourceMappingURL=index.js.map
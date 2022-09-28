"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bustCache = exports.isInstant = exports.LocalStorageStrategy = exports.DOMStorageStrategy = exports.IAsyncStorageStrategy = exports.IStorageStrategy = exports.GlobalCacheConfig = exports.DEFAULT_HASHER = exports.DEFAULT_CACHE_RESOLVER = void 0;
var IStorageStrategy_1 = require("./IStorageStrategy");
Object.defineProperty(exports, "IStorageStrategy", { enumerable: true, get: function () { return IStorageStrategy_1.IStorageStrategy; } });
var InMemoryStorageStrategy_1 = require("./InMemoryStorageStrategy");
var IAsyncStorageStrategy_1 = require("./IAsyncStorageStrategy");
Object.defineProperty(exports, "IAsyncStorageStrategy", { enumerable: true, get: function () { return IAsyncStorageStrategy_1.IAsyncStorageStrategy; } });
var DOMStorageStrategy_1 = require("./DOMStorageStrategy");
Object.defineProperty(exports, "DOMStorageStrategy", { enumerable: true, get: function () { return DOMStorageStrategy_1.DOMStorageStrategy; } });
var LocalStorageStrategy_1 = require("./LocalStorageStrategy");
Object.defineProperty(exports, "LocalStorageStrategy", { enumerable: true, get: function () { return LocalStorageStrategy_1.LocalStorageStrategy; } });
var CacheBusterFunctions_1 = require("./CacheBusterFunctions");
Object.defineProperty(exports, "isInstant", { enumerable: true, get: function () { return CacheBusterFunctions_1.isInstant; } });
Object.defineProperty(exports, "bustCache", { enumerable: true, get: function () { return CacheBusterFunctions_1.bustCache; } });
var DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.DEFAULT_CACHE_RESOLVER = DEFAULT_CACHE_RESOLVER;
var DEFAULT_HASHER = function (parameters) { return parameters.map(function (param) { return param !== undefined ? JSON.parse(JSON.stringify(param)) : param; }); };
exports.DEFAULT_HASHER = DEFAULT_HASHER;
exports.GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE',
    promiseImplementation: Promise
};
//# sourceMappingURL=index.js.map
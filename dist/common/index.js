"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryStorageStrategy_1 = require("./InMemoryStorageStrategy");
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE'
};
//# sourceMappingURL=index.js.map
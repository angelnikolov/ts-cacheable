"use strict";
exports.__esModule = true;
var IStorageStrategy_1 = require("./IStorageStrategy");
exports.IStorageStrategy = IStorageStrategy_1.IStorageStrategy;
var InMemoryStorageStrategy_1 = require("./InMemoryStorageStrategy");
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE'
};

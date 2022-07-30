import { IStorageStrategy } from './IStorageStrategy';
import { InMemoryStorageStrategy } from './InMemoryStorageStrategy';
import { IAsyncStorageStrategy } from './IAsyncStorageStrategy';
import { DOMStorageStrategy } from './DOMStorageStrategy';
import { LocalStorageStrategy } from './LocalStorageStrategy';
export var DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
export var DEFAULT_HASHER = function (parameters) { return parameters.map(function (param) { return param !== undefined ? JSON.parse(JSON.stringify(param)) : param; }); };
export var GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE',
    promiseImplementation: Promise
};
export { IStorageStrategy };
export { IAsyncStorageStrategy };
export { DOMStorageStrategy };
export { LocalStorageStrategy };
//# sourceMappingURL=index.js.map
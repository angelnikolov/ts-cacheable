import { IStorageStrategy } from './IStorageStrategy';
import { InMemoryStorageStrategy } from './InMemoryStorageStrategy';
import { IAsyncStorageStrategy } from './IAsyncStorageStrategy';
import { DOMStorageStrategy } from './DOMStorageStrategy';
import { LocalStorageStrategy } from './LocalStorageStrategy';
import { isInstant, bustCache } from './CacheBusterFunctions';
export const DEFAULT_CACHE_RESOLVER = (oldParams, newParams) => JSON.stringify(oldParams) === JSON.stringify(newParams);
export const DEFAULT_HASHER = (parameters) => parameters.map(param => param !== undefined ? JSON.parse(JSON.stringify(param)) : param);
export const GlobalCacheConfig = {
    storageStrategy: InMemoryStorageStrategy,
    globalCacheKey: 'CACHE_STORAGE',
    promiseImplementation: Promise
};
export { IStorageStrategy };
export { IAsyncStorageStrategy };
export { DOMStorageStrategy };
export { LocalStorageStrategy };
export { isInstant, bustCache };
//# sourceMappingURL=index.js.map
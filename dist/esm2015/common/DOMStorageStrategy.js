import { IStorageStrategy } from './IStorageStrategy';
import { GlobalCacheConfig } from '.';
export class DOMStorageStrategy extends IStorageStrategy {
    constructor() {
        super();
        this.masterCacheKey = GlobalCacheConfig.globalCacheKey;
        if (typeof localStorage == 'undefined') {
            throw new Error('Platform not supported.');
        }
    }
    add(cachePair, cacheKey) {
        const allCachedData = this.getRawData();
        if (!allCachedData[cacheKey]) {
            allCachedData[cacheKey] = [];
        }
        allCachedData[cacheKey].push(cachePair);
        this.storeRawData(allCachedData);
    }
    ;
    getAll(cacheKey) {
        return this.getRawData()[cacheKey] || [];
    }
    ;
    removeAtIndex(index, cacheKey) {
        const allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].splice(index, 1);
        }
        this.storeRawData(allCachedData);
    }
    updateAtIndex(index, entity, cacheKey) {
        const allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey][index]) {
            allCachedData[cacheKey][index] = entity;
        }
        this.storeRawData(allCachedData);
    }
    removeAll(cacheKey) {
        const allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].length = 0;
        }
        this.storeRawData(allCachedData);
    }
    getRawData() {
        const data = localStorage.getItem(this.masterCacheKey);
        try {
            return JSON.parse(data) || {};
        }
        catch (error) {
            throw new Error(error);
        }
    }
    storeRawData(data) {
        localStorage.setItem(this.masterCacheKey, JSON.stringify(data));
    }
}
//# sourceMappingURL=DOMStorageStrategy.js.map
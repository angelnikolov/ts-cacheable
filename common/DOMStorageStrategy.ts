import { IStorageStrategy } from './IStorageStrategy';
import { ICachePair, GlobalCacheConfig } from '.';

export class DOMStorageStrategy extends IStorageStrategy {
  private masterCacheKey: string = GlobalCacheConfig.globalCacheKey;
  constructor() {
    super();
    if (typeof localStorage == 'undefined') {
      throw new Error('Platform not supported.')
    }
  }

  add(cachePair: ICachePair<any>, cacheKey: string) {
    const allCachedData = this.getRawData();
    if (!allCachedData[cacheKey]) {
      allCachedData[cacheKey] = [];
    }
    allCachedData[cacheKey].push(cachePair);
    this.storeRawData(allCachedData);
  };

  getAll(cacheKey: string) {
    return this.getRawData()[cacheKey] || [];
  };

  removeAtIndex(index: number, cacheKey: string) {
    const allCachedData = this.getRawData();
    if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
      allCachedData[cacheKey].splice(index, 1);
    }
    this.storeRawData(allCachedData);
  }

  updateAtIndex(index: number, entity: any, cacheKey: string) {
    const allCachedData = this.getRawData();
    if (allCachedData[cacheKey] && allCachedData[cacheKey][index]) {
      allCachedData[cacheKey][index] = entity;
    }
    this.storeRawData(allCachedData);
  }

  removeAll(cacheKey: string) {
    const allCachedData = this.getRawData();
    if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
      allCachedData[cacheKey].length = 0;
    }
    this.storeRawData(allCachedData);
  }

  private getRawData(): { [key: string]: Array<ICachePair<any>> } {
    const data = localStorage.getItem(this.masterCacheKey);
    try {
      return JSON.parse(data) || {};
    } catch (error) {
      throw new Error(error);
    }
  }

  private storeRawData(data: { [key: string]: Array<ICachePair<any>> }): void {
    localStorage.setItem(this.masterCacheKey, JSON.stringify(data));
  }
}

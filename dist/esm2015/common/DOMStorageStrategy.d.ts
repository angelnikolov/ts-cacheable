import { IStorageStrategy } from './IStorageStrategy';
import { ICachePair } from '.';
/**
 * @deprecated Use {@link LocalStorageStrategy} instead.
 */
export declare class DOMStorageStrategy extends IStorageStrategy {
    private masterCacheKey;
    constructor();
    add(cachePair: ICachePair<any>, cacheKey: string): void;
    addMany(cachePairs: ICachePair<any>[], cacheKey: string): void;
    getAll(cacheKey: string): ICachePair<any>[];
    removeAtIndex(index: number, cacheKey: string): void;
    remove(index: number, entity: any, cacheKey: string): void;
    updateAtIndex(index: number, entity: any, cacheKey: string): void;
    update(index: number, entity: any, cacheKey: string): void;
    removeAll(cacheKey: string): void;
    private getRawData;
    private storeRawData;
}

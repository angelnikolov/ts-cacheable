import { Observable, Subject } from 'rxjs';
import { ICacheResolver, IShouldCacheDecider, ICacheHasher, ICachePair } from './index';
import { IStorageStrategy } from './IStorageStrategy';
import { IAsyncStorageStrategy } from './IAsyncStorageStrategy';
export interface ICacheConfig {
    /**
     * @description cache resolver which will get old and new paramaters passed to and based on those
     * will figure out if we need to bail out of cache or not
     */
    cacheResolver?: ICacheResolver;
    /**
     * @description cache hasher which will be called to hash the parameters into a cache key
     */
    cacheHasher?: ICacheHasher;
    /**
     * @description cache decider that will figure out if the response should be cached or not, based on it
     */
    shouldCacheDecider?: IShouldCacheDecider;
    /**
     * maxAge of cache in milliseconds
     * @description if time between method calls is larger - we bail out of cache
     */
    maxAge?: number;
    /**
     * whether should use a sliding expiration strategy on caches
     * this will reset the cache created property and keep the cache alive for @param maxAge milliseconds more
     */
    slidingExpiration?: boolean;
    /**
     * max cacheCount for different parameters
     * @description maximum allowed unique caches (same parameters)
     */
    maxCacheCount?: number;
    /**
     * pass an Observable upon whose emission all caches will be busted
     */
    cacheBusterObserver?: Observable<any>;
    /**
     * storage strategy
     */
    storageStrategy?: new () => IStorageStrategy | IAsyncStorageStrategy;
    /**
     * property name under which to store the cached pairs for this method
     * if not provided a combination of class name + method name will be used
     */
    cacheKey?: string;
    /**
     * Emit a callback which changes the caches and returns it.
     * Whatever is returned from the callback will be automatically stored against the chosen cacheKey in the
     * storage of the storage strategy you've chosen.
     */
    cacheModifier?: Subject<(cachePairs: ICachePair<Observable<any>>[]) => ICachePair<Observable<any>>[]>;
}

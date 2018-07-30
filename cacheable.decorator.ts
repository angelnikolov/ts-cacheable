import { Observable, of } from 'rxjs';
import { delay, finalize, shareReplay, tap } from 'rxjs/operators';

const DEFAULT_CACHE_RESOLVER = (oldParams, newParams) =>
  JSON.stringify(oldParams) === JSON.stringify(newParams);

export type ICacheRequestResolver = (
  oldParameters: Array<any>,
  newParameters: Array<any>
) => boolean;
export type IShouldCacheDecider = (response: any) => boolean;
type ICacheable = (...args) => Observable<any>;
interface ICachePair<T> {
  parameters: any;
  response: T;
  created: Date;
}
export interface ICacheConfig {
  /**
   * pass an Observable upon whose emission all caches will be busted
   */
  cacheBusterObserver?: Observable<any>;

  /**
   * @description request cache resolver which will get old and new paramaters passed to and based on those
   * will figure out if we need to bail out of cache or not
   */
  cacheResolver?: ICacheRequestResolver;
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
   * cache will be resolved asynchronously - an extra change detection pass will be made by
   * @description should cache be resolved asynchronously? - helps with declarative forms and two-way databinding via ngModel
   */
  async?: boolean;
}
export function Cacheable(_cacheConfig?: ICacheConfig) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable>
  ) {
    const _oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      const _cachePairs: Array<ICachePair<any>> = [];
      const _observableCachePairs: Array<ICachePair<Observable<any>>> = [];
      const cacheConfig = _cacheConfig ? _cacheConfig : {};
      if (cacheConfig.cacheBusterObserver) {
        /**
         * subscribe to the cacheBusterObserver and upon emission, clear all caches
         */
        cacheConfig.cacheBusterObserver.subscribe(_ => {
          _cachePairs.length = 0;
          _observableCachePairs.length = 0;
        });
      }
      cacheConfig.cacheResolver = cacheConfig.cacheResolver
        ? cacheConfig.cacheResolver
        : DEFAULT_CACHE_RESOLVER;

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function(..._parameters) {
        let parameters = JSON.parse(JSON.stringify(_parameters));
        let _foundCachePair = _cachePairs.find(cp =>
          cacheConfig.cacheResolver(cp.parameters, parameters)
        );
        const _foundObservableCachePair = _observableCachePairs.find(cp =>
          cacheConfig.cacheResolver(cp.parameters, parameters)
        );
        /**
         * check if maxAge is passed and cache has actually expired
         */
        if (cacheConfig.maxAge && _foundCachePair && _foundCachePair.created) {
          if (
            new Date().getTime() - _foundCachePair.created.getTime() >
            cacheConfig.maxAge
          ) {
            /**
             * cache duration has expired - remove it from the cachePairs array
             */
            _cachePairs.splice(_cachePairs.indexOf(_foundCachePair), 1);
            _foundCachePair = null;
          } else if (_cacheConfig.slidingExpiration) {
            /**
             * renew cache duration
             */
            _foundCachePair.created = new Date();
          }
        }

        if (_foundCachePair) {
          const cached$ = of(_foundCachePair.response);
          return cacheConfig.async ? cached$.pipe(delay(0)) : cached$;
        } else if (_foundObservableCachePair) {
          return _foundObservableCachePair.response;
        } else {
          const response$ = (_oldMethod.call(this, ...parameters) as Observable<
            any
          >).pipe(
            finalize(() => {
              /**
               * if there has been an observable cache pair for these parameters, when it completes or errors, remove it
               */
              const _observableCachePairToRemove = _observableCachePairs.find(
                cp => cacheConfig.cacheResolver(cp.parameters, parameters)
              );
              _observableCachePairs.splice(
                _observableCachePairs.indexOf(_observableCachePairToRemove),
                1
              );
            }),
            tap(response => {
              /**
               * if no maxCacheCount has been passed
               * if maxCacheCount has not been passed, just shift the cachePair to make room for the new one
               * if maxCacheCount has been passed, respect that and only shift the cachePairs if the new cachePair will make them exceed the count
               */
              if (
                !cacheConfig.shouldCacheDecider ||
                cacheConfig.shouldCacheDecider(response)
              ) {
                if (
                  !cacheConfig.maxCacheCount ||
                  cacheConfig.maxCacheCount === 1 ||
                  (cacheConfig.maxCacheCount &&
                    cacheConfig.maxCacheCount < _cachePairs.length + 1)
                ) {
                  _cachePairs.shift();
                }
                _cachePairs.push({
                  parameters,
                  response,
                  created: cacheConfig.maxAge ? new Date() : null
                });
              }
            }),
            /**
             * replay cached observable, so we don't enter finalize and tap for every cached observable subscription
             */
            shareReplay()
          );
          /**
           * cache the stream
           */
          _observableCachePairs.push({
            parameters: parameters,
            response: response$,
            created: new Date()
          });
          return response$;
        }
      };
    }
    return propertyDescriptor;
  };
}

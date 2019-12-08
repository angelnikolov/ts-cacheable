import { empty, merge, Observable, of, Subject } from 'rxjs';
import { delay, finalize, tap, publishReplay, refCount } from 'rxjs/operators';
import { DEFAULT_CACHE_RESOLVER, ICacheable, GlobalCacheConfig, IStorageStrategy, DEFAULT_HASHER } from './common';
import { IObservableCacheConfig } from './common/IObservableCacheConfig';
import { ICachePair } from './common/ICachePair';
export const globalCacheBusterNotifier = new Subject<void>();

export function Cacheable(cacheConfig: IObservableCacheConfig = {}) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>>>
  ) {
    const cacheKey = cacheConfig.cacheKey || _target.constructor.name + '#' + _propertyKey;
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      let storageStrategy: IStorageStrategy = !cacheConfig.storageStrategy
        ? new GlobalCacheConfig.storageStrategy() as IStorageStrategy
        : new cacheConfig.storageStrategy();
      const pendingCachePairs: Array<ICachePair<Observable<any>>> = [];
      /**
       * subscribe to the globalCacheBuster
       * if a custom cacheBusterObserver is passed, subscribe to it as well
       * subscribe to the cacheBusterObserver and upon emission, clear all caches
       */
      merge(
        globalCacheBusterNotifier.asObservable(),
        cacheConfig.cacheBusterObserver
          ? cacheConfig.cacheBusterObserver
          : empty()
      ).subscribe(_ => {
        storageStrategy.removeAll(cacheKey);
        pendingCachePairs.length = 0;
      });
      const cacheResolver = cacheConfig.cacheResolver || GlobalCacheConfig.cacheResolver;
      cacheConfig.cacheResolver = cacheResolver
        ? cacheResolver
        : DEFAULT_CACHE_RESOLVER;
      const cacheHasher = cacheConfig.cacheHasher || GlobalCacheConfig.cacheHasher;
      cacheConfig.cacheHasher = cacheHasher
        ? cacheHasher
        : DEFAULT_HASHER;

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function(...parameters: Array<any>) {
        const cachePairs: Array<ICachePair<Observable<any>>> = storageStrategy.getAll(cacheKey);
        let cacheParameters = cacheConfig.cacheHasher(parameters);
        let _foundCachePair = cachePairs.find(cp =>
          cacheConfig.cacheResolver(cp.parameters, cacheParameters));
        const _foundPendingCachePair = pendingCachePairs.find(cp =>
          cacheConfig.cacheResolver(cp.parameters, cacheParameters)
        );
        /**
         * check if maxAge is passed and cache has actually expired
         */
        if ((cacheConfig.maxAge || GlobalCacheConfig.maxAge) && _foundCachePair && _foundCachePair.created) {
          if (
            new Date().getTime() - new Date(_foundCachePair.created).getTime() >
            (cacheConfig.maxAge || GlobalCacheConfig.maxAge)
          ) {
            /**
             * cache duration has expired - remove it from the cachePairs array
             */
            storageStrategy.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey);
            _foundCachePair = null;
          } else if (cacheConfig.slidingExpiration || GlobalCacheConfig.slidingExpiration) {
            /**
             * renew cache duration
             */
            _foundCachePair.created = new Date();
            storageStrategy.updateAtIndex(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey);
          }
        }

        if (_foundCachePair) {
          const cached$ = of(_foundCachePair.response);
          return cacheConfig.async ? cached$.pipe(delay(0)) : cached$;
        } else if (_foundPendingCachePair) {
          return _foundPendingCachePair.response;
        } else {
          const response$ = (oldMethod.call(this, ...parameters) as Observable<
            any
          >).pipe(
            finalize(() => {
              /**
               * if there has been an observable cache pair for these parameters, when it completes or errors, remove it
               */
              const _pendingCachePairToRemove = pendingCachePairs.find(cp =>
                cacheConfig.cacheResolver(cp.parameters, cacheParameters)
              );
              pendingCachePairs.splice(
                pendingCachePairs.indexOf(_pendingCachePairToRemove),
                1
              );
            }),
            tap(response => {
              /**
               * if maxCacheCount has not been passed, just shift the cachePair to make room for the new one
               * if maxCacheCount has been passed, respect that and only shift the cachePairs if the new cachePair will make them exceed the count
               */
              if (
                !cacheConfig.shouldCacheDecider ||
                cacheConfig.shouldCacheDecider(response)
              ) {
                if (
                  !(cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) ||
                  (cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) === 1 ||
                  ((cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) &&
                    (cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) < cachePairs.length + 1)
                ) {
                  storageStrategy.removeAtIndex(0, cacheKey);
                }
                storageStrategy.add({
                  parameters: cacheParameters,
                  response,
                  created: (cacheConfig.maxAge || GlobalCacheConfig.maxAge) ? new Date() : null
                }, cacheKey);
              }
            }),
            publishReplay(1),
            refCount()
          );
          /**
           * cache the stream
           */
          pendingCachePairs.push({
            parameters: cacheParameters,
            response: response$,
            created: new Date()
          });
          return response$;
        }
      };
    }
    return propertyDescriptor;
  }
};

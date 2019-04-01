import { EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { delay, finalize, shareReplay, tap } from 'rxjs/operators';
import { DEFAULT_CACHE_RESOLVER, ICacheable } from './common';
import { IObservableCacheConfig } from './common/IObservableCacheConfig';
import { ICachePair } from './common';
export const globalCacheBusterNotifier = new Subject<void>();

export function Cacheable(cacheConfig: IObservableCacheConfig = {}) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>>>
  ) {
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      const cachePairs: Array<ICachePair<Observable<any>>> = [];
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
          : EMPTY
      ).subscribe(_ => {
          if (cacheConfig.localStorage) {
              window.localStorage.clear();
          } else {
              cachePairs.length = 0;
              pendingCachePairs.length = 0;
          }
      });

      cacheConfig.cacheResolver = cacheConfig.cacheResolver
        ? cacheConfig.cacheResolver
        : DEFAULT_CACHE_RESOLVER;

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function (..._parameters) {
        let parameters = _parameters.map(param => param !== undefined ? JSON.parse(JSON.stringify(param)) : param);
        let _foundCachePair;

        const _foundPendingCachePair = pendingCachePairs.find(cp =>
            cacheConfig.cacheResolver(cp.parameters, parameters)
        );
        if (cacheConfig.localStorage) {
              _foundCachePair = JSON.parse(window.localStorage.getItem(JSON.stringify(_parameters)));
        } else {
            _foundCachePair = cachePairs.find(cp =>
                cacheConfig.cacheResolver(cp.parameters, parameters)
            );
        }
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
              if (!cacheConfig.localStorage) {
                  cachePairs.splice(cachePairs.indexOf(_foundCachePair), 1);
                  _foundCachePair = null;
              } else {
                  window.localStorage.setItem(JSON.stringify(_parameters), null);
                  _foundCachePair = null;
              }
          } else if (cacheConfig.slidingExpiration) {
            /**
             * renew cache duration
             */
            _foundCachePair.created = new Date();
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
                cacheConfig.cacheResolver(cp.parameters, parameters)
              );
              pendingCachePairs.splice(
                pendingCachePairs.indexOf(_pendingCachePairToRemove),
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
                    cacheConfig.maxCacheCount < cachePairs.length + 1)
                ) {
                  cachePairs.shift();
                }
                if(cacheConfig.localStorage) {
                    window.localStorage.setItem(JSON.stringify(_parameters), JSON.stringify({
                        parameters,
                        response,
                        created: cacheConfig.maxAge ? new Date() : null
                    }));
                } else {
                    cachePairs.push({
                        parameters,
                        response,
                        created: cacheConfig.maxAge ? new Date() : null
                    });
                }
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
          pendingCachePairs.push({
            parameters: parameters,
            response: response$,
            created: new Date()
          });
          return response$;
        }
      };
    }
    return propertyDescriptor;
  }
}

import { empty, merge } from 'rxjs';
import { globalCacheBusterNotifier } from './cacheable.decorator';
import { DEFAULT_CACHE_RESOLVER, makeCacheableDecorator } from './common';
import { ICacheConfig } from './common/ICacheConfig';
import { ICachePair } from './common/ICachePair';

const removeCachePair = <T>(
  cachePairs: Array<ICachePair<T>>,
  parameters: any,
  cacheConfig: ICacheConfig
) => {
  /**
   * if there has been an pending cache pair for these parameters, when it completes or errors, remove it
   */
  const _pendingCachePairToRemove = cachePairs.find(cp =>
    cacheConfig.cacheResolver(cp.parameters, parameters)
  );
  cachePairs.splice(cachePairs.indexOf(_pendingCachePairToRemove), 1);
};

export const PCacheable = makeCacheableDecorator<Promise<any>>(
  (
    propertyDescriptor,
    oldMethod,
    cachePairs,
    pendingCachePairs,
    cacheConfig
  ) => {
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
      cachePairs.length = 0;
      pendingCachePairs.length = 0;
    });
    
    cacheConfig.cacheResolver = cacheConfig.cacheResolver
      ? cacheConfig.cacheResolver
      : DEFAULT_CACHE_RESOLVER;

    /* use function instead of an arrow function to keep context of invocation */
    (propertyDescriptor.value as any) = function(..._parameters) {
      let parameters = JSON.parse(JSON.stringify(_parameters));
      let _foundCachePair = cachePairs.find(cp =>
        cacheConfig.cacheResolver(cp.parameters, parameters)
      );
      const _foundPendingCachePair = pendingCachePairs.find(cp =>
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
          cachePairs.splice(cachePairs.indexOf(_foundCachePair), 1);
          _foundCachePair = null;
        } else if (cacheConfig.slidingExpiration) {
          /**
           * renew cache duration
           */
          _foundCachePair.created = new Date();
        }
      }

      if (_foundCachePair) {
        return Promise.resolve(_foundCachePair.response);
      } else if (_foundPendingCachePair) {
        return _foundPendingCachePair.response;
      } else {
        const response$ = (oldMethod.call(this, ...parameters) as Promise<any>)
          .then(response => {
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
              cachePairs.push({
                parameters,
                response,
                created: cacheConfig.maxAge ? new Date() : null
              });
            }
            removeCachePair(pendingCachePairs, parameters, cacheConfig);

            return response;
          })
          .catch(_ => {
            removeCachePair(pendingCachePairs, parameters, cacheConfig);
          });
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
);

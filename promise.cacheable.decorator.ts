import {empty, merge, Subject} from 'rxjs';
import {DEFAULT_CACHE_RESOLVER, ICacheable, GlobalCacheConfig, IStorageStrategy, DEFAULT_HASHER} from './common';
import {ICacheConfig} from './common/ICacheConfig';
import {ICachePair} from './common/ICachePair';
import {IAsyncStorageStrategy} from './common/IAsyncStorageStrategy';
export const promiseGlobalCacheBusterNotifier = new Subject<void>();


const getResponse = (oldMethod: Function, cacheKey: string, cacheConfig: ICacheConfig, context: any, cachePairs: ICachePair<any>[], parameters: any[], pendingCachePairs: ICachePair<Promise<any>>[] | {parameters: any; response: Promise<any>; created: Date;}[], storageStrategy: IStorageStrategy | IAsyncStorageStrategy, promiseImplementation: any) => {
  let cacheParameters = cacheConfig.cacheHasher(parameters);
  let _foundCachePair = cachePairs.find(cp =>
    cacheConfig.cacheResolver(cp.parameters, cacheParameters)
  );
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
    return promiseImplementation.resolve(_foundCachePair.response);
  } else if (_foundPendingCachePair) {
    return _foundPendingCachePair.response;
  } else {
    const response$ = (oldMethod.call(context, ...parameters) as Promise<any>)
      .then(response => {
        removeCachePair(pendingCachePairs, parameters, cacheConfig);
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

        return response;
      })
      .catch(error => {
        removeCachePair(pendingCachePairs, parameters, cacheConfig);
        return promiseImplementation.reject(error);
      });
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
}

const removeCachePair = <T>(
  cachePairs: Array<ICachePair<T>>,
  parameters: any,
  cacheConfig: ICacheConfig
) => {
  const cacheParameters = cacheConfig.cacheHasher(parameters);
  /**
   * if there has been an pending cache pair for these parameters, when it completes or errors, remove it
   */
  const _pendingCachePairToRemove = cachePairs.find(cp =>
    cacheConfig.cacheResolver(cp.parameters, cacheParameters)
  );
  cachePairs.splice(cachePairs.indexOf(_pendingCachePairToRemove), 1);
};

export function PCacheable(cacheConfig: ICacheConfig = {}) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Promise<any>>>
  ) {
    const cacheKey = cacheConfig.cacheKey || _target.constructor.name + '#' + _propertyKey;
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      let storageStrategy: IStorageStrategy | IAsyncStorageStrategy = !cacheConfig.storageStrategy
        ? new GlobalCacheConfig.storageStrategy()
        : new cacheConfig.storageStrategy();
      const pendingCachePairs: Array<ICachePair<Promise<any>>> = [];
      /**
       * subscribe to the promiseGlobalCacheBusterNotifier
       * if a custom cacheBusterObserver is passed, subscribe to it as well
       * subscribe to the cacheBusterObserver and upon emission, clear all caches
       */
      merge(
        promiseGlobalCacheBusterNotifier.asObservable(),
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
        const promiseImplementation = typeof GlobalCacheConfig.promiseImplementation === 'function' && (GlobalCacheConfig.promiseImplementation !== Promise) ?
          (GlobalCacheConfig.promiseImplementation as () => PromiseConstructorLike).call(this)
          : GlobalCacheConfig.promiseImplementation as PromiseConstructorLike;
        let cachePairs = storageStrategy.getAll(cacheKey);
        if (!(cachePairs instanceof promiseImplementation)) {
          cachePairs = promiseImplementation.resolve(cachePairs);
        }
        return (cachePairs as Promise<ICachePair<any>[]>).then(cachePairs => getResponse(oldMethod, cacheKey, cacheConfig, this, cachePairs, parameters, pendingCachePairs, storageStrategy, promiseImplementation))
      };
    }

    return propertyDescriptor;
  };
};
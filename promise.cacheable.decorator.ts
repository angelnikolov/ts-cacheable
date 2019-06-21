import { empty, merge, Subject } from 'rxjs';
import { DEFAULT_CACHE_RESOLVER, ICacheable, GlobalCacheConfig, IStorageStrategy } from './common';
import { ICacheConfig } from './common/ICacheConfig';
import { ICachePair } from './common/ICachePair';
import { IAsyncStorageStrategy } from './common/IAsyncStorageStrategy';
export const promiseGlobalCacheBusterNotifier = new Subject<void>();


const getResponse = (oldMethod: Function, cacheKey: string, cacheConfig: ICacheConfig, context: any, cachePairs: ICachePair<any>[], _parameters: any[], pendingCachePairs: ICachePair<Promise<any>>[] | { parameters: any; response: Promise<any>; created: Date; }[], storageStrategy: IStorageStrategy | IAsyncStorageStrategy, promiseImplementation: any) => {
  let parameters = _parameters.map(param => param !== undefined ? JSON.parse(JSON.stringify(param)) : param);
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
      new Date().getTime() - new Date(_foundCachePair.created).getTime() >
      cacheConfig.maxAge
    ) {
      /**
       * cache duration has expired - remove it from the cachePairs array
       */
      storageStrategy.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey);
      _foundCachePair = null;
    } else if (cacheConfig.slidingExpiration) {
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
            !cacheConfig.maxCacheCount ||
            cacheConfig.maxCacheCount === 1 ||
            (cacheConfig.maxCacheCount &&
              cacheConfig.maxCacheCount < cachePairs.length + 1)
          ) {
            storageStrategy.removeAtIndex(0, cacheKey);
          }
          storageStrategy.add({
            parameters,
            response,
            created: cacheConfig.maxAge ? new Date() : null
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
      parameters: parameters,
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
  /**
   * if there has been an pending cache pair for these parameters, when it completes or errors, remove it
   */
  const _pendingCachePairToRemove = cachePairs.find(cp =>
    cacheConfig.cacheResolver(cp.parameters, parameters)
  );
  cachePairs.splice(cachePairs.indexOf(_pendingCachePairToRemove), 1);
};

export function PCacheable(cacheConfig: ICacheConfig = {}) {
  return function (
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

      cacheConfig.cacheResolver = cacheConfig.cacheResolver
        ? cacheConfig.cacheResolver
        : DEFAULT_CACHE_RESOLVER;

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function (..._parameters: Array<any>) {
        const promiseImplementation = typeof GlobalCacheConfig.promiseImplementation === 'function' && (GlobalCacheConfig.promiseImplementation !== Promise) ?
          (GlobalCacheConfig.promiseImplementation as () => PromiseConstructorLike).call(this)
          : GlobalCacheConfig.promiseImplementation as PromiseConstructorLike;
        let cachePairs = storageStrategy.getAll(cacheKey);
        if (!(cachePairs instanceof promiseImplementation)) {
          return getResponse(oldMethod, cacheKey, cacheConfig, this, cachePairs as ICachePair<any>[], _parameters, pendingCachePairs, storageStrategy, promiseImplementation)
        } else {
          return (cachePairs as Promise<ICachePair<any>[]>).then(cachePairs => getResponse(oldMethod, cacheKey, cacheConfig, this, cachePairs, _parameters, pendingCachePairs, storageStrategy, promiseImplementation))
        }
      };
    }

    return propertyDescriptor;
  };
};
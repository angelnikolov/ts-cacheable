import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { delay, tap } from 'rxjs/operators';

const DEFAULT_CACHE_RESOLVER = (oldParams:Array<any>, newParams:Array<any>) =>
  JSON.stringify(oldParams) === JSON.stringify(newParams);

export type ICacheRequestResolver = (
  oldParameters: Array<any>,
  newParameters: Array<any>
) => boolean;
export type IShouldCacheDecider = (response: any) => boolean;
export type ICacheable = (...args:Array<any>) => Observable<any>;
interface ICachePair {
  parameters: any;
  response: any;
  created: Date;
}
export interface ICacheConfig {
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
export const Cacheable: ((
  cacheConfig?: ICacheConfig
) => (
  target: Object,
  propertyKey: string,
  propertyDescriptor: TypedPropertyDescriptor<ICacheable>
) => TypedPropertyDescriptor<ICacheable>) = _cacheConfig => {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable>
  ) {
    const _oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      const _cachePairs: Array<ICachePair> = [];
      const cacheConfig = _cacheConfig ? _cacheConfig : {};
      cacheConfig.cacheResolver = cacheConfig.cacheResolver
        ? cacheConfig.cacheResolver
        : DEFAULT_CACHE_RESOLVER;

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function(...parameters:Array<any>) {
        let _foundCachePair = _cachePairs.find(cp =>
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
            _cachePairs.splice(_cachePairs.indexOf(_foundCachePair, 1));
            _foundCachePair = null;
          } else if (_cacheConfig.slidingExpiration) {
            _foundCachePair.created = new Date();
          }
        }

        if (_foundCachePair) {
          const cached$ = of(_foundCachePair.response);
          return cacheConfig.async ? cached$.pipe(delay(0)) : cached$;
        } else {
          return (_oldMethod.call(this, ...parameters) as Observable<any>).pipe(
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
            })
          );
        }
      };
    }
    return propertyDescriptor;
  };
};

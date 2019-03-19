import { ICacheBusterConfig } from './ICacheBusterConfig';
import { ICacheConfig } from './ICacheConfig';
import { ICachePair } from './ICachePair';

export const DEFAULT_CACHE_RESOLVER = (oldParams, newParams) =>
  JSON.stringify(oldParams) === JSON.stringify(newParams);

export type ICacheRequestResolver = (
  oldParameters: Array<any>,
  newParameters: Array<any>
) => boolean;

export type IShouldCacheDecider = (response: any) => boolean;

export type ICacheable<T> = (...args) => T;

export const makeCacheableDecorator = <T, K extends ICacheConfig = ICacheConfig>(
  decorate: (
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>,
    oldMethod: ICacheable<T>,
    cachePairs: Array<ICachePair<any>>,
    pendingCachePairs: Array<ICachePair<T>>,
    cacheConfig: K
  ) => void
) => {
  return function Cacheable(cacheConfig?: K) {
    return function(
      _target: Object,
      _propertyKey: string,
      propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>
    ) {
      const oldMethod = propertyDescriptor.value;
      if (propertyDescriptor && propertyDescriptor.value) {
        const cachePairs: Array<ICachePair<any>> = [];
        const pendingCachePairs: Array<ICachePair<T>> = [];
        decorate(
          propertyDescriptor,
          oldMethod,
          cachePairs,
          pendingCachePairs,
          cacheConfig ? cacheConfig : ({} as K)
        );
      }
      return propertyDescriptor;
    };
  };
};

export const makeCacheBusterDecorator = <T>(
  decorate: (
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>,
    oldMethod: ICacheable<T>,
    cacheBusterConfig: ICacheBusterConfig
  ) => void
) => {
  return function CacheBuster(cacheBusterConfig?: ICacheBusterConfig) {
    return function(
      _target: Object,
      _propertyKey: string,
      propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>
    ) {
      const oldMethod = propertyDescriptor.value;
      if (propertyDescriptor && propertyDescriptor.value) {
          decorate(propertyDescriptor, oldMethod, cacheBusterConfig)
      }
      return propertyDescriptor;
    };
  };
};

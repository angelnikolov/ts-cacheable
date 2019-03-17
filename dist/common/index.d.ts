import { ICacheBusterConfig } from './ICacheBusterConfig';
import { ICacheConfig } from './ICacheConfig';
import { ICachePair } from './ICachePair';
export declare const DEFAULT_CACHE_RESOLVER: (oldParams: any, newParams: any) => boolean;
export declare type ICacheRequestResolver = (oldParameters: Array<any>, newParameters: Array<any>) => boolean;
export declare type IShouldCacheDecider = (response: any) => boolean;
export declare type ICacheable<T> = (...args) => T;
export declare const makeCacheableDecorator: <T>(decorate: (propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>, oldMethod: ICacheable<T>, cachePairs: ICachePair<any>[], pendingCachePairs: ICachePair<T>[], cacheConfig: ICacheConfig) => void) => (cacheConfig?: ICacheConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>) => TypedPropertyDescriptor<ICacheable<T>>;
export declare const makeCacheBusterDecorator: <T>(decorate: (propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>, oldMethod: ICacheable<T>, cacheBusterConfig: ICacheBusterConfig) => void) => (cacheBusterConfig?: ICacheBusterConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<T>>) => TypedPropertyDescriptor<ICacheable<T>>;

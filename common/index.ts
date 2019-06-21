import { ICacheBusterConfig } from './ICacheBusterConfig';
import { ICacheConfig } from './ICacheConfig';
import { ICachePair } from './ICachePair';
import { IStorageStrategy } from './IStorageStrategy';
import { InMemoryStorageStrategy } from './InMemoryStorageStrategy';
import { IAsyncStorageStrategy } from './IAsyncStorageStrategy';

export const DEFAULT_CACHE_RESOLVER = (oldParams: Array<any>, newParams: Array<any>) =>
  JSON.stringify(oldParams) === JSON.stringify(newParams);

export type ICacheRequestResolver = (
  oldParameters: Array<any>,
  newParameters: Array<any>
) => boolean;

export type IShouldCacheDecider = (response: any) => boolean;

export type ICacheable<T> = (...args: Array<any>) => T;

export { ICacheBusterConfig, ICacheConfig, ICachePair };

export const GlobalCacheConfig: {
  storageStrategy: new () => IStorageStrategy | IAsyncStorageStrategy,
  globalCacheKey: string,
  promiseImplementation: (() => PromiseConstructorLike) | PromiseConstructorLike;
} = {
  storageStrategy: InMemoryStorageStrategy,
  globalCacheKey: 'CACHE_STORAGE',
  promiseImplementation: Promise
}

export { IStorageStrategy };
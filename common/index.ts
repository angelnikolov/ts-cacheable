import { ICacheBusterConfig } from './ICacheBusterConfig';
import { ICacheConfig } from './ICacheConfig';
import { ICachePair } from './ICachePair';
import { IStorageStrategy } from './IStorageStrategy';
import { InMemoryStorageStrategy } from './InMemoryStorageStrategy';
import { IAsyncStorageStrategy } from './IAsyncStorageStrategy';
import { DOMStorageStrategy } from './DOMStorageStrategy';

export const DEFAULT_CACHE_RESOLVER = (oldParams: any, newParams: any) =>
  JSON.stringify(oldParams) === JSON.stringify(newParams);

export const DEFAULT_HASHER = (parameters: Array<any>) => parameters.map(param => param !== undefined ? JSON.parse(JSON.stringify(param)) : param);

export type ICacheResolver = (
  oldParameters: any,
  newParameters: any
) => boolean;

export type ICacheHasher = (
  parameters: Array<any>
) => any;

export type IShouldCacheDecider = (response: any) => boolean;

export type ICacheable<T> = (...args: Array<any>) => T;

export { ICacheBusterConfig, ICacheConfig, ICachePair };

export const GlobalCacheConfig: {
  maxAge?: number;
  slidingExpiration?: boolean;
  maxCacheCount?: number;
  cacheResolver?: ICacheResolver;
  cacheHasher?: ICacheHasher;
  storageStrategy: new () => IStorageStrategy | IAsyncStorageStrategy;
  globalCacheKey: string;
  promiseImplementation: (() => PromiseConstructorLike) | PromiseConstructorLike;
} = {
  storageStrategy: InMemoryStorageStrategy,
  globalCacheKey: 'CACHE_STORAGE',
  promiseImplementation: Promise
}

export { IStorageStrategy };
export { IAsyncStorageStrategy };
export { DOMStorageStrategy };

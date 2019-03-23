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

export { ICacheBusterConfig, ICacheConfig, ICachePair };
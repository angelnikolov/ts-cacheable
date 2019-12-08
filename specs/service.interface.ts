import { Cat } from './cat';
export interface IService<T> {
  mockServiceCall(parameter: any): T;
  mockSaveServiceCall(): T;
  mockServiceCallWithMultipleParameters(parameter1: any, parameter2: any): T;
  getData(parameter: string): T;
  getDataWithParamsObj(parameter: any): T;
  getDataAndReturnCachedStream(parameter: string): T;
  getDataWithExpiration(parameter: string): T;
  getDataWithSlidingExpiration(parameter: string): T;
  getDataWithMaxCacheCount(parameter: string): T;
  getDataWithMaxCacheCountAndExpiration(parameter: string): T;
  getDataWithMaxCacheCountAndSlidingExpiration(parameter: string): T;
  getDataWithCustomCacheResolver(
    parameter: string,
    _cacheRerouterParameter?: { straightToLastCache: boolean }
  ): T;
  getDataWithCustomCacheResolverAndHasher(
    parameter: number
  ): T;
  getWithAComplexType(
    parameter: Cat
  ): T;
  getDataWithCustomCacheDecider(parameter: string): T;
  saveDataAndCacheBust(): T;
  getDataWithCacheBusting(parameter: string): T;
  getDataWithUndefinedParameter(parameter?: string): T;
  getDataWithMultipleUndefinedParameters(parameter: string, parameter1: string): T;
  getDateWithCustomStorageStrategyProvided(parameter: string): T;
  getDataAsync?(parameter: string): T;
  getData1?(parameter: string): T;
  getData2?(parameter: string): T;
  getData3?(parameter: string): T;
}
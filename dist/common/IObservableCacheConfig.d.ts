import { ICacheConfig } from './ICacheConfig';
import { IStorageStrategy } from '.';
export interface IObservableCacheConfig extends ICacheConfig {
    /**
     * cache will be resolved asynchronously - an extra change detection pass will be made by
     * @description should cache be resolved asynchronously? - helps with declarative forms and two-way databinding via ngModel
     */
    async?: boolean;
    /**
     * storage strategy
     */
    storageStrategy?: new () => IStorageStrategy;
}

import { Subject } from 'rxjs';
export interface ICacheBusterConfig {
    /**
     * pass a Subject which will emit whenever the inner source stream has emitted
     * this can later be subscribed to from Cacheables so they can get rid of their caches
     */
    cacheBusterNotifier?: Subject<void>;
}
/**
 * flag that indicates whether cache should be cleared before decorated method has been called.
 * False by default, i.e. cache is cleared after observable from decorated method emits
 */
export declare type ICacheBusterConfigInstant = ICacheBusterConfig & {
    isInstant: true;
};
export declare type DecoratorFactoryType<T> = (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>;
export declare type ICacheBusterConfigOrConfigWithInstant = ICacheBusterConfig | ICacheBusterConfigInstant;
export declare type DecoratorFactoryTypeOfAnyOrKReturnType<TConfig extends ICacheBusterConfigOrConfigWithInstant, KReturnType> = TConfig extends ICacheBusterConfigInstant ? DecoratorFactoryType<any> : DecoratorFactoryType<KReturnType>;

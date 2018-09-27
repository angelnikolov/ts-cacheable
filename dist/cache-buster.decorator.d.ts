import { Observable, Subject } from 'rxjs';
declare type ICacheable = (...args: any[]) => Observable<any>;
export interface ICacheBusterConfig {
    /**
     * pass a Subject which will emit whenever the inner source stream has emitted
     * this can later be subscribed to from Cacheables so they can get rid of their caches
     */
    cacheBusterNotifier?: Subject<any>;
}
export declare function CacheBuster(_cacheBusterConfig?: ICacheBusterConfig): (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable>) => TypedPropertyDescriptor<ICacheable>;
export {};

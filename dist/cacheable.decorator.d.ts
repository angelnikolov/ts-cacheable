import { Observable, Subject } from 'rxjs';
import { IObservableCacheConfig } from './common/IObservableCacheConfig';
export declare const globalCacheBusterNotifier: Subject<void>;
export declare const Cacheable: (cacheConfig?: IObservableCacheConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<any>>) => TypedPropertyDescriptor<(...args: any[]) => Observable<any>>;

import { Observable, Subject } from 'rxjs';
import { ICacheConfig } from './common/ICacheConfig';
export declare const globalCacheBusterNotifier: Subject<void>;
export declare const Cacheable: (cacheConfig?: ICacheConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<any>>) => TypedPropertyDescriptor<(...args: any[]) => Observable<any>>;

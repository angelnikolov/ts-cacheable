import { Observable, Subject } from 'rxjs';
import { ICacheable } from './common';
import { IObservableCacheConfig } from './common/IObservableCacheConfig';
export declare const globalCacheBusterNotifier: Subject<void>;
export declare function Cacheable(cacheConfig?: IObservableCacheConfig): (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>>>) => TypedPropertyDescriptor<ICacheable<Observable<any>>>;

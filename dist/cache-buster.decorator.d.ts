import { Observable } from 'rxjs';
import { ICacheBusterConfig } from './common/ICacheBusterConfig';
export declare const CacheBuster: (cacheBusterConfig?: ICacheBusterConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Observable<any>>) => TypedPropertyDescriptor<(...args: any[]) => Observable<any>>;

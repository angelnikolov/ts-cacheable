import { ICacheBusterConfig } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
import { Observable } from 'rxjs';
export declare function CacheBuster(cacheBusterConfig?: ICacheBusterConfig): (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>>>) => TypedPropertyDescriptor<ICacheable<Observable<any>>>;

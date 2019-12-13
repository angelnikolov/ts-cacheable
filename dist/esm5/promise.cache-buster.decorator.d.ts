import { ICacheBusterConfig } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
export declare function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig): (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<Promise<any>>>) => TypedPropertyDescriptor<ICacheable<Promise<any>>>;

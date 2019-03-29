import { ICacheable } from './common';
import { ICacheConfig } from './common/ICacheConfig';
export declare function PCacheable(cacheConfig?: ICacheConfig): (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<ICacheable<Promise<any>>>) => TypedPropertyDescriptor<ICacheable<Promise<any>>>;

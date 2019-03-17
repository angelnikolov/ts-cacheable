import { ICacheConfig } from './common/ICacheConfig';
export declare const PCacheable: (cacheConfig?: ICacheConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;

import { ICacheBusterConfig } from './common/ICacheBusterConfig';
export declare const PCacheBuster: (cacheBusterConfig?: ICacheBusterConfig) => (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;

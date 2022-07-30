import { DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
export declare function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Promise<any>>>;
export declare function PCacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>;

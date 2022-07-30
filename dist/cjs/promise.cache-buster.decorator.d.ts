import { DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
export declare function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Promise<any>>>;
export declare function PCacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>;
export declare const NO_PROMISE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return Promise. \n  If you don't want to change the method signature, set isInstant flag to true.\n";

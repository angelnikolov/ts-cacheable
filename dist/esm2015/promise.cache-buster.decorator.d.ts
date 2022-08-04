import { DecoratorFactoryTypeOfAnyOrKReturnType, ICacheBusterConfigOrConfigWithInstant } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
export declare function PCacheBuster<T extends ICacheBusterConfigOrConfigWithInstant>(cacheBusterConfig?: T): DecoratorFactoryTypeOfAnyOrKReturnType<T, ICacheable<Promise<any>>>;
export declare const NO_PROMISE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return Promise. \n  If you don't want to change the method signature, set isInstant flag to true.\n";

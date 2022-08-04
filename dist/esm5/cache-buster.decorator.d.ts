import { DecoratorFactoryTypeOfAnyOrKReturnType, ICacheBusterConfigOrConfigWithInstant } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
import { Observable } from 'rxjs';
export declare function CacheBuster<T extends ICacheBusterConfigOrConfigWithInstant>(cacheBusterConfig?: T): DecoratorFactoryTypeOfAnyOrKReturnType<T, ICacheable<Observable<any>>>;
export declare const NO_OBSERVABLE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return observable. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
export declare function throwErrorIfResultIsNotObservable(decoratedMethodResult: any): asserts decoratedMethodResult is Observable<any>;

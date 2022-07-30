import { DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
import { Observable } from 'rxjs';
export declare function CacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Observable<any>>>;
export declare function CacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>;
export declare const NO_OBSERVABLE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return observable. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
export declare function throwErrorIfResultIsNotObservable(decoratedMethodResult: any): asserts decoratedMethodResult is Observable<any>;

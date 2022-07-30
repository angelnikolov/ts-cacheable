import {DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant} from './common/ICacheBusterConfig';
import {ICacheable} from './common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export function CacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Observable<any>>>
export function CacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>
export function CacheBuster(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): DecoratorFactoryType<ICacheable<Observable<any>>> | DecoratorFactoryType<any> {
  return function (
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>> | any>
  ) {
    const decoratedMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      /* use function instead of an arrow function to keep context of invocation */
      propertyDescriptor.value = function (...parameters: Array<any>) {
        if(isInstant(cacheBusterConfig)) {
          bustCache(cacheBusterConfig);
          return decoratedMethod.call(this, ...parameters);
        }

        const decoratedMethodResult = decoratedMethod.call(this, ...parameters);

        throwErrorIfResultIsNotObservable(decoratedMethodResult);

        return decoratedMethodResult.pipe(
            tap(() => {
              bustCache(cacheBusterConfig);
            })
        );
      };
    };
    return propertyDescriptor;
  };
};

export const NO_OBSERVABLE_ERROR_MESSAGE = `
  Method decorated with @CacheBuster should return observable. 
  If you don't want to change the method signature, set isInstant flag to true.
`;

export function throwErrorIfResultIsNotObservable(decoratedMethodResult: any): asserts decoratedMethodResult is Observable<any> {
  if (decoratedMethodResult instanceof Observable === false) {
    throw new Error(NO_OBSERVABLE_ERROR_MESSAGE);
  }
}

function bustCache(cacheBusterConfig: ICacheBusterConfig): void {
  if (cacheBusterConfig?.cacheBusterNotifier) {
    cacheBusterConfig.cacheBusterNotifier.next();
  }
}

function isInstant(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): boolean {
  return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant
}

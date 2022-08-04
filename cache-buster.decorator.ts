import {
  DecoratorFactoryTypeOfAnyOrKReturnType,
  ICacheBusterConfigOrConfigWithInstant
} from './common/ICacheBusterConfig';
import {bustCache, ICacheable, isInstant} from './common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

export function CacheBuster<T extends ICacheBusterConfigOrConfigWithInstant>(cacheBusterConfig?: T)
  : DecoratorFactoryTypeOfAnyOrKReturnType<T, ICacheable<Observable<any>>> {
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

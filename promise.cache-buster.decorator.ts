import {
  DecoratorFactoryTypeOfAnyOrKReturnType, ICacheBusterConfigOrConfigWithInstant
} from './common/ICacheBusterConfig';
import {bustCache, ICacheable, isInstant} from './common';

export function PCacheBuster<T extends ICacheBusterConfigOrConfigWithInstant>(cacheBusterConfig?: T)
  : DecoratorFactoryTypeOfAnyOrKReturnType<T, ICacheable<Promise<any>>> {
  return function (
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Promise<any>>>
  ) {
    const decoratedMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function (...parameters: Array<any>) {
        if(isInstant(cacheBusterConfig)){
          bustCache(cacheBusterConfig);
          return decoratedMethod.call(this, ...parameters);
        }

        const decoratedMethodResult = decoratedMethod.call(this, ...parameters)

        throwErrorIfResultIsNotPromise(decoratedMethodResult);

        return decoratedMethodResult.then(
          response => {
            bustCache(cacheBusterConfig)
            return response;
          }
        );
      };
    };
    return propertyDescriptor;
  };
};

export const NO_PROMISE_ERROR_MESSAGE = `
  Method decorated with @CacheBuster should return Promise. 
  If you don't want to change the method signature, set isInstant flag to true.
`;

function throwErrorIfResultIsNotPromise(decoratedMethodResult: any): asserts decoratedMethodResult is Promise<any> {
  if (decoratedMethodResult instanceof Promise === false) {
    throw new Error(NO_PROMISE_ERROR_MESSAGE);
  }
}

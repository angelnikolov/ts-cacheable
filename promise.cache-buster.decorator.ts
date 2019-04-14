import { ICacheBusterConfig } from './common/ICacheBusterConfig';
import { ICacheable } from './common';

export function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig) {
  return function (
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Promise<any>>>
  ) {
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function (...parameters: Array<any>) {
        return (oldMethod.call(this, ...parameters) as Promise<any>).then(
          response => {
            if (cacheBusterConfig.cacheBusterNotifier) {
              cacheBusterConfig.cacheBusterNotifier.next();
            }
            return response;
          }
        );
      };
    };
    return propertyDescriptor;
  };
};
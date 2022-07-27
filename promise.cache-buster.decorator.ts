import {DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant} from './common/ICacheBusterConfig';
import { ICacheable } from './common';

export function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Promise<any>>>
export function PCacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>
export function PCacheBuster(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): DecoratorFactoryType<ICacheable<Promise<any>>> | DecoratorFactoryType<any> {
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

import {DecoratorFactoryType, ICacheBusterConfig, ICacheBusterConfigInstant} from './common/ICacheBusterConfig';
import { ICacheable } from './common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function CacheBuster(cacheBusterConfig?: ICacheBusterConfig): DecoratorFactoryType<ICacheable<Observable<any>>>
export function CacheBuster(cacheBusterConfig?: ICacheBusterConfigInstant): DecoratorFactoryType<any>
export function CacheBuster(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): DecoratorFactoryType<ICacheable<Observable<any>>> | DecoratorFactoryType<any> {
  return function (
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any> | any>>
  ) {
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      /* use function instead of an arrow function to keep context of invocation */
      propertyDescriptor.value = function (...parameters: Array<any>) {
        if('isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant) {
          cacheBusterConfig.cacheBusterNotifier.next();
          return oldMethod.call(this, ...parameters);
        } else {
          const res = oldMethod.call(this, ...parameters);

          if (res instanceof Observable === false) {
            throw new Error(`
              Method decorated with @CacheBuster should return observable. 
              If you don't want to change the method signature, set isInstant flag to true.
              `);
          }

          return res.pipe(
              tap(() => {
                if (cacheBusterConfig.cacheBusterNotifier) {
                  cacheBusterConfig.cacheBusterNotifier.next();
                }
              })
          );
        }
      };
    };
    return propertyDescriptor;
  };
};

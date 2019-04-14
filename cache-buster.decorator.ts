import { ICacheBusterConfig } from './common/ICacheBusterConfig';
import { ICacheable } from './common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export function CacheBuster(cacheBusterConfig?: ICacheBusterConfig) {
  return function (
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable<Observable<any>>>
  ) {
    const oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function (...parameters: Array<any>) {
        return (oldMethod.call(this, ...parameters) as Observable<any>).pipe(
          tap(() => {
            if (cacheBusterConfig.cacheBusterNotifier) {
              cacheBusterConfig.cacheBusterNotifier.next();
            }
          })
        );
      };
    };
    return propertyDescriptor;
  };
};
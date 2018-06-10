import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

type ICacheable = (...args) => Observable<any>;
export interface ICacheBusterConfig {
  /**
   * pass a Subject which will emit whenever the inner source stream has emitted
   * this can later be subscribed to from Cacheables so they can get rid of their caches
   */
  cacheBusterNotifier?: Subject<any>;
}
export function CacheBuster(_cacheBusterConfig?: ICacheBusterConfig) {
  return function(
    _target: Object,
    _propertyKey: string,
    propertyDescriptor: TypedPropertyDescriptor<ICacheable>
  ) {
    const _oldMethod = propertyDescriptor.value;
    if (propertyDescriptor && propertyDescriptor.value) {
      const cacheBusterConfig = _cacheBusterConfig ? _cacheBusterConfig : {};

      /* use function instead of an arrow function to keep context of invocation */
      (propertyDescriptor.value as any) = function(...parameters) {
        return (_oldMethod.call(this, ...parameters) as Observable<any>).pipe(
          tap(() => {
            if (cacheBusterConfig.cacheBusterNotifier) {
              cacheBusterConfig.cacheBusterNotifier.next();
            }
          })
        );
      };
    }
    return propertyDescriptor;
  };
}

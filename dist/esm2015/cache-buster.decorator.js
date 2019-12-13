import { tap } from 'rxjs/operators';
export function CacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        const oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function (...parameters) {
                return oldMethod.call(this, ...parameters).pipe(tap(() => {
                    if (cacheBusterConfig.cacheBusterNotifier) {
                        cacheBusterConfig.cacheBusterNotifier.next();
                    }
                }));
            };
        }
        ;
        return propertyDescriptor;
    };
}
;
//# sourceMappingURL=cache-buster.decorator.js.map
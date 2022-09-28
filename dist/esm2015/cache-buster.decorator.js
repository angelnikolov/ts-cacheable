import { bustCache, isInstant } from './common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export function CacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        const decoratedMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function (...parameters) {
                if (isInstant(cacheBusterConfig)) {
                    bustCache(cacheBusterConfig);
                    return decoratedMethod.call(this, ...parameters);
                }
                const decoratedMethodResult = decoratedMethod.call(this, ...parameters);
                throwErrorIfResultIsNotObservable(decoratedMethodResult);
                return decoratedMethodResult.pipe(tap(() => {
                    bustCache(cacheBusterConfig);
                }));
            };
        }
        ;
        return propertyDescriptor;
    };
}
;
export const NO_OBSERVABLE_ERROR_MESSAGE = `
  Method decorated with @CacheBuster should return observable. 
  If you don't want to change the method signature, set isInstant flag to true.
`;
export function throwErrorIfResultIsNotObservable(decoratedMethodResult) {
    if (decoratedMethodResult instanceof Observable === false) {
        throw new Error(NO_OBSERVABLE_ERROR_MESSAGE);
    }
}
//# sourceMappingURL=cache-buster.decorator.js.map
export function PCacheBuster(cacheBusterConfig) {
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
                throwErrorIfResultIsNotPromise(decoratedMethodResult);
                return decoratedMethodResult.then(response => {
                    bustCache(cacheBusterConfig);
                    return response;
                });
            };
        }
        ;
        return propertyDescriptor;
    };
}
;
export const NO_PROMISE_ERROR_MESSAGE = `
  Method decorated with @CacheBuster should return Promise. 
  If you don't want to change the method signature, set isInstant flag to true.
`;
function throwErrorIfResultIsNotPromise(decoratedMethodResult) {
    if (decoratedMethodResult instanceof Promise === false) {
        throw new Error(NO_PROMISE_ERROR_MESSAGE);
    }
}
function bustCache(cacheBusterConfig) {
    if (cacheBusterConfig === null || cacheBusterConfig === void 0 ? void 0 : cacheBusterConfig.cacheBusterNotifier) {
        cacheBusterConfig.cacheBusterNotifier.next();
    }
}
function isInstant(cacheBusterConfig) {
    return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant;
}
//# sourceMappingURL=promise.cache-buster.decorator.js.map
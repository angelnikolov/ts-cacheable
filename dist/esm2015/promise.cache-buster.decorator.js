export function PCacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        const oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function (...parameters) {
                return oldMethod.call(this, ...parameters).then(response => {
                    if (cacheBusterConfig.cacheBusterNotifier) {
                        cacheBusterConfig.cacheBusterNotifier.next();
                    }
                    return response;
                });
            };
        }
        ;
        return propertyDescriptor;
    };
}
;
//# sourceMappingURL=promise.cache-buster.decorator.js.map
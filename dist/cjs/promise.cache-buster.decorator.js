"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PCacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                return oldMethod.call.apply(oldMethod, [this].concat(parameters)).then(function (response) {
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
exports.PCacheBuster = PCacheBuster;
;
//# sourceMappingURL=promise.cache-buster.decorator.js.map
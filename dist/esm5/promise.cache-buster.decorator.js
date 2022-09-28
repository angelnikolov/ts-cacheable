var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { bustCache, isInstant } from './common';
export function PCacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var decoratedMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                if (isInstant(cacheBusterConfig)) {
                    bustCache(cacheBusterConfig);
                    return decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                }
                var decoratedMethodResult = decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                throwErrorIfResultIsNotPromise(decoratedMethodResult);
                return decoratedMethodResult.then(function (response) {
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
export var NO_PROMISE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return Promise. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
function throwErrorIfResultIsNotPromise(decoratedMethodResult) {
    if (decoratedMethodResult instanceof Promise === false) {
        throw new Error(NO_PROMISE_ERROR_MESSAGE);
    }
}
//# sourceMappingURL=promise.cache-buster.decorator.js.map
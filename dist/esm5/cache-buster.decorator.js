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
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
export function CacheBuster(cacheBusterConfig) {
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
                throwErrorIfResultIsNotObservable(decoratedMethodResult);
                return decoratedMethodResult.pipe(tap(function () {
                    bustCache(cacheBusterConfig);
                }));
            };
        }
        ;
        return propertyDescriptor;
    };
}
;
export var NO_OBSERVABLE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return observable. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
export function throwErrorIfResultIsNotObservable(decoratedMethodResult) {
    if (decoratedMethodResult instanceof Observable === false) {
        throw new Error(NO_OBSERVABLE_ERROR_MESSAGE);
    }
}
//# sourceMappingURL=cache-buster.decorator.js.map
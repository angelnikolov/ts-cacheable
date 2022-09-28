"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwErrorIfResultIsNotObservable = exports.NO_OBSERVABLE_ERROR_MESSAGE = exports.CacheBuster = void 0;
var common_1 = require("./common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function CacheBuster(cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var decoratedMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                if ((0, common_1.isInstant)(cacheBusterConfig)) {
                    (0, common_1.bustCache)(cacheBusterConfig);
                    return decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                }
                var decoratedMethodResult = decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                throwErrorIfResultIsNotObservable(decoratedMethodResult);
                return decoratedMethodResult.pipe((0, operators_1.tap)(function () {
                    (0, common_1.bustCache)(cacheBusterConfig);
                }));
            };
        }
        ;
        return propertyDescriptor;
    };
}
exports.CacheBuster = CacheBuster;
;
exports.NO_OBSERVABLE_ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return observable. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
function throwErrorIfResultIsNotObservable(decoratedMethodResult) {
    if (decoratedMethodResult instanceof rxjs_1.Observable === false) {
        throw new Error(exports.NO_OBSERVABLE_ERROR_MESSAGE);
    }
}
exports.throwErrorIfResultIsNotObservable = throwErrorIfResultIsNotObservable;
//# sourceMappingURL=cache-buster.decorator.js.map
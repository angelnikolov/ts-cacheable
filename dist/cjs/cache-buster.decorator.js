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
exports.throwErrorIfResultIsNotObservable = exports.ERROR_MESSAGE = exports.CacheBuster = void 0;
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
                if (isInstant(cacheBusterConfig)) {
                    bustCache(cacheBusterConfig);
                    return decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                }
                var decoratedMethodResult = decoratedMethod.call.apply(decoratedMethod, __spreadArray([this], parameters, false));
                throwErrorIfResultIsNotObservable(decoratedMethodResult);
                return decoratedMethodResult.pipe((0, operators_1.tap)(function () {
                    bustCache(cacheBusterConfig);
                }));
            };
        }
        ;
        return propertyDescriptor;
    };
}
exports.CacheBuster = CacheBuster;
;
exports.ERROR_MESSAGE = "\n  Method decorated with @CacheBuster should return observable. \n  If you don't want to change the method signature, set isInstant flag to true.\n";
function throwErrorIfResultIsNotObservable(decoratedMethodResult) {
    if (decoratedMethodResult instanceof rxjs_1.Observable === false) {
        throw new Error(exports.ERROR_MESSAGE);
    }
}
exports.throwErrorIfResultIsNotObservable = throwErrorIfResultIsNotObservable;
function bustCache(cacheBusterConfig) {
    if (cacheBusterConfig === null || cacheBusterConfig === void 0 ? void 0 : cacheBusterConfig.cacheBusterNotifier) {
        cacheBusterConfig.cacheBusterNotifier.next();
    }
}
function isInstant(cacheBusterConfig) {
    return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant;
}
//# sourceMappingURL=cache-buster.decorator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
function CacheBuster(_cacheBusterConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var _oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var cacheBusterConfig_1 = _cacheBusterConfig ? _cacheBusterConfig : {};
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                return _oldMethod.call.apply(_oldMethod, [this].concat(parameters)).pipe(operators_1.tap(function () {
                    if (cacheBusterConfig_1.cacheBusterNotifier) {
                        cacheBusterConfig_1.cacheBusterNotifier.next();
                    }
                }));
            };
        }
        return propertyDescriptor;
    };
}
exports.CacheBuster = CacheBuster;
//# sourceMappingURL=cache-buster.decorator.js.map
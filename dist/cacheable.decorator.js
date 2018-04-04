"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var of_1 = require("rxjs/observable/of");
var operators_1 = require("rxjs/operators");
var DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.Cacheable = function (_cacheConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var _oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var _cachePairs_1 = [];
            var cacheConfig_1 = _cacheConfig ? _cacheConfig : {};
            cacheConfig_1.cacheResolver = cacheConfig_1.cacheResolver
                ? cacheConfig_1.cacheResolver
                : DEFAULT_CACHE_RESOLVER;
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                var _foundCachePair = _cachePairs_1.find(function (cp) {
                    return cacheConfig_1.cacheResolver(cp.parameters, parameters);
                });
                /**
                 * check if maxAge is passed and cache has actually expired
                 */
                if (cacheConfig_1.maxAge && _foundCachePair && _foundCachePair.created) {
                    if (new Date().getTime() - _foundCachePair.created.getTime() >
                        cacheConfig_1.maxAge) {
                        _cachePairs_1.splice(_cachePairs_1.indexOf(_foundCachePair, 1));
                        _foundCachePair = null;
                    }
                    else if (_cacheConfig.slidingExpiration) {
                        _foundCachePair.created = new Date();
                    }
                }
                if (_foundCachePair) {
                    var cached$ = of_1.of(_foundCachePair.response);
                    return cacheConfig_1.async ? cached$.pipe(operators_1.delay(0)) : cached$;
                }
                else {
                    return _oldMethod.call.apply(_oldMethod, [this].concat(parameters)).pipe(operators_1.tap(function (response) {
                        /**
                         * if no maxCacheCount has been passed
                         * if maxCacheCount has not been passed, just shift the cachePair to make room for the new one
                         * if maxCacheCount has been passed, respect that and only shift the cachePairs if the new cachePair will make them exceed the count
                         */
                        if (!cacheConfig_1.shouldCacheDecider ||
                            cacheConfig_1.shouldCacheDecider(response)) {
                            if (!cacheConfig_1.maxCacheCount ||
                                cacheConfig_1.maxCacheCount === 1 ||
                                (cacheConfig_1.maxCacheCount &&
                                    cacheConfig_1.maxCacheCount < _cachePairs_1.length + 1)) {
                                _cachePairs_1.shift();
                            }
                            _cachePairs_1.push({
                                parameters: parameters,
                                response: response,
                                created: cacheConfig_1.maxAge ? new Date() : null
                            });
                        }
                    }));
                }
            };
        }
        return propertyDescriptor;
    };
};
//# sourceMappingURL=cacheable.decorator.js.map
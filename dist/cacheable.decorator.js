"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
function Cacheable(_cacheConfig) {
    return function (_target, _propertyKey, propertyDescriptor) {
        var _oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var _cachePairs_1 = [];
            var _observableCachePairs_1 = [];
            var cacheConfig_1 = _cacheConfig ? _cacheConfig : {};
            if (cacheConfig_1.cacheBusterObserver) {
                /**
                 * subscribe to the cacheBusterObserver and upon emission, clear all caches
                 */
                cacheConfig_1.cacheBusterObserver.subscribe(function (_) {
                    _cachePairs_1.length = 0;
                    _observableCachePairs_1.length = 0;
                });
            }
            cacheConfig_1.cacheResolver = cacheConfig_1.cacheResolver
                ? cacheConfig_1.cacheResolver
                : DEFAULT_CACHE_RESOLVER;
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var _parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _parameters[_i] = arguments[_i];
                }
                var parameters = JSON.parse(JSON.stringify(_parameters));
                var _foundCachePair = _cachePairs_1.find(function (cp) {
                    return cacheConfig_1.cacheResolver(cp.parameters, parameters);
                });
                var _foundObservableCachePair = _observableCachePairs_1.find(function (cp) {
                    return cacheConfig_1.cacheResolver(cp.parameters, parameters);
                });
                /**
                 * check if maxAge is passed and cache has actually expired
                 */
                if (cacheConfig_1.maxAge && _foundCachePair && _foundCachePair.created) {
                    if (new Date().getTime() - _foundCachePair.created.getTime() >
                        cacheConfig_1.maxAge) {
                        /**
                         * cache duration has expired - remove it from the cachePairs array
                         */
                        _cachePairs_1.splice(_cachePairs_1.indexOf(_foundCachePair), 1);
                        _foundCachePair = null;
                    }
                    else if (_cacheConfig.slidingExpiration) {
                        /**
                         * renew cache duration
                         */
                        _foundCachePair.created = new Date();
                    }
                }
                if (_foundCachePair) {
                    var cached$ = rxjs_1.of(_foundCachePair.response);
                    return cacheConfig_1.async ? cached$.pipe(operators_1.delay(0)) : cached$;
                }
                else if (_foundObservableCachePair) {
                    return _foundObservableCachePair.response;
                }
                else {
                    var response$ = _oldMethod.call.apply(_oldMethod, [this].concat(parameters)).pipe(operators_1.finalize(function () {
                        /**
                         * if there has been an observable cache pair for these parameters, when it completes or errors, remove it
                         */
                        var _observableCachePairToRemove = _observableCachePairs_1.find(function (cp) { return cacheConfig_1.cacheResolver(cp.parameters, parameters); });
                        _observableCachePairs_1.splice(_observableCachePairs_1.indexOf(_observableCachePairToRemove), 1);
                    }), operators_1.tap(function (response) {
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
                    }), 
                    /**
                     * replay cached observable, so we don't enter finalize and tap for every cached observable subscription
                     */
                    operators_1.shareReplay());
                    /**
                     * cache the stream
                     */
                    _observableCachePairs_1.push({
                        parameters: parameters,
                        response: response$,
                        created: new Date()
                    });
                    return response$;
                }
            };
        }
        return propertyDescriptor;
    };
}
exports.Cacheable = Cacheable;
//# sourceMappingURL=cacheable.decorator.js.map
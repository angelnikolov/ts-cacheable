"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var common_1 = require("./common");
exports.promiseGlobalCacheBusterNotifier = new rxjs_1.Subject();
var getResponse = function (oldMethod, cacheKey, cacheConfig, context, cachePairs, _parameters, pendingCachePairs, storageStrategy, promiseImplementation) {
    var parameters = _parameters.map(function (param) { return param !== undefined ? JSON.parse(JSON.stringify(param)) : param; });
    var _foundCachePair = cachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, parameters);
    });
    var _foundPendingCachePair = pendingCachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, parameters);
    });
    /**
     * check if maxAge is passed and cache has actually expired
     */
    if (cacheConfig.maxAge && _foundCachePair && _foundCachePair.created) {
        if (new Date().getTime() - new Date(_foundCachePair.created).getTime() >
            cacheConfig.maxAge) {
            /**
             * cache duration has expired - remove it from the cachePairs array
             */
            storageStrategy.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey);
            _foundCachePair = null;
        }
        else if (cacheConfig.slidingExpiration) {
            /**
             * renew cache duration
             */
            _foundCachePair.created = new Date();
            storageStrategy.updateAtIndex(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey);
        }
    }
    if (_foundCachePair) {
        return promiseImplementation.resolve(_foundCachePair.response);
    }
    else if (_foundPendingCachePair) {
        return _foundPendingCachePair.response;
    }
    else {
        var response$ = oldMethod.call.apply(oldMethod, [context].concat(parameters))
            .then(function (response) {
            removeCachePair(pendingCachePairs, parameters, cacheConfig);
            /**
             * if no maxCacheCount has been passed
             * if maxCacheCount has not been passed, just shift the cachePair to make room for the new one
             * if maxCacheCount has been passed, respect that and only shift the cachePairs if the new cachePair will make them exceed the count
             */
            if (!cacheConfig.shouldCacheDecider ||
                cacheConfig.shouldCacheDecider(response)) {
                if (!cacheConfig.maxCacheCount ||
                    cacheConfig.maxCacheCount === 1 ||
                    (cacheConfig.maxCacheCount &&
                        cacheConfig.maxCacheCount < cachePairs.length + 1)) {
                    storageStrategy.removeAtIndex(0, cacheKey);
                }
                storageStrategy.add({
                    parameters: parameters,
                    response: response,
                    created: cacheConfig.maxAge ? new Date() : null
                }, cacheKey);
            }
            return response;
        })
            .catch(function (error) {
            removeCachePair(pendingCachePairs, parameters, cacheConfig);
            return promiseImplementation.reject(error);
        });
        /**
         * cache the stream
         */
        pendingCachePairs.push({
            parameters: parameters,
            response: response$,
            created: new Date()
        });
        return response$;
    }
};
var removeCachePair = function (cachePairs, parameters, cacheConfig) {
    /**
     * if there has been an pending cache pair for these parameters, when it completes or errors, remove it
     */
    var _pendingCachePairToRemove = cachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, parameters);
    });
    cachePairs.splice(cachePairs.indexOf(_pendingCachePairToRemove), 1);
};
function PCacheable(cacheConfig) {
    if (cacheConfig === void 0) { cacheConfig = {}; }
    return function (_target, _propertyKey, propertyDescriptor) {
        var cacheKey = cacheConfig.cacheKey || _target.constructor.name + '#' + _propertyKey;
        var oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var storageStrategy_1 = !cacheConfig.storageStrategy
                ? new common_1.GlobalCacheConfig.storageStrategy()
                : new cacheConfig.storageStrategy();
            var pendingCachePairs_1 = [];
            /**
             * subscribe to the promiseGlobalCacheBusterNotifier
             * if a custom cacheBusterObserver is passed, subscribe to it as well
             * subscribe to the cacheBusterObserver and upon emission, clear all caches
             */
            rxjs_1.merge(exports.promiseGlobalCacheBusterNotifier.asObservable(), cacheConfig.cacheBusterObserver
                ? cacheConfig.cacheBusterObserver
                : rxjs_1.empty()).subscribe(function (_) {
                storageStrategy_1.removeAll(cacheKey);
                pendingCachePairs_1.length = 0;
            });
            cacheConfig.cacheResolver = cacheConfig.cacheResolver
                ? cacheConfig.cacheResolver
                : common_1.DEFAULT_CACHE_RESOLVER;
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var _this = this;
                var _parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    _parameters[_i] = arguments[_i];
                }
                var promiseImplementation = typeof common_1.GlobalCacheConfig.promiseImplementation === 'function' && (common_1.GlobalCacheConfig.promiseImplementation !== Promise) ?
                    common_1.GlobalCacheConfig.promiseImplementation.call(this)
                    : common_1.GlobalCacheConfig.promiseImplementation;
                var cachePairs = storageStrategy_1.getAll(cacheKey);
                if (!(cachePairs instanceof promiseImplementation)) {
                    return getResponse(oldMethod, cacheKey, cacheConfig, this, cachePairs, _parameters, pendingCachePairs_1, storageStrategy_1, promiseImplementation);
                }
                else {
                    return cachePairs.then(function (cachePairs) { return getResponse(oldMethod, cacheKey, cacheConfig, _this, cachePairs, _parameters, pendingCachePairs_1, storageStrategy_1, promiseImplementation); });
                }
            };
        }
        return propertyDescriptor;
    };
}
exports.PCacheable = PCacheable;
;
//# sourceMappingURL=promise.cacheable.decorator.js.map
import { empty, merge, Subject } from 'rxjs';
import { DEFAULT_CACHE_RESOLVER, GlobalCacheConfig, DEFAULT_HASHER } from './common';
export var promiseGlobalCacheBusterNotifier = new Subject();
var getResponse = function (oldMethod, cacheKey, cacheConfig, context, cachePairs, parameters, pendingCachePairs, storageStrategy, promiseImplementation) {
    var cacheParameters = cacheConfig.cacheHasher(parameters);
    var _foundCachePair = cachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
    });
    var _foundPendingCachePair = pendingCachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
    });
    /**
     * check if maxAge is passed and cache has actually expired
     */
    if ((cacheConfig.maxAge || GlobalCacheConfig.maxAge) && _foundCachePair && _foundCachePair.created) {
        if (new Date().getTime() - new Date(_foundCachePair.created).getTime() >
            (cacheConfig.maxAge || GlobalCacheConfig.maxAge)) {
            /**
             * cache duration has expired - remove it from the cachePairs array
             */
            storageStrategy.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey);
            _foundCachePair = null;
        }
        else if (cacheConfig.slidingExpiration || GlobalCacheConfig.slidingExpiration) {
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
                if (!(cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) ||
                    (cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) === 1 ||
                    ((cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) &&
                        (cacheConfig.maxCacheCount || GlobalCacheConfig.maxCacheCount) < cachePairs.length + 1)) {
                    storageStrategy.removeAtIndex(0, cacheKey);
                }
                storageStrategy.add({
                    parameters: cacheParameters,
                    response: response,
                    created: (cacheConfig.maxAge || GlobalCacheConfig.maxAge) ? new Date() : null
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
            parameters: cacheParameters,
            response: response$,
            created: new Date()
        });
        return response$;
    }
};
var removeCachePair = function (cachePairs, parameters, cacheConfig) {
    var cacheParameters = cacheConfig.cacheHasher(parameters);
    /**
     * if there has been an pending cache pair for these parameters, when it completes or errors, remove it
     */
    var _pendingCachePairToRemove = cachePairs.find(function (cp) {
        return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
    });
    cachePairs.splice(cachePairs.indexOf(_pendingCachePairToRemove), 1);
};
export function PCacheable(cacheConfig) {
    if (cacheConfig === void 0) { cacheConfig = {}; }
    return function (_target, _propertyKey, propertyDescriptor) {
        var cacheKey = cacheConfig.cacheKey || _target.constructor.name + '#' + _propertyKey;
        var oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var storageStrategy_1 = !cacheConfig.storageStrategy
                ? new GlobalCacheConfig.storageStrategy()
                : new cacheConfig.storageStrategy();
            var pendingCachePairs_1 = [];
            /**
             * subscribe to the promiseGlobalCacheBusterNotifier
             * if a custom cacheBusterObserver is passed, subscribe to it as well
             * subscribe to the cacheBusterObserver and upon emission, clear all caches
             */
            merge(promiseGlobalCacheBusterNotifier.asObservable(), cacheConfig.cacheBusterObserver
                ? cacheConfig.cacheBusterObserver
                : empty()).subscribe(function (_) {
                storageStrategy_1.removeAll(cacheKey);
                pendingCachePairs_1.length = 0;
            });
            var cacheResolver = cacheConfig.cacheResolver || GlobalCacheConfig.cacheResolver;
            cacheConfig.cacheResolver = cacheResolver
                ? cacheResolver
                : DEFAULT_CACHE_RESOLVER;
            var cacheHasher = cacheConfig.cacheHasher || GlobalCacheConfig.cacheHasher;
            cacheConfig.cacheHasher = cacheHasher
                ? cacheHasher
                : DEFAULT_HASHER;
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var _this = this;
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                var promiseImplementation = typeof GlobalCacheConfig.promiseImplementation === 'function' && (GlobalCacheConfig.promiseImplementation !== Promise) ?
                    GlobalCacheConfig.promiseImplementation.call(this)
                    : GlobalCacheConfig.promiseImplementation;
                var cachePairs = storageStrategy_1.getAll(cacheKey);
                if (!(cachePairs instanceof promiseImplementation)) {
                    cachePairs = promiseImplementation.resolve(cachePairs);
                }
                return cachePairs.then(function (cachePairs) { return getResponse(oldMethod, cacheKey, cacheConfig, _this, cachePairs, parameters, pendingCachePairs_1, storageStrategy_1, promiseImplementation); });
            };
        }
        return propertyDescriptor;
    };
}
;
//# sourceMappingURL=promise.cacheable.decorator.js.map
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
exports.Cacheable = exports.globalCacheBusterNotifier = void 0;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var common_1 = require("./common");
exports.globalCacheBusterNotifier = new rxjs_1.Subject();
function Cacheable(cacheConfig) {
    if (cacheConfig === void 0) { cacheConfig = {}; }
    return function (_target, _propertyKey, propertyDescriptor) {
        var _this = this;
        var cacheKey = cacheConfig.cacheKey || _target.constructor.name + '#' + _propertyKey;
        var oldMethod = propertyDescriptor.value;
        if (propertyDescriptor && propertyDescriptor.value) {
            var storageStrategy_1 = !cacheConfig.storageStrategy
                ? new common_1.GlobalCacheConfig.storageStrategy()
                : new cacheConfig.storageStrategy();
            var pendingCachePairs_1 = [];
            if (cacheConfig.cacheModifier) {
                cacheConfig.cacheModifier.subscribe(function (callback) { return storageStrategy_1.addMany(callback(storageStrategy_1.getAll(cacheKey, _this)), cacheKey, _this); });
            }
            /**
             * subscribe to the globalCacheBuster
             * if a custom cacheBusterObserver is passed, subscribe to it as well
             * subscribe to the cacheBusterObserver and upon emission, clear all caches
             */
            (0, rxjs_1.merge)(exports.globalCacheBusterNotifier.asObservable(), cacheConfig.cacheBusterObserver
                ? cacheConfig.cacheBusterObserver
                : (0, rxjs_1.empty)()).subscribe(function (_) {
                storageStrategy_1.removeAll(cacheKey, _this);
                pendingCachePairs_1.length = 0;
            });
            var cacheResolver = cacheConfig.cacheResolver || common_1.GlobalCacheConfig.cacheResolver;
            cacheConfig.cacheResolver = cacheResolver
                ? cacheResolver
                : common_1.DEFAULT_CACHE_RESOLVER;
            var cacheHasher = cacheConfig.cacheHasher || common_1.GlobalCacheConfig.cacheHasher;
            cacheConfig.cacheHasher = cacheHasher
                ? cacheHasher
                : common_1.DEFAULT_HASHER;
            /* use function instead of an arrow function to keep context of invocation */
            propertyDescriptor.value = function () {
                var _this = this;
                var parameters = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    parameters[_i] = arguments[_i];
                }
                var cachePairs = storageStrategy_1.getAll(cacheKey, this);
                var cacheParameters = cacheConfig.cacheHasher(parameters);
                var _foundCachePair = cachePairs.find(function (cp) {
                    return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
                });
                var _foundPendingCachePair = pendingCachePairs_1.find(function (cp) {
                    return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
                });
                /**
                 * check if maxAge is passed and cache has actually expired
                 */
                if ((cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge) && _foundCachePair && _foundCachePair.created) {
                    if (new Date().getTime() - new Date(_foundCachePair.created).getTime() >
                        (cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge)) {
                        /**
                         * cache duration has expired - remove it from the cachePairs array
                         */
                        storageStrategy_1.remove ? storageStrategy_1.remove(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, this) : storageStrategy_1.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey, this);
                        _foundCachePair = null;
                    }
                    else if (cacheConfig.slidingExpiration || common_1.GlobalCacheConfig.slidingExpiration) {
                        /**
                         * renew cache duration
                         */
                        _foundCachePair.created = new Date();
                        storageStrategy_1.update ? storageStrategy_1.update(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, this) : storageStrategy_1.updateAtIndex(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, this);
                    }
                }
                if (_foundCachePair) {
                    var cached$ = (0, rxjs_1.of)(_foundCachePair.response);
                    return cacheConfig.async ? cached$.pipe((0, operators_1.delay)(0)) : cached$;
                }
                else if (_foundPendingCachePair) {
                    return _foundPendingCachePair.response;
                }
                else {
                    var response$ = oldMethod.call.apply(oldMethod, __spreadArray([this], parameters, false)).pipe((0, operators_1.finalize)(function () {
                        /**
                         * if there has been an observable cache pair for these parameters, when it completes or errors, remove it
                         */
                        var _pendingCachePairToRemove = pendingCachePairs_1.find(function (cp) {
                            return cacheConfig.cacheResolver(cp.parameters, cacheParameters);
                        });
                        pendingCachePairs_1.splice(pendingCachePairs_1.indexOf(_pendingCachePairToRemove), 1);
                    }), (0, operators_1.tap)(function (response) {
                        /**
                         * if maxCacheCount has not been passed, just shift the cachePair to make room for the new one
                         * if maxCacheCount has been passed, respect that and only shift the cachePairs if the new cachePair will make them exceed the count
                         */
                        if (!cacheConfig.shouldCacheDecider ||
                            cacheConfig.shouldCacheDecider(response)) {
                            if (!(cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) ||
                                (cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) === 1 ||
                                ((cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) &&
                                    (cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) < cachePairs.length + 1)) {
                                storageStrategy_1.remove ? storageStrategy_1.remove(0, cachePairs[0], cacheKey, _this) : storageStrategy_1.removeAtIndex(0, cacheKey, _this);
                            }
                            storageStrategy_1.add({
                                parameters: cacheParameters,
                                response: response,
                                created: (cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge) ? new Date() : null
                            }, cacheKey, _this);
                        }
                    }), (0, operators_1.publishReplay)(1), (0, operators_1.refCount)());
                    /**
                     * cache the stream
                     */
                    pendingCachePairs_1.push({
                        parameters: cacheParameters,
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
;
//# sourceMappingURL=cacheable.decorator.js.map
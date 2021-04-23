"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var common_1 = require("./common");
exports.promiseGlobalCacheBusterNotifier = new rxjs_1.Subject();
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
    if ((cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge) && _foundCachePair && _foundCachePair.created) {
        if (new Date().getTime() - new Date(_foundCachePair.created).getTime() >
            (cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge)) {
            /**
             * cache duration has expired - remove it from the cachePairs array
             */
            storageStrategy.remove ? storageStrategy.remove(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, _this) : storageStrategy.removeAtIndex(cachePairs.indexOf(_foundCachePair), cacheKey, _this);
            _foundCachePair = null;
        }
        else if (cacheConfig.slidingExpiration || common_1.GlobalCacheConfig.slidingExpiration) {
            /**
             * renew cache duration
             */
            _foundCachePair.created = new Date();
            storageStrategy.update ? storageStrategy.update(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, _this) : storageStrategy.updateAtIndex(cachePairs.indexOf(_foundCachePair), _foundCachePair, cacheKey, _this);
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
                if (!(cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) ||
                    (cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) === 1 ||
                    ((cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) &&
                        (cacheConfig.maxCacheCount || common_1.GlobalCacheConfig.maxCacheCount) < cachePairs.length + 1)) {
                    storageStrategy.remove ? storageStrategy.remove(0, cachePairs[0], cacheKey, _this) : storageStrategy.removeAtIndex(0, cacheKey, _this);
                }
                storageStrategy.add({
                    parameters: cacheParameters,
                    response: response,
                    created: (cacheConfig.maxAge || common_1.GlobalCacheConfig.maxAge) ? new Date() : null
                }, cacheKey, _this);
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
function PCacheable(cacheConfig) {
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
                cacheConfig.cacheModifier.subscribe(function (callback) { return __awaiter(_this, void 0, void 0, function () { var _a, _b, _c; return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _b = (_a = storageStrategy_1).addMany;
                            _c = callback;
                            return [4 /*yield*/, storageStrategy_1.getAll(cacheKey, this)];
                        case 1: return [2 /*return*/, _b.apply(_a, [_c.apply(void 0, [_d.sent()]), cacheKey, this])];
                    }
                }); }); });
            }
            /**
             * subscribe to the promiseGlobalCacheBusterNotifier
             * if a custom cacheBusterObserver is passed, subscribe to it as well
             * subscribe to the cacheBusterObserver and upon emission, clear all caches
             */
            rxjs_1.merge(exports.promiseGlobalCacheBusterNotifier.asObservable(), cacheConfig.cacheBusterObserver
                ? cacheConfig.cacheBusterObserver
                : rxjs_1.empty()).subscribe(function (_) {
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
                var promiseImplementation = typeof common_1.GlobalCacheConfig.promiseImplementation === 'function' && (common_1.GlobalCacheConfig.promiseImplementation !== Promise) ?
                    common_1.GlobalCacheConfig.promiseImplementation.call(this)
                    : common_1.GlobalCacheConfig.promiseImplementation;
                var cachePairs = storageStrategy_1.getAll(cacheKey, this);
                if (!(cachePairs instanceof promiseImplementation)) {
                    cachePairs = promiseImplementation.resolve(cachePairs);
                }
                return cachePairs.then(function (cachePairs) { return getResponse(oldMethod, cacheKey, cacheConfig, _this, cachePairs, parameters, pendingCachePairs_1, storageStrategy_1, promiseImplementation); });
            };
        }
        return propertyDescriptor;
    };
}
exports.PCacheable = PCacheable;
;
//# sourceMappingURL=promise.cacheable.decorator.js.map
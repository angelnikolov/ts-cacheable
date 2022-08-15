"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomContextStrategy = void 0;
var rxjs_1 = require("rxjs");
var promise_cache_buster_decorator_1 = require("../promise.cache-buster.decorator");
var promise_cacheable_decorator_1 = require("../promise.cacheable.decorator");
var promise_cacheable_decorator_2 = require("../promise.cacheable.decorator");
var common_1 = require("../common");
var LocalStorageStrategy_1 = require("../common/LocalStorageStrategy");
var InMemoryStorageStrategy_1 = require("../common/InMemoryStorageStrategy");
var IAsyncStorageStrategy_1 = require("common/IAsyncStorageStrategy");
var cat_1 = require("./cat");
var customStrategySpy = jasmine.createSpy();
var CustomContextStrategy = /** @class */ (function (_super) {
    __extends(CustomContextStrategy, _super);
    function CustomContextStrategy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomContextStrategy.prototype.add = function (cachePair, cacheKey, ctx) {
        customStrategySpy(ctx);
        _super.prototype.add.call(this, cachePair, cacheKey, ctx);
    };
    ;
    return CustomContextStrategy;
}(InMemoryStorageStrategy_1.InMemoryStorageStrategy));
exports.CustomContextStrategy = CustomContextStrategy;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
var AsyncStorageStrategy = /** @class */ (function (_super) {
    __extends(AsyncStorageStrategy, _super);
    function AsyncStorageStrategy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachePairs = [];
        return _this;
    }
    AsyncStorageStrategy.prototype.add = function (cachePair) {
        this.cachePairs.push(cachePair);
        return Promise.resolve();
    };
    ;
    AsyncStorageStrategy.prototype.addMany = function (cachePairs) {
        this.cachePairs = cachePairs;
        return Promise.resolve();
    };
    ;
    AsyncStorageStrategy.prototype.updateAtIndex = function (index, entity) {
        var updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
        return Promise.resolve();
    };
    AsyncStorageStrategy.prototype.update = function (index, entity) {
        var updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
        return Promise.resolve();
    };
    AsyncStorageStrategy.prototype.getAll = function () {
        return Promise.resolve(this.cachePairs);
    };
    ;
    AsyncStorageStrategy.prototype.removeAtIndex = function (index) {
        this.cachePairs.splice(index, 1);
        return Promise.resolve();
    };
    AsyncStorageStrategy.prototype.remove = function (index) {
        this.cachePairs.splice(index, 1);
        return Promise.resolve();
    };
    AsyncStorageStrategy.prototype.removeAll = function () {
        this.cachePairs.length = 0;
        return Promise.resolve();
    };
    return AsyncStorageStrategy;
}(IAsyncStorageStrategy_1.IAsyncStorageStrategy));
var strategies = [null, AsyncStorageStrategy, LocalStorageStrategy_1.LocalStorageStrategy];
strategies.forEach(function (s) {
    var cacheBusterNotifier = new rxjs_1.Subject();
    if (s) {
        common_1.GlobalCacheConfig.storageStrategy = s;
    }
    describe((!s ? 'InMemoryStorageStrategy' : s.name) + ": PCacheableDecorator", function () {
        var service = null;
        var mockServiceCallSpy = null;
        var cacheModifier = new rxjs_1.Subject();
        var Service = /** @class */ (function () {
            function Service() {
            }
            Service.prototype.mockServiceCall = function (parameter) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve({ payload: parameter });
                    }, 300);
                });
            };
            Service.prototype.mockSaveServiceCall = function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve('SAVED');
                    }, 300);
                });
            };
            Service.prototype.mockServiceCallWithMultipleParameters = function (parameter1, parameter2) {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve({ payload: [parameter1, parameter2] });
                    }, 300);
                });
            };
            Service.prototype.getData = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getData1 = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getData2 = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getData3 = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithParamsObj = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataAndReturnCachedStream = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithExpiration = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithSlidingExpiration = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithMaxCacheCount = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithMaxCacheCountAndExpiration = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithMaxCacheCountAndSlidingExpiration = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithCustomCacheResolver = function (parameter, _cacheRerouterParameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithCustomCacheResolverAndHasher = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getWithAComplexType = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithCustomCacheDecider = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.saveDataAndCacheBust = function () {
                return this.mockSaveServiceCall();
            };
            Service.prototype.saveDataAndCacheBustWithInstant = function () {
                return this.mockSaveServiceCall();
            };
            Service.prototype.getDataWithCacheBusting = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithUndefinedParameter = function (parameter) {
                if (parameter === void 0) { parameter = ''; }
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithMultipleUndefinedParameters = function (parameter, parameter1) {
                if (parameter === void 0) { parameter = 'Parameter1'; }
                if (parameter1 === void 0) { parameter1 = 'Parameter2'; }
                return this.mockServiceCallWithMultipleParameters(parameter, parameter1);
            };
            Service.prototype.getDataWithCustomStorageStrategyProvided = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getMutableData = function (parameter) {
                return this.mockServiceCall(parameter);
            };
            Service.prototype.getDataWithCustomContextStorageStrategy = function (parameter) {
                if (parameter === void 0) { parameter = 'Parameter1'; }
                return this.mockServiceCall(parameter);
            };
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getData", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getData1", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getData2", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getData3", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getDataWithParamsObj", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getDataAndReturnCachedStream", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxAge: 400
                })
            ], Service.prototype, "getDataWithExpiration", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxAge: 400,
                    slidingExpiration: true
                })
            ], Service.prototype, "getDataWithSlidingExpiration", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxCacheCount: 5
                })
            ], Service.prototype, "getDataWithMaxCacheCount", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxAge: 400,
                    maxCacheCount: 5
                })
            ], Service.prototype, "getDataWithMaxCacheCountAndExpiration", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxAge: 400,
                    maxCacheCount: 5,
                    slidingExpiration: true
                })
            ], Service.prototype, "getDataWithMaxCacheCountAndSlidingExpiration", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    cacheResolver: function (_oldParameters, newParameters) {
                        return newParameters.find(function (param) { return !!param.straightToLastCache; });
                    }
                })
            ], Service.prototype, "getDataWithCustomCacheResolver", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    cacheHasher: function (_parameters) { return _parameters[0] * 2; },
                    cacheResolver: function (oldParameter, newParameter) {
                        return newParameter > 5;
                    }
                })
            ], Service.prototype, "getDataWithCustomCacheResolverAndHasher", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getWithAComplexType", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    shouldCacheDecider: function (response) {
                        return response.payload === 'test';
                    }
                })
            ], Service.prototype, "getDataWithCustomCacheDecider", null);
            __decorate([
                (0, promise_cache_buster_decorator_1.PCacheBuster)({
                    cacheBusterNotifier: cacheBusterNotifier
                })
            ], Service.prototype, "saveDataAndCacheBust", null);
            __decorate([
                (0, promise_cache_buster_decorator_1.PCacheBuster)({
                    cacheBusterNotifier: cacheBusterNotifier,
                    isInstant: true
                })
            ], Service.prototype, "saveDataAndCacheBustWithInstant", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    cacheBusterObserver: cacheBusterNotifier.asObservable()
                })
            ], Service.prototype, "getDataWithCacheBusting", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getDataWithUndefinedParameter", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)()
            ], Service.prototype, "getDataWithMultipleUndefinedParameters", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    maxAge: 400,
                    slidingExpiration: true,
                    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy
                })
            ], Service.prototype, "getDataWithCustomStorageStrategyProvided", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy,
                    cacheModifier: cacheModifier
                })
            ], Service.prototype, "getMutableData", null);
            __decorate([
                (0, promise_cacheable_decorator_1.PCacheable)({
                    storageStrategy: CustomContextStrategy
                })
            ], Service.prototype, "getDataWithCustomContextStorageStrategy", null);
            return Service;
        }());
        beforeEach(function () {
            service = new Service();
            mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();
            if (common_1.GlobalCacheConfig.storageStrategy === LocalStorageStrategy_1.LocalStorageStrategy) {
                localStorage.clear();
            }
        });
        it('return cached data up until a new parameter is passed and the cache is busted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse, cachedResponse3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getData('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getData('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        /**
                         * response acquired from cache, so no incrementation on the service spy call counter is expected here
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getData('test2')];
                    case 3:
                        _a.sent();
                        /**
                         * no cache for 'test2', but service call was made so the spy counter is incremented
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        return [4 /*yield*/, service.getData('test3')];
                    case 4:
                        cachedResponse3 = _a.sent();
                        // /**
                        //  * service call is made and waited out
                        //  */
                        expect(cachedResponse3).toEqual({ payload: 'test3' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
                        /**
                         * this should NOT return cached response, since the currently cached one should be 'test3'
                         */
                        return [4 /*yield*/, service.getData('test')];
                    case 5:
                        /**
                         * this should NOT return cached response, since the currently cached one should be 'test3'
                         */
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns promises in cache with a referential type params', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = {
                            number: [1]
                        };
                        /**
                         * call the service endpoint with current params values
                         */
                        return [4 /*yield*/, service.getDataWithParamsObj(params)];
                    case 1:
                        /**
                         * call the service endpoint with current params values
                         */
                        _a.sent();
                        /**
                         * change params object values
                         */
                        params.number.push(2);
                        /**
                         * call again..
                         */
                        return [4 /*yield*/, service.getDataWithParamsObj(params)];
                    case 2:
                        /**
                         * call again..
                         */
                        _a.sent();
                        /**
                         * service call count should still be 2, since param object has changed
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        it('return the cached observable up until it completes or errors', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < 500)) return [3 /*break*/, 4];
                        return [4 /*yield*/, service.getDataAndReturnCachedStream('test')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    /**
                                     * call again..
                                     */
                                    return [4 /*yield*/, service.getDataAndReturnCachedStream('test')];
                                    case 1:
                                        /**
                                         * call again..
                                         */
                                        _a.sent();
                                        /**
                                         * service call count should still be 1, since we are returning from cache now
                                         */
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                                        done();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached date up until the maxAge period has passed and then bail out to data source', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithExpiration('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithExpiration('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    /**
                                     * after 500ms the cache would've expired and we will bail to the data source
                                     */
                                    return [4 /*yield*/, service.getDataWithExpiration('test')];
                                    case 1:
                                        /**
                                         * after 500ms the cache would've expired and we will bail to the data source
                                         */
                                        _a.sent();
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                                        done();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data up until the maxAge period but renew the expiration if called within the period', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithSlidingExpiration('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithSlidingExpiration('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        /**
                         * call count should still be one, since we rerouted to cache, instead of service call
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service.getDataWithSlidingExpiration('test')];
                                    case 1:
                                        _a.sent();
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, service.getDataWithSlidingExpiration('test')];
                                                    case 1:
                                                        _a.sent();
                                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                                                        done();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 500);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data for 5 unique requests, then should bail to data source', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parameters, cachedResponse, cachedResponseAll, asyncData, newParameters, cachedResponseAll2, nonCachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
                        return [4 /*yield*/, Promise.all(parameters.map(function (param) { return (service.getDataWithMaxCacheCount(param)); }))
                            /**
                             * data for all endpoints should be available through cache by now
                             */
                        ];
                    case 1:
                        _a.sent();
                        /**
                         * data for all endpoints should be available through cache by now
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, service.getDataWithMaxCacheCount('test1')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test1' });
                        /** call count still 5 */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, Promise.all(parameters.map(function (param) { return service.getDataWithMaxCacheCount(param); }))];
                    case 3:
                        cachedResponseAll = _a.sent();
                        expect(cachedResponseAll).toEqual([
                            { payload: 'test1' },
                            { payload: 'test2' },
                            { payload: 'test3' },
                            { payload: 'test4' },
                            { payload: 'test5' }
                        ]);
                        /** call count still 5 */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, service.getDataWithMaxCacheCount('test6')];
                    case 4:
                        asyncData = _a.sent();
                        expect(asyncData).toEqual({ payload: 'test6' });
                        /** call count incremented by one */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                        newParameters = ['test2', 'test3', 'test4', 'test5', 'test6'];
                        return [4 /*yield*/, Promise.all(newParameters.map(function (param) { return service.getDataWithMaxCacheCount(param); }))];
                    case 5:
                        cachedResponseAll2 = _a.sent();
                        expect(cachedResponseAll2).toEqual([
                            { payload: 'test2' },
                            { payload: 'test3' },
                            { payload: 'test4' },
                            { payload: 'test5' },
                            { payload: 'test6' }
                        ]);
                        /** no service calls will be made, since we have all the responses still cached even after 1s (1000ms) */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                        return [4 /*yield*/, service.getDataWithMaxCacheCount('test7')];
                    case 6:
                        nonCachedResponse = _a.sent();
                        expect(nonCachedResponse).toEqual({ payload: 'test7' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);
                        /**
                         * since the cached response for 'test2' was now removed from cache by 'test7',
                         */
                        return [4 /*yield*/, service.getDataWithMaxCacheCount('test2')];
                    case 7:
                        /**
                         * since the cached response for 'test2' was now removed from cache by 'test7',
                         */
                        _a.sent();
                        /**
                         * test2 is not in cache anymore and a service call will be made
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data for 5 unique requests all available for 7500ms', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var parameters, cachedResponse2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
                        return [4 /*yield*/, Promise.all(parameters.map(function (param) {
                                return service.getDataWithMaxCacheCountAndExpiration(param);
                            }))];
                    case 1:
                        cachedResponse2 = _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        expect(cachedResponse2).toEqual([
                            { payload: 'test1' },
                            { payload: 'test2' },
                            { payload: 'test3' },
                            { payload: 'test4' },
                            { payload: 'test5' }
                        ]);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service.getDataWithMaxCacheCountAndExpiration('test1')];
                                    case 1:
                                        _a.sent();
                                        /**
                                         * by now, no cache exists for the 'test1' parameter, so 1 more call will be made to the service
                                         */
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                                        done();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 500);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data up until new parameters are passed WITH a custom resolver function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, asyncFreshData2, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithCustomCacheResolver('test1')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test1' });
                        expect(mockServiceCallSpy).toHaveBeenCalled();
                        return [4 /*yield*/, service.getDataWithCustomCacheResolver('test2')];
                    case 2:
                        asyncFreshData2 = _a.sent();
                        expect(asyncFreshData2).toEqual({ payload: 'test2' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        return [4 /*yield*/, service.getDataWithCustomCacheResolver('test3', {
                                straightToLastCache: true
                            })];
                    case 3:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test2' });
                        /**
                         * call count still 2, since we rerouted directly to cache
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        return [4 /*yield*/, service.getDataWithCustomCacheResolver('test3')];
                    case 4:
                        _a.sent();
                        /**no cache reerouter -> bail to service call -> increment call counter*/
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('only cache data when a specific response is returned, otherwise it should bail to service call', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncData, asyncData2, cachedData2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithCustomCacheDecider('test1')];
                    case 1:
                        asyncData = _a.sent();
                        expect(asyncData).toEqual({ payload: 'test1' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithCustomCacheDecider('test1')];
                    case 2:
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        return [4 /*yield*/, service.getDataWithCustomCacheDecider('test')];
                    case 3:
                        asyncData2 = _a.sent();
                        expect(asyncData2).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
                        return [4 /*yield*/, service.getDataWithCustomCacheDecider('test')];
                    case 4:
                        cachedData2 = _a.sent();
                        expect(cachedData2).toEqual({ payload: 'test' });
                        /**
                         * the service call count won't be incremented
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
                        return [2 /*return*/];
                }
            });
        }); });
        it('cache data until the cacheBusterNotifier has emitted', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 1:
                        asyncFreshData = _c.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 2:
                        cachedResponse = _c.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        /**
                         * response acquired from cache, so no incrementation on the service spy call counter is expected here
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        /**
                         * make the save call
                         * after 1 second the cache busting subject will emit and the cache for getDataWithCacheBusting('test') will be relieved of
                         */
                        _a = expect;
                        return [4 /*yield*/, service.saveDataAndCacheBust()];
                    case 3:
                        /**
                         * make the save call
                         * after 1 second the cache busting subject will emit and the cache for getDataWithCacheBusting('test') will be relieved of
                         */
                        _a.apply(void 0, [_c.sent()]).toEqual('SAVED');
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 4:
                        _c.sent();
                        /**
                         * call count has incremented due to the actual method call (instead of cache)
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        /**
                         * pass through 1s of time
                         */
                        /**
                         * synchronous cached response should now be returned
                         */
                        _b = expect;
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 5:
                        /**
                         * pass through 1s of time
                         */
                        /**
                         * synchronous cached response should now be returned
                         */
                        _b.apply(void 0, [_c.sent()]).toEqual({
                            payload: 'test'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        xit('cache data until the cacheBusterNotifier has emitted { isInstant: true }', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse, promise, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 1:
                        asyncFreshData = _c.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 2:
                        cachedResponse = _c.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        /**
                         * response acquired from cache, so no incrementation on the service spy call counter is expected here
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        promise = service.saveDataAndCacheBustWithInstant();
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 3:
                        _c.sent();
                        /**
                         * call count has incremented due to the actual method call (instead of cache)
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        /**
                        * expect promise to return original data
                        **/
                        _a = expect;
                        return [4 /*yield*/, promise];
                    case 4:
                        /**
                        * expect promise to return original data
                        **/
                        _a.apply(void 0, [_c.sent()]).toEqual('SAVED');
                        /**
                         * pass through 1s of time
                         */
                        /**
                         * synchronous cached response should now be returned
                         */
                        _b = expect;
                        return [4 /*yield*/, service.getDataWithCacheBusting('test')];
                    case 5:
                        /**
                         * pass through 1s of time
                         */
                        /**
                         * synchronous cached response should now be returned
                         */
                        _b.apply(void 0, [_c.sent()]).toEqual({
                            payload: 'test'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it('should clear all caches when the global cache buster is called', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData1, cachedResponse1, asyncFreshData2, cachedResponse2, asyncFreshData3, cachedResponse3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                         * call the first method and cache it
                         */
                        service.getData('test1');
                        return [4 /*yield*/, (service.getData('test1'))];
                    case 1:
                        asyncFreshData1 = _a.sent();
                        expect(asyncFreshData1).toEqual({ payload: 'test1' });
                        return [4 /*yield*/, (service.getData('test1'))];
                    case 2:
                        cachedResponse1 = _a.sent();
                        expect(cachedResponse1).toEqual({ payload: 'test1' });
                        /**
                         * even though we called getData twice, this should only be called once
                         * since the second call went straight to the cache
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        service.getData('test2');
                        return [4 /*yield*/, (service.getData('test2'))];
                    case 3:
                        asyncFreshData2 = _a.sent();
                        expect(asyncFreshData2).toEqual({ payload: 'test2' });
                        return [4 /*yield*/, (service.getData('test2'))];
                    case 4:
                        cachedResponse2 = _a.sent();
                        expect(cachedResponse2).toEqual({ payload: 'test2' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                        service.getData('test3');
                        return [4 /*yield*/, (service.getData('test3'))];
                    case 5:
                        asyncFreshData3 = _a.sent();
                        expect(asyncFreshData3).toEqual({ payload: 'test3' });
                        return [4 /*yield*/, (service.getData('test3'))];
                    case 6:
                        cachedResponse3 = _a.sent();
                        expect(cachedResponse3).toEqual({ payload: 'test3' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
                        /**
                         * bust all caches
                         */
                        promise_cacheable_decorator_2.promiseGlobalCacheBusterNotifier.next();
                        return [4 /*yield*/, (service.getData('test1'))];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, (service.getData('test2'))];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, (service.getData('test3'))];
                    case 9:
                        _a.sent();
                        /**
                         * if we didn't bust the cache, this would've been 3
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should not change undefined parameters to null', function () { return __awaiter(void 0, void 0, void 0, function () {
            var mockServiceCallWithMultipleParametersSpy, asyncData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithUndefinedParameter(undefined)];
                    case 1:
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledWith('');
                        return [4 /*yield*/, service.getDataWithUndefinedParameter()];
                    case 2:
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledWith('');
                        mockServiceCallWithMultipleParametersSpy = spyOn(service, 'mockServiceCallWithMultipleParameters').and.callThrough();
                        return [4 /*yield*/, service.getDataWithMultipleUndefinedParameters(undefined, undefined)];
                    case 3:
                        _a.sent();
                        expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');
                        return [4 /*yield*/, service.getDataWithMultipleUndefinedParameters(undefined, undefined)];
                    case 4:
                        asyncData = _a.sent();
                        expect(asyncData).toEqual({ payload: ['Parameter1', 'Parameter2'] });
                        expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');
                        return [4 /*yield*/, service.getDataWithMultipleUndefinedParameters(undefined, undefined)];
                    case 5:
                        _a.sent();
                        expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithMultipleUndefinedParameters('Parameter1', undefined)];
                    case 6:
                        _a.sent();
                        expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work correctly with a custom storage strategy', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var getAllSpy, asyncFreshData, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getAllSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'getAll').and.callThrough();
                        return [4 /*yield*/, service.getDataWithCustomStorageStrategyProvided('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        // one add call, one getAll call
                        expect(getAllSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getDataWithCustomStorageStrategyProvided('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        expect(getAllSpy).toHaveBeenCalledTimes(2);
                        /**
                         * call count should still be one, since we rerouted to cache, instead of service call
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service.getDataWithCustomStorageStrategyProvided('test')];
                                    case 1:
                                        _a.sent();
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                                        // three getAll calls since every time we call the decorated method, we check the cache first
                                        expect(getAllSpy).toHaveBeenCalledTimes(3);
                                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, service.getDataWithCustomStorageStrategyProvided('test')];
                                                    case 1:
                                                        _a.sent();
                                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                                                        done();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 500);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data up until new parameters are passed WITH a custom resolver and hasher function', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // call once and cache with 3
                    return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(3)];
                    case 1:
                        // call once and cache with 3
                        _a.sent();
                        // call twice with 3 and reuse the cached values because of 
                        // the custom cache resolver passed to the decorator, i.e - 3 * 2 > 5
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(3)];
                    case 2:
                        // call twice with 3 and reuse the cached values because of 
                        // the custom cache resolver passed to the decorator, i.e - 3 * 2 > 5
                        _a.sent();
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(3)];
                    case 3:
                        _a.sent();
                        // call 4 times with an uncashed parameter 2
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(2)];
                    case 4:
                        // call 4 times with an uncashed parameter 2
                        _a.sent();
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(2)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(2)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, service.getDataWithCustomCacheResolverAndHasher(2)];
                    case 7:
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [2 /*return*/];
                }
            });
        }); });
        it('return cached data up until new parameters are passed WITH a custom GLOBAL resolver and hasher function', function () { return __awaiter(void 0, void 0, void 0, function () {
            var Service, service;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common_1.GlobalCacheConfig.cacheHasher = function (_parameters) { return _parameters[0] + '__wehoo'; };
                        common_1.GlobalCacheConfig.cacheResolver = function (oldParameter, newParameter) {
                            return newParameter === 'cached__wehoo';
                        };
                        Service = /** @class */ (function () {
                            function Service() {
                            }
                            Service.prototype.mockServiceCall = function (parameter) {
                                return new Promise(function (resolve) {
                                    setTimeout(function () {
                                        resolve({ payload: parameter });
                                    }, 300);
                                });
                            };
                            Service.prototype.getData = function (parameter) {
                                return this.mockServiceCall(parameter);
                            };
                            __decorate([
                                (0, promise_cacheable_decorator_1.PCacheable)()
                            ], Service.prototype, "getData", null);
                            return Service;
                        }());
                        service = new Service();
                        mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();
                        // call once and cache with cached
                        return [4 /*yield*/, service.getData('cached')];
                    case 1:
                        // call once and cache with cached
                        _a.sent();
                        // call twice with cached and reuse the cached values
                        return [4 /*yield*/, service.getData('cached')];
                    case 2:
                        // call twice with cached and reuse the cached values
                        _a.sent();
                        return [4 /*yield*/, service.getData('cached')];
                    case 3:
                        _a.sent();
                        // call 4 times with an uncashed parameter 2
                        return [4 /*yield*/, service.getData('not-cached')];
                    case 4:
                        // call 4 times with an uncashed parameter 2
                        _a.sent();
                        return [4 /*yield*/, service.getData('not-cached')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, service.getData('not-cached')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, service.getData('not-cached')];
                    case 7:
                        _a.sent();
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        common_1.GlobalCacheConfig.cacheHasher = undefined;
                        common_1.GlobalCacheConfig.cacheResolver = undefined;
                        return [2 /*return*/];
                }
            });
        }); });
        it('should call a function with a complex instance which should not be touched and passed to the original method as it is', function () { return __awaiter(void 0, void 0, void 0, function () {
            var complexObject, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        complexObject = new cat_1.Cat();
                        complexObject.name = 'Felix';
                        return [4 /*yield*/, service.getWithAComplexType(complexObject)];
                    case 1:
                        response = _a.sent();
                        expect(service.mockServiceCall).toHaveBeenCalledWith(complexObject);
                        // object method would not exist if we have mutated the parameter through the DEFAULT_CACHE_RESOLVER
                        expect(response.payload.meow("I am hungry!")).toBe("Felix says I am hungry!");
                        return [2 /*return*/];
                }
            });
        }); });
        it('use the maxAge and slidingExpiration from the GlobalCacheConfig', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common_1.GlobalCacheConfig.maxAge = 400;
                        common_1.GlobalCacheConfig.slidingExpiration = true;
                        return [4 /*yield*/, service.getData1('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getData1('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        /**
                         * call count should still be one, since we rerouted to cache, instead of service call
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, service.getData1('test')];
                                    case 1:
                                        _a.sent();
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, service.getData1('test')];
                                                    case 1:
                                                        _a.sent();
                                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                                                        done();
                                                        common_1.GlobalCacheConfig.maxAge = undefined;
                                                        common_1.GlobalCacheConfig.slidingExpiration = undefined;
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, 500);
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 200);
                        return [2 /*return*/];
                }
            });
        }); });
        it('use the maxCacheCount from the GlobalCacheConfig', function () { return __awaiter(void 0, void 0, void 0, function () {
            var parameters, cachedResponse, cachedResponseAll, asyncData, newParameters, cachedResponseAll2, nonCachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common_1.GlobalCacheConfig.maxCacheCount = 5;
                        parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
                        return [4 /*yield*/, Promise.all(parameters.map(function (param) { return (service.getData2(param)); }))
                            /**
                             * data for all endpoints should be available through cache by now
                             */
                        ];
                    case 1:
                        _a.sent();
                        /**
                         * data for all endpoints should be available through cache by now
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, service.getData2('test1')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test1' });
                        /** call count still 5 */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, Promise.all(parameters.map(function (param) { return service.getData2(param); }))];
                    case 3:
                        cachedResponseAll = _a.sent();
                        expect(cachedResponseAll).toEqual([
                            { payload: 'test1' },
                            { payload: 'test2' },
                            { payload: 'test3' },
                            { payload: 'test4' },
                            { payload: 'test5' }
                        ]);
                        /** call count still 5 */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
                        return [4 /*yield*/, service.getData2('test6')];
                    case 4:
                        asyncData = _a.sent();
                        expect(asyncData).toEqual({ payload: 'test6' });
                        /** call count incremented by one */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                        newParameters = ['test2', 'test3', 'test4', 'test5', 'test6'];
                        return [4 /*yield*/, Promise.all(newParameters.map(function (param) { return service.getData2(param); }))];
                    case 5:
                        cachedResponseAll2 = _a.sent();
                        expect(cachedResponseAll2).toEqual([
                            { payload: 'test2' },
                            { payload: 'test3' },
                            { payload: 'test4' },
                            { payload: 'test5' },
                            { payload: 'test6' }
                        ]);
                        /** no service calls will be made, since we have all the responses still cached even after 1s (1000ms) */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
                        return [4 /*yield*/, service.getData2('test7')];
                    case 6:
                        nonCachedResponse = _a.sent();
                        expect(nonCachedResponse).toEqual({ payload: 'test7' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);
                        /**
                         * since the cached response for 'test2' was now removed from cache by 'test7',
                         */
                        return [4 /*yield*/, service.getData2('test2')];
                    case 7:
                        /**
                         * since the cached response for 'test2' was now removed from cache by 'test7',
                         */
                        _a.sent();
                        /**
                         * test2 is not in cache anymore and a service call will be made
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
                        common_1.GlobalCacheConfig.maxCacheCount = undefined;
                        return [2 /*return*/];
                }
            });
        }); });
        it('use the maxAge from the GlobalCacheConfig', function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        common_1.GlobalCacheConfig.maxAge = 1000;
                        return [4 /*yield*/, service.getData3('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getData3('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    /**
                                     * after 1001ms the cache would've expired and we will bail to the data source
                                     */
                                    return [4 /*yield*/, service.getData3('test')];
                                    case 1:
                                        /**
                                         * after 1001ms the cache would've expired and we will bail to the data source
                                         */
                                        _a.sent();
                                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
                                        common_1.GlobalCacheConfig.maxAge = undefined;
                                        done();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1001);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should modify cache of getMutableData dynamically', function () { return __awaiter(void 0, void 0, void 0, function () {
            var asyncFreshData, cachedResponse, cachedResponse2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getMutableData('test')];
                    case 1:
                        asyncFreshData = _a.sent();
                        expect(asyncFreshData).toEqual({ payload: 'test' });
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [4 /*yield*/, service.getMutableData('test')];
                    case 2:
                        cachedResponse = _a.sent();
                        expect(cachedResponse).toEqual({ payload: 'test' });
                        cacheModifier.next(function (data) {
                            data.find(function (p) { return p.parameters[0] === 'test'; }).response.payload = 'test_modified';
                            return data;
                        });
                        return [4 /*yield*/, service.getMutableData('test')];
                    case 3:
                        cachedResponse2 = _a.sent();
                        expect(cachedResponse2).toEqual({ payload: 'test_modified' });
                        /**
                         * response acquired from cache, so no incrementation on the service spy call counter is expected here
                         */
                        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should work with a custom context storage strategy', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, service.getDataWithCustomContextStorageStrategy('test')];
                    case 1:
                        _a.sent();
                        expect(customStrategySpy).toHaveBeenCalledWith(jasmine.any(Object));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=promise-cacheable.decorator.spec.js.map
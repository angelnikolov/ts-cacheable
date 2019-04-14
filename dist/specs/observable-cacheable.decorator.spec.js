"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var operators_1 = require("rxjs/operators");
var cacheable_decorator_1 = require("../cacheable.decorator");
var cacheable_decorator_2 = require("../cacheable.decorator");
var cache_buster_decorator_1 = require("../cache-buster.decorator");
var rxjs_2 = require("rxjs");
var operators_2 = require("rxjs/operators");
var common_1 = require("../common");
var DOMStorageStrategy_1 = require("../common/DOMStorageStrategy");
var InMemoryStorageStrategy_1 = require("../common/InMemoryStorageStrategy");
var strategies = [null, DOMStorageStrategy_1.DOMStorageStrategy];
strategies.forEach(function (s) {
    if (s) {
        common_1.GlobalCacheConfig.storageStrategy = s;
    }
    var cacheBusterNotifier = new rxjs_2.Subject();
    var Service = /** @class */ (function () {
        function Service() {
        }
        Service.prototype.mockServiceCall = function (parameter) {
            return rxjs_2.timer(1000).pipe(operators_2.mapTo({ payload: parameter }));
        };
        Service.prototype.mockSaveServiceCall = function () {
            return rxjs_2.timer(1000).pipe(operators_2.mapTo('SAVED'));
        };
        Service.prototype.mockServiceCallWithMultipleParameters = function (parameter1, parameter2) {
            return rxjs_2.timer(1000).pipe(operators_2.mapTo({ payload: [parameter1, parameter2] }));
        };
        Service.prototype.getData = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getDataWithParamsObj = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getDataAndReturnCachedStream = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getDataAsync = function (parameter) {
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
        Service.prototype.getDataWithCustomCacheDecider = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.saveDataAndCacheBust = function () {
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
        Service.prototype.getData1 = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getData2 = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getData3 = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        Service.prototype.getDateWithCustomStorageStrategyProvided = function (parameter) {
            return this.mockServiceCall(parameter);
        };
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getData", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getDataWithParamsObj", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getDataAndReturnCachedStream", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                async: true
            })
        ], Service.prototype, "getDataAsync", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxAge: 7500
            })
        ], Service.prototype, "getDataWithExpiration", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxAge: 7500,
                slidingExpiration: true
            })
        ], Service.prototype, "getDataWithSlidingExpiration", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxCacheCount: 5
            })
        ], Service.prototype, "getDataWithMaxCacheCount", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxAge: 7500,
                maxCacheCount: 5
            })
        ], Service.prototype, "getDataWithMaxCacheCountAndExpiration", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxAge: 7500,
                maxCacheCount: 5,
                slidingExpiration: true
            })
        ], Service.prototype, "getDataWithMaxCacheCountAndSlidingExpiration", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                cacheResolver: function (_oldParameters, newParameters) {
                    return newParameters.find(function (param) { return !!param.straightToLastCache; });
                }
            })
        ], Service.prototype, "getDataWithCustomCacheResolver", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                shouldCacheDecider: function (response) {
                    return response.payload === 'test';
                }
            })
        ], Service.prototype, "getDataWithCustomCacheDecider", null);
        __decorate([
            cache_buster_decorator_1.CacheBuster({
                cacheBusterNotifier: cacheBusterNotifier
            })
        ], Service.prototype, "saveDataAndCacheBust", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                cacheBusterObserver: cacheBusterNotifier.asObservable()
            })
        ], Service.prototype, "getDataWithCacheBusting", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getDataWithUndefinedParameter", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getDataWithMultipleUndefinedParameters", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getData1", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getData2", null);
        __decorate([
            cacheable_decorator_2.Cacheable()
        ], Service.prototype, "getData3", null);
        __decorate([
            cacheable_decorator_2.Cacheable({
                maxAge: 7500,
                slidingExpiration: true,
                storageStrategy: InMemoryStorageStrategy_1.InMemoryStorageStrategy
            })
        ], Service.prototype, "getDateWithCustomStorageStrategyProvided", null);
        return Service;
    }());
    describe('CacheableDecorator', function () {
        var service = null;
        var mockServiceCallSpy = null;
        beforeEach(function () {
            jasmine.clock().install();
            service = new Service();
            mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();
            if (common_1.GlobalCacheConfig.storageStrategy === DOMStorageStrategy_1.DOMStorageStrategy) {
                localStorage.clear();
            }
        });
        afterEach(function () {
            jasmine.clock().uninstall();
        });
        /**
         * do not use async await when using jasmine.clock()
         * we can mitigate this but will make our tests slower
         * https://www.google.bg/search?q=jasmine.clock.install+%2B+async+await&oq=jasmine.clock.install+%2B+async+await&aqs=chrome..69i57.4240j0j7&sourceid=chrome&ie=UTF-8
         */
        it('return cached data up until a new parameter is passed and the cache is busted', function () {
            var asyncFreshData = _timedStreamAsyncAwait(service.getData('test'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponse = _timedStreamAsyncAwait(service.getData('test'));
            expect(cachedResponse).toEqual({ payload: 'test' });
            /**
             * response acquired from cache, so no incrementation on the service spy call counter is expected here
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponse2 = _timedStreamAsyncAwait(service.getData('test2'));
            expect(cachedResponse2).toEqual(null);
            /**
             * no cache for 'test2', but service call was made so the spy counter is incremented
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            var cachedResponse3 = _timedStreamAsyncAwait(service.getData('test3'), 1000);
            /**
             * service call is made and waited out
             */
            expect(cachedResponse3).toEqual({ payload: 'test3' });
            /**
             * this should NOT return cached response, since the currently cached one should be 'test3'
             */
            var cachedResponse4 = _timedStreamAsyncAwait(service.getData('test'));
            expect(cachedResponse4).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
        });
        it('returns observables in cache with a referential type params', function () {
            var params = {
                number: [1]
            };
            /**
             * call the service endpoint with current params values
             */
            service.getDataWithParamsObj(params);
            /**
             * return the response
             */
            jasmine.clock().tick(1000);
            /**
             * change params object values
             */
            params.number.push(2);
            /**
             * call again..
             */
            service.getDataWithParamsObj(params);
            /**
             * service call count should still be 2, since param object has changed
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
        });
        it('return the cached observable up until it completes or errors', function () {
            /**
             * call the service endpoint five hundred times with the same parameter
             * but the service should only be called once, since the observable will be cached
             */
            for (var i = 0; i < 500; i++) {
                service.getDataAndReturnCachedStream('test');
            }
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * return the response
             */
            jasmine.clock().tick(1000);
            /**
             * call again..
             */
            service.getDataAndReturnCachedStream('test');
            /**
             * service call count should still be 1, since we are returning from cache now
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
        });
        it('with async:true return cached data ASYNCHRONOUSLY up until a new parameter is passed and the cache is busted', function () {
            var asyncFreshData = _timedStreamAsyncAwait(service.getDataAsync('test'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponseTry1 = _timedStreamAsyncAwait(service.getDataAsync('test'));
            /**
             * async cache hasn't resolved yet
             * we need to wait a tick out first
             */
            expect(cachedResponseTry1).toEqual(null);
            /**
             * 1 millisecond delay added, so the async cache resolves
             */
            var cachedResponseTry2 = _timedStreamAsyncAwait(service.getDataAsync('test'), 1);
            expect(cachedResponseTry2).toEqual({ payload: 'test' });
            /**
             * response acquired from cache, so no incrementation on the service spy call counter is expected here
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * 1 millisecond delay added, so the async cache resolves
             */
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDataAsync('test2'), 1);
            expect(cachedResponse2).toEqual(null);
            /**
             * no cache for 'test2', but service call was made so the spy counter is incremented
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            var cachedResponse3 = _timedStreamAsyncAwait(service.getDataAsync('test3'), 1000);
            /**
             * service call is made and waited out
             */
            expect(cachedResponse3).toEqual({ payload: 'test3' });
            /**
             * this should return cached response, since the currently cached one should be 'test3'
             * 1 millisecond delay added, so the async cache resolves
             */
            var cachedResponse4 = _timedStreamAsyncAwait(service.getDataAsync('test'), 1);
            expect(cachedResponse4).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
        });
        it('return cached date up until the maxAge period has passed and then bail out to data source', function () {
            jasmine.clock().mockDate();
            var asyncFreshData = _timedStreamAsyncAwait(service.getDataWithExpiration('test'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponse = _timedStreamAsyncAwait(service.getDataWithExpiration('test'));
            /**
             * service shouldn't be called and we should route directly to cache
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            expect(cachedResponse).toEqual({ payload: 'test' });
            /**
             * progress in time for 7501 ms, e.g - one millisecond after the maxAge would expire
             */
            jasmine.clock().tick(7501);
            /**
             * no cache anymore, bail out to service call
             */
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDataWithExpiration('test'));
            expect(cachedResponse2).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            var asyncFreshDataAfterCacheBust = null;
            service.getDataWithExpiration('test').subscribe(function (data) {
                asyncFreshDataAfterCacheBust = data;
            });
            jasmine.clock().tick(1000);
            expect(asyncFreshDataAfterCacheBust).toEqual({ payload: 'test' });
        });
        it('return cached data up until the maxAge period but renew the expiration if called within the period', function () {
            jasmine.clock().mockDate();
            var asyncFreshData = _timedStreamAsyncAwait(service.getDataWithSlidingExpiration('test'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponse = _timedStreamAsyncAwait(service.getDataWithSlidingExpiration('test'));
            expect(cachedResponse).toEqual({ payload: 'test' });
            /**
             * call count should still be one, since we rerouted to cache, instead of service call
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * travel through 3000ms of time
             */
            jasmine.clock().tick(3000);
            /**
             * calling the method again should renew expiration for 7500 more milliseconds
             */
            service.getDataWithSlidingExpiration('test').subscribe();
            jasmine.clock().tick(4501);
            /**
             * this should have returned null, if the cache didnt renew
             */
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDataWithSlidingExpiration('test'));
            expect(cachedResponse2).toEqual({ payload: 'test' });
            /**
             * call count is still one, because we renewed the cache 4501ms ago
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * expire cache, shouldn't renew since 7501 ms have ellapsed
             */
            jasmine.clock().tick(7501);
            var cachedResponse3 = _timedStreamAsyncAwait(service.getDataWithSlidingExpiration('test'));
            /**
             * cached has expired, request hasn't returned yet but still - the service was called
             */
            expect(cachedResponse3).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
        });
        it('return cached data for 5 unique requests, then should bail to data source', function () {
            /**
             * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
             */
            var parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
            parameters.forEach(function (param) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, _timedStreamAsyncAwait(service.getDataWithMaxCacheCount(param), 1000)];
            }); }); });
            /**
             * data for all endpoints should be available through cache by now
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            var cachedResponse = _timedStreamAsyncAwait(service.getDataWithMaxCacheCount('test1'));
            expect(cachedResponse).toEqual({ payload: 'test1' });
            /** call count still 5 */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            /**
             * this should return a maximum of 5 different cached responses
             */
            var cachedResponseAll = _timedStreamAsyncAwait(rxjs_1.forkJoin(parameters.map(function (param) { return service.getDataWithMaxCacheCount(param); })));
            expect(cachedResponseAll).toEqual([
                { payload: 'test1' },
                { payload: 'test2' },
                { payload: 'test3' },
                { payload: 'test4' },
                { payload: 'test5' }
            ]);
            /** call count still 5 */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            var asyncData = _timedStreamAsyncAwait(service.getDataWithMaxCacheCount('test6'), 1000);
            expect(asyncData).toEqual({ payload: 'test6' });
            /** call count incremented by one */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
            /**
             * by now the response for test6 should be cached and the one for test1 should be free for GC..
             */
            var newParameters = ['test2', 'test3', 'test4', 'test5', 'test6'];
            /**
             * this should return a maximum of 5 different cached responses, with the latest one in the end
             */
            var cachedResponseAll2 = _timedStreamAsyncAwait(rxjs_1.forkJoin(newParameters.map(function (param) { return service.getDataWithMaxCacheCount(param); })), 1000);
            expect(cachedResponseAll2).toEqual([
                { payload: 'test2' },
                { payload: 'test3' },
                { payload: 'test4' },
                { payload: 'test5' },
                { payload: 'test6' }
            ]);
            /** no service calls will be made, since we have all the responses still cached even after 1s (1000ms) */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
            /**
             * fetch and cache the test7 response
             */
            var nonCachedResponse = _timedStreamAsyncAwait(service.getDataWithMaxCacheCount('test7'), 1000);
            expect(nonCachedResponse).toEqual({ payload: 'test7' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);
            /**
             * since the cached response for 'test2' was now removed from cache by 'test7', it shouldn't be available in cache
             */
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDataWithMaxCacheCount('test2'));
            expect(cachedResponse2).toEqual(null);
            /**
             * service call is made anyway
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
        });
        it('return cached data for 5 unique requests all available for 7500ms', function () {
            jasmine.clock().mockDate();
            /**
             * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
             */
            var parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
            parameters.forEach(function (param) {
                return service.getDataWithMaxCacheCountAndExpiration(param).subscribe();
            });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            jasmine.clock().tick(1000);
            var cachedResponse2 = _timedStreamAsyncAwait(rxjs_1.forkJoin(parameters.map(function (param) {
                return service.getDataWithMaxCacheCountAndExpiration(param);
            })));
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            expect(cachedResponse2).toEqual([
                { payload: 'test1' },
                { payload: 'test2' },
                { payload: 'test3' },
                { payload: 'test4' },
                { payload: 'test5' }
            ]);
            /**
             * expire caches
             */
            jasmine.clock().tick(7501);
            var cachedResponse3 = _timedStreamAsyncAwait(service.getDataWithMaxCacheCountAndExpiration('test1'));
            expect(cachedResponse3).toEqual(null);
            /**
             * by now, no cache exists for the 'test1' parameter, so 1 more call will be made to the service
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
        });
        it('return cached data for 5 unique requests all available for 7500ms WITH slidingExpiration on', function () {
            jasmine.clock().mockDate();
            /**
             * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
             */
            var parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
            parameters.forEach(function (param) {
                return service.getDataWithMaxCacheCountAndSlidingExpiration(param).subscribe();
            });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            /**
             * allow for the mock request to complete
             */
            jasmine.clock().tick(1000);
            /**
             * pass through time to just before the cache expires
             */
            jasmine.clock().tick(7500);
            /**
             * re-call just with test2 so we renew its expiration
             */
            service.getDataWithMaxCacheCountAndSlidingExpiration('test2').subscribe();
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
            /**
             * expire ALL caches except the test2 one
             */
            jasmine.clock().tick(1);
            var cachedResponse = _timedStreamAsyncAwait(rxjs_1.combineLatest(parameters.map(function (param) {
                return service
                    .getDataWithMaxCacheCountAndSlidingExpiration(param)
                    .pipe(operators_1.startWith(null));
            })));
            /**
             * no cache for 4 payloads, so 4 more calls to the service will be made
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(9);
            expect(cachedResponse).toEqual([
                null,
                { payload: 'test2' },
                null,
                null,
                null
            ]);
            jasmine.clock().uninstall();
        });
        it('return cached data up until new parameters are passed WITH a custom resolver function', function () {
            var asyncFreshData = _timedStreamAsyncAwait(service.getDataWithCustomCacheResolver('test1'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test1' });
            expect(mockServiceCallSpy).toHaveBeenCalled();
            var asyncFreshData2 = _timedStreamAsyncAwait(service.getDataWithCustomCacheResolver('test2'), 1000);
            expect(asyncFreshData2).toEqual({ payload: 'test2' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            var cachedResponse = _timedStreamAsyncAwait(service.getDataWithCustomCacheResolver('test3', {
                straightToLastCache: true
            }));
            expect(cachedResponse).toEqual({ payload: 'test2' });
            /**
             * call count still 2, since we rerouted directly to cache
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            _timedStreamAsyncAwait(service.getDataWithCustomCacheResolver('test3'));
            /**no cache reerouter -> bail to service call -> increment call counter*/
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
        });
        it('only cache data when a specific response is returned, otherwise it should bail to service call', function () {
            var asyncData = _timedStreamAsyncAwait(service.getDataWithCustomCacheDecider('test1'), 1000);
            expect(asyncData).toEqual({ payload: 'test1' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * this call shouldn't be cached, since the custom response decider hasn't passed
             */
            var cachedData = _timedStreamAsyncAwait(service.getDataWithCustomCacheDecider('test1'));
            expect(cachedData).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            /**
             * next calls will be for 'test' whose response will match the cache deciders condition and it will be cached
             */
            var asyncData2 = _timedStreamAsyncAwait(service.getDataWithCustomCacheDecider('test'), 1000);
            expect(asyncData2).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
            /**
             * this call has to return cached data, since we the response cache decider should have matched the previous one
             */
            var cachedData2 = _timedStreamAsyncAwait(service.getDataWithCustomCacheDecider('test'));
            expect(cachedData2).toEqual({ payload: 'test' });
            /**
             * the service call count won't be incremented
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
        });
        it('cache data until the cacheBusterNotifier has emitted', function () {
            var asyncFreshData = _timedStreamAsyncAwait(service.getDataWithCacheBusting('test'), 1000);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            var cachedResponse = _timedStreamAsyncAwait(service.getDataWithCacheBusting('test'));
            expect(cachedResponse).toEqual({ payload: 'test' });
            /**
             * response acquired from cache, so no incrementation on the service spy call counter is expected here
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * make the save call
             * after 1 second the cache busting subject will emit and the cache for getDataWithCacheBusting('test') will be relieved of
             */
            expect(_timedStreamAsyncAwait(service.saveDataAndCacheBust(), 1000)).toEqual('SAVED');
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDataWithCacheBusting('test'));
            expect(cachedResponse2).toEqual(null);
            /**
             * call count has incremented due to the actual method call (instead of cache)
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            /**
             * pass through 1s of time
             */
            jasmine.clock().tick(1000);
            /**
             * synchronous cached response should now be returned
             */
            expect(_timedStreamAsyncAwait(service.getDataWithCacheBusting('test'))).toEqual({ payload: 'test' });
        });
        it('should clear all caches when the global cache buster is called', function () {
            /**
             * call the first method and cache it
             */
            service.getData1('test1');
            var asyncFreshData1 = _timedStreamAsyncAwait(service.getData1('test1'), 1000);
            expect(asyncFreshData1).toEqual({ payload: 'test1' });
            var cachedResponse1 = _timedStreamAsyncAwait(service.getData1('test1'));
            expect(cachedResponse1).toEqual({ payload: 'test1' });
            /**
             * even though we called getData1 twice, this should only be called once
             * since the second call went straight to the cache
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            service.getData2('test2');
            var asyncFreshData2 = _timedStreamAsyncAwait(service.getData2('test2'), 1000);
            expect(asyncFreshData2).toEqual({ payload: 'test2' });
            var cachedResponse2 = _timedStreamAsyncAwait(service.getData2('test2'));
            expect(cachedResponse2).toEqual({ payload: 'test2' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            service.getData3('test3');
            var asyncFreshData3 = _timedStreamAsyncAwait(service.getData3('test3'), 1000);
            expect(asyncFreshData3).toEqual({ payload: 'test3' });
            var cachedResponse3 = _timedStreamAsyncAwait(service.getData3('test3'));
            expect(cachedResponse3).toEqual({ payload: 'test3' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
            /**
             * bust all caches
             */
            cacheable_decorator_1.globalCacheBusterNotifier.next();
            _timedStreamAsyncAwait(service.getData1('test1'), 1000);
            _timedStreamAsyncAwait(service.getData2('test2'), 1000);
            _timedStreamAsyncAwait(service.getData3('test3'), 1000);
            /**
             * if we didn't bust the cache, this would've been 3
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
        });
        it('should not change undefined parameters to null', function () {
            service.getDataWithUndefinedParameter(undefined);
            expect(mockServiceCallSpy).toHaveBeenCalledWith('');
            service.getDataWithUndefinedParameter();
            expect(mockServiceCallSpy).toHaveBeenCalledWith('');
            var mockServiceCallWithMultipleParametersSpy = spyOn(service, 'mockServiceCallWithMultipleParameters').and.callThrough();
            var asyncData = _timedStreamAsyncAwait(service.getDataWithMultipleUndefinedParameters(undefined, undefined), 1000);
            expect(asyncData).toEqual({ payload: ['Parameter1', 'Parameter2'] });
            expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');
            service.getDataWithMultipleUndefinedParameters(undefined, undefined);
            expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(1);
            service.getDataWithMultipleUndefinedParameters('Parameter1', undefined);
            expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(2);
        });
        it('should work correctly with a custom storage strategy', function () {
            var addSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'add').and.callThrough();
            var updateAtIndexSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'updateAtIndex').and.callThrough();
            var getAllSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'getAll').and.callThrough();
            var removeAtIndexSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'removeAtIndex').and.callThrough();
            var removeAllSpy = spyOn(InMemoryStorageStrategy_1.InMemoryStorageStrategy.prototype, 'removeAll').and.callThrough();
            jasmine.clock().mockDate();
            var asyncFreshData = _timedStreamAsyncAwait(service.getDateWithCustomStorageStrategyProvided('test'), 1000);
            // called removeAtIndex once, because of how the cache works, it always removes the last cached pair with this method
            expect(removeAtIndexSpy).toHaveBeenCalledTimes(1);
            expect(asyncFreshData).toEqual({ payload: 'test' });
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            // one add call, one getAll call
            expect(getAllSpy).toHaveBeenCalledTimes(1);
            expect(addSpy).toHaveBeenCalledTimes(1);
            var cachedResponse = _timedStreamAsyncAwait(service.getDateWithCustomStorageStrategyProvided('test'));
            // this call will renew the updateAtIndex call count since it's used to renew the cache
            expect(updateAtIndexSpy).toHaveBeenCalledTimes(1);
            expect(cachedResponse).toEqual({ payload: 'test' });
            /**
             * call count should still be one, since we rerouted to cache, instead of service call
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            // two getAll calls because we checked for the cache twice, and only one add call, because cache existed
            expect(getAllSpy).toHaveBeenCalledTimes(2);
            expect(addSpy).toHaveBeenCalledTimes(1);
            /**
             * travel through 3000ms of time
             */
            jasmine.clock().tick(3000);
            /**
             * calling the method again should renew expiration for 7500 more milliseconds
             */
            service.getDateWithCustomStorageStrategyProvided('test').subscribe();
            // this call will renew the updateAtIndex call count since it's used to renew the cache
            expect(updateAtIndexSpy).toHaveBeenCalledTimes(2);
            // one more getAll cache and it is renewed
            expect(getAllSpy).toHaveBeenCalledTimes(3);
            expect(addSpy).toHaveBeenCalledTimes(1);
            jasmine.clock().tick(4501);
            /**
             * this should have returned null, if the cache didnt renew
             */
            var cachedResponse2 = _timedStreamAsyncAwait(service.getDateWithCustomStorageStrategyProvided('test'));
            // this call will renew the updateAtIndex call count since it's used to renew the cache
            expect(updateAtIndexSpy).toHaveBeenCalledTimes(3);
            // one more getAll call, and still just one add call, since the cache was renewed due to sliding expiration
            expect(getAllSpy).toHaveBeenCalledTimes(4);
            expect(addSpy).toHaveBeenCalledTimes(1);
            expect(cachedResponse2).toEqual({ payload: 'test' });
            /**
             * call count is still one, because we renewed the cache 4501ms ago
             */
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
            /**
             * expire cache, shouldn't renew since 7501 ms have ellapsed
             */
            jasmine.clock().tick(7501);
            var cachedResponse3 = _timedStreamAsyncAwait(service.getDateWithCustomStorageStrategyProvided('test'));
            // cache has expired so the currently cached pair should have been swapped by now by calling the removeAtIndex method first
            expect(removeAtIndexSpy).toHaveBeenCalledTimes(2);
            expect(getAllSpy).toHaveBeenCalledTimes(5);
            expect(addSpy).toHaveBeenCalledTimes(1);
            /**
             * cached has expired, request hasn't returned yet but still - the service was called
             */
            expect(cachedResponse3).toEqual(null);
            expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
            /**
             * call the global cache buster just so we can test if removeAll was called
             */
            cacheable_decorator_1.globalCacheBusterNotifier.next();
            expect(addSpy).toHaveBeenCalledTimes(1);
            expect(updateAtIndexSpy).toHaveBeenCalledTimes(3);
            expect(getAllSpy).toHaveBeenCalledTimes(5);
            expect(removeAtIndexSpy).toHaveBeenCalledTimes(2);
            expect(removeAllSpy).toHaveBeenCalled();
        });
    });
    function _timedStreamAsyncAwait(stream$, skipTime) {
        var response = null;
        stream$.subscribe(function (data) {
            response = data;
        });
        if (skipTime) {
            /**
             * use jasmine clock to artificially manipulate time-based web apis like setTimeout, setInterval and Date
             * we can easily use async/await but that means that we will have to actually wait out the time needed for every delay/mock request
             * we can't use fakeAsync/tick here since this is Angular agnostic test and we do not need zonejs or change detection
             */
            jasmine.clock().tick(skipTime);
        }
        return response;
    }
});
//# sourceMappingURL=observable-cacheable.decorator.spec.js.map
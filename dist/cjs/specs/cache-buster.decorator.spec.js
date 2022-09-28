"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var cache_buster_decorator_1 = require("../cache-buster.decorator");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
describe('CacheBusterDecorator', function () {
    var cacheBusterNotifier = new rxjs_1.Subject();
    var service;
    var testScheduler;
    var TestService = /** @class */ (function () {
        function TestService() {
        }
        TestService.prototype.sumWithObservableNonInstant = function (a, b) {
            return (0, rxjs_1.of)(this.sumValues(a, b)).pipe((0, operators_1.delay)(1000));
        };
        // @ts-expect-error
        TestService.prototype.throwWithNonObservableNonInstant = function () {
            /*
            Method decorated with @CacheBuster should return observable.
            If you don't want to change the method signature, set isInstant flag to true.
            */
        };
        TestService.prototype.sumWithInstant = function (a, b) {
            return this.sumValues(a, b);
        };
        TestService.prototype.sumValues = function (a, b) {
            return a + b;
        };
        __decorate([
            (0, cache_buster_decorator_1.CacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier
            })
        ], TestService.prototype, "sumWithObservableNonInstant", null);
        __decorate([
            (0, cache_buster_decorator_1.CacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier
            })
        ], TestService.prototype, "throwWithNonObservableNonInstant", null);
        __decorate([
            (0, cache_buster_decorator_1.CacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier,
                isInstant: true
            })
        ], TestService.prototype, "sumWithInstant", null);
        return TestService;
    }());
    beforeEach(function () {
        service = new TestService();
        testScheduler = new testing_1.TestScheduler(function (actual, expected) {
            expect(actual).toEqual(expected);
        });
    });
    it('should create', function () {
        expect(service).toBeTruthy();
    });
    it('should call original method body and return result [isInstant: undefined]', function (done) {
        service.sumWithObservableNonInstant(1, 2).subscribe(function (res) {
            expect(res).toEqual(3);
            done();
        });
    });
    it('should call original method body and return result [isInstant: true]', function () {
        var res = service.sumWithInstant(1, 2);
        expect(res).toEqual(3);
    });
    it('it should throw error if [isInstant: undefined] is decorating method that does not return Observable', function () {
        expect(function () { return service.throwWithNonObservableNonInstant(); }).toThrowError(cache_buster_decorator_1.NO_OBSERVABLE_ERROR_MESSAGE);
    });
    it('should bust the cache before original method has been executed', function () {
        var methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
        var notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();
        service.sumWithInstant(1, 3);
        expect(methodBodySpy).toHaveBeenCalledTimes(1);
        expect(notifierSpy).toHaveBeenCalledTimes(1);
        expect(notifierSpy).toHaveBeenCalledBefore(methodBodySpy);
    });
    it('should bust the cache after original has been executed (observable emitted)', function (done) {
        var methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
        var notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();
        service.sumWithObservableNonInstant(1, 3).subscribe(function (res) {
            expect(methodBodySpy).toHaveBeenCalledTimes(1);
            expect(notifierSpy).toHaveBeenCalledTimes(1);
            expect(methodBodySpy).toHaveBeenCalledBefore(notifierSpy);
            done();
        });
    });
    it('should wait until observable from decorated method emits and then bust the cache', function () {
        testScheduler.run(function (_a) {
            var expectObservable = _a.expectObservable;
            var source$ = service.sumWithObservableNonInstant(1, 2);
            var notifier$ = cacheBusterNotifier;
            expectObservable(source$).toBe('1000ms (a|)', { a: 3 });
            expectObservable(notifier$).toBe('1000ms a', { a: undefined });
        });
    });
});
//# sourceMappingURL=cache-buster.decorator.spec.js.map
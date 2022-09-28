"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var promise_cache_buster_decorator_1 = require("../promise.cache-buster.decorator");
describe('PCacheBusterDecorator', function () {
    var cacheBusterNotifier = new rxjs_1.Subject();
    var service;
    var TestService = /** @class */ (function () {
        function TestService() {
        }
        TestService.prototype.sumWithPromise = function (a, b) {
            return Promise.resolve(this.sumValues(a, b));
        };
        // @ts-expect-error
        TestService.prototype.throwWithNonPromiseNonInstant = function () {
            /*
            Method decorated with @PCacheBuster should return Promise.
            If you don't want to change the method signature, set isInstant flag to true.
            */
        };
        TestService.prototype.sumWithInstant = function (a, b) {
            return this.sumValues(a, b);
        };
        TestService.prototype.sumWithInstantAndPromise = function (a, b) {
            return Promise.resolve(this.sumValues(a, b));
        };
        TestService.prototype.sumValues = function (a, b) {
            return a + b;
        };
        __decorate([
            (0, promise_cache_buster_decorator_1.PCacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier
            })
        ], TestService.prototype, "sumWithPromise", null);
        __decorate([
            (0, promise_cache_buster_decorator_1.PCacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier
            })
        ], TestService.prototype, "throwWithNonPromiseNonInstant", null);
        __decorate([
            (0, promise_cache_buster_decorator_1.PCacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier,
                isInstant: true
            })
        ], TestService.prototype, "sumWithInstant", null);
        __decorate([
            (0, promise_cache_buster_decorator_1.PCacheBuster)({
                cacheBusterNotifier: cacheBusterNotifier,
                isInstant: true
            })
        ], TestService.prototype, "sumWithInstantAndPromise", null);
        return TestService;
    }());
    beforeEach(function () {
        service = new TestService();
    });
    it('should create', function () {
        expect(service).toBeTruthy();
    });
    it('should call original method body and return result [isInstant: undefined]', function (done) {
        service.sumWithPromise(1, 2).then(function (res) {
            expect(res).toEqual(3);
            done();
        });
    });
    it('should call original method body and return result [isInstant: true]', function () {
        var res = service.sumWithInstant(1, 2);
        expect(res).toEqual(3);
    });
    it('it should throw error if [isInstant: undefined] is decorating method that does not return Promise', function () {
        expect(function () { return service.throwWithNonPromiseNonInstant(); }).toThrowError(promise_cache_buster_decorator_1.NO_PROMISE_ERROR_MESSAGE);
    });
    it('should bust the cache before original method has been executed', function () {
        var methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
        var notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();
        service.sumWithInstant(1, 3);
        expect(methodBodySpy).toHaveBeenCalledTimes(1);
        expect(notifierSpy).toHaveBeenCalledTimes(1);
        expect(notifierSpy).toHaveBeenCalledBefore(methodBodySpy);
    });
    it('should bust the cache after original has been executed (Promise resolved)', function (done) {
        var methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
        var notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();
        service.sumWithPromise(1, 3).then(function (res) {
            expect(methodBodySpy).toHaveBeenCalledTimes(1);
            expect(notifierSpy).toHaveBeenCalledTimes(1);
            expect(methodBodySpy).toHaveBeenCalledBefore(notifierSpy);
            done();
        });
    });
    it('should bust the cache once', function (done) {
        var methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
        var notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();
        service.sumWithInstantAndPromise(1, 2).then(function (_) {
            expect(methodBodySpy).toHaveBeenCalledTimes(1);
            expect(notifierSpy).toHaveBeenCalledTimes(1);
            done();
        });
    });
});
//# sourceMappingURL=promise.cache-buster.decorator.spec.js.map
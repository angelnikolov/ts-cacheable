"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var IStorageStrategy_1 = require("./IStorageStrategy");
var _1 = require(".");
var LocalStorageStrategy = /** @class */ (function (_super) {
    __extends(LocalStorageStrategy, _super);
    function LocalStorageStrategy() {
        var _this = _super.call(this) || this;
        _this.masterCacheKey = _1.GlobalCacheConfig.globalCacheKey;
        if (typeof localStorage == 'undefined') {
            throw new Error('Platform not supported.');
        }
        return _this;
    }
    LocalStorageStrategy.prototype.add = function (cachePair, cacheKey) {
        var allCachedData = this.getRawData();
        if (!allCachedData[cacheKey]) {
            allCachedData[cacheKey] = [];
        }
        allCachedData[cacheKey].push(cachePair);
        this.storeRawData(allCachedData);
    };
    ;
    LocalStorageStrategy.prototype.addMany = function (cachePairs, cacheKey) {
        var allCachedData = this.getRawData();
        if (!allCachedData[cacheKey]) {
            allCachedData[cacheKey] = [];
        }
        allCachedData[cacheKey] = cachePairs;
        this.storeRawData(allCachedData);
    };
    ;
    LocalStorageStrategy.prototype.getAll = function (cacheKey) {
        return this.getRawData()[cacheKey] || [];
    };
    ;
    LocalStorageStrategy.prototype.removeAtIndex = function (index, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].splice(index, 1);
        }
        this.storeRawData(allCachedData);
    };
    LocalStorageStrategy.prototype.remove = function (index, entity, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].splice(index, 1);
        }
        this.storeRawData(allCachedData);
    };
    LocalStorageStrategy.prototype.updateAtIndex = function (index, entity, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey][index]) {
            allCachedData[cacheKey][index] = entity;
        }
        this.storeRawData(allCachedData);
    };
    LocalStorageStrategy.prototype.update = function (index, entity, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey][index]) {
            allCachedData[cacheKey][index] = entity;
        }
        this.storeRawData(allCachedData);
    };
    LocalStorageStrategy.prototype.removeAll = function (cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].length = 0;
        }
        this.storeRawData(allCachedData);
    };
    LocalStorageStrategy.prototype.getRawData = function () {
        var data = localStorage.getItem(this.masterCacheKey);
        try {
            return JSON.parse(data) || {};
        }
        catch (error) {
            throw new Error(error);
        }
    };
    LocalStorageStrategy.prototype.storeRawData = function (data) {
        localStorage.setItem(this.masterCacheKey, JSON.stringify(data));
    };
    return LocalStorageStrategy;
}(IStorageStrategy_1.IStorageStrategy));
exports.LocalStorageStrategy = LocalStorageStrategy;
//# sourceMappingURL=LocalStorageStrategy.js.map
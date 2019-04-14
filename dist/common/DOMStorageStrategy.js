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
var DOMStorageStrategy = /** @class */ (function (_super) {
    __extends(DOMStorageStrategy, _super);
    function DOMStorageStrategy() {
        var _this = _super.call(this) || this;
        _this.masterCacheKey = _1.GlobalCacheConfig.globalCacheKey;
        if (typeof localStorage == 'undefined') {
            throw new Error('Platform not supported.');
        }
        return _this;
    }
    DOMStorageStrategy.prototype.add = function (cachePair, cacheKey) {
        var allCachedData = this.getRawData();
        if (!allCachedData[cacheKey]) {
            allCachedData[cacheKey] = [];
        }
        allCachedData[cacheKey].push(cachePair);
        this.storeRawData(allCachedData);
    };
    ;
    DOMStorageStrategy.prototype.getAll = function (cacheKey) {
        return this.getRawData()[cacheKey] || [];
    };
    ;
    DOMStorageStrategy.prototype.removeAtIndex = function (index, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].splice(index, 1);
        }
        this.storeRawData(allCachedData);
    };
    DOMStorageStrategy.prototype.updateAtIndex = function (index, entity, cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey][index]) {
            allCachedData[cacheKey][index] = entity;
        }
        this.storeRawData(allCachedData);
    };
    DOMStorageStrategy.prototype.removeAll = function (cacheKey) {
        var allCachedData = this.getRawData();
        if (allCachedData[cacheKey] && allCachedData[cacheKey].length) {
            allCachedData[cacheKey].length = 0;
        }
        this.storeRawData(allCachedData);
    };
    DOMStorageStrategy.prototype.getRawData = function () {
        var data = localStorage.getItem(this.masterCacheKey);
        try {
            return JSON.parse(data) || {};
        }
        catch (error) {
            throw new Error(error);
        }
    };
    DOMStorageStrategy.prototype.storeRawData = function (data) {
        localStorage.setItem(this.masterCacheKey, JSON.stringify(data));
    };
    return DOMStorageStrategy;
}(IStorageStrategy_1.IStorageStrategy));
exports.DOMStorageStrategy = DOMStorageStrategy;
//# sourceMappingURL=DOMStorageStrategy.js.map
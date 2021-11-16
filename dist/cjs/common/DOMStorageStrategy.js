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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMStorageStrategy = void 0;
var IStorageStrategy_1 = require("./IStorageStrategy");
var _1 = require(".");
/**
 * @deprecated Use {@link LocalStorageStrategy} instead.
 */
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
    DOMStorageStrategy.prototype.addMany = function (cachePairs, cacheKey) {
        var allCachedData = this.getRawData();
        if (!allCachedData[cacheKey]) {
            allCachedData[cacheKey] = [];
        }
        allCachedData[cacheKey] = cachePairs;
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
    DOMStorageStrategy.prototype.remove = function (index, entity, cacheKey) {
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
    DOMStorageStrategy.prototype.update = function (index, entity, cacheKey) {
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
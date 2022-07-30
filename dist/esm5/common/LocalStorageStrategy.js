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
import { IStorageStrategy } from './IStorageStrategy';
import { GlobalCacheConfig } from '.';
var LocalStorageStrategy = /** @class */ (function (_super) {
    __extends(LocalStorageStrategy, _super);
    function LocalStorageStrategy() {
        var _this = _super.call(this) || this;
        _this.masterCacheKey = GlobalCacheConfig.globalCacheKey;
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
}(IStorageStrategy));
export { LocalStorageStrategy };
//# sourceMappingURL=LocalStorageStrategy.js.map
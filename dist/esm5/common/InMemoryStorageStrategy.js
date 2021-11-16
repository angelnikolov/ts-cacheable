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
var InMemoryStorageStrategy = /** @class */ (function (_super) {
    __extends(InMemoryStorageStrategy, _super);
    function InMemoryStorageStrategy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachePairs = [];
        return _this;
    }
    InMemoryStorageStrategy.prototype.add = function (cachePair, cacheKey, ctx) {
        this.cachePairs.push(cachePair);
    };
    ;
    InMemoryStorageStrategy.prototype.addMany = function (cachePairs) {
        this.cachePairs = cachePairs;
    };
    ;
    InMemoryStorageStrategy.prototype.updateAtIndex = function (index, entity) {
        var updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
    };
    InMemoryStorageStrategy.prototype.update = function (index, entity) {
        var updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
    };
    InMemoryStorageStrategy.prototype.getAll = function () {
        return this.cachePairs;
    };
    ;
    InMemoryStorageStrategy.prototype.removeAtIndex = function (index) {
        this.cachePairs.splice(index, 1);
    };
    InMemoryStorageStrategy.prototype.remove = function (index) {
        this.cachePairs.splice(index, 1);
    };
    InMemoryStorageStrategy.prototype.removeAll = function () {
        this.cachePairs.length = 0;
    };
    return InMemoryStorageStrategy;
}(IStorageStrategy));
export { InMemoryStorageStrategy };
//# sourceMappingURL=InMemoryStorageStrategy.js.map
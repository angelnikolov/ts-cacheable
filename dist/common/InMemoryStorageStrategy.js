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
var InMemoryStorageStrategy = /** @class */ (function (_super) {
    __extends(InMemoryStorageStrategy, _super);
    function InMemoryStorageStrategy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cachePairs = [];
        return _this;
    }
    InMemoryStorageStrategy.prototype.add = function (cachePair) {
        this.cachePairs.push(cachePair);
    };
    ;
    InMemoryStorageStrategy.prototype.updateAtIndex = function (index, entity) {
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
    InMemoryStorageStrategy.prototype.removeAll = function () {
        this.cachePairs.length = 0;
    };
    return InMemoryStorageStrategy;
}(IStorageStrategy_1.IStorageStrategy));
exports.InMemoryStorageStrategy = InMemoryStorageStrategy;
//# sourceMappingURL=InMemoryStorageStrategy.js.map
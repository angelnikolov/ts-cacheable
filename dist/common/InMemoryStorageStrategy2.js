"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryStorageStrategy2 = /** @class */ (function () {
    function InMemoryStorageStrategy2() {
        this.cachePairs = [];
    }
    InMemoryStorageStrategy2.prototype.add = function (cachePair) {
        this.cachePairs.push(cachePair);
    };
    ;
    InMemoryStorageStrategy2.prototype.updateAtIndex = function () {
    };
    InMemoryStorageStrategy2.prototype.getAll = function () {
        return this.cachePairs;
    };
    ;
    InMemoryStorageStrategy2.prototype.removeAtIndex = function (index) {
        this.cachePairs.splice(index, 1);
    };
    InMemoryStorageStrategy2.prototype.removeAll = function () {
        this.cachePairs.length = 0;
    };
    return InMemoryStorageStrategy2;
}());
exports.InMemoryStorageStrategy2 = InMemoryStorageStrategy2;
//# sourceMappingURL=InMemoryStorageStrategy2.js.map
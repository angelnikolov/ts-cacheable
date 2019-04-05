"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomPersistenceAdapter = /** @class */ (function () {
    function DomPersistenceAdapter(persistenceAdapter) {
        this.persistenceAdapter = persistenceAdapter;
    }
    DomPersistenceAdapter.prototype.get = function (key) {
        if (this.persistenceAdapter === window.localStorage) {
            return this.persistenceAdapter.getItem(key);
        }
        return this.persistenceAdapter.get(key);
    };
    DomPersistenceAdapter.prototype.set = function (key, value) {
        if (this.persistenceAdapter === window.localStorage) {
            this.persistenceAdapter.setItem(key, value);
        }
        else {
            this.persistenceAdapter.set(key, value);
        }
        return this.persistenceAdapter;
    };
    return DomPersistenceAdapter;
}());
exports.DomPersistenceAdapter = DomPersistenceAdapter;
//# sourceMappingURL=DomPersistenceAdapter.js.map
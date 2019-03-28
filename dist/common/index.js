"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
//# sourceMappingURL=index.js.map
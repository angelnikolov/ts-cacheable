"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInstant = exports.bustCache = void 0;
function bustCache(cacheBusterConfig) {
    if (cacheBusterConfig === null || cacheBusterConfig === void 0 ? void 0 : cacheBusterConfig.cacheBusterNotifier) {
        cacheBusterConfig.cacheBusterNotifier.next();
    }
}
exports.bustCache = bustCache;
function isInstant(cacheBusterConfig) {
    return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant;
}
exports.isInstant = isInstant;
//# sourceMappingURL=CacheBusterFunctions.js.map
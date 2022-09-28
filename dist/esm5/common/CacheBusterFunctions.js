export function bustCache(cacheBusterConfig) {
    if (cacheBusterConfig === null || cacheBusterConfig === void 0 ? void 0 : cacheBusterConfig.cacheBusterNotifier) {
        cacheBusterConfig.cacheBusterNotifier.next();
    }
}
export function isInstant(cacheBusterConfig) {
    return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant;
}
//# sourceMappingURL=CacheBusterFunctions.js.map
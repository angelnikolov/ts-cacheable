"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CACHE_RESOLVER = function (oldParams, newParams) {
    return JSON.stringify(oldParams) === JSON.stringify(newParams);
};
exports.makeCacheableDecorator = function (decorate) {
    return function Cacheable(cacheConfig) {
        return function (_target, _propertyKey, propertyDescriptor) {
            var oldMethod = propertyDescriptor.value;
            if (propertyDescriptor && propertyDescriptor.value) {
                var cachePairs = [];
                var pendingCachePairs = [];
                decorate(propertyDescriptor, oldMethod, cachePairs, pendingCachePairs, cacheConfig ? cacheConfig : {});
            }
            return propertyDescriptor;
        };
    };
};
exports.makeCacheBusterDecorator = function (decorate) {
    return function CacheBuster(cacheBusterConfig) {
        return function (_target, _propertyKey, propertyDescriptor) {
            var oldMethod = propertyDescriptor.value;
            if (propertyDescriptor && propertyDescriptor.value) {
                decorate(propertyDescriptor, oldMethod, cacheBusterConfig);
            }
            return propertyDescriptor;
        };
    };
};
//# sourceMappingURL=index.js.map
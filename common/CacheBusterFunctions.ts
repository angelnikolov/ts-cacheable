import {ICacheBusterConfig, ICacheBusterConfigInstant} from "./ICacheBusterConfig";

export function bustCache(cacheBusterConfig: ICacheBusterConfig): void {
  if (cacheBusterConfig?.cacheBusterNotifier) {
    cacheBusterConfig.cacheBusterNotifier.next();
  }
}

export function isInstant(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): boolean {
  return cacheBusterConfig && 'isInstant' in cacheBusterConfig && cacheBusterConfig.isInstant
}

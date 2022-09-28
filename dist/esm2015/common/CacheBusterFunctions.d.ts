import { ICacheBusterConfig, ICacheBusterConfigInstant } from "./ICacheBusterConfig";
export declare function bustCache(cacheBusterConfig: ICacheBusterConfig): void;
export declare function isInstant(cacheBusterConfig?: ICacheBusterConfig | ICacheBusterConfigInstant): boolean;

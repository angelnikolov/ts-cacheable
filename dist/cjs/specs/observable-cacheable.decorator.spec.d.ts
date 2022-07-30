import { ICachePair } from '../common';
import { InMemoryStorageStrategy } from '../common/InMemoryStorageStrategy';
export declare class CustomContextStrategy extends InMemoryStorageStrategy {
    add(cachePair: ICachePair<any>, cacheKey: string, ctx?: any): void;
}

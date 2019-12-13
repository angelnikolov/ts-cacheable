import { ICachePair } from '.';
export declare abstract class IStorageStrategy {
    abstract getAll(cacheKey: string): Array<ICachePair<any>>;
    abstract add(entity: ICachePair<any>, cacheKey: string): void;
    abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string): void;
    abstract removeAtIndex(index: number, cacheKey: string): void;
    abstract removeAll(cacheKey: string): void;
}

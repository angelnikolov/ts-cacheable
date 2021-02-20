import { ICachePair } from '.';
export declare abstract class IAsyncStorageStrategy {
    abstract getAll(cacheKey: string): Array<ICachePair<any>> | Promise<Array<ICachePair<any>>>;
    abstract add(entity: ICachePair<any>, cacheKey: string): void | Promise<void>;
    /**
     * @deprecated Use update instead.
     */
    abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string): void | Promise<void>;
    abstract update?(index: number, entity: ICachePair<any>, cacheKey: string): Promise<void>;
    /**
     * @deprecated Use remove instead.
     */
    abstract removeAtIndex(index: number, cacheKey: string): void | Promise<void>;
    abstract remove?(index: number, entity: ICachePair<any>, cacheKey: string): Promise<void>;
    abstract removeAll(cacheKey: string): void | Promise<void>;
    abstract addMany(entities: ICachePair<any>[], cacheKey: string): Promise<void>;
}

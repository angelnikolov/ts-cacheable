import {ICachePair} from '.';

export abstract class IStorageStrategy {
  abstract getAll(cacheKey: string): Array<ICachePair<any>>;
  abstract add(entity: ICachePair<any>, cacheKey: string): void;
  /**
   * @deprecated Use update instead.
   */
  abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string): void;
  abstract update?(index: number, entity: ICachePair<any>, cacheKey: string): void;
  /**
   * @deprecated Use remove instead.
   */
  abstract removeAtIndex(index: number, cacheKey: string): void;
  abstract remove?(index: number, entity: ICachePair<any>, cacheKey: string): void;
  abstract removeAll(cacheKey: string): void;
  abstract addMany(entities: ICachePair<any>[], cacheKey: string): void;
}
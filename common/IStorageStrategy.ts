import {ICachePair} from '.';

export abstract class IStorageStrategy {
  abstract getAll(cacheKey: string, ctx?: any): Array<ICachePair<any>>;
  abstract add(entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  /**
   * @deprecated Use update instead.
   */
  abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  abstract update?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  /**
   * @deprecated Use remove instead.
   */
  abstract removeAtIndex(index: number, cacheKey: string, ctx?: any): void;
  abstract remove?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  abstract removeAll(cacheKey: string, ctx?: any): void;
  abstract addMany(entities: ICachePair<any>[], cacheKey: string, ctx?: any): void;
}
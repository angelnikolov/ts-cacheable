import {ICachePair} from '.';

export abstract class IAsyncStorageStrategy {
  abstract getAll(cacheKey: string, ctx?: any): Array<ICachePair<any>> | Promise<Array<ICachePair<any>>>;
  abstract add(entity: ICachePair<any>, cacheKey: string, ctx?: any): void | Promise<void>;
  /**
   * @deprecated Use update instead.
   */
  abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void | Promise<void>;
  abstract update?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): Promise<void>;
  /**
   * @deprecated Use remove instead.
   */
  abstract removeAtIndex(index: number, cacheKey: string, ctx?: any): void | Promise<void>;
  abstract remove?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): Promise<void>;
  abstract removeAll(cacheKey: string, ctx?: any): void | Promise<void>;
  abstract addMany(entities: ICachePair<any>[], cacheKey: string, ctx?: any): Promise<void>;
}
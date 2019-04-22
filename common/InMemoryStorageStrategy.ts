import { IStorageStrategy } from './IStorageStrategy';
import { ICachePair } from '.';

export class InMemoryStorageStrategy extends IStorageStrategy {
  private cachePairs: Array<ICachePair<any>> = [];

  add(cachePair: ICachePair<any>) {
    this.cachePairs.push(cachePair)
  };

  updateAtIndex(index: number, entity: ICachePair<any>) {
    const updatee = this.cachePairs[index];
    Object.assign(updatee, entity);
  }

  getAll() {
    return this.cachePairs;
  };

  removeAtIndex(index: number) {
    this.cachePairs.splice(index, 1);
  }

  removeAll() {
    this.cachePairs.length = 0;
  }
}

import { IStorageStrategy } from './IStorageStrategy';
import { Observable } from 'rxjs';
import { ICachePair } from '.';

export class InMemoryStorageStrategy extends IStorageStrategy {
  private cachePairs: Array<ICachePair<Observable<any>>> = [];

  add(cachePair: ICachePair<Observable<any>>) {
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

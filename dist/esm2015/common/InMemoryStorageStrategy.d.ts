import { IStorageStrategy } from './IStorageStrategy';
import { ICachePair } from '.';
export declare class InMemoryStorageStrategy extends IStorageStrategy {
    private cachePairs;
    add(cachePair: ICachePair<any>): void;
    updateAtIndex(index: number, entity: ICachePair<any>): void;
    getAll(): ICachePair<any>[];
    removeAtIndex(index: number): void;
    removeAll(): void;
}

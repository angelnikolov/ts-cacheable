import { IStorageStrategy } from './IStorageStrategy';
import { Observable } from 'rxjs';
import { ICachePair } from '.';
export declare class InMemoryStorageStrategy extends IStorageStrategy {
    private cachePairs;
    add(cachePair: ICachePair<Observable<any>>): void;
    updateAtIndex(index: number, entity: ICachePair<any>): void;
    getAll(): ICachePair<Observable<any>>[];
    removeAtIndex(index: number): void;
    removeAll(): void;
}

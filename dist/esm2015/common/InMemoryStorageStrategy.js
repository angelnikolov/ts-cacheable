import { IStorageStrategy } from './IStorageStrategy';
export class InMemoryStorageStrategy extends IStorageStrategy {
    constructor() {
        super(...arguments);
        this.cachePairs = [];
    }
    add(cachePair) {
        this.cachePairs.push(cachePair);
    }
    ;
    updateAtIndex(index, entity) {
        const updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
    }
    getAll() {
        return this.cachePairs;
    }
    ;
    removeAtIndex(index) {
        this.cachePairs.splice(index, 1);
    }
    removeAll() {
        this.cachePairs.length = 0;
    }
}
//# sourceMappingURL=InMemoryStorageStrategy.js.map
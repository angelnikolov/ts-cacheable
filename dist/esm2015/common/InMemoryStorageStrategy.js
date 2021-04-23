import { IStorageStrategy } from './IStorageStrategy';
export class InMemoryStorageStrategy extends IStorageStrategy {
    constructor() {
        super(...arguments);
        this.cachePairs = [];
    }
    add(cachePair, cacheKey, ctx) {
        this.cachePairs.push(cachePair);
    }
    ;
    addMany(cachePairs) {
        this.cachePairs = cachePairs;
    }
    ;
    updateAtIndex(index, entity) {
        const updatee = this.cachePairs[index];
        Object.assign(updatee, entity);
    }
    update(index, entity) {
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
    remove(index) {
        this.cachePairs.splice(index, 1);
    }
    removeAll() {
        this.cachePairs.length = 0;
    }
}
//# sourceMappingURL=InMemoryStorageStrategy.js.map
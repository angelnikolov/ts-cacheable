import {IPersistenceAdapter} from "./IPersistenceAdapter";

export class DomPersistenceAdapter implements IPersistenceAdapter {
    private persistenceAdapter: any;

    constructor(persistenceAdapter) {
        this.persistenceAdapter = persistenceAdapter;
    }
    get(key): any {
        if (this.persistenceAdapter === window.localStorage) {
            return this.persistenceAdapter.getItem(key);
        }
        return this.persistenceAdapter.get(key);
    }

    set(key, value): any {
        if (this.persistenceAdapter === window.localStorage) {
            this.persistenceAdapter.setItem(key, value);
        } else {
            this.persistenceAdapter.set(key, value);
        }
        return this.persistenceAdapter;
    }
}

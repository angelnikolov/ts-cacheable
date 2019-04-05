import { IPersistenceAdapter } from "./IPersistenceAdapter";
export declare class DomPersistenceAdapter implements IPersistenceAdapter {
    private persistenceAdapter;
    constructor(persistenceAdapter: any);
    get(key: any): any;
    set(key: any, value: any): any;
}

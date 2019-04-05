import { Observable } from 'rxjs'


export interface IPersistenceAdapter {
    set(key, value): any | Promise<any> | Observable<any>;
    get(key): any | Promise<any> | Observable<any>;
}

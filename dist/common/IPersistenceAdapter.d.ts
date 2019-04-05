import { Observable } from 'rxjs';
export interface IPersistenceAdapter {
    set(key: any, value: any): any | Promise<any> | Observable<any>;
    get(key: any): any | Promise<any> | Observable<any>;
}

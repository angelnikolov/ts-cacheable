import { Subject } from 'rxjs';
export interface ICacheBusterConfig {
    /**
     * pass a Subject which will emit whenever the inner source stream has emitted
     * this can later be subscribed to from Cacheables so they can get rid of their caches
     */
    cacheBusterNotifier?: Subject<any>;
}

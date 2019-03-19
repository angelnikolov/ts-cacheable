import { Observable } from 'rxjs';
import { ICacheRequestResolver, IShouldCacheDecider } from './index';
export interface ICacheConfig {
  /**
   * @description request cache resolver which will get old and new paramaters passed to and based on those
   * will figure out if we need to bail out of cache or not
   */
  cacheResolver?: ICacheRequestResolver;
  /**
   * @description cache decider that will figure out if the response should be cached or not, based on it
   */
  shouldCacheDecider?: IShouldCacheDecider;
  /**
   * maxAge of cache in milliseconds
   * @description if time between method calls is larger - we bail out of cache
   */
  maxAge?: number;
  /**
   * whether should use a sliding expiration strategy on caches
   * this will reset the cache created property and keep the cache alive for @param maxAge milliseconds more
   */
  slidingExpiration?: boolean;
  /**
   * max cacheCount for different parameters
   * @description maximum allowed unique caches (same parameters)
   */
  maxCacheCount?: number;

  /**
   * pass an Observable upon whose emission all caches will be busted
   */
  cacheBusterObserver?: Observable<any>;
}

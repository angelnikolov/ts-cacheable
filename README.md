[![Build Status](https://travis-ci.org/angelnikolov/ngx-cacheable.svg?branch=master)](https://travis-ci.org/angelnikolov/ngx-cacheable)
# ngx-cacheable

Observable cache decorator you can use to decorate class methods which return streams and cache their return values.


## Installing

To install the package, just run

```
npm install ngx-cacheable
```
Import the decorator from ngx-cacheable like:
```
import { Cacheable } from 'ngx-cacheable';
```
and use it decorate any class method like:
```
@Cacheable()
  getUsers() {
    return this.http
    .get(`${environment.api}/users`);
  }
```
Now all subsequent calls to this endpoint will be returned from an in-memory cache, rather than the actual http call!
Another example will be:

```
@Cacheable()
  getUser(id:string) {
    return this.http
    .get(`${environment.api}/users/${id}`);
  }
```
If we call this method by `service.getUser(1)`, its return value will be cached and returned, up until the method is called with a different parameter. Then the old cache will be busted and a new one will take its place.

For more information and other configurations, see the configuration options below

## Configuration
```
export interface ICacheConfig {
  /**
   * pass an Observable upon whose emission all caches will be busted
   */
  cacheBusterObserver?: Observable<void>;
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
   * cache will be resolved asynchronously - an extra change detection pass will be made by
   * @description should cache be resolved asynchronously? - helps with declarative forms and two-way databinding via ngModel
   */
  async?: boolean;
}
```

## Running the tests

Just run `npm test`.

## Contributing

The project is open for contributors! Please file an issue or make a PR:)

## Authors

* **Angel Nikolov** - *Initial work* - https://github.com/angelnikolov


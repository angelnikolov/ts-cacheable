[![Build Status](https://travis-ci.org/angelnikolov/ngx-cacheable.svg?branch=master)](https://travis-ci.org/angelnikolov/ngx-cacheable)
# ngx-cacheable

Observable/Promise cache decorator you can use to decorate class methods which return streams and cache their return values.


## Installing (all examples below will also work with Promise-returning methods and the `PCacheable`, `PCacheBuster` decorators)
To install the package, just run

```
npm install ngx-cacheable
```
Import the decorator from ngx-cacheable like:
```
import { Cacheable } from 'ngx-cacheable';
```
and use it decorate any class method like:
```ts
@Cacheable()
  getUsers() {
    return this.http
    .get(`${environment.api}/users`);
  }
```
Now all subsequent calls to this endpoint will be returned from an in-memory cache, rather than the actual http call!
Another example will be:

```ts
@Cacheable()
  getUser(id:string) {
    return this.http
    .get(`${environment.api}/users/${id}`);
  }
```
If we call this method by `service.getUser(1)`, its return value will be cached and returned, up until the method is called with a different parameter. Then the old cache will be busted and a new one will take its place.

For more information and other configurations, see the configuration options below

## Configuration
```ts
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

## Examples
### Cache Busting
You can achieve it by decorating the cache busting method with the CacheBuster decorator. So you can have one method for fetching and caching data and another, to remove the cache. This is useful when for example you want to add an item to a list and refresh that list afterwards.
```ts
const cacheBuster$ = new Subject<void>();
export class Service {
  @Cacheable({
    cacheBusterObserver: cacheBuster$
  })
  getData() {
    ///needs to return an Observable
  }
  @CacheBuster({
    cacheBusterNotifier: cacheBuster$
  })
  saveData() {
    ///needs to return an Observable
  }
}
```

If you want to globally bust your whole cache (i.e caches of all Cacheable decorators), just import the `globalCacheBusterNotifier` and call `next()` on it, like:
```typescript
import { globalCacheBusterNotifier } from './cacheable.decorator';

globalCacheBusterNotifier.next();
``` 

### Storage Strategies
By default, both the Observable and Promise decorators are caching in-memory only. Now, there's another browser-only caching strategy called DOMCachingStrategy which will use localStorage to persist the data. This means that you can simply provide that strategy **somewhere up top in your application lifecycle** to your decorators with a couple of lines:
```ts
import { GlobalCacheConfig } from '@ngx-cacheable'; 
import { DOMStorageStrategy } from '@ngx-cacheable/common/DOMStorageStrategy'; 
GlobalCacheConfig.storageStrategy = DOMStorageStrategy;
```
And that's it, from then on, your decorators will be `caching` in `localStorage` and all other cache config options from above will just work.
Also, you can specify the caching strategy on a decorator basis, so if you want a different strategy for one decorator only, just provide it via the cacheConfig object like:
```ts
@Cacheable({
    storageStrategy: customCachingStrategy
})
```

### Creating your own strategy
It's also really easy to implement your own caching strategy, by extending the IStorageStrategy abstract class, which has this shape:
```ts
export abstract class IStorageStrategy {
  abstract getAll(cacheKey: string): Array<ICachePair<any>>;
  abstract add(entity: ICachePair<any>, cacheKey: string): void;
  abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string): void;
  abstract removeAtIndex(index: number, cacheKey: string): void;
  abstract removeAll(cacheKey: string): void;
}
```

and then provide it to your decorators as in the example above.

For the `PCacheable` decorator, we also support async promise-based caching strategies. Just extend the `IAsyncStorageStrategy` and provide it to your promise decorators and voila. You can use that to implement Redis caching, IndexDB or whatever async caching you might desire.

**IMPORTANT: Right now, we only support async strategies as a configuration for our promise decorators**
## Running the tests

Just run `npm test`.

## Contributing

The project is open for contributors! Please file an issue or make a PR:)

## Authors

* **Angel Nikolov** - *Initial work* - https://github.com/angelnikolov


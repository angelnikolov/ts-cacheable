[![Actions Status](https://github.com/angelnikolov/ts-cacheable/workflows/test/badge.svg)](https://github.com/angelnikolov/ts-cacheable/actions)
# ngx-cacheable is becoming ts-cacheable
Initially, the project has been created for the purposes of a clientside Angular application. Since then, it has grown into becoming a popular platform-agnostic caching library. Therfore, we no longer need the ngx prefix.


# ts-cacheable

Observable/Promise cache decorator you can use to decorate class methods which return streams and cache their return values.


## Installing (all examples below will also work with Promise-returning methods and the `PCacheable`, `PCacheBuster` decorators)
To install the package, just run

```
npm install ts-cacheable
```
Import the decorator from ts-cacheable like:
```
import { Cacheable } from 'ts-cacheable';
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
   * @description cache hasher which will be called to hash the parameters into a cache key
   */
  cacheHasher?: ICacheHasher;
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

  /**
   * Emit a callback which changes the caches and returns it.
   * Whatever is returned from the callback will be automatically stored against the chosen cacheKey in the
   * storage of the storage strategy you've chosen.
   */
  cacheModifier?: Subject<(cachePairs: ICachePair<Observable<any>>[]) => ICachePair<Observable<any>>[]>;
}
```

## Global Configuration
Some of the local cache config options (passed to specific decorators) can also be used as global ones. All the local configurations will of course take precedence over the global ones.
Here are all the possible global configurations:
```ts
  /**
   * whether should use a sliding expiration strategy on caches
   * this will reset the cache created property and keep the cache alive for @param maxAge milliseconds more
   */
  slidingExpiration: boolean;
  /**
   * max cacheCount for different parameters
   * @description maximum allowed unique caches (same parameters)
   */
  maxCacheCount: number;
  /**
   * @description request cache resolver which will get old and new paramaters passed to and based on those
   * will figure out if we need to bail out of cache or not
   */
  cacheResolver: ICacheRequestResolver;
  /**
   * @description cache hasher which will be called to hash the parameters into a cache key
   */
  cacheHasher: ICacheHasher;
  /**
   * @description cache decider that will figure out if the response should be cached or not, based on it
   */
  shouldCacheDecider: IShouldCacheDecider;
  /**
   * maxAge of cache in milliseconds
   * @description if time between method calls is larger - we bail out of cache
   */
  maxAge: number;
  /**
   * @description storage strategy to be used for setting, evicting and updating cache.
   */
  storageStrategy: new () => IStorageStrategy | IAsyncStorageStrategy;
  /**
   * @description global cache key which will be used to namespace the cache.
   * for example, it will be used in the LocalStorageStrategy for now.
   */
  globalCacheKey: string;
  /**
   * @description a custom promise implementation. For example, if you use angularjs, you might like to provide $q's promise here change detection still works properly.
   */
  promiseImplementation: (() => PromiseConstructorLike) | PromiseConstructorLike;
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
import { globalCacheBusterNotifier } from 'ts-cacheable';

globalCacheBusterNotifier.next();
``` 

### Storage Strategies
By default, both the Observable and Promise decorators are caching in-memory only. Now, there's another browser-only caching strategy called DOMCachingStrategy which will use localStorage to persist the data. This means that you can simply provide that strategy **somewhere up top in your application lifecycle** to your decorators with a couple of lines:
```ts
import { GlobalCacheConfig } from 'ts-cacheable'; 
import { LocalStorageStrategy } from 'ts-cacheable'; 
GlobalCacheConfig.storageStrategy = LocalStorageStrategy;
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
  abstract getAll(cacheKey: string, ctx?: any): Array<ICachePair<any>>;
  abstract add(entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  /**
   * @deprecated Use update instead.
   */
  abstract updateAtIndex(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  abstract update?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  /**
   * @deprecated Use remove instead.
   */
  abstract removeAtIndex(index: number, cacheKey: string, ctx?: any): void;
  abstract remove?(index: number, entity: ICachePair<any>, cacheKey: string, ctx?: any): void;
  abstract removeAll(cacheKey: string, ctx?: any): void;
  abstract addMany(entities: ICachePair<any>[], cacheKey: string, ctx?: any): void;
}
```

and then provide it to your decorators as in the example above.

For the `PCacheable` decorator, we also support async promise-based caching strategies. Just extend the `IAsyncStorageStrategy` and provide it to your promise decorators and voila. You can use that to implement Redis caching, IndexDB or whatever async caching you might desire.

**IMPORTANT: Right now, we only support async strategies as a configuration for our promise decorators**

### Changing, accessing and mutating cache

You can get access to the cached data and change it by providing a `cacheModifier` subject to your decorator like this:
```ts
const cacheModifier = new Subject<any>();
@Cacheable({
  cacheModifier
})
getMutableData(parameter: string) {
  return this.getData(parameter);
}
```

Then, say you want to change the cached data somewhere in your code.
You can emit a callback through the `cacheModifier` subject, which will be called upon all your cached data for this decorator, by:
```ts
cacheModifier.next((data: any[]) => {
  data.find(p => p.parameters[0] === 'test').response.payload = 'test_modified';
  return data;
});
```
What happens here is that we look for the cache under the `'test'` parameter here and modify it to a different string.
`data` is all the caches for this method so you can change it in whatever way you want.

Now, if this method is called with the same parameter as before, it will still return cached data, but this time modified.
You can also delete and add more data to the cache.


## Running the tests

Just run `npm test`.

## Contributing

The project is open for contributors! Please file an issue or make a PR:)

## Authors

* **Angel Nikolov** - *Initial work* - https://github.com/angelnikolov


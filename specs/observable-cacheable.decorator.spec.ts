import { combineLatest, forkJoin, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { globalCacheBusterNotifier } from '../cacheable.decorator';
import { Cacheable } from '../cacheable.decorator';
import { CacheBuster } from '../cache-buster.decorator';
import { timer, Subject } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { GlobalCacheConfig } from '../common';
import { DOMStorageStrategy } from '../common/DOMStorageStrategy';
import { InMemoryStorageStrategy } from '../common/InMemoryStorageStrategy';
import { IService } from './service.interface';
import { Cat } from './cat';
const strategies: any[] = [
  null,
  DOMStorageStrategy
];
strategies.forEach(s => {
  if (s) {
    GlobalCacheConfig.storageStrategy = s;
  }
  describe('CacheableDecorator', () => {
    let service: IService<Observable<any>> = null;
    let mockServiceCallSpy: jasmine.Spy = null;
    beforeEach(() => {
      const cacheBusterNotifier = new Subject();
      class Service {
        mockServiceCall(parameter: any) {
          return timer(1000).pipe(mapTo({ payload: parameter }));
        }
        mockSaveServiceCall() {
          return timer(1000).pipe(mapTo('SAVED'));
        }

        mockServiceCallWithMultipleParameters(parameter1: any, parameter2: any) {
          return timer(1000).pipe(mapTo({ payload: [parameter1, parameter2] }));
        }

        @Cacheable()
        getData(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable()
        getDataWithParamsObj(parameter: any) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable()
        getDataAndReturnCachedStream(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          async: true
        })
        getDataAsync(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          maxAge: 7500
        })
        getDataWithExpiration(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          maxAge: 7500,
          slidingExpiration: true
        })
        getDataWithSlidingExpiration(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          maxCacheCount: 5
        })
        getDataWithMaxCacheCount(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          maxAge: 7500,
          maxCacheCount: 5
        })
        getDataWithMaxCacheCountAndExpiration(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          maxAge: 7500,
          maxCacheCount: 5,
          slidingExpiration: true
        })
        getDataWithMaxCacheCountAndSlidingExpiration(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          cacheResolver: (_oldParameters, newParameters) => {
            return newParameters.find((param: any) => !!param.straightToLastCache);
          }
        })
        getDataWithCustomCacheResolver(
          parameter: string,
          _cacheRerouterParameter?: { straightToLastCache: boolean }
        ) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          cacheHasher: (_parameters) => _parameters[0] * 2,
          cacheResolver: (oldParameter, newParameter) => {
            return newParameter > 5
          }
        })
        getDataWithCustomCacheResolverAndHasher(
          parameter: number
        ) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable()
        getWithAComplexType(
          parameter: Cat
        ) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable({
          shouldCacheDecider: (response: { payload: string }) => {
            return response.payload === 'test';
          }
        })
        getDataWithCustomCacheDecider(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @CacheBuster({
          cacheBusterNotifier: cacheBusterNotifier
        })
        saveDataAndCacheBust() {
          return this.mockSaveServiceCall();
        }

        @Cacheable({
          cacheBusterObserver: cacheBusterNotifier.asObservable()
        })
        getDataWithCacheBusting(parameter: string) {
          return this.mockServiceCall(parameter);
        }

        @Cacheable()
        getDataWithUndefinedParameter(parameter: string = '') {
          return this.mockServiceCall(parameter);
        }

        @Cacheable()
        getDataWithMultipleUndefinedParameters(parameter: string = 'Parameter1', parameter1: string = 'Parameter2') {
          return this.mockServiceCallWithMultipleParameters(parameter, parameter1);
        }

        @Cacheable({
          maxAge: 7500,
          slidingExpiration: true,
          storageStrategy: InMemoryStorageStrategy
        })
        getDateWithCustomStorageStrategyProvided(parameter: string) {
          return this.mockServiceCall(parameter);
        }
      }
      jasmine.clock().install();
      service = new Service();
      mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();
      if (GlobalCacheConfig.storageStrategy === DOMStorageStrategy) {
        localStorage.clear();
      }
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    /**
     * do not use async await when using jasmine.clock()
     * we can mitigate this but will make our tests slower
     * https://www.google.bg/search?q=jasmine.clock.install+%2B+async+await&oq=jasmine.clock.install+%2B+async+await&aqs=chrome..69i57.4240j0j7&sourceid=chrome&ie=UTF-8
     */

    it('return cached data up until a new parameter is passed and the cache is busted', () => {
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getData('test'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(service.getData('test'));
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * response acquired from cache, so no incrementation on the service spy call counter is expected here
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse2 = _timedStreamAsyncAwait(service.getData('test2'));
      expect(cachedResponse2).toEqual(null);

      /**
       * no cache for 'test2', but service call was made so the spy counter is incremented
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getData('test3'),
        1000
      );

      /**
       * service call is made and waited out
       */
      expect(cachedResponse3).toEqual({ payload: 'test3' });

      /**
       * this should NOT return cached response, since the currently cached one should be 'test3'
       */
      const cachedResponse4 = _timedStreamAsyncAwait(service.getData('test'));
      expect(cachedResponse4).toEqual(null);

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
    });

    it('returns observables in cache with a referential type params', () => {
      let params = {
        number: [1]
      };
      /**
       * call the service endpoint with current params values
       */
      service.getDataWithParamsObj(params);

      /**
       * return the response
       */
      jasmine.clock().tick(1000);

      /**
       * change params object values
       */
      params.number.push(2);
      /**
       * call again..
       */
      service.getDataWithParamsObj(params);
      /**
       * service call count should still be 2, since param object has changed
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
    });

    it('return the cached observable up until it completes or errors', () => {
      /**
       * call the service endpoint five hundred times with the same parameter
       * but the service should only be called once, since the observable will be cached
       */
      for (let i = 0; i < 500; i++) {
        service.getDataAndReturnCachedStream('test');
      }

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      /**
       * return the response
       */
      jasmine.clock().tick(1000);
      /**
       * call again..
       */
      service.getDataAndReturnCachedStream('test');
      /**
       * service call count should still be 1, since we are returning from cache now
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
    });

    it('with async:true return cached data ASYNCHRONOUSLY up until a new parameter is passed and the cache is busted', () => {
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDataAsync('test'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponseTry1 = _timedStreamAsyncAwait(
        service.getDataAsync('test')
      );
      /**
       * async cache hasn't resolved yet
       * we need to wait a tick out first
       */
      expect(cachedResponseTry1).toEqual(null);
      /**
       * 1 millisecond delay added, so the async cache resolves
       */
      const cachedResponseTry2 = _timedStreamAsyncAwait(
        service.getDataAsync('test'),
        1
      );
      expect(cachedResponseTry2).toEqual({ payload: 'test' });
      /**
       * response acquired from cache, so no incrementation on the service spy call counter is expected here
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * 1 millisecond delay added, so the async cache resolves
       */
      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDataAsync('test2'),
        1
      );
      expect(cachedResponse2).toEqual(null);

      /**
       * no cache for 'test2', but service call was made so the spy counter is incremented
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getDataAsync('test3'),
        1000
      );

      /**
       * service call is made and waited out
       */
      expect(cachedResponse3).toEqual({ payload: 'test3' });

      /**
       * this should return cached response, since the currently cached one should be 'test3'
       * 1 millisecond delay added, so the async cache resolves
       */
      const cachedResponse4 = _timedStreamAsyncAwait(
        service.getDataAsync('test'),
        1
      );
      expect(cachedResponse4).toEqual(null);

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
    });
    it('return cached date up until the maxAge period has passed and then bail out to data source', () => {
      jasmine.clock().mockDate();
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDataWithExpiration('test'),
        1000
      );

      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDataWithExpiration('test')
      );
      /**
       * service shouldn't be called and we should route directly to cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      expect(cachedResponse).toEqual({ payload: 'test' });

      /**
       * progress in time for 7501 ms, e.g - one millisecond after the maxAge would expire
       */
      jasmine.clock().tick(7501);

      /**
       * no cache anymore, bail out to service call
       */
      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDataWithExpiration('test')
      );
      expect(cachedResponse2).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      let asyncFreshDataAfterCacheBust = null;
      service.getDataWithExpiration('test').subscribe(data => {
        asyncFreshDataAfterCacheBust = data;
      });
      jasmine.clock().tick(1000);
      expect(asyncFreshDataAfterCacheBust).toEqual({ payload: 'test' });
    });

    it('return cached data up until the maxAge period but renew the expiration if called within the period', () => {
      jasmine.clock().mockDate();
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDataWithSlidingExpiration('test'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDataWithSlidingExpiration('test')
      );
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * travel through 3000ms of time
       */
      jasmine.clock().tick(3000);
      /**
       * calling the method again should renew expiration for 7500 more milliseconds
       */
      service.getDataWithSlidingExpiration('test').subscribe();
      jasmine.clock().tick(4501);

      /**
       * this should have returned null, if the cache didnt renew
       */

      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDataWithSlidingExpiration('test')
      );
      expect(cachedResponse2).toEqual({ payload: 'test' });
      /**
       * call count is still one, because we renewed the cache 4501ms ago
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * expire cache, shouldn't renew since 7501 ms have ellapsed
       */
      jasmine.clock().tick(7501);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getDataWithSlidingExpiration('test')
      );
      /**
       * cached has expired, request hasn't returned yet but still - the service was called
       */
      expect(cachedResponse3).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
    });

    it('return cached data for 5 unique requests, then should bail to data source', () => {
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      parameters.forEach(async param =>
        _timedStreamAsyncAwait(service.getDataWithMaxCacheCount(param), 1000)
      );
      /**
       * data for all endpoints should be available through cache by now
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDataWithMaxCacheCount('test1')
      );
      expect(cachedResponse).toEqual({ payload: 'test1' });
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      /**
       * this should return a maximum of 5 different cached responses
       */
      const cachedResponseAll = _timedStreamAsyncAwait(
        forkJoin(parameters.map(param => service.getDataWithMaxCacheCount(param)))
      );

      expect(cachedResponseAll).toEqual([
        { payload: 'test1' },
        { payload: 'test2' },
        { payload: 'test3' },
        { payload: 'test4' },
        { payload: 'test5' }
      ]);
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const asyncData = _timedStreamAsyncAwait(
        service.getDataWithMaxCacheCount('test6'),
        1000
      );

      expect(asyncData).toEqual({ payload: 'test6' });
      /** call count incremented by one */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);

      /**
       * by now the response for test6 should be cached and the one for test1 should be free for GC..
       */
      const newParameters = ['test2', 'test3', 'test4', 'test5', 'test6'];

      /**
       * this should return a maximum of 5 different cached responses, with the latest one in the end
       */
      const cachedResponseAll2 = _timedStreamAsyncAwait(
        forkJoin(
          newParameters.map(param => service.getDataWithMaxCacheCount(param))
        ),
        1000
      );

      expect(cachedResponseAll2).toEqual([
        { payload: 'test2' },
        { payload: 'test3' },
        { payload: 'test4' },
        { payload: 'test5' },
        { payload: 'test6' }
      ]);

      /** no service calls will be made, since we have all the responses still cached even after 1s (1000ms) */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
      /**
       * fetch and cache the test7 response
       */
      const nonCachedResponse = _timedStreamAsyncAwait(
        service.getDataWithMaxCacheCount('test7'),
        1000
      );
      expect(nonCachedResponse).toEqual({ payload: 'test7' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);

      /**
       * since the cached response for 'test2' was now removed from cache by 'test7', it shouldn't be available in cache
       */
      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDataWithMaxCacheCount('test2')
      );
      expect(cachedResponse2).toEqual(null);
      /**
       * service call is made anyway
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
    });

    it('return cached data for 5 unique requests all available for 7500ms', () => {
      jasmine.clock().mockDate();

      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      parameters.forEach(param =>
        service.getDataWithMaxCacheCountAndExpiration(param).subscribe()
      );
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      jasmine.clock().tick(1000);
      const cachedResponse2 = _timedStreamAsyncAwait(
        forkJoin(
          parameters.map(param =>
            service.getDataWithMaxCacheCountAndExpiration(param)
          )
        )
      );
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      expect(cachedResponse2).toEqual([
        { payload: 'test1' },
        { payload: 'test2' },
        { payload: 'test3' },
        { payload: 'test4' },
        { payload: 'test5' }
      ]);

      /**
       * expire caches
       */
      jasmine.clock().tick(7501);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getDataWithMaxCacheCountAndExpiration('test1')
      );
      expect(cachedResponse3).toEqual(null);
      /**
       * by now, no cache exists for the 'test1' parameter, so 1 more call will be made to the service
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
    });

    it('return cached data for 5 unique requests all available for 7500ms WITH slidingExpiration on', () => {
      jasmine.clock().mockDate();
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      parameters.forEach(param =>
        service.getDataWithMaxCacheCountAndSlidingExpiration(param).subscribe()
      );
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      /**
       * allow for the mock request to complete
       */
      jasmine.clock().tick(1000);

      /**
       * pass through time to just before the cache expires
       */
      jasmine.clock().tick(7500);
      /**
       * re-call just with test2 so we renew its expiration
       */
      service.getDataWithMaxCacheCountAndSlidingExpiration('test2').subscribe();

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
      /**
       * expire ALL caches except the test2 one
       */
      jasmine.clock().tick(1);
      const cachedResponse = _timedStreamAsyncAwait(
        combineLatest(
          parameters.map(param =>
            service
              .getDataWithMaxCacheCountAndSlidingExpiration(param)
              .pipe(startWith(null))
          )
        )
      );
      /**
       * no cache for 4 payloads, so 4 more calls to the service will be made
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(9);
      expect(cachedResponse).toEqual([
        null,
        { payload: 'test2' },
        null,
        null,
        null
      ]);
      jasmine.clock().uninstall();
    });

    it('return cached data up until new parameters are passed WITH a custom resolver function', () => {
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheResolver('test1'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test1' });
      expect(mockServiceCallSpy).toHaveBeenCalled();

      const asyncFreshData2 = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheResolver('test2'),
        1000
      );
      expect(asyncFreshData2).toEqual({ payload: 'test2' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheResolver('test3', {
          straightToLastCache: true
        })
      );
      expect(cachedResponse).toEqual({ payload: 'test2' });
      /**
       * call count still 2, since we rerouted directly to cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      _timedStreamAsyncAwait(service.getDataWithCustomCacheResolver('test3'));
      /**no cache reerouter -> bail to service call -> increment call counter*/
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
    });

    it('return cached data up until new parameters are passed WITH a custom resolver and hasher function', () => {
      // call once and cache with 3
      _timedStreamAsyncAwait(
        service.getDataWithCustomCacheResolverAndHasher(3),
        1000
      );
      // call twice with 3 and reuse the cached values because of 
      // the custom cache resolver passed to the decorator, i.e - 3 * 2 > 5
      service.getDataWithCustomCacheResolverAndHasher(3);
      service.getDataWithCustomCacheResolverAndHasher(3);
      // call 4 times with an uncashed parameter 2
      service.getDataWithCustomCacheResolverAndHasher(2);
      service.getDataWithCustomCacheResolverAndHasher(2);
      service.getDataWithCustomCacheResolverAndHasher(2);
      service.getDataWithCustomCacheResolverAndHasher(2);

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
    });

    it('return cached data up until new parameters are passed WITH a custom GLOBAL resolver and hasher function', () => {
      GlobalCacheConfig.cacheHasher = (_parameters) => _parameters[0] + '__wehoo';
      GlobalCacheConfig.cacheResolver = (oldParameter, newParameter) => {
        return newParameter === 'cached__wehoo';
      };
      class Service {
        mockServiceCall(parameter: any) {
          return timer(1000).pipe(mapTo({ payload: parameter }));
        }
        @Cacheable()
        getData(parameter: string) {
          return this.mockServiceCall(parameter);
        }
      }
      const service = new Service();
      mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();

      // call once and cache with cached
      _timedStreamAsyncAwait(
        service.getData('cached'),
        1000
      );
      // call twice with cached and reuse the cached values
      service.getData('cached');
      service.getData('cached');
      // call 4 times with an uncashed parameter 2
      service.getData('not-cached');
      service.getData('not-cached');
      service.getData('not-cached');
      service.getData('not-cached');

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
      GlobalCacheConfig.cacheHasher = undefined;
      GlobalCacheConfig.cacheResolver = undefined;
    });

    it('should call a function with a complex instance which should not be touched and passed to the original method as it is', () => {
      const complexObject = new Cat();
      complexObject.name = 'Felix';
      const response = _timedStreamAsyncAwait(
        service.getWithAComplexType(complexObject),
        1000
      );
      expect(service.mockServiceCall).toHaveBeenCalledWith(complexObject);
      // object method would not exist if we have mutated the parameter through the DEFAULT_CACHE_RESOLVER
      expect(response.payload.meow("I am hungry!")).toBe("Felix says I am hungry!")
    });

    it('only cache data when a specific response is returned, otherwise it should bail to service call', () => {
      const asyncData = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheDecider('test1'),
        1000
      );
      expect(asyncData).toEqual({ payload: 'test1' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * this call shouldn't be cached, since the custom response decider hasn't passed
       */
      const cachedData = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheDecider('test1')
      );
      expect(cachedData).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      /**
       * next calls will be for 'test' whose response will match the cache deciders condition and it will be cached
       */

      const asyncData2 = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheDecider('test'),
        1000
      );
      expect(asyncData2).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);

      /**
       * this call has to return cached data, since we the response cache decider should have matched the previous one
       */
      const cachedData2 = _timedStreamAsyncAwait(
        service.getDataWithCustomCacheDecider('test')
      );
      expect(cachedData2).toEqual({ payload: 'test' });
      /**
       * the service call count won't be incremented
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
    });

    it('cache data until the cacheBusterNotifier has emitted', () => {
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDataWithCacheBusting('test'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDataWithCacheBusting('test')
      );
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * response acquired from cache, so no incrementation on the service spy call counter is expected here
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * make the save call
       * after 1 second the cache busting subject will emit and the cache for getDataWithCacheBusting('test') will be relieved of
       */
      expect(
        _timedStreamAsyncAwait(service.saveDataAndCacheBust(), 1000)
      ).toEqual('SAVED');

      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDataWithCacheBusting('test')
      );
      expect(cachedResponse2).toEqual(null);
      /**
       * call count has incremented due to the actual method call (instead of cache)
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      /**
       * pass through 1s of time
       */
      jasmine.clock().tick(1000);
      /**
       * synchronous cached response should now be returned
       */
      expect(
        _timedStreamAsyncAwait(service.getDataWithCacheBusting('test'))
      ).toEqual({ payload: 'test' });
    });

    it('should clear all caches when the global cache buster is called', () => {
      /**
       * call the first method and cache it
       */
      service.getData('test1');
      const asyncFreshData1 = _timedStreamAsyncAwait(
        service.getData('test1'),
        1000
      );
      expect(asyncFreshData1).toEqual({ payload: 'test1' });
      const cachedResponse1 = _timedStreamAsyncAwait(service.getData('test1'));
      expect(cachedResponse1).toEqual({ payload: 'test1' });
      /**
       * even though we called getData twice, this should only be called once
       * since the second call went straight to the cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      service.getData('test2');
      const asyncFreshData2 = _timedStreamAsyncAwait(
        service.getData('test2'),
        1000
      );
      expect(asyncFreshData2).toEqual({ payload: 'test2' });
      const cachedResponse2 = _timedStreamAsyncAwait(service.getData('test2'));
      expect(cachedResponse2).toEqual({ payload: 'test2' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);


      service.getData('test3');
      const asyncFreshData3 = _timedStreamAsyncAwait(
        service.getData('test3'),
        1000
      );
      expect(asyncFreshData3).toEqual({ payload: 'test3' });
      const cachedResponse3 = _timedStreamAsyncAwait(service.getData('test3'));
      expect(cachedResponse3).toEqual({ payload: 'test3' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);

      /**
       * bust all caches
       */
      globalCacheBusterNotifier.next();

      _timedStreamAsyncAwait(
        service.getData('test1'),
        1000
      );
      _timedStreamAsyncAwait(
        service.getData('test2'),
        1000
      );
      _timedStreamAsyncAwait(
        service.getData('test3'),
        1000
      );

      /**
       * if we didn't bust the cache, this would've been 3
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
    });

    it('should not change undefined parameters to null', () => {
      service.getDataWithUndefinedParameter(undefined);
      expect(mockServiceCallSpy).toHaveBeenCalledWith('');
      service.getDataWithUndefinedParameter();
      expect(mockServiceCallSpy).toHaveBeenCalledWith('');

      let mockServiceCallWithMultipleParametersSpy = spyOn(service, 'mockServiceCallWithMultipleParameters').and.callThrough();
      const asyncData = _timedStreamAsyncAwait(
        service.getDataWithMultipleUndefinedParameters(undefined, undefined),
        1000
      );

      expect(asyncData).toEqual({ payload: ['Parameter1', 'Parameter2'] });
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');

      service.getDataWithMultipleUndefinedParameters(undefined, undefined);
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(1);

      service.getDataWithMultipleUndefinedParameters('Parameter1', undefined);
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(2);
    });

    it('should work correctly with a custom storage strategy', () => {
      const addSpy = spyOn(InMemoryStorageStrategy.prototype, 'add').and.callThrough();
      const updateAtIndexSpy = spyOn(InMemoryStorageStrategy.prototype, 'updateAtIndex').and.callThrough();
      const getAllSpy = spyOn(InMemoryStorageStrategy.prototype, 'getAll').and.callThrough();
      const removeAtIndexSpy = spyOn(InMemoryStorageStrategy.prototype, 'removeAtIndex').and.callThrough();
      const removeAllSpy = spyOn(InMemoryStorageStrategy.prototype, 'removeAll').and.callThrough();

      jasmine.clock().mockDate();
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getDateWithCustomStorageStrategyProvided('test'),
        1000
      );
      // called removeAtIndex once, because of how the cache works, it always removes the last cached pair with this method
      expect(removeAtIndexSpy).toHaveBeenCalledTimes(1);
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      // one add call, one getAll call
      expect(getAllSpy).toHaveBeenCalledTimes(1);
      expect(addSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getDateWithCustomStorageStrategyProvided('test')
      );
      // this call will renew the updateAtIndex call count since it's used to renew the cache
      expect(updateAtIndexSpy).toHaveBeenCalledTimes(1);
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      // two getAll calls because we checked for the cache twice, and only one add call, because cache existed
      expect(getAllSpy).toHaveBeenCalledTimes(2);
      expect(addSpy).toHaveBeenCalledTimes(1);

      /**
       * travel through 3000ms of time
       */
      jasmine.clock().tick(3000);
      /**
       * calling the method again should renew expiration for 7500 more milliseconds
       */
      service.getDateWithCustomStorageStrategyProvided('test').subscribe();
      // this call will renew the updateAtIndex call count since it's used to renew the cache
      expect(updateAtIndexSpy).toHaveBeenCalledTimes(2);
      // one more getAll cache and it is renewed
      expect(getAllSpy).toHaveBeenCalledTimes(3);
      expect(addSpy).toHaveBeenCalledTimes(1);
      jasmine.clock().tick(4501);

      /**
       * this should have returned null, if the cache didnt renew
       */

      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getDateWithCustomStorageStrategyProvided('test')
      );
      // this call will renew the updateAtIndex call count since it's used to renew the cache
      expect(updateAtIndexSpy).toHaveBeenCalledTimes(3);
      // one more getAll call, and still just one add call, since the cache was renewed due to sliding expiration
      expect(getAllSpy).toHaveBeenCalledTimes(4);
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(cachedResponse2).toEqual({ payload: 'test' });
      /**
       * call count is still one, because we renewed the cache 4501ms ago
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * expire cache, shouldn't renew since 7501 ms have ellapsed
       */
      jasmine.clock().tick(7501);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getDateWithCustomStorageStrategyProvided('test')
      );
      // cache has expired so the currently cached pair should have been swapped by now by calling the removeAtIndex method first
      expect(removeAtIndexSpy).toHaveBeenCalledTimes(2);
      expect(getAllSpy).toHaveBeenCalledTimes(5);
      expect(addSpy).toHaveBeenCalledTimes(1);
      /**
       * cached has expired, request hasn't returned yet but still - the service was called
       */
      expect(cachedResponse3).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      /**
       * call the global cache buster just so we can test if removeAll was called
       */
      globalCacheBusterNotifier.next();
      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(updateAtIndexSpy).toHaveBeenCalledTimes(3);
      expect(getAllSpy).toHaveBeenCalledTimes(5);
      expect(removeAtIndexSpy).toHaveBeenCalledTimes(2);
      expect(removeAllSpy).toHaveBeenCalled();
    })

    it('use the maxAge and slidingExpiration from the GlobalCacheConfig', () => {
      GlobalCacheConfig.maxAge = 7500;
      GlobalCacheConfig.slidingExpiration = true;
      jasmine.clock().mockDate();
      const asyncFreshData = _timedStreamAsyncAwait(
        service.getData('test'),
        1000
      );
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getData('test')
      );
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * travel through 3000ms of time
       */
      jasmine.clock().tick(3000);
      /**
       * calling the method again should renew expiration for 7500 more milliseconds
       */
      service.getData('test').subscribe();
      jasmine.clock().tick(4501);

      /**
       * this should have returned null, if the cache didnt renew
       */

      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getData('test')
      );
      expect(cachedResponse2).toEqual({ payload: 'test' });
      /**
       * call count is still one, because we renewed the cache 4501ms ago
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * expire cache, shouldn't renew since 7501 ms have ellapsed
       */
      jasmine.clock().tick(7501);

      const cachedResponse3 = _timedStreamAsyncAwait(
        service.getData('test')
      );
      /**
       * cached has expired, request hasn't returned yet but still - the service was called
       */
      expect(cachedResponse3).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      GlobalCacheConfig.maxAge = undefined;
      GlobalCacheConfig.slidingExpiration;
    });

    it('use the maxCacheCount from the GlobalCacheConfig', () => {
      GlobalCacheConfig.maxCacheCount = 5;
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      parameters.forEach(async param =>
        _timedStreamAsyncAwait(service.getData(param), 1000)
      );
      /**
       * data for all endpoints should be available through cache by now
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getData('test1')
      );
      expect(cachedResponse).toEqual({ payload: 'test1' });
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      /**
       * this should return a maximum of 5 different cached responses
       */
      const cachedResponseAll = _timedStreamAsyncAwait(
        forkJoin(parameters.map(param => service.getData(param)))
      );

      expect(cachedResponseAll).toEqual([
        { payload: 'test1' },
        { payload: 'test2' },
        { payload: 'test3' },
        { payload: 'test4' },
        { payload: 'test5' }
      ]);
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const asyncData = _timedStreamAsyncAwait(
        service.getData('test6'),
        1000
      );

      expect(asyncData).toEqual({ payload: 'test6' });
      /** call count incremented by one */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);

      /**
       * by now the response for test6 should be cached and the one for test1 should be free for GC..
       */
      const newParameters = ['test2', 'test3', 'test4', 'test5', 'test6'];

      /**
       * this should return a maximum of 5 different cached responses, with the latest one in the end
       */
      const cachedResponseAll2 = _timedStreamAsyncAwait(
        forkJoin(
          newParameters.map(param => service.getData(param))
        ),
        1000
      );
      expect(cachedResponseAll2).toEqual([
        { payload: 'test2' },
        { payload: 'test3' },
        { payload: 'test4' },
        { payload: 'test5' },
        { payload: 'test6' }
      ]);

      /** no service calls will be made, since we have all the responses still cached even after 1s (1000ms) */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
      /**
       * fetch and cache the test7 response
       */
      const nonCachedResponse = _timedStreamAsyncAwait(
        service.getData('test7'),
        1000
      );
      expect(nonCachedResponse).toEqual({ payload: 'test7' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);

      /**
       * since the cached response for 'test2' was now removed from cache by 'test7', it shouldn't be available in cache
       */
      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getData('test2')
      );
      expect(cachedResponse2).toEqual(null);
      /**
       * service call is made anyway
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);

      GlobalCacheConfig.maxCacheCount = undefined;
    });
    it('use the maxAge from the GlobalCacheConfig', () => {
      GlobalCacheConfig.maxAge = 10000;
      jasmine.clock().mockDate();

      const asyncFreshData = _timedStreamAsyncAwait(
        service.getData('test'),
        1000
      );

      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = _timedStreamAsyncAwait(
        service.getData('test')
      );
      /**
       * service shouldn't be called and we should route directly to cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      expect(cachedResponse).toEqual({ payload: 'test' });

      /**
       * progress in time for 10001 ms, e.g - one millisecond after the maxAge would expire
       */
      jasmine.clock().tick(10001);

      /**
       * no cache anymore, bail out to service call
       */
      const cachedResponse2 = _timedStreamAsyncAwait(
        service.getData('test')
      );
      expect(cachedResponse2).toEqual(null);
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      let asyncFreshDataAfterCacheBust = null;
      service.getData('test').subscribe(data => {
        asyncFreshDataAfterCacheBust = data;
      });
      jasmine.clock().tick(1000);
      expect(asyncFreshDataAfterCacheBust).toEqual({ payload: 'test' });
      GlobalCacheConfig.maxAge = undefined;
    });
  });

  function _timedStreamAsyncAwait(stream$: Observable<any>, skipTime?: number): any {
    let response = null;
    stream$.subscribe(data => {
      response = data;
    });
    if (skipTime) {
      /**
       * use jasmine clock to artificially manipulate time-based web apis like setTimeout, setInterval and Date
       * we can easily use async/await but that means that we will have to actually wait out the time needed for every delay/mock request
       * we can't use fakeAsync/tick here since this is Angular agnostic test and we do not need zonejs or change detection
       */
      jasmine.clock().tick(skipTime);
    }
    return response;
  }
});
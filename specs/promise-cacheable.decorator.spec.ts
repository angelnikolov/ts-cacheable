import { Subject } from 'rxjs';
import { PCacheBuster } from '../promise.cache-buster.decorator';
import { PCacheable } from '../promise.cacheable.decorator';
import { promiseGlobalCacheBusterNotifier } from '../promise.cacheable.decorator';
import { GlobalCacheConfig, ICachePair } from '../common';
import { DOMStorageStrategy } from '../common/DOMStorageStrategy';
import { InMemoryStorageStrategy } from '../common/InMemoryStorageStrategy';
import { IAsyncStorageStrategy } from 'common/IAsyncStorageStrategy';
import { IService } from './service.interface';
import { Cat } from './cat';
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
class AsyncStorageStrategy extends IAsyncStorageStrategy {
  private cachePairs: Array<ICachePair<any>> = [];

  add(cachePair: ICachePair<any>) {
    this.cachePairs.push(cachePair);
    return Promise.resolve();
  };

  updateAtIndex(index: number, entity: ICachePair<any>) {
    const updatee = this.cachePairs[index];
    Object.assign(updatee, entity);
    return Promise.resolve();
  }

  getAll() {
    return Promise.resolve(this.cachePairs);
  };

  removeAtIndex(index: number) {
    this.cachePairs.splice(index, 1);
    return Promise.resolve();
  }

  removeAll() {
    this.cachePairs.length = 0;
    return Promise.resolve();
  }
}
const strategies = [null, AsyncStorageStrategy, DOMStorageStrategy];
strategies.forEach(s => {
  const cacheBusterNotifier = new Subject();
  if (s) {
    GlobalCacheConfig.storageStrategy = s;
  }

  describe('PCacheableDecorator', () => {
    let service: IService<Promise<any>> = null;
    let mockServiceCallSpy: jasmine.Spy = null;
    class Service {
      mockServiceCall(parameter: any) {
        return new Promise<any>(resolve => {
          setTimeout(() => {
            resolve({ payload: parameter });
          }, 300);
        });
      }
      mockSaveServiceCall() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve('SAVED');
          }, 300);
        });
      }

      mockServiceCallWithMultipleParameters(parameter1: any, parameter2: any) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ payload: [parameter1, parameter2] });
          }, 300);
        });
      }

      @PCacheable()
      getData(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getData1(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getData2(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getData3(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getDataWithParamsObj(parameter: any) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getDataAndReturnCachedStream(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        maxAge: 400
      })
      getDataWithExpiration(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        maxAge: 400,
        slidingExpiration: true
      })
      getDataWithSlidingExpiration(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        maxCacheCount: 5
      })
      getDataWithMaxCacheCount(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        maxAge: 400,
        maxCacheCount: 5
      })
      getDataWithMaxCacheCountAndExpiration(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        maxAge: 400,
        maxCacheCount: 5,
        slidingExpiration: true
      })
      getDataWithMaxCacheCountAndSlidingExpiration(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
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

      @PCacheable({
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

      @PCacheable()
      getWithAComplexType(
        parameter: Cat
      ) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable({
        shouldCacheDecider: (response: { payload: string }) => {
          return response.payload === 'test';
        }
      })
      getDataWithCustomCacheDecider(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheBuster({
        cacheBusterNotifier: cacheBusterNotifier
      })
      saveDataAndCacheBust() {
        return this.mockSaveServiceCall();
      }

      @PCacheable({
        cacheBusterObserver: cacheBusterNotifier.asObservable()
      })
      getDataWithCacheBusting(parameter: string) {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getDataWithUndefinedParameter(parameter: string = '') {
        return this.mockServiceCall(parameter);
      }

      @PCacheable()
      getDataWithMultipleUndefinedParameters(parameter: string = 'Parameter1', parameter1: string = 'Parameter2') {
        return this.mockServiceCallWithMultipleParameters(parameter, parameter1);
      }
      @PCacheable({
        maxAge: 400,
        slidingExpiration: true,
        storageStrategy: InMemoryStorageStrategy
      })
      getDateWithCustomStorageStrategyProvided(parameter: string) {
        return this.mockServiceCall(parameter);
      }
    }
    beforeEach(() => {
      service = new Service();
      mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();
      if (GlobalCacheConfig.storageStrategy === DOMStorageStrategy) {
        localStorage.clear();
      }
    });

    it('return cached data up until a new parameter is passed and the cache is busted', async () => {
      const asyncFreshData = await service.getData('test');
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getData('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * response acquired from cache, so no incrementation on the service spy call counter is expected here
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      await service.getData('test2');

      /**
       * no cache for 'test2', but service call was made so the spy counter is incremented
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      const cachedResponse3 = await service.getData('test3');

      // /**
      //  * service call is made and waited out
      //  */
      expect(cachedResponse3).toEqual({ payload: 'test3' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);

      /**
       * this should NOT return cached response, since the currently cached one should be 'test3'
       */
      await service.getData('test');

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(4);
    });

    it('returns promises in cache with a referential type params', async (done) => {
      let params = {
        number: [1]
      };
      /**
       * call the service endpoint with current params values
       */
      await service.getDataWithParamsObj(params);

      /**
       * change params object values
       */
      params.number.push(2);
      /**
       * call again..
       */
      await service.getDataWithParamsObj(params);
      /**
       * service call count should still be 2, since param object has changed
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      done();
    });

    it('return the cached observable up until it completes or errors', async (done) => {
      /**
       * call the service endpoint five hundred times with the same parameter
       * but the service should only be called once, since the observable will be cached
       */
      for (let i = 0; i < 500; i++) {
        await service.getDataAndReturnCachedStream('test');
      }

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      setTimeout(async () => {
        /**
         * call again..
         */
        await service.getDataAndReturnCachedStream('test');
        /**
         * service call count should still be 1, since we are returning from cache now
         */
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
        done();
      }, 1000);
    });

    it('return cached date up until the maxAge period has passed and then bail out to data source', async done => {
      const asyncFreshData = await service.getDataWithExpiration('test');

      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getDataWithExpiration('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      setTimeout(async () => {
        /**
         * after 500ms the cache would've expired and we will bail to the data source
         */
        await service.getDataWithExpiration('test');
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
        done();
      }, 500);
    });

    it('return cached data up until the maxAge period but renew the expiration if called within the period', async done => {
      const asyncFreshData = await service.getDataWithSlidingExpiration('test');
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getDataWithSlidingExpiration('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      setTimeout(async () => {
        await service.getDataWithSlidingExpiration('test');
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
        setTimeout(async () => {
          await service.getDataWithSlidingExpiration('test');
          expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
          done();
        }, 500);
      }, 200);
    });

    it('return cached data for 5 unique requests, then should bail to data source', async () => {
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      await Promise.all(parameters.map(
        param => (service.getDataWithMaxCacheCount(param))
      ))
      /**
       * data for all endpoints should be available through cache by now
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const cachedResponse = await service.getDataWithMaxCacheCount('test1');
      expect(cachedResponse).toEqual({ payload: 'test1' });
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      /**
       * this should return a maximum of 5 different cached responses
       */
      const cachedResponseAll = await Promise.all(
        parameters.map(param => service.getDataWithMaxCacheCount(param))
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

      const asyncData = await service.getDataWithMaxCacheCount('test6');

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
      const cachedResponseAll2 = await Promise.all(
        newParameters.map(param => service.getDataWithMaxCacheCount(param))
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
      const nonCachedResponse = await service.getDataWithMaxCacheCount('test7');
      expect(nonCachedResponse).toEqual({ payload: 'test7' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);

      /**
       * since the cached response for 'test2' was now removed from cache by 'test7',
       */
      await service.getDataWithMaxCacheCount('test2');
      /**
       * test2 is not in cache anymore and a service call will be made
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
    });

    it('return cached data for 5 unique requests all available for 7500ms', async (done) => {
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      const cachedResponse2 = await Promise.all(
        parameters.map(param =>
          service.getDataWithMaxCacheCountAndExpiration(param)
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

      setTimeout(async () => {
        await service.getDataWithMaxCacheCountAndExpiration('test1');
        /**
         * by now, no cache exists for the 'test1' parameter, so 1 more call will be made to the service
         */
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
        done();
      }, 500);
    });

    it('return cached data up until new parameters are passed WITH a custom resolver function', async () => {
      const asyncFreshData = await service.getDataWithCustomCacheResolver(
        'test1'
      );
      expect(asyncFreshData).toEqual({ payload: 'test1' });
      expect(mockServiceCallSpy).toHaveBeenCalled();

      const asyncFreshData2 = await service.getDataWithCustomCacheResolver(
        'test2'
      );
      expect(asyncFreshData2).toEqual({ payload: 'test2' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      const cachedResponse = await service.getDataWithCustomCacheResolver(
        'test3',
        {
          straightToLastCache: true
        }
      );
      expect(cachedResponse).toEqual({ payload: 'test2' });
      /**
       * call count still 2, since we rerouted directly to cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      await service.getDataWithCustomCacheResolver('test3');
      /**no cache reerouter -> bail to service call -> increment call counter*/
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
    });

    it('only cache data when a specific response is returned, otherwise it should bail to service call', async () => {
      const asyncData = await service.getDataWithCustomCacheDecider('test1');
      expect(asyncData).toEqual({ payload: 'test1' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      await service.getDataWithCustomCacheDecider('test1');
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      /**
       * next calls will be for 'test' whose response will match the cache deciders condition and it will be cached
       */

      const asyncData2 = await service.getDataWithCustomCacheDecider('test');
      expect(asyncData2).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);

      /**
       * this call has to return cached data, since we the response cache decider should have matched the previous one
       */
      const cachedData2 = await service.getDataWithCustomCacheDecider('test');
      expect(cachedData2).toEqual({ payload: 'test' });
      /**
       * the service call count won't be incremented
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);
    });

    it('cache data until the cacheBusterNotifier has emitted', async () => {
      const asyncFreshData = await service.getDataWithCacheBusting('test');
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getDataWithCacheBusting('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * response acquired from cache, so no incrementation on the service spy call counter is expected here
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      /**
       * make the save call
       * after 1 second the cache busting subject will emit and the cache for getDataWithCacheBusting('test') will be relieved of
       */
      expect(await service.saveDataAndCacheBust()).toEqual('SAVED');

      await service.getDataWithCacheBusting('test');
      /**
       * call count has incremented due to the actual method call (instead of cache)
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
      /**
       * pass through 1s of time
       */
      /**
       * synchronous cached response should now be returned
       */
      expect(await service.getDataWithCacheBusting('test')).toEqual({
        payload: 'test'
      });
    });

    it('should clear all caches when the global cache buster is called', async () => {
      /**
       * call the first method and cache it
       */
      service.getData('test1');
      const asyncFreshData1 = await (
        service.getData('test1')
      );

      expect(asyncFreshData1).toEqual({ payload: 'test1' });
      const cachedResponse1 = await (service.getData('test1'));
      expect(cachedResponse1).toEqual({ payload: 'test1' });
      /**
       * even though we called getData twice, this should only be called once
       * since the second call went straight to the cache
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      service.getData('test2');
      const asyncFreshData2 = await (
        service.getData('test2')
      );

      expect(asyncFreshData2).toEqual({ payload: 'test2' });
      const cachedResponse2 = await (service.getData('test2'));
      expect(cachedResponse2).toEqual({ payload: 'test2' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);

      service.getData('test3');
      const asyncFreshData3 = await (service.getData('test3'));
      expect(asyncFreshData3).toEqual({ payload: 'test3' });
      const cachedResponse3 = await (service.getData('test3'));
      expect(cachedResponse3).toEqual({ payload: 'test3' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(3);

      /**
       * bust all caches
       */
      promiseGlobalCacheBusterNotifier.next();

      await (service.getData('test1'));
      await (service.getData('test2'));
      await (service.getData('test3'));

      /**
       * if we didn't bust the cache, this would've been 3
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(6);
    });

    it('should not change undefined parameters to null', async () => {
      await service.getDataWithUndefinedParameter(undefined);
      expect(mockServiceCallSpy).toHaveBeenCalledWith('');
      await service.getDataWithUndefinedParameter();
      expect(mockServiceCallSpy).toHaveBeenCalledWith('');

      let mockServiceCallWithMultipleParametersSpy = spyOn(service, 'mockServiceCallWithMultipleParameters').and.callThrough();
      await service.getDataWithMultipleUndefinedParameters(undefined, undefined);
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');


      const asyncData = await service.getDataWithMultipleUndefinedParameters(undefined, undefined);

      expect(asyncData).toEqual({ payload: ['Parameter1', 'Parameter2'] });
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledWith('Parameter1', 'Parameter2');

      await service.getDataWithMultipleUndefinedParameters(undefined, undefined);
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(1);

      await service.getDataWithMultipleUndefinedParameters('Parameter1', undefined);
      expect(mockServiceCallWithMultipleParametersSpy).toHaveBeenCalledTimes(2);
    });

    it('should work correctly with a custom storage strategy', async (done) => {
      //for some reason we cant rely on expectations on the other methods here
      const getAllSpy = spyOn(InMemoryStorageStrategy.prototype, 'getAll').and.callThrough();
      const asyncFreshData = await service.getDateWithCustomStorageStrategyProvided('test');
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
      // one add call, one getAll call
      expect(getAllSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getDateWithCustomStorageStrategyProvided('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      expect(getAllSpy).toHaveBeenCalledTimes(2);
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      setTimeout(async () => {
        await service.getDateWithCustomStorageStrategyProvided('test');
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
        // three getAll calls since every time we call the decorated method, we check the cache first
        expect(getAllSpy).toHaveBeenCalledTimes(3);
        setTimeout(async () => {
          await service.getDateWithCustomStorageStrategyProvided('test');
          expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
          done();
        }, 500);
      }, 200);
    });

    it('return cached data up until new parameters are passed WITH a custom resolver and hasher function', async () => {
      // call once and cache with 3
      await service.getDataWithCustomCacheResolverAndHasher(3);
      // call twice with 3 and reuse the cached values because of 
      // the custom cache resolver passed to the decorator, i.e - 3 * 2 > 5
      await service.getDataWithCustomCacheResolverAndHasher(3);
      await service.getDataWithCustomCacheResolverAndHasher(3);
      // call 4 times with an uncashed parameter 2
      await service.getDataWithCustomCacheResolverAndHasher(2);
      await service.getDataWithCustomCacheResolverAndHasher(2);
      await service.getDataWithCustomCacheResolverAndHasher(2);
      await service.getDataWithCustomCacheResolverAndHasher(2);

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
    });

    it('return cached data up until new parameters are passed WITH a custom GLOBAL resolver and hasher function', async () => {
      GlobalCacheConfig.cacheHasher = (_parameters) => _parameters[0] + '__wehoo';
      GlobalCacheConfig.cacheResolver = (oldParameter, newParameter) => {
        return newParameter === 'cached__wehoo';
      };
      class Service {
        mockServiceCall(parameter: any) {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve({ payload: parameter });
            }, 300);
          });
        }
        @PCacheable()
        getData(parameter: string) {
          return this.mockServiceCall(parameter);
        }
      }
      const service = new Service();
      mockServiceCallSpy = spyOn(service, 'mockServiceCall').and.callThrough();

      // call once and cache with cached
      await service.getData('cached');
      // call twice with cached and reuse the cached values
      await service.getData('cached');
      await service.getData('cached');
      // call 4 times with an uncashed parameter 2
      await service.getData('not-cached');
      await service.getData('not-cached');
      await service.getData('not-cached');
      await service.getData('not-cached');

      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);
      GlobalCacheConfig.cacheHasher = undefined;
      GlobalCacheConfig.cacheResolver = undefined;
    });

    it('should call a function with a complex instance which should not be touched and passed to the original method as it is', async () => {
      const complexObject = new Cat();
      complexObject.name = 'Felix';
      const response = await service.getWithAComplexType(complexObject);
      expect(service.mockServiceCall).toHaveBeenCalledWith(complexObject);
      // object method would not exist if we have mutated the parameter through the DEFAULT_CACHE_RESOLVER
      expect(response.payload.meow("I am hungry!")).toBe("Felix says I am hungry!")
    });

    it('use the maxAge and slidingExpiration from the GlobalCacheConfig', async done => {
      GlobalCacheConfig.maxAge = 400;
      GlobalCacheConfig.slidingExpiration = true;

      const asyncFreshData = await service.getData1('test');
      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getData1('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      /**
       * call count should still be one, since we rerouted to cache, instead of service call
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      setTimeout(async () => {
        await service.getData1('test');
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);
        setTimeout(async () => {
          await service.getData1('test');
          expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
          done();
          GlobalCacheConfig.maxAge = undefined;
          GlobalCacheConfig.slidingExpiration = undefined;
        }, 500);
      }, 200);

    });

    it('use the maxCacheCount from the GlobalCacheConfig', async () => {
      GlobalCacheConfig.maxCacheCount = 5;
      /**
       * call the same endpoint with 5 different parameters and cache all 5 responses, based on the maxCacheCount parameter
       */
      const parameters = ['test1', 'test2', 'test3', 'test4', 'test5'];
      await Promise.all(parameters.map(
        param => (service.getData2(param))
      ))
      /**
       * data for all endpoints should be available through cache by now
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      const cachedResponse = await service.getData2('test1');
      expect(cachedResponse).toEqual({ payload: 'test1' });
      /** call count still 5 */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(5);

      /**
       * this should return a maximum of 5 different cached responses
       */
      const cachedResponseAll = await Promise.all(
        parameters.map(param => service.getData2(param))
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

      const asyncData = await service.getData2('test6');

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
      const cachedResponseAll2 = await Promise.all(
        newParameters.map(param => service.getData2(param))
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
      const nonCachedResponse = await service.getData2('test7');
      expect(nonCachedResponse).toEqual({ payload: 'test7' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(7);

      /**
       * since the cached response for 'test2' was now removed from cache by 'test7',
       */
      await service.getData2('test2');
      /**
       * test2 is not in cache anymore and a service call will be made
       */
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(8);
      GlobalCacheConfig.maxCacheCount = undefined;
    });


    it('use the maxAge from the GlobalCacheConfig', async done => {
      GlobalCacheConfig.maxAge = 1000;
      const asyncFreshData = await service.getData3('test');

      expect(asyncFreshData).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      const cachedResponse = await service.getData3('test');
      expect(cachedResponse).toEqual({ payload: 'test' });
      expect(mockServiceCallSpy).toHaveBeenCalledTimes(1);

      setTimeout(async () => {
        /**
         * after 1001ms the cache would've expired and we will bail to the data source
         */
        await service.getData3('test');
        expect(mockServiceCallSpy).toHaveBeenCalledTimes(2);
        GlobalCacheConfig.maxAge = undefined;
        done();
      }, 1001);
    });
  });
});
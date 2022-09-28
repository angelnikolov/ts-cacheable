import {Subject} from "rxjs";
import {NO_PROMISE_ERROR_MESSAGE, PCacheBuster} from "../promise.cache-buster.decorator";

describe('PCacheBusterDecorator', () => {
  const cacheBusterNotifier = new Subject<void>();
  let service: TestService;

  class TestService {
    @PCacheBuster({
      cacheBusterNotifier: cacheBusterNotifier
    })
    public sumWithPromise(a: number, b: number): Promise<number> {
      return Promise.resolve(this.sumValues(a, b));
    }

    // @ts-expect-error
    @PCacheBuster({
      cacheBusterNotifier: cacheBusterNotifier
    })
    public throwWithNonPromiseNonInstant(): void {
      /*
      Method decorated with @PCacheBuster should return Promise.
      If you don't want to change the method signature, set isInstant flag to true.
      */
    }

    @PCacheBuster(
      {
        cacheBusterNotifier: cacheBusterNotifier,
        isInstant: true
      }
    )
    public sumWithInstant(a: number, b: number): number {
      return this.sumValues(a, b);
    }

    @PCacheBuster(
      {
        cacheBusterNotifier: cacheBusterNotifier,
        isInstant: true
      }
    )
    public sumWithInstantAndPromise(a: number, b: number): Promise<number> {
      return Promise.resolve(this.sumValues(a, b));
    }

    public sumValues(a: number, b: number): number {
      return a + b;
    }
  }

  beforeEach(() => {
    service = new TestService();
  })

  it('should create', () => {
    expect(service).toBeTruthy();
  })

  it('should call original method body and return result [isInstant: undefined]', (done) => {
    service.sumWithPromise(1,2).then(res => {
      expect(res).toEqual(3);
      done();
    });
  })

  it('should call original method body and return result [isInstant: true]', () => {
    const res = service.sumWithInstant(1,2);

    expect(res).toEqual(3);
  })

  it('it should throw error if [isInstant: undefined] is decorating method that does not return Promise', () => {
    expect(() => service.throwWithNonPromiseNonInstant()).toThrowError(NO_PROMISE_ERROR_MESSAGE)
  })

  it('should bust the cache before original method has been executed', () => {
    const methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
    const notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();

    service.sumWithInstant(1, 3);

    expect(methodBodySpy).toHaveBeenCalledTimes(1);
    expect(notifierSpy).toHaveBeenCalledTimes(1);
    expect(notifierSpy).toHaveBeenCalledBefore(methodBodySpy);
  })

  it('should bust the cache after original has been executed (Promise resolved)', (done) => {
    const methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
    const notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();

    service.sumWithPromise(1, 3).then(res => {
      expect(methodBodySpy).toHaveBeenCalledTimes(1);
      expect(notifierSpy).toHaveBeenCalledTimes(1);
      expect(methodBodySpy).toHaveBeenCalledBefore(notifierSpy);
      done();
    })
  });

  it('should bust the cache once', (done) => {
    const methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
    const notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();

    service.sumWithInstantAndPromise(1,2).then(_ => {
      expect(methodBodySpy).toHaveBeenCalledTimes(1);
      expect(notifierSpy).toHaveBeenCalledTimes(1);
      done();
    });
  })
})

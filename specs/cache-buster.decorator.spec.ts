import {Observable, of, Subject} from "rxjs";
import {CacheBuster, NO_OBSERVABLE_ERROR_MESSAGE} from "../cache-buster.decorator";
import {delay} from "rxjs/operators";
import {TestScheduler} from "rxjs/testing";

describe('CacheBusterDecorator', () => {
  const cacheBusterNotifier = new Subject<void>();
  let service: TestService;
  let testScheduler: TestScheduler;

  class TestService {
    @CacheBuster({
      cacheBusterNotifier: cacheBusterNotifier
    })
    public sumWithObservableNonInstant(a: number, b: number): Observable<number> {
      return of(this.sumValues(a, b)).pipe(delay(1000));
    }

    // @ts-expect-error
    @CacheBuster({
      cacheBusterNotifier: cacheBusterNotifier
    })
    public throwWithNonObservableNonInstant(): void {
      /*
      Method decorated with @CacheBuster should return observable.
      If you don't want to change the method signature, set isInstant flag to true.
      */
    }

    @CacheBuster(
      {
        cacheBusterNotifier: cacheBusterNotifier,
        isInstant: true
      }
    )
    public sumWithInstant(a: number, b: number): number {
      return this.sumValues(a, b);
    }

    public sumValues(a: number, b: number): number {
      return a + b;
    }
  }

  beforeEach(() => {
    service = new TestService();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  })

  it('should create', () => {
    expect(service).toBeTruthy();
  })

  it('should call original method body and return result [isInstant: undefined]', (done) => {
    service.sumWithObservableNonInstant(1,2).subscribe(res => {
      expect(res).toEqual(3);
      done();
    });
  })

  it('should call original method body and return result [isInstant: true]', () => {
    const res = service.sumWithInstant(1,2);

    expect(res).toEqual(3);
  })

  it('it should throw error if [isInstant: undefined] is decorating method that does not return Observable', () => {
    expect(() => service.throwWithNonObservableNonInstant()).toThrowError(NO_OBSERVABLE_ERROR_MESSAGE)
  })

  it('should bust the cache before original method has been executed', () => {
    const methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
    const notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();

    service.sumWithInstant(1, 3);

    expect(methodBodySpy).toHaveBeenCalledTimes(1);
    expect(notifierSpy).toHaveBeenCalledTimes(1);
    expect(notifierSpy).toHaveBeenCalledBefore(methodBodySpy);
  })

  it('should bust the cache after original has been executed (observable emitted)', (done) => {
    const methodBodySpy = spyOn(service, 'sumValues').and.callThrough();
    const notifierSpy = spyOn(cacheBusterNotifier, 'next').and.callThrough();

    service.sumWithObservableNonInstant(1, 3).subscribe(res => {
      expect(methodBodySpy).toHaveBeenCalledTimes(1);
      expect(notifierSpy).toHaveBeenCalledTimes(1);
      expect(methodBodySpy).toHaveBeenCalledBefore(notifierSpy);
      done();
    })
  });

  it('should wait until observable from decorated method emits and then bust the cache', () => {
    testScheduler.run(({ expectObservable }) => {
      const source$ = service.sumWithObservableNonInstant(1, 2);
      const notifier$ = cacheBusterNotifier;

      expectObservable(source$).toBe('1000ms (a|)', { a: 3 });
      expectObservable(notifier$).toBe('1000ms a', { a: undefined });
    })
  })
})

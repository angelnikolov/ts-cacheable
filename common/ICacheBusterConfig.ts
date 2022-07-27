import { Subject } from 'rxjs';

export interface ICacheBusterConfig {
  /**
   * pass a Subject which will emit whenever the inner source stream has emitted
   * this can later be subscribed to from Cacheables so they can get rid of their caches
   */
  cacheBusterNotifier?: Subject<void>;
}

/**
 * flag that indicates whether cache should be cleared before decorated method is called.
 * False by default, i.e. cache will be cleared after observable from decorated method emits
 */
// isInstant?: boolean;


export type ICacheBusterConfigInstant = ICacheBusterConfig & { isInstant: true };

export type DecoratorFactoryType<T> = (_target: Object, _propertyKey: string, propertyDescriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T>

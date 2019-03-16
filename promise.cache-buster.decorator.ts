import { makeCacheBusterDecorator } from './common';
import { ICacheBusterConfig } from './common/ICacheBusterConfig';

export const PCacheBuster = makeCacheBusterDecorator<Promise<any>>(
  (propertyDescriptor, oldMethod, cacheBusterConfig: ICacheBusterConfig) => {
    /* use function instead of an arrow function to keep context of invocation */
    (propertyDescriptor.value as any) = function(...parameters) {
      return (oldMethod.call(this, ...parameters) as Promise<any>).then(
        response => {
          if (cacheBusterConfig.cacheBusterNotifier) {
            cacheBusterConfig.cacheBusterNotifier.next();
          }
          return response;
        }
      );
    };
  }
);

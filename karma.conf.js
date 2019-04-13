module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: ['ChromeHeadlessNoSandbox'],
    reporters: ['progress', 'karma-typescript'],
    files: [
      './common/index.ts',
      './common/IStorageStrategy.ts',
      './common/InMemoryStorageStrategy.ts',
      './common/DOMStorageStrategy.ts',
      './cacheable.decorator.ts',
      './cache-buster.decorator.ts',
      './cacheable-tests.ts',
      './promise-cacheable-tests.ts',
      './promise.cache-buster.decorator.ts',
      './promise.cacheable.decorator.ts',
      './promise.cacheable.decorator.spec.ts',
      './ls-promise.cacheable.decorator.spec.ts',
      './cacheable.decorator.spec.ts',
      './ls-cacheable.decorator.spec.ts',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json'
    },
    // you can define custom flags
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true
  });
};

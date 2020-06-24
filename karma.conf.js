module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: ['ChromeHeadlessNoSandbox'],
    reporters: ['progress', 'karma-typescript'],
    files: [
      './index.ts',
      './common/index.ts',
      './common/IAsyncStorageStrategy.ts',
      './common/IStorageStrategy.ts',
      './common/DOMStorageStrategy.ts',
      './common/InMemoryStorageStrategy.ts',
      './cacheable.decorator.ts',
      './cache-buster.decorator.ts',
      './promise.cache-buster.decorator.ts',
      './promise.cacheable.decorator.ts',
      './specs/observable-cacheable.decorator.spec.ts',
      './specs/promise-cacheable.decorator.spec.ts',
      './specs/cat.ts',
      './specs/service.interface.ts',
    ],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      reports: {
        lcovonly: {
          "directory": "coverage",
          "subdirectory": "lcov",
          "filename": "coverage.xml",
        }
      }
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

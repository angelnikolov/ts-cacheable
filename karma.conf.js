module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    browsers: ["ChromeHeadlessNoSandbox"],
    reporters: ["progress", "karma-typescript"],
    files: ["./cacheable.decorator.ts", "./cache-buster.decorator.ts", "./cacheable.decorator.spec.ts"],
    preprocessors: {
      "**/*.ts": "karma-typescript"
    },
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.json"
    },
    // you can define custom flags
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"]
      }
    },
    singleRun: true
  });
};

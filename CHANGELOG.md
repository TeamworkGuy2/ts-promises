# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.8.0](N/A) - 2021-06-12
#### Changed
* Update to TypeScript 4.3


--------
### [0.7.0](https://github.com/TeamworkGuy2/ts-promises/commit/a84cb8b418c5f1b4947c8c5678ccfb8a1d912b98) - 2021-03-14
#### Changed
* Switched from `Q` promise implementation to native `Promise`
  * Promise implementation can be changed via public static `Defer.promiseImpl` field


--------
### [0.6.0](https://github.com/TeamworkGuy2/ts-promises/commit/c43791254c763189d9b46051c4da05453532a3e7) - 2020-09-05
#### Changed
* Update to TypeScript 4.0


--------
### [0.5.2](https://github.com/TeamworkGuy2/ts-promises/commit/78769addb7e48c1b99d28a73dff97cf7f1b5b121) - 2019-11-08
#### Changed
* Update to TypeScript 3.7


--------
### [0.5.1](https://github.com/TeamworkGuy2/ts-promises/commit/1a1e73c3601789d7b2856321c3a7b4ebc9027729) - 2019-07-06
#### Changed
* Update to TypeScript 3.5


--------
### [0.5.0](https://github.com/TeamworkGuy2/ts-promises/commit/5538831a4e473328603c068f36c186282ee179a6) - 2018-12-29
#### Changed
* Update to TypeScript 3.2 and fix compile errors
* Added public `Defer.promiseImpl` property which can be overwritten with a custom defer/promise implementation (Q is the default)
* `PsPromise` `isFulfilled()`, `isRejected()`, and `isPending()` no longer based on Q.js definition, compatible with bluebird promises

#### Removed
* `Defer.chainTo()` since it doesn't save much code and obfuscates what's happening
* `PsPromise.inspect()` removed to decouple from Q.js specific features


--------
### [0.4.4](https://github.com/TeamworkGuy2/ts-promises/commit/f0784e1b9a6263fb6ccccae713f658679438bb2b) - 2018-11-23
#### Fixed
* Fixed returning `PsPromise<..., never>` from a `then()` call not falling back to the `then()`'s promise error type


--------
### [0.4.3](https://github.com/TeamworkGuy2/ts-promises/commit/812104f065d8131e1b785b2a4f22a8b9825457a2) - 2018-10-14
#### Changed
* Update to TypeScript 3.1
* Update dev dependencies and @types
* Enable `tsconfig.json` `strict` and fix compile errors
* Removed compiled bin tarball in favor of git tags


--------
### [0.4.2](https://github.com/TeamworkGuy2/ts-promises/commit/7497a3be5c9d262b77d9b0703cf76b57438e37e7) - 2018-04-14
#### Fixed
* Fixed `PsPromise.then()` and `catch()` definitions to return a `PsPromise<..., ...>` type when presented with a generic type or union type.
* Move `@types/q` from `devDependencies` to `dependencies`


--------
### [0.4.1](https://github.com/TeamworkGuy2/ts-promises/commit/8c6924330afa032c6619ee175133233b5ed7b43b) - 2018-04-09
#### Changed
* Update tsconfig.json with `noImplicitReturns: true` and `forceConsistentCasingInFileNames: true`
* Added release tarball and npm script `build-package` to package.json referencing external process to generate tarball


--------
### [0.4.0](N/A) - 2018-03-25
#### Changed
* Update to TypeScript 2.8-rc
* Completely changed PsPromise to leverage conditional types and conditional type inference.
* Updated Defer `resolve()` and `reject()` with generic type defaults
* `PsPromise.then` is no longer compatible with `Promise.then` or `Q.IPromise.then`
  * `PsPromise` no longer extends `Q.Promise>`
  * `PsDeferred` no longer extends `Q.Deferred`

#### Fixed
* Defer `cachedDeferredTask()` and `cachedPromiseTask()` weren't saving their calculated cache data correctly


--------
### [0.3.1](https://github.com/TeamworkGuy2/ts-promises/commit/745e9f5306781df066b9f21f90e72dadbf3bdd8c) - 2018-02-28
#### Changed
* Update to TypeScript 2.7
* Update dependencies: mocha, @types/chai, @types/mocha, @types/node
* Enable tsconfig.json `noImplicitAny` and fix resulting type errors


--------
### [0.3.0](https://github.com/TeamworkGuy2/ts-promises/commit/91f215c1d56f454f0a308750c2a3de95cf48e005) - 2017-11-14
#### Changed
* `package.json` added `strictNullChecks` and enabled `noImplicitThis` and fixed code to support these flags
* Renamed `Defer` methods:
  * `newPromiseResolved()` -> `resolve()`
  * `newPromiseRejected()` -> `reject()`
  * `createCachedDeferredTask()` -> `cachedDeferredTask()`
  * `createCachedPromiseTask()` -> `cachedPromiseTask()`
* Improved `PsPromise` method definitions
* Improved `Throws<T>` norminal interface
* Added unit test

#### Fixed
* Fixed `"catch"` unit test error and several code changes to support new `package.json` flags

#### Removed
* Removed `PsPromise` methods definitions: `fin` and `finally`
* Removed `Defer.runActionForAll()` method


--------
### [0.2.5](https://github.com/TeamworkGuy2/ts-promises/commit/e025ed876978d80bc99bd714d59f9debd6b1c95e) - 2017-08-06
* Full/correct TypeScript 2.4 compatibility


--------
### [0.2.4](https://github.com/TeamworkGuy2/ts-promises/commit/82b526e6a66c50b61e205280697f6401b0283c44) - 2017-08-05
#### Changed
* Updated to TypeScript 2.4


--------
### [0.2.3](https://github.com/TeamworkGuy2/ts-promises/commit/a855f6cc831a5e9618a0df54eb484e346cfd6517) - 2017-05-09
#### Changed
* Updated some documentation to work with Visual Studio
* Updated to TypeScript 2.3, added tsconfig.json, use @types/ definitions


--------
### [0.2.2](https://github.com/TeamworkGuy2/ts-promises/commit/15ac3ec7e29ab86f8218c14b6dbab6d3dde76ab0) - 2017-01-02
#### Changed
* Improved PsPromise definition, added catch(), fin(), and finally()
* Added some more unit tests


--------
### [0.2.1](https://github.com/TeamworkGuy2/ts-promises/commit/b4d43ed4917e40df85e022c7ef97b417a39645fd) - 2016-12-21
#### Changed
* Minor tweaks for TypeScript 2.0 compatibility


--------
### [0.2.0](https://github.com/TeamworkGuy2/ts-promises/commit/ec171a66bc9031732a36f6c7a0e833416afe5cc9) - 2016-10-18
#### Changed
* Defer.throwBack now returns Throws<T>, which is captured by PsPromise (see next line)
* Augmented PsPromise then() and done() with better error type tracking (via Throws<T>) separate from error handler return type (which I previously did not understand was transformed to a success value in chained promises)
* Removed PsDeferredVoid, PsDeferredError<F>, PsDeferredErrorString in favor of just using parameterized PsDeferred and PsPromise types
* Updated mocha test dependency


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-promises/commit/857f754beeeb54f1f4ffcfa95b3055fdbd61d27b) - 2016-05-24
#### Added
Initial commit of existing Defer.ts and tspromises.d.ts (renamed ts-promises.d.ts) originally from ts-mortar library,
split into this separate library and moved out of the nested promises/ directory into the root of project, using mocha and chai for tests.
# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.3.0](N/A) - 2017-11-14
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
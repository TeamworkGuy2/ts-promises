# Change Log
All notable changes to this project will be documented in this file.
This project does its best to adhere to [Semantic Versioning](http://semver.org/).


--------
### [0.2.0](N/A) - 2016-10-18
#### Changed
* Defer.throwBack now returns Throws<T>, which is captured by PsPromise (see next line)
* Augmented PsPromise with better error type tracking (via Throws<T>) separate from error handler return type (which I previously did not understand was transformed to a success value in chained promises)
* Removed PsDeferredVoid, PsDeferredError<F>, PsDeferredErrorString in favor of just using parameterized PsDeferred and PsPromise types
* Updated mocha test dependency


--------
### [0.1.0](https://github.com/TeamworkGuy2/ts-promises/commit/857f754beeeb54f1f4ffcfa95b3055fdbd61d27b) - 2016-05-24
#### Added
Initial commit of existing Defer.ts and tspromises.d.ts (renamed ts-promises.d.ts) originally from ts-mortar library,
split into this separate library and moved out of the nested promises/ directory into the root of project, using mocha and chai for tests.
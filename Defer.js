"use strict";
/** Defer - functions for strongly typed promise/deferred handling
 */
var Defer = /** @class */ (function () {
    function Defer() {
    }
    /** Create a deferred object with a 'promise' property and 'resolve' and 'reject' methods */
    Defer.newDefer = function () {
        return Defer.promiseImpl.defer();
    };
    /** Create a promise already resolved with the given value */
    Defer.resolve = function (resolveValue) {
        return Defer.promiseImpl.resolve(resolveValue);
    };
    /** Create a promise already rejected with the given value */
    Defer.reject = function (rejectValue) {
        return Defer.promiseImpl.reject(rejectValue);
    };
    Defer.when = function (promises) {
        return Defer.promiseImpl.all(promises);
    };
    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    Defer.throw = function (error) {
        throw error;
    };
    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type
     * (Same as throw() but for earlier versions of TypeScript when throw was a keyword not allowed as a method name)
     */
    Defer.throwBack = function (error) {
        throw error;
    };
    /** Run each object from 'args' through 'actionFunc' and return a deferred promise that completes when all of the actions complete
     * @param args an array of objects to pass individually to 'actionFunc''
     * @param actionFunc this action is called with a unique deferred promise that must be resolved or rejected
     * somewhere in the action, and each object from 'args' as a parameter
     * @param failOnFirstError true to stop running the actions when the first one throws an error,
     * else continue running and return a list of successful results
     * @return a promise that returns an array of all of the results returned from the calls to 'actionFunc'
     */
    Defer.runActionForAllInSeries = function (args, actionFunc, stopOnFirstError) {
        if (stopOnFirstError === void 0) { stopOnFirstError = false; }
        var initalDfd = Defer.promiseImpl.defer();
        initalDfd.resolve(null);
        var results = [];
        var errors = [];
        // for each action/argument combination, chain it to the previous action result
        var promise = args.reduce(function runActionForArgInSeries(promise, arg) {
            function successCallNextAction(res) {
                results.push(res);
                var dfd = Defer.promiseImpl.defer();
                actionFunc(dfd, arg);
                return dfd.promise;
            }
            function failureCallNextAction(err) {
                errors.push(err);
                var dfd = Defer.promiseImpl.defer();
                actionFunc(dfd, arg);
                return dfd.promise;
            }
            // handle errors if all actions need to run
            if (!stopOnFirstError) {
                return promise.then(successCallNextAction, failureCallNextAction);
            }
            else {
                return promise.then(successCallNextAction);
            }
        }, initalDfd.promise);
        return promise.then(function (res) {
            results.push(res);
            // remove the first item since the initial promise in the args.reduce(...) call is a dummy promise to start the chain
            results.shift();
            return results;
        });
    };
    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstDfd'.
     * With optional success and failure functions that are called before the 'dstDfd' is resolved/rejected.
     * @param srcPromise the source promise to listen to via Promise.then()
     * @param dstDfd the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     * @param successCb optional function to call if 'srcPromise' succeeds,
     * which can optionally modify the result forwarded to 'dstDfd'
     * @param failureCb optional function to call if 'srcPromise' fails,
     * which can optionally modify the error forwarded to 'dstDfd'
     */
    Defer.chainToWith = function (srcPromise, dstDfd, successCb, failureCb) {
        if (srcPromise == null || dstDfd == null) {
            throw new Error("incorrect usage (" + srcPromise + ", " + dstDfd + ", ...), expected (PsPromise, PsDeferred, ...)");
        }
        srcPromise.then(function chainedPromiseSucess(res) {
            if (successCb) {
                var newRes = null;
                try {
                    newRes = successCb(res);
                }
                catch (successCallErr) {
                    dstDfd.reject(successCallErr);
                }
                if (newRes != null) {
                    res = newRes;
                }
            }
            dstDfd.resolve(res);
        }, function chainedPromiseFailure(err) {
            var newErr = null;
            if (failureCb) {
                var tmpErr = null;
                try {
                    tmpErr = failureCb(err);
                }
                catch (failureCallErr) {
                    tmpErr = failureCallErr;
                }
                if (tmpErr != null) {
                    newErr = tmpErr;
                }
            }
            else {
                newErr = err;
            }
            dstDfd.reject(newErr);
        });
    };
    /** Caches an asynchronous task that returns a deferred so that subsequent calls to
     * the task resolve or reject with the initial cached result or error.
     * @param work the function that performs the work and returns a deferred
     * @return a function with the same signature as 'work' that returns a cached deferred
     */
    Defer.cachedDeferredTask = function (work) {
        var cachedDfd = Defer.newDefer();
        var started = false;
        var cacheDone = false;
        var cacheFailed = false;
        var error = null;
        var cachedData = null;
        function cachedDeferResolver() {
            if (!started) {
                try {
                    var workDfd = work();
                    started = true;
                    workDfd.promise.then(function cachedPromiseSuccess(res) {
                        cachedDfd.resolve(res);
                        cachedData = res;
                        cacheDone = true;
                    }, function cachedPromiseFailure(err2) {
                        cachedDfd.reject(err2);
                        error = err2;
                        cacheFailed = true;
                    });
                }
                catch (err) {
                    cachedDfd.reject(err);
                    error = err;
                    cacheFailed = true;
                }
            }
            return cachedDfd;
        }
        return cachedDeferResolver;
    };
    /** Caches an asynchronous task that returns a promise so that subsequent calls to
     * the task resolve or reject with the initial cached result or error.
     * @param work the function that performs the work and returns a promise
     * @return a function with the same signature as 'work' that returns a cached promise
     */
    Defer.cachedPromiseTask = function (work) {
        var cachedPromise = undefined;
        function cachedPromiseResolver() {
            if (cachedPromise === undefined) {
                var pWork = work();
                cachedPromise = pWork || null;
            }
            return cachedPromise;
        }
        return cachedPromiseResolver;
    };
    /** This is the promise implementation for this library. Native JS 'Promise' is used as the default implementation */
    Defer.promiseImpl = {
        defer: function () {
            var resolve = null;
            var reject = null;
            var p = new Promise(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            return {
                promise: p,
                resolve: resolve,
                reject: reject,
            };
        },
        resolve: function (value) { return Promise.resolve(value); },
        reject: function (reason) { return Promise.reject(reason); },
        all: function (promises) { return Promise.all(promises); },
    };
    return Defer;
}());
module.exports = Defer;

"use strict";
var Q = require("q");
/** Defer - functions for strongly typed promise/deferred handling
 */
var Defer = (function () {
    function Defer() {
    }
    /** Create a Q deferred object with a 'promise' property
     * @return a PS deferred object with success and error return values
     */
    Defer.newDefer = function () {
        return Q.defer();
    };
    Defer.resolve = function (resolveValue) {
        return Q.resolve(resolveValue);
    };
    Defer.reject = function (rejectValue) {
        return Q.reject(rejectValue);
    };
    Defer.when = function (promises) {
        return Q.all(promises);
    };
    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    Defer.throw = function (error) {
        throw error;
    };
    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    Defer.throwBack = function (error) {
        throw error;
    };
    /** Run each object from 'args' through 'actionFunc' and return a deferred promise that completes when all of the actions complete
     * @param args: an array of objects to pass individually to 'actionFunc''
     * @param actionFunc: this action is called with a unique deferred promise that must be resolved or rejected
     * somewhere in the action, and each object from 'args' as a parameter
     * @param failOnFirstError: true to stop running the actions when the first one throws an error,
     * else continue running and return a list of successful results
     * @return a promise that returns an array of all of the results returned from the calls to 'actionFunc'
     */
    Defer.runActionForAllInSeries = function (args, actionFunc, stopOnFirstError) {
        if (stopOnFirstError === void 0) { stopOnFirstError = false; }
        if (typeof actionFunc !== "function") {
            throw new Error("incorrect arguments (" + args + "," + actionFunc + "), expected (Array, Function)");
        }
        var initalDfd = Q.defer();
        initalDfd.resolve(null);
        var results = [];
        var errors = [];
        // for each action/argument combination, chain it to the previous action result
        var promise = args.reduce(function runActionForArgInSeries(promise, arg) {
            function successCallNextAction(res) {
                results.push(res);
                var dfd = Q.defer();
                actionFunc(dfd, arg);
                return dfd.promise;
            }
            function failureCallNextAction(err) {
                errors.push(err);
                var dfd = Q.defer();
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
    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstPromise'
     * @param srcPromise: the source promise to listen to via Promise.then()
     * @param dstPromise: the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     */
    Defer.chainTo = function (srcPromise, dstDfd) {
        srcPromise.then(function chainedPromiseSuccess(res) {
            dstDfd.resolve(res);
        }, function chainedPromiseFailure(err) {
            dstDfd.reject(err);
        });
    };
    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstPromise'.
     * With optional success and failure functions that are called before the 'dstProimse' is resolved/rejected.
     * @param srcPromise: the source promise to listen to via Promise.then()
     * @param dstPromise: the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     * @param [successCall]: optional function to call if 'srcPromise' succeeds,
     * which can optionally modify the result forwarded to 'dstPromise'
     * @param [failureCall]: optional function to call if 'srcPromise' fails,
     * which can optionally modify the error forwarded to 'dstPromise'
     */
    Defer.chainToWith = function (srcPromise, dstDfd, successCall, failureCall) {
        if (srcPromise == null || dstDfd == null) {
            throw new Error("incorrect usage (" + srcPromise + ", " + dstDfd + ", ...), expected (Q.IPromise, Q.Deferred, ...)");
        }
        srcPromise.then(function chainedWithActionPromiseSucess(res) {
            if (successCall) {
                var newRes = null;
                try {
                    newRes = successCall(res);
                }
                catch (successCallErr) {
                    dstDfd.reject(successCallErr);
                }
                if (newRes != null) {
                    res = newRes;
                }
            }
            dstDfd.resolve(res);
        }, function chainedWithActionPromiseFailure(err) {
            var newErr = null;
            if (failureCall) {
                var tmpErr = null;
                try {
                    tmpErr = failureCall(err);
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
     * the task resolve or reject with the initial cached result or error
     * @param work: the function that performs the work and returns a deferred
     * @return a function with the same signature as 'work' that the returns a cached deferred
     */
    Defer.cachedDeferredTask = function (work) {
        function cachedDeferResolver() {
            var cachedDfd = Defer.newDefer();
            var cacheDone = false;
            var cacheFailed = false;
            var error = null;
            var cachedData = null;
            if (cacheDone === true) {
                if (cacheFailed) {
                    cachedDfd.reject(error);
                }
                else {
                    cachedDfd.resolve(cachedData);
                }
            }
            else {
                var workDfd = work();
                workDfd.promise.then(function cachedPromiseSuccess(res) {
                    cachedDfd.resolve(res);
                    cachedData = res;
                    cacheDone = true;
                }, function cachedPromiseFailure(err) {
                    cachedDfd.reject(err);
                    error = err;
                    cacheFailed = true;
                });
            }
            return cachedDfd;
        }
        return cachedDeferResolver;
    };
    /** Caches an asynchronous task that returns a promise so that subsequent calls to
     * the task resolve or reject with the initial cached result or error
     * @param work: the function that performs the work and returns a promise
     * @return a function with the same signature as 'work' that the returns a cached promise
     */
    Defer.cachedPromiseTask = function (work) {
        function cachedPromiseResolver() {
            var cachedPromise = undefined;
            if (cachedPromise === undefined) {
                var workPromise = work();
                cachedPromise = workPromise || null;
            }
            return cachedPromise;
        }
        return cachedPromiseResolver;
    };
    return Defer;
}());
module.exports = Defer;

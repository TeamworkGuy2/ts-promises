import Q = require("q");

/** Defer - functions for strongly typed promise/deferred handling
 */
class Defer {

    /** Create a Q deferred object with a 'promise' property
     * @return a PS deferred object with success and error return values
     */
    static newDefer<T, F>(): PsDeferred<T, F> {
        return <PsDeferred<T, F>>Q.defer<any>();
    }


    static resolve<T, F>(resolveValue: T): PsPromise<T, F> {
        return <PsPromise<T, F>>Q.resolve<any>(resolveValue);
    }


    static reject<T, F>(rejectValue: F): PsPromise<T, F> {
        return <PsPromise<T, F>>Q.reject<any>(rejectValue);
    }


    /** Wait for eight promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, T4, T5, T6, T7, T8, F1, F2, F3, F4, F5, F6, F7, F8>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>, PsPromise<T4, F4>, PsPromise<T5, F5>, PsPromise<T6, F6>, PsPromise<T7, F7>, PsPromise<T8, F8>]): PsPromise<[T1, T2, T3, T4, T5, T6, T7, T8], (F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8)>;
    /** Wait for seven promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, T4, T5, T6, T7, F1, F2, F3, F4, F5, F6, F7>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>, PsPromise<T4, F4>, PsPromise<T5, F5>, PsPromise<T6, F6>, PsPromise<T7, F7>]): PsPromise<[T1, T2, T3, T4, T5, T6, T7], (F1 | F2 | F3 | F4 | F5 | F6 | F7)>;
    /** Wait for sixe promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, T4, T5, T6, F1, F2, F3, F4, F5, F6>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>, PsPromise<T4, F4>, PsPromise<T5, F5>, PsPromise<T6, F6>]): PsPromise<[T1, T2, T3, T4, T5, T6], (F1 | F2 | F3 | F4 | F5 | F6)>;
    /** Wait for five promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, T4, T5, F1, F2, F3, F4, F5>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>, PsPromise<T4, F4>, PsPromise<T5, F5>]): PsPromise<[T1, T2, T3, T4, T5], (F1 | F2 | F3 | F4 | F5)>;
    /** Wait for four promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, T4, F1, F2, F3, F4>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>, PsPromise<T4, F4>]): PsPromise<[T1, T2, T3, T4], (F1 | F2 | F3 | F4)>;
    /** Wait for three promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, T3, F1, F2, F3>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>, PsPromise<T3, F3>]): PsPromise<[T1, T2, T3], (F1 | F2 | F3)>;
    /** Wait for two promises to resolve and return the result in a strongly typed array */
    static when<T1, T2, F1, F2>(promises: [PsPromise<T1, F1>, PsPromise<T2, F2>]): PsPromise<[T1, T2], (F1 | F2)>;
    /** Wait for one promise to resolve and return the result in a strongly typed array with one element */
    static when<T1, F1>(promises: [PsPromise<T1, F1>]): PsPromise<[T1], F1>;
    /** Wait for an array of promises to resolve and return the result in a strongly typed array */
    static when<T, F>(promises: PsPromise<T, F>[]): PsPromise<T[], F>;
    static when<T, F>(promises: PsPromise<T, F>[]): PsPromise<T[], F> {
        return <PsPromise<T[], F>>Q.all(promises);
    }


    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    static throw<F>(error: F): Throws<F> {
        throw error;
    }


    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    static throwBack<F>(error: F): Throws<F> {
        throw error;
    }


    /** Run each object from 'args' through 'actionFunc' and return a deferred promise that completes when all of the actions complete
     * @param args: an array of objects to pass individually to 'actionFunc''
     * @param actionFunc: this action is called with a unique deferred promise that must be resolved or rejected
     * somewhere in the action, and each object from 'args' as a parameter
     * @param failOnFirstError: true to stop running the actions when the first one throws an error,
     * else continue running and return a list of successful results
     * @return a promise that returns an array of all of the results returned from the calls to 'actionFunc'
     */
    static runActionForAllInSeries<T, R, F>(args: T[], actionFunc: (def: PsDeferred<R, F>, obj: T) => void, stopOnFirstError: boolean = false): PsPromise<R[], F> {
        if (typeof actionFunc !== "function") {
            throw new Error("incorrect arguments (" + args + "," + actionFunc + "), expected (Array, Function)");
        }
        var initalDfd = Q.defer<R>();
        initalDfd.resolve(<never>null);
        var results: any[] = [];
        var errors: any[] = [];
        // for each action/argument combination, chain it to the previous action result
        var promise = args.reduce(function runActionForArgInSeries(promise, arg) {
            function successCallNextAction(res: R) {
                results.push(res);
                var dfd = <PsDeferred<R, F>>Q.defer<R>();
                actionFunc(dfd, arg);
                return dfd.promise;
            }

            function failureCallNextAction(err: any) {
                errors.push(err);
                var dfd = <PsDeferred<R, F>>Q.defer<R>();
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

        return <PsPromise<R[], F>>promise.then(function (res) {
            results.push(res);
            // remove the first item since the initial promise in the args.reduce(...) call is a dummy promise to start the chain
            results.shift();
            return results;
        });
    }


    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstPromise'
     * @param srcPromise: the source promise to listen to via Promise.then()
     * @param dstPromise: the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     */
    static chainTo<T, F>(srcPromise: PsPromise<T, F>, dstDfd: PsDeferred<T, F>) {
        srcPromise.then(function chainedPromiseSuccess(res) {
            dstDfd.resolve(res);
        }, function chainedPromiseFailure(err) {
            dstDfd.reject(err);
        });
    }


    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstPromise'.
     * With optional success and failure functions that are called before the 'dstProimse' is resolved/rejected.
     * @param srcPromise: the source promise to listen to via Promise.then()
     * @param dstPromise: the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     * @param [successCall]: optional function to call if 'srcPromise' succeeds,
     * which can optionally modify the result forwarded to 'dstPromise'
     * @param [failureCall]: optional function to call if 'srcPromise' fails,
     * which can optionally modify the error forwarded to 'dstPromise'
     */
    static chainToWith<T, F1, F2>(srcPromise: PsPromise<T, F1>, dstDfd: PsDeferred<T, F2>, successCall: (obj: T) => T | null | undefined, failureCall: (err: F1) => F2 | null | undefined) {
        if (srcPromise == null || dstDfd == null) {
            throw new Error("incorrect usage (" + srcPromise + ", " + dstDfd + ", ...), expected (Q.IPromise, Q.Deferred, ...)");
        }

        srcPromise.then(function chainedWithActionPromiseSucess(res) {
            if (successCall) {
                var newRes: T | null | undefined = null;
                try {
                    newRes = successCall(res);
                } catch (successCallErr) {
                    dstDfd.reject(successCallErr);
                }
                if (newRes != null) {
                    res = newRes;
                }
            }
            dstDfd.resolve(res);
        }, function chainedWithActionPromiseFailure(err) {
            var newErr: F2 = <never>null;
            if (failureCall) {
                var tmpErr: F2 | null | undefined = null;
                try {
                    tmpErr = failureCall(err);
                } catch (failureCallErr) {
                    tmpErr = failureCallErr;
                }
                if (tmpErr != null) {
                    newErr = tmpErr;
                }
            }
            else {
                newErr = <any>err;
            }
            dstDfd.reject(newErr);
        });
    }


    /** Caches an asynchronous task that returns a deferred so that subsequent calls to
     * the task resolve or reject with the initial cached result or error
     * @param work: the function that performs the work and returns a deferred
     * @return a function with the same signature as 'work' that the returns a cached deferred
     */
    static cachedDeferredTask<T, F>(work: () => PsDeferred<T, F>): () => PsDeferred<T, F> {
        function cachedDeferResolver(): PsDeferred<T, F> {
            var cachedDfd = Defer.newDefer<T, F>();
            var cacheDone = false;
            var cacheFailed = false;
            var error: F = <never>null;
            var cachedData: T = <never>null;

            if (<boolean>cacheDone === true) {
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
    }


    /** Caches an asynchronous task that returns a promise so that subsequent calls to
     * the task resolve or reject with the initial cached result or error
     * @param work: the function that performs the work and returns a promise
     * @return a function with the same signature as 'work' that the returns a cached promise
     */
    static cachedPromiseTask<T extends Q.IPromise<any>>(work: () => T): () => T {
        function cachedPromiseResolver(): T {
            var cachedPromise: T = <never>undefined;

            if (cachedPromise === undefined) {
                var workPromise = work();
                cachedPromise = workPromise || null;
            }

            return cachedPromise;
        }

        return cachedPromiseResolver;
    }

}


export = Defer;

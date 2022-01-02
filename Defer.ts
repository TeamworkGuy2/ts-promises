
/** Defer - functions for strongly typed promise/deferred handling
 */
class Defer {
    /** This is the promise implementation for this library. Native JS 'Promise' is used as the default implementation */
    public static promiseImpl: {
        defer<T, F>(): PsDeferred<T, F>;
        resolve<T = any, F = never>(value: T): PsPromise<T, F>;
        reject<T = never, F = any>(error: F): PsPromise<T, F>;
        all<T, F>(promises: PsPromise<T, F>[]): PsPromise<T[], F>;
    } = {
        defer: () => {
            var resolve: (value?: any) => void = <any>null;
            var reject: (reason?: any) => void = <any>null;
            var p = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return {
                promise: <PsPromise<any, any>>p,
                resolve: resolve,
                reject: reject,
            };
        },
        resolve: (value) => <any>Promise.resolve(value),
        reject: (reason) => <any>Promise.reject(reason),
        all: (promises) => <any>Promise.all(<any[]>promises),
    };


    /** Create a deferred object with a 'promise' property and 'resolve' and 'reject' methods */
    static newDefer<T, F>(): PsDeferred<T, F> {
        return Defer.promiseImpl.defer<T, F>();
    }


    /** Create a promise already resolved with the given value */
    static resolve<T = any, F = never>(resolveValue: T): PsPromise<T, F> {
        return Defer.promiseImpl.resolve<T, F>(resolveValue);
    }


    /** Create a promise already rejected with the given value */
    static reject<T = never, F = any>(rejectValue: F): PsPromise<T, F> {
        return Defer.promiseImpl.reject<T, F>(rejectValue);
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
        return <PsPromise<T[], F>>Defer.promiseImpl.all(<any[]>promises);
    }


    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type */
    static throw<F>(error: F): Throws<F> {
        throw error;
    }


    /** Takes an argument and throws it, useful for inferring the type of TypeScript promises without having to explicitly give the type
     * (Same as throw() but for earlier versions of TypeScript when throw was a keyword not allowed as a method name)
     */
    static throwBack<F>(error: F): Throws<F> {
        throw error;
    }


    /** Run each object from 'args' through 'actionFunc' and return a deferred promise that completes when all of the actions complete
     * @param args an array of objects to pass individually to 'actionFunc''
     * @param actionFunc this action is called with a unique deferred promise that must be resolved or rejected
     * somewhere in the action, and each object from 'args' as a parameter
     * @param failOnFirstError true to stop running the actions when the first one throws an error,
     * else continue running and return a list of successful results
     * @return a promise that returns an array of all of the results returned from the calls to 'actionFunc'
     */
    static runActionForAllInSeries<T, R, F>(args: T[], actionFunc: (def: PsDeferred<R, F>, obj: T) => void, stopOnFirstError: boolean = false): PsPromise<R[], F> {
        var initalDfd = Defer.promiseImpl.defer<R, F>();
        initalDfd.resolve(<never>null);
        var results: R[] = [];
        var errors: F[] = [];
        // for each action/argument combination, chain it to the previous action result
        var promise = args.reduce(function runActionForArgInSeries(promise: PsPromise<R, F>, arg: T) {
            function successCallNextAction(res: R) {
                results.push(res);
                var dfd = Defer.promiseImpl.defer<R, F>();
                actionFunc(dfd, arg);
                return dfd.promise;
            }

            function failureCallNextAction(err: F) {
                errors.push(err);
                var dfd = Defer.promiseImpl.defer<R, F>();
                actionFunc(dfd, arg);
                return dfd.promise;
            }

            // handle errors if all actions need to run
            if (!stopOnFirstError) {
                return <PsPromise<R, F>>promise.then(successCallNextAction, failureCallNextAction);
            }
            else {
                return <PsPromise<R, F>>promise.then(successCallNextAction);
            }
        }, initalDfd.promise);

        return <PsPromise<R[], F>>promise.then(function (res: R) {
            results.push(res);
            // remove the first item since the initial promise in the args.reduce(...) call is a dummy promise to start the chain
            results.shift();
            return results;
        });
    }


    /** Chain one deferred to another, so resolve and reject callbacks pass from 'srcPromise' to 'dstDfd'.
     * With optional success and failure functions that are called before the 'dstDfd' is resolved/rejected.
     * @param srcPromise the source promise to listen to via Promise.then()
     * @param dstDfd the destination to pipe 'srcPromise' Promise.resolve() and Promise.reject() callbacks to
     * @param successCb optional function to call if 'srcPromise' succeeds,
     * which can optionally modify the result forwarded to 'dstDfd'
     * @param failureCb optional function to call if 'srcPromise' fails,
     * which can optionally modify the error forwarded to 'dstDfd'
     */
    static chainToWith<T, F1, F2>(srcPromise: PsPromise<T, F1>, dstDfd: PsDeferred<T, F2>, successCb?: ((obj: T) => T | null | undefined) | null, failureCb?: ((err: F1) => F2 | null | undefined) | null) {
        if (srcPromise == null || dstDfd == null) {
            throw new Error("incorrect usage (" + srcPromise + ", " + dstDfd + ", ...), expected (PsPromise, PsDeferred, ...)");
        }

        srcPromise.then(function chainedPromiseSucess(res) {
            if (successCb) {
                var newRes: T | null | undefined = null;
                try {
                    newRes = successCb(res);
                } catch (successCallErr) {
                    dstDfd.reject(<any>successCallErr);
                }
                if (newRes != null) {
                    res = newRes;
                }
            }
            dstDfd.resolve(res);
        }, function chainedPromiseFailure(err) {
            var newErr: F2 = <never>null;
            if (failureCb) {
                var tmpErr: F2 | null | undefined = null;
                try {
                    tmpErr = failureCb(err);
                } catch (failureCallErr) {
                    tmpErr = <any>failureCallErr;
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
     * the task resolve or reject with the initial cached result or error.
     * @param work the function that performs the work and returns a deferred
     * @return a function with the same signature as 'work' that returns a cached deferred
     */
    static cachedDeferredTask<T, F>(work: () => PsDeferred<T, F>): () => PsDeferred<T, F> {
        var cachedDfd = Defer.newDefer<T, F>();
        var started = false;
        var cacheDone = false;
        var cacheFailed = false;
        var error: F = <never>null;
        var cachedData: T = <never>null;

        function cachedDeferResolver(): PsDeferred<T, F> {
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
                    cachedDfd.reject(<any>err);
                    error = <any>err;
                    cacheFailed = true;
                }
            }

            return cachedDfd;
        }

        return cachedDeferResolver;
    }


    /** Caches an asynchronous task that returns a promise so that subsequent calls to
     * the task resolve or reject with the initial cached result or error.
     * @param work the function that performs the work and returns a promise
     * @return a function with the same signature as 'work' that returns a cached promise
     */
    static cachedPromiseTask<T extends PromiseLike<any> | PsPromise<any, any>>(work: () => T): () => T {
        var cachedPromise: T = <never>undefined;

        function cachedPromiseResolver(): T {
            if (cachedPromise === undefined) {
                var pWork = work();
                cachedPromise = pWork || null;
            }

            return cachedPromise;
        }

        return cachedPromiseResolver;
    }

}


export = Defer;

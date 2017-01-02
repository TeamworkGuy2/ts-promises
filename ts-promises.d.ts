/// <reference path="../definitions/q/Q.d.ts" />

// strongly typed promise with error type
interface PsPromise<T, F> extends Q.Promise<T> {
    then<T1, F1>(onFulfill: (value: T) => Throws<F1> | PsPromise<T1, F1>): PsPromise<T1, F | F1>;
    then<T1>    (onFulfill: (value: T) => T1                            ): PsPromise<T1, F>;
    then<T1, T2, F1, F2>(onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T1 | T2, F1 | F2>;
    then<T1,     F1, F2>(onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => Throws<F2>       ): PsPromise<T1, F1 | F2>;
    then<T1, T2, F1>    (onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => T2               ): PsPromise<T1 | T2, F1>;
    then<    T2, F1, F2>(onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T2, F1 | F2>;
    then<        F1, F2>(onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => Throws<F2>       ): PsPromise<void, F1 | F2>;
    then<    T2, F1    >(onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => T2               ): PsPromise<T2, F1>;
    then<T1, T2,     F2>(onFulfill: (value: T) => T1,                onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T1 | T2, F2>;
    then<T1,         F2>(onFulfill: (value: T) => T1,                onReject: (error: F) => Throws<F2>       ): PsPromise<T1, F2>;
    then<T1, T2>        (onFulfill: (value: T) => T1,                onReject: (error: F) => T2               ): PsPromise<T1 | T2, void>;
    then<T1,     F1, F2>(onFulfill?: (value: T) => Throws<F1> | PsPromise<T1, F1> | T1, onReject?: (error: F) => Throws<F2> | PsPromise<T1, F2> | T1): PsPromise<T1, F1 | F2>;
    then<T1, T2, F1, F2>(onFulfill?: (value: T) => Throws<F1> | PsPromise<T1, F1> | T1, onReject?: (error: F) => Throws<F2> | PsPromise<T2, F2> | T2): PsPromise<T1 | T2, F1 | F2>;

    done<T1, F1>    (onFulfilled: (value: T) => Throws<F1> | PsPromise<T1, F1> | T1): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => Throws<F2>): void;
    done<T1, F1    >(onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => T1): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<    F1, F2>(onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => Throws<F2>): void;
    done<T1, F1    >(onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => T1): void;
    done<T1,     F2>(onFulfilled: (value: T) => T1,                onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<T1,     F2>(onFulfilled: (value: T) => T1,                onRejected: (reason: F) => Throws<F2>): void;
    done<T1        >(onFulfilled: (value: T) => T1,                onRejected: (reason: F) => T1): void;
    done<T1, F1, F2>(onFulfilled?: (value: T) => Throws<F1> | PsPromise<T1, F1> | T1, onRejected?: (reason: F) => Throws<F2> | PsPromise<T1, F2> | T1): void;

    catch<    F1>(onRejected: (reason: F) => Throws<F1>                      ): PsPromise<T, F1>;
    catch<T1, F1>(onRejected: (reason: F) => Throws<F1> | Q.IPromise<T1> | T1): PsPromise<T | T1, F | F1>;
    catch<T1>    (onRejected: (reason: F) => Q.IPromise<T1> | T1             ): PsPromise<T1, F>;

    fin(finallyCallback: () => any): PsPromise<T, F>;
    finally(finallyCallback: () => any): PsPromise<T, F>;
}

interface PsDeferred<T, F> extends Q.Deferred<T> {
    promise: PsPromise<T, F>;
    resolve(result?: T);
    reject(reason: F);
}

interface Throws<T1> {
    "ts-promises-Throws": void;
}

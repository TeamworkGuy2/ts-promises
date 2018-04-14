/// <reference types="q" />

interface PromiseThen<T, F> {
    /*
    <T1 = void, F1 = void>(onFulfill?: (value: T) => T1, onReject?: (error: F) => F1):
        // return
        T1 extends PsPromise<infer TR1, infer FR1> ? (
            F1 extends PsPromise<infer TR2, infer FR2> ? PsPromise<(TR1 extends void ? T : TR1) | (TR2 extends void ? T : TR2), (FR1 extends void ? F : FR1) | (FR2 extends void ? F : FR2)> :
            F1 extends Throws<infer FR3> ? PsPromise<(TR1 extends void ? T : TR1), (FR1 extends void ? F : FR1) | FR3> :
            F1 extends void ? PsPromise<(TR1 extends void ? T : TR1), (FR1 extends void ? F : FR1 | F)> :
            PsPromise<(TR1 extends void ? T : TR1) | F1, (FR1 extends void ? F : FR1)>
        ) :
        T1 extends Throws<infer FR4> ? (
            F1 extends PsPromise<infer TR5, infer FR5> ? PsPromise<TR5, (FR4 extends void ? F : FR4) | (FR5 extends void ? F : FR5)> :
            F1 extends Throws<infer FR6> ? PsPromise<never, (FR4 extends void ? F : FR4) | (FR6 extends void ? F : FR6)> :
            F1 extends void ? PsPromise<never, (FR4 extends void ? F : FR4 | F)> :
            PsPromise<F1, FR4>
        ) :
        T1 extends void ? (
            F1 extends PsPromise<infer TR7, infer FR7> ? PsPromise<(TR7 extends void ? T : TR7 | T), (FR7 extends void ? F : FR7)> :
            F1 extends Throws<infer FR8> ? PsPromise<T, (FR8 extends void ? F : FR8)> :
            F1 extends void ? PsPromise<T, F> :
            PsPromise<F1, never>
        ) :
        // T1 = regular return value
            F1 extends PsPromise<infer TR10, infer FR10> ? PsPromise<(TR10 extends void ? T : TR10) | T1, (FR10 extends void ? F : FR10)> :
            F1 extends Throws<infer FR11> ? PsPromise<T1, (FR11 extends void ? F : FR11)> :
            F1 extends void ? PsPromise<T1, F> :
            PsPromise<T1 | F1, never>;
    */

    <T1 = void, F1 = void>(onFulfill?: (value: T) => T1, onReject?: (error: F) => F1):
        // return
        PsPromise<
        // T1
        T1 extends PsPromise<infer TR1, any> ? (
            F1 extends PsPromise<infer TR2, any> ? (TR1 extends void ? T : TR1) | (TR2 extends void ? T : TR2) :
            F1 extends Throws<any> ? (TR1 extends void ? T : TR1) :
            F1 extends void ? (TR1 extends void ? T : TR1) :
            (TR1 extends void ? T : TR1) | F1
        ) :
        T1 extends Throws<any> ? (
            F1 extends PsPromise<infer TR5, any> ? TR5 :
            F1 extends Throws<any> ? never :
            F1 extends void ? never :
            F1
        ) :
        T1 extends void ? (
            F1 extends PsPromise<infer TR7, any> ? (TR7 extends void ? T : TR7 | T) :
            F1 extends Throws<any> ? T :
            F1 extends void ? T :
            F1
        ) :
        // T1 = regular return value
        F1 extends PsPromise<infer TR10, any> ? (TR10 extends void ? T : TR10) | T1 :
        F1 extends Throws<any> ? T1 :
        F1 extends void ? T1 :
        T1 | F1,

        // F1
        T1 extends PsPromise<any, infer FR1> ? (
            F1 extends PsPromise<any, infer FR2> ? (FR1 extends void ? F : FR1) | (FR2 extends void ? F : FR2) :
            F1 extends Throws<infer FR3> ? (FR1 extends void ? F : FR1) | FR3 :
            F1 extends void ? (FR1 extends void ? F : FR1 | F) :
            (FR1 extends void ? F : FR1)
        ) :
        T1 extends Throws<infer FR4> ? (
            F1 extends PsPromise<any, infer FR5> ? (FR4 extends void ? F : FR4) | (FR5 extends void ? F : FR5) :
            F1 extends Throws<infer FR6> ? (FR4 extends void ? F : FR4) | (FR6 extends void ? F : FR6) :
            F1 extends void ? (FR4 extends void ? F : FR4 | F) :
            FR4
        ) :
        T1 extends void ? (
            F1 extends PsPromise<any, infer FR7> ? (FR7 extends void ? F : FR7) :
            F1 extends Throws<infer FR8> ? (FR8 extends void ? F : FR8) :
            F1 extends void ? F :
            never
        ) :
        // T1 = regular return value
        F1 extends PsPromise<any, infer FR10> ? (FR10 extends void ? F : FR10) :
        F1 extends Throws<infer FR11> ? (FR11 extends void ? F : FR11) :
        F1 extends void ? F :
        never
        >;
}

interface PromiseDone<T, F> {
    (onFulfill?: (value: T) => any, onReject?: (error: F) => any): void;
}

interface PromiseCatch<T, F> {
    <F1 = void>(onReject?: (error: F) => F1):
        // return
        PsPromise<
        // T1
        F1 extends PsPromise<infer TR1, any> ? (TR1 extends void ? T : TR1 | T) :
        F1 extends Throws<any> ? T :
        F1 extends void ? T :
        F1 | T,

        // F1
        F1 extends PsPromise<any, infer FR1> ? FR1 :
        F1 extends Throws<infer FR2> ? FR2 :
        F1 extends void ? never :
        never
        >;
}

interface PsPromise<T, F> /* extends Q.Promise<T> */ {
    then: PromiseThen<T, F>;
    done: PromiseDone<T, F>;
    catch: PromiseCatch<T, F>;

    isFulfilled: Q.Promise<T>["isFulfilled"];
    isRejected: Q.Promise<T>["isRejected"];
    isPending: Q.Promise<T>["isPending"];
    inspect: Q.Promise<T>["inspect"];
}


/** strongly typed promise with error type */
/*interface PsPromise<T, F> extends Q.Promise<T> {
    then<T1, F1>        (onFulfill: (value: T) => PsPromise<T1, F1> | Throws<F1>): PsPromise<T1, F | F1>;
    then<T1>            (onFulfill: (value: T) => T1                            ): PsPromise<T1, F>;
    then<T1, T2, F1, F2>(onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T1 | T2, F1 | F2>;
    then<T1,     F1, F2>(onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => Throws<F2>       ): PsPromise<T1, F1 | F2>;
    then<T1, T2, F1>    (onFulfill: (value: T) => PsPromise<T1, F1>, onReject: (error: F) => T2               ): PsPromise<T1 | T2, F1>;
    then<    T2, F1, F2>(onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T2, F1 | F2>;
    then<        F1, F2>(onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => Throws<F2>       ): PsPromise<void, F1 | F2>;
    then<    T2, F1>    (onFulfill: (value: T) => Throws<F1>,        onReject: (error: F) => T2               ): PsPromise<T2, F1>;
    then<T1, T2,     F2>(onFulfill: (value: T) => T1,                onReject: (error: F) => PsPromise<T2, F2>): PsPromise<T1 | T2, F2>;
    then<T1,         F2>(onFulfill: (value: T) => T1,                onReject: (error: F) => Throws<F2>       ): PsPromise<T1, F2>;
    then<T1, T2, F1>    (onFulfill: (value: T) => T1,                onReject: (error: F) => Throws<F1> | T2  ): PsPromise<T1 | T2, F1>;
    then<T1, T2>        (onFulfill: (value: T) => T1,                onReject: (error: F) => T2               ): PsPromise<T1 | T2, void>;
    then<T1,     F1, F2>(onFulfill?: (value: T) => PsPromise<T1, F1> | Throws<F1> | T1, onReject?: (error: F) => PsPromise<T1, F2> | Throws<F2> | T1): PsPromise<T1, F1 | F2>;
    then<T1, T2, F1, F2>(onFulfill?: (value: T) => PsPromise<T1, F1> | Throws<F1> | T1, onReject?: (error: F) => PsPromise<T2, F2> | Throws<F2> | T2): PsPromise<T1 | T2, F1 | F2>;

    done<T1, F1>    (onFulfilled: (value: T) => PsPromise<T1, F1> | Throws<F1> | T1): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => Throws<F2>): void;
    done<T1, F1>    (onFulfilled: (value: T) => PsPromise<T1, F1>, onRejected: (reason: F) => T1): void;
    done<T1, F1, F2>(onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<    F1, F2>(onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => Throws<F2>): void;
    done<T1, F1>    (onFulfilled: (value: T) => Throws<F1>,        onRejected: (reason: F) => T1): void;
    done<T1,     F2>(onFulfilled: (value: T) => T1,                onRejected: (reason: F) => PsPromise<T1, F2>): void;
    done<T1,     F2>(onFulfilled: (value: T) => T1,                onRejected: (reason: F) => Throws<F2>): void;
    done<T1>        (onFulfilled: (value: T) => T1,                onRejected: (reason: F) => T1): void;
    done<T1, F1, F2>(onFulfilled?: (value: T) => PsPromise<T1, F1> | Throws<F1> | T1, onRejected?: (reason: F) => PsPromise<T1, F2> | Throws<F2> | T1): void;

    catch<    F1>(onRejected: (reason: F) => Throws<F1>                         ): PsPromise<T, F1>;
    catch<    F1>(onRejected: (reason: F) => Throws<F1>                         ): PsPromise<T, F1>;
    catch<T1, F1>(onRejected: (reason: F) => Throws<F1> | T1                    ): PsPromise<T | T1, F1>;
    catch<T1, F1>(onRejected: (reason: F) => Throws<F1> | PsPromise<T1, F1> | T1): PsPromise<T | T1, F1>;
    catch<T1, F1>(onRejected: (reason: F) => PsPromise<T1, F1> | T1             ): PsPromise<T | T1, void>;
}*/

interface PsDeferred<T, F> {
    promise: PsPromise<T, F>;
    resolve(result?: T): void;
    reject(reason: F): void;
}

interface Throws<T1> {
    "Throws-T1": T1;
    "ts-promises-Throws": void;
}

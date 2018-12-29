interface PromiseThen<T, F> {
    <T1 = void, F1 = void>(onFulfill?: (value: T) => T1, onReject?: (error: F) => F1):
        // return
        PsPromise<
        // T1
        T1 extends PsPromise<infer TR1, any> ? (
            F1 extends PsPromise<infer TR2, any> ? (TR1 extends void ? T : TR1) | (TR2 extends void ? T : TR2) :
            F1 extends Throws<any> | void ? (TR1 extends void ? T : TR1) :
            (TR1 extends void ? T : TR1) | F1
        ) :
        T1 extends Throws<any> ? (
            F1 extends PsPromise<infer TR5, any> ? TR5 :
            F1 extends Throws<any> | void ? never :
            F1
        ) :
        T1 extends void ? (
            F1 extends PsPromise<infer TR7, any> ? (TR7 extends void ? T : TR7) | T :
            F1 extends Throws<any> | void ? T :
            F1
        ) :
        // T1 = regular return value
        F1 extends PsPromise<infer TR10, any> ? (TR10 extends void ? T : TR10) | T1 :
        F1 extends Throws<any> | void ? T1 :
        T1 | F1,

        // F1
        T1 extends PsPromise<any, infer FR1> ? (
            F1 extends PsPromise<any, infer FR2> ? (FR1 extends void ? F : FR1) | (FR2 extends void ? F : FR2) :
            F1 extends Throws<infer FR3> ? (FR1 extends void ? F : FR1) | FR3 :
            F1 extends void ? (FR1 extends void ? F : FR1) | F :
            (FR1 extends void ? F : FR1)
        ) :
        T1 extends Throws<infer FR4> ? (
            F1 extends PsPromise<any, infer FR5> ? (FR4 extends void ? F : FR4) | (FR5 extends void ? F : FR5) :
            F1 extends Throws<infer FR6> ? (FR4 extends void ? F : FR4) | (FR6 extends void ? F : FR6) :
            F1 extends void ? (FR4 extends void ? F : FR4) | F :
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

interface PsPromise<T, F> {
    then: PromiseThen<T, F>;
    done: PromiseDone<T, F>;
    catch: PromiseCatch<T, F>;

    /** Returns whether a given promise is in the fulfilled state. When the static version is used on non-promises, the result is always true. */
    isFulfilled(): boolean;
    /** Returns whether a given promise is in the rejected state. When the static version is used on non-promises, the result is always false. */
    isRejected(): boolean;
    /** Returns whether a given promise is in the pending state. When the static version is used on non-promises, the result is always false. */
    isPending(): boolean;
}

interface PsDeferred<T, F> {
    promise: PsPromise<T, F>;
    resolve(result?: T): void;
    reject(reason: F): void;
}

interface Throws<T1> {
    "Throws-T1": T1;
    "ts-promises-Throws": void;
}

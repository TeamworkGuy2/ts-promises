﻿/// <reference types="chai" />
/// <reference types="mocha" />
import chai = require("chai");
import Q = require("q");
import Defer = require("../Defer");

var asr = chai.assert;

interface SyncSettings<E extends F, F, S, R> {
    findFilterFunc: (item: S) => F;
    copyObjectFunc: (item: E) => E;
    convertUrlToSyncDownFunc?: (url: string) => (params: any) => PsPromise<S[], R>;
    convertUrlToSyncUpFunc?: (url: string) => (params: any, items: S[]) => PsPromise<any, R>;
}

interface SyncUpSettings<E extends F, F, P, S, U, R> {
    syncUpFunc: (params: P, items: S[]) => PsPromise<U, R>;
    toSvcObject: (item: E) => S;
}

declare interface SyncSettingsWithUp<E extends F, F, P, S, U, R> extends SyncSettings<E, F, S, R>, SyncUpSettings<E, F, P, S, U, R> {
}

interface SyncError {
    collectionName: string;
    syncingUp ?: boolean;
    syncingDown ?: boolean;
    error: any;
}

//Defer.promiseImpl = <any>Q;
/*Defer.promiseImpl = {
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
};*/


suite("Defer", function DeferTest() {
    function log(...args: any[]) {
        // console.log() or other
    }


    test("when", function whenTest(done) {
        var a = Defer.resolve<string, void>("start");
        var ary = [a, a, a];
        Defer.when(ary).then(function (res) {
            asr.deepEqual(res, ["start", "start", "start"]);
            done();
        }, function (err) {
            asr.equal(false, true, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("then-chain", function thenFulfillTest(done) {
        // case then(promise, void)
        Defer.resolve<{ prop: number }, Error>({ prop: 23 }).then((r) => {
            return Defer.resolve<number, { errText: string }>(r.prop);
        })
        // case then(throws, void)
        .then((r2) => {
            return Defer.throw(r2);
        })
        .catch((err) => {
            return Number(err);
        })
        // case then(value, void)
        .then((r3) => {
            return r3.toFixed();
        })
        .then((r4) => {
            var _r4: string = r4;
            asr.equal(r4, "23");
            done();
        }, (e4) => {
            var _e4: never = e4;
            asr.ok(false, "unexpected error: " + JSON.stringify(e4));
            done();
        });
    });


    test("then-chain-throwPromise", function thenChainThrowPromise(done) {
        var dfd = Defer.newDefer<{ res: number }, { errText: string }>();
        // case then(promise, promise)
        var p1: PsPromise<{ prop: string | String } | null, { errText: any }> = dfd.promise.then(() => Defer.resolve<{ prop: string } | null, never>(null), () => Defer.resolve<{ prop: String }, { errText: any }>({ prop: new String(23) }));
        // case then(value)
        var p2: PsPromise<{ prop: number }, { errText: any }> = p1.then(() => ({ prop: 23 }));
        // case then(promise, throws | value)
        var p3: PsPromise<number | { errText: any }, Error | { boom: string }> = p2.then(() => Defer.resolve<number, Error>(10), (err) => (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })));
        // case then(value, throws)
        var p4: PsPromise<number | { errText: any }, PsPromise<number, Error>> = p3.then((res) => res, (err) => Defer.throwBack(Defer.resolve<number, Error>(10)));

        p4.then((res) => {
            var expectedRes: number | { errText: any } = res;
            asr.equal(expectedRes, 10);
            done();
        }, (err) => {
            var expectedErr: PsPromise<number, Error> = err;
            asr.fail(expectedErr, undefined, "did not expect error");
            done();
        });

        dfd.resolve({ res: 10 });
    });


    test("then-onReject", function thenRejectTest(done) {
        // case then(throws, void)
        Defer.resolve({ prop: 23 }).then((r) => {
            return Defer.throw(r.prop);
        })
        // case then(void, throws)
        .then(undefined, (r2) => {
            return Defer.throw(r2);
        })
        // case then(void, promise)
        .then(undefined, (e3) => {
            return Defer.reject({ error: "error", value: e3 });
        })
        // case then(void, value)
        .then(undefined, (e4) => {
            return e4;
        })
        .catch((err) => {
            var _err: never = err;
            return Defer.throw({ errText: "impossible error" });
        })
        .then((r5) => {
            var _r5: { error: string; value: number } = r5;
            asr.equal(r5.error, "error");
            asr.equal(r5.value, 23);
            done();
        }, (e5) => {
            var _e5: { errText: string } = e5;
            asr.ok(false, "unexpected error: " + JSON.stringify(e5));
            done();
        });
    });


    test("then-generic", function thenGenericTest(done) {
        // PsPromise.then(T, F) generics
        function promiser<E extends F, F, P, S, U, R>(params: P, syncSetting: SyncSettingsWithUp<E, F, P, S, U, R>) {
            var items: E[] = <never>null;
            var data: S[] = <never>null;

            var res = syncSetting.syncUpFunc(params, data).then(function (res) {
                return res;
            }).catch(function (err): Throws<SyncError> {
                return Defer.throw({
                    collectionName: "test-coll",
                    error: err,
                    syncingUp: true
                });
            });
            return res;
        }

        var settings: SyncSettingsWithUp<{ pp: number; modifiedUtc: Date }, { pp: number }, { searchPhrase: string }, { pnum: number; modifiedUtc: string }, boolean, SyncError> = {
            convertUrlToSyncDownFunc: (url) => (params) => Defer.resolve([{ pnum: 1.2, modifiedUtc: "" }, { pnum: 5.0, modifiedUtc: "" }]),
            convertUrlToSyncUpFunc: (url) => (params) => Defer.resolve([{ pp: 0.5, modifiedUtc: new Date() }, { pp: 0.123, modifiedUtc: new Date() }]),
            copyObjectFunc: (obj) => ({ pp: obj.pp, modifiedUtc: obj.modifiedUtc }),
            findFilterFunc: (obj) => ({ pp: obj.pnum }),
            syncUpFunc: (params, items) => Defer.resolve<boolean, SyncError>(true),
            toSvcObject: (obj) => ({ pnum: obj.pp, modifiedUtc: obj.modifiedUtc.toString() })
        };

        var r1: PsPromise<boolean, SyncError> = promiser({ searchPhrase: "abc" }, settings);
        r1.then((success) => {
            asr.ok(success, "unexpected error");
            done();
        });

        // Promise<..., never>
        var r2: PsPromise<{ name: string }, SyncError> = Defer.newDefer<{ name: string }, SyncError>().promise.then((res) => {
            Defer.resolve<{ name: string }, never>({ name: "" });
        });
    });

    function convert<T>(tt?: () => T): (T extends null | undefined ? "null | undefined" : (T extends void | never ? "void | never" : T)) {
        return <any>undefined;
    }

    test("then-return-promise", function thenReturnPromiseTest(done) {
        var pIds = Defer.resolve<number[], SyntaxError>([11, 22, 33, 44, 55]).catch((err) => log(err));
        var isAdmin = false;
        convert(function () { });
        convert(function () { return undefined; });
        convert(function () { return 90; });
        convert(function () { while (true); });

        Defer.reject<{ isAdmin: boolean }, ReferenceError>(new ReferenceError("ref fail")).then((res) => {
            isAdmin = res.isAdmin;
            return pIds;
        }).then((res) => {
            var nums: number[] = res;
            asr.ok(false, "expected failure, received result " + JSON.stringify(nums));
            done();
        }, (err) => {
            var errValue: ReferenceError = err;
            asr.equal(err.message, "ref fail", typeof errValue);
            done();
        });
    });


    test("throwBack", function throwBackTest(done) {
        try {
            var res = Defer.throwBack("my-error");
            asr.ok(false, "expected error to be thrown by throwBack()");
            done();
        } catch (err) {
            asr.equal(err, "my-error");
            done();
        }
    });


    test("catch-simple", function catchSimpleTest(done) {
        var init = Defer.reject<{ res: string }, { err: string }>({ err: "hmm" });

        var r1 = init.catch((err) => {
            asr.equal(err.err, "hmm");
        }).then((res) => {
            asr.equal(res, undefined);
        }, (err) => {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
        });

        var r2 = init.catch((err) => {
            // do nothing
        });

        Defer.when([r1, r2]).then(function ([res1, res2]) {
            asr.deepEqual(res1, undefined);
            asr.deepEqual(res2, undefined);
            done();
        }, function (err) {
            asr.isNotOk(err);
            done();
        });
    });


    test("catch", function catchTest(done) {
        var init = Defer.reject<{ sip: number }, { errText: string }>({ errText: "testing catch" });

        var r1: PsPromise<{ res2: string } | { err2: string }, never> = init.then(function (res) {
            return { res2: "return result" };
        }, function (err) {
            return { err2: "return from error catch" };
        });

        function rr(err: any) {
            return err ? Defer.throwBack({ errErr: "throw from error catch" }) : { err2: "return from error catch 2" };
        }

        var rrr = init.catch(rr);

        var r2Tmp: PsPromise<{ res2: string } | { err2: string }, { errErr: string }> = init.then(function (res) {
            return { res2: "return result 2" };
        }, rr);
        var r2: PsPromise<{ res2: string } | { err2: string } | { errErr: string }, never> = r2Tmp.catch(function (err) {
            return err;
        });

        var r3: PsPromise<string | { sip: number }, string | { errText: string }> = init.catch(function (err) {
            if (err.errText) {
                return err.errText;
            }
            else {
                return Defer.throwBack(err.errText);
            }
        });

        var r4 = init.catch(function (err) {
            // return nothing
        });

        Defer.when([r1, r2, r3, r4]).then(function ([res1, res2, res3, res4]) {
            asr.deepEqual(res1, { err2: "return from error catch" });
            asr.deepEqual(res2, { errErr: "throw from error catch" });
            asr.equal(res3, "testing catch");
            asr.equal(res4, undefined);
            done();
        }, function (err) {
            asr.isNotOk(err);
            done();
        });
    });


    var runInSeriesArgs = [2, 3, 5, 7];

    test("runActionForAllInSeries", function whenTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => dfd.resolve(num * 2)).then((res) => {
            asr.deepEqual(res, [4, 6, 10, 14]);
            done();
        }, (err) => {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("runActionForAllInSeries-success", function runActionForAllInSeriesSuccessTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), false).then((res) => {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, (err) => {
            asr.equal(err, 14);
            done();
        });
    });


    test("runActionForAllInSeries-throw", function runActionForAllInSeriesThrowsTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), true).then((res) => {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done()
        }, (err) => {
            asr.equal(err, 6);
            done()
        });
    });

});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="chai" />
/// <reference types="mocha" />
var chai = require("chai");
var Defer = require("../Defer");
var asr = chai.assert;
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
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // console.log() or other
    }
    test("when", function whenTest(done) {
        var a = Defer.resolve("start");
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
        Defer.resolve({ prop: 23 }).then(function (r) {
            return Defer.resolve(r.prop);
        })
            // case then(throws, void)
            .then(function (r2) {
            return Defer.throw(r2);
        })
            .catch(function (err) {
            return Number(err);
        })
            // case then(value, void)
            .then(function (r3) {
            return r3.toFixed();
        })
            .then(function (r4) {
            var _r4 = r4;
            asr.equal(r4, "23");
            done();
        }, function (e4) {
            var _e4 = e4;
            asr.ok(false, "unexpected error: " + JSON.stringify(e4));
            done();
        });
    });
    test("then-chain-throwPromise", function thenChainThrowPromise(done) {
        var dfd = Defer.newDefer();
        // case then(promise, promise)
        var p1 = dfd.promise.then(function () { return Defer.resolve(null); }, function () { return Defer.resolve({ prop: new String(23) }); });
        // case then(value)
        var p2 = p1.then(function () { return ({ prop: 23 }); });
        // case then(promise, throws | value)
        var p3 = p2.then(function () { return Defer.resolve(10); }, function (err) { return (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })); });
        // case then(value, throws)
        var p4 = p3.then(function (res) { return res; }, function (err) { return Defer.throwBack(Defer.resolve(10)); });
        p4.then(function (res) {
            var expectedRes = res;
            asr.equal(expectedRes, 10);
            done();
        }, function (err) {
            var expectedErr = err;
            asr.fail(expectedErr, undefined, "did not expect error");
            done();
        });
        dfd.resolve({ res: 10 });
    });
    test("then-onReject", function thenRejectTest(done) {
        // case then(throws, void)
        Defer.resolve({ prop: 23 }).then(function (r) {
            return Defer.throw(r.prop);
        })
            // case then(void, throws)
            .then(undefined, function (r2) {
            return Defer.throw(r2);
        })
            // case then(void, promise)
            .then(undefined, function (e3) {
            return Defer.reject({ error: "error", value: e3 });
        })
            // case then(void, value)
            .then(undefined, function (e4) {
            return e4;
        })
            .catch(function (err) {
            var _err = err;
            return Defer.throw({ errText: "impossible error" });
        })
            .then(function (r5) {
            var _r5 = r5;
            asr.equal(r5.error, "error");
            asr.equal(r5.value, 23);
            done();
        }, function (e5) {
            var _e5 = e5;
            asr.ok(false, "unexpected error: " + JSON.stringify(e5));
            done();
        });
    });
    test("then-generic", function thenGenericTest(done) {
        // PsPromise.then(T, F) generics
        function promiser(params, syncSetting) {
            var items = null;
            var data = null;
            var res = syncSetting.syncUpFunc(params, data).then(function (res) {
                return res;
            }).catch(function (err) {
                return Defer.throw({
                    collectionName: "test-coll",
                    error: err,
                    syncingUp: true
                });
            });
            return res;
        }
        var settings = {
            convertUrlToSyncDownFunc: function (url) { return function (params) { return Defer.resolve([{ pnum: 1.2, modifiedUtc: "" }, { pnum: 5.0, modifiedUtc: "" }]); }; },
            convertUrlToSyncUpFunc: function (url) { return function (params) { return Defer.resolve([{ pp: 0.5, modifiedUtc: new Date() }, { pp: 0.123, modifiedUtc: new Date() }]); }; },
            copyObjectFunc: function (obj) { return ({ pp: obj.pp, modifiedUtc: obj.modifiedUtc }); },
            findFilterFunc: function (obj) { return ({ pp: obj.pnum }); },
            syncUpFunc: function (params, items) { return Defer.resolve(true); },
            toSvcObject: function (obj) { return ({ pnum: obj.pp, modifiedUtc: obj.modifiedUtc.toString() }); }
        };
        var r1 = promiser({ searchPhrase: "abc" }, settings);
        r1.then(function (success) {
            asr.ok(success, "unexpected error");
            done();
        });
        // Promise<..., never>
        var r2 = Defer.newDefer().promise.then(function (res) {
            Defer.resolve({ name: "" });
        });
    });
    function convert(tt) {
        return undefined;
    }
    test("then-return-promise", function thenReturnPromiseTest(done) {
        var pIds = Defer.resolve([11, 22, 33, 44, 55]).catch(function (err) { return log(err); });
        var isAdmin = false;
        convert(function () { });
        convert(function () { return undefined; });
        convert(function () { return 90; });
        convert(function () { while (true)
            ; });
        Defer.reject(new ReferenceError("ref fail")).then(function (res) {
            isAdmin = res.isAdmin;
            return pIds;
        }).then(function (res) {
            var nums = res;
            asr.ok(false, "expected failure, received result " + JSON.stringify(nums));
            done();
        }, function (err) {
            var errValue = err;
            asr.equal(err.message, "ref fail", typeof errValue);
            done();
        });
    });
    test("throwBack", function throwBackTest(done) {
        try {
            var res = Defer.throwBack("my-error");
            asr.ok(false, "expected error to be thrown by throwBack()");
            done();
        }
        catch (err) {
            asr.equal(err, "my-error");
            done();
        }
    });
    test("catch-simple", function catchSimpleTest(done) {
        var init = Defer.reject({ err: "hmm" });
        var r1 = init.catch(function (err) {
            asr.equal(err.err, "hmm");
        }).then(function (res) {
            asr.equal(res, undefined);
        }, function (err) {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
        });
        var r2 = init.catch(function (err) {
            // do nothing
        });
        Defer.when([r1, r2]).then(function (_a) {
            var res1 = _a[0], res2 = _a[1];
            asr.deepEqual(res1, undefined);
            asr.deepEqual(res2, undefined);
            done();
        }, function (err) {
            asr.isNotOk(err);
            done();
        });
    });
    test("catch", function catchTest(done) {
        var init = Defer.reject({ errText: "testing catch" });
        var r1 = init.then(function (res) {
            return { res2: "return result" };
        }, function (err) {
            return { err2: "return from error catch" };
        });
        function rr(err) {
            return err ? Defer.throwBack({ errErr: "throw from error catch" }) : { err2: "return from error catch 2" };
        }
        var rrr = init.catch(rr);
        var r2Tmp = init.then(function (res) {
            return { res2: "return result 2" };
        }, rr);
        var r2 = r2Tmp.catch(function (err) {
            return err;
        });
        var r3 = init.catch(function (err) {
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
        Defer.when([r1, r2, r3, r4]).then(function (_a) {
            var res1 = _a[0], res2 = _a[1], res3 = _a[2], res4 = _a[3];
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
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return dfd.resolve(num * 2); }).then(function (res) {
            asr.deepEqual(res, [4, 6, 10, 14]);
            done();
        }, function (err) {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });
    test("runActionForAllInSeries-success", function runActionForAllInSeriesSuccessTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)); }, false).then(function (res) {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, function (err) {
            asr.equal(err, 14);
            done();
        });
    });
    test("runActionForAllInSeries-throw", function runActionForAllInSeriesThrowsTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)); }, true).then(function (res) {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, function (err) {
            asr.equal(err, 6);
            done();
        });
    });
});

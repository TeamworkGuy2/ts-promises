"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="chai" />
/// <reference types="mocha" />
var chai = require("chai");
var Defer = require("../Defer");
var asr = chai.assert;
suite("Defer", function DeferTest() {
    test("when", function whenTest(done) {
        var a = Defer.resolve("start");
        var b = Defer.resolve({ s: 22 });
        var c = Defer.resolve(10);
        var dfd = Defer.newDefer();
        var p1 = dfd.promise.then(function () { return Defer.resolve(null); }, function () { return Defer.resolve({ prop: new String(23) }); });
        var p2 = p1.then(function () { return ({ prop: 23 }); });
        var p3 = p2.then(function () { return c; }, function (err) { return (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })); });
        var p4 = p3.then(function (res) { return res; }, function (err) { return Defer.throwBack(c); });
        var ary = [a, a, a];
        Defer.when(ary).then(function (res) {
            asr.deepEqual(res, ["start", "start", "start"]);
            done();
        }, function (err) {
            asr.equal(false, true, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });
    test("then-onFulfill", function thenFulfillTest(done) {
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
    test("catch simple", function catchSimpleTest(done) {
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
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return dfd.resolve(num * 2); }).done(function (res) {
            asr.deepEqual(res, [4, 6, 10, 14]);
            done();
        }, function (err) {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });
    test("runActionForAllInSeries-success", function runActionForAllInSeriesSuccessTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)); }, false).done(function (res) {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, function (err) {
            asr.equal(err, 14);
            done();
        });
    });
    test("runActionForAllInSeries-throw", function runActionForAllInSeriesThrowsTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, function (dfd, num) { return (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)); }, true).done(function (res) {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, function (err) {
            asr.equal(err, 6);
            done();
        });
    });
});

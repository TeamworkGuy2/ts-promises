/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />

import chai = require("chai");
import Defer = require("../Defer");

var asr = chai.assert;

suite("Defer", function DeferTest() {

    test("when", function whenTest(done) {
        var a = Defer.newPromiseResolved<string, void>("start");
        var b = Defer.newPromiseResolved<{ s: number }, void>({ s: 22 });
        var c = Defer.newPromiseResolved<number, Error>(10);

        var dfd = Defer.newDefer<{ res: number }, { errText: string }>();
        var p1: PsPromise<{ prop: string | String }, { errText: any }>         = dfd.promise.then(() => Defer.newPromiseResolved<{ prop: string }, { errText: string }>(null), () => Defer.newPromiseResolved<{ prop: String }, { errText }>({ prop: new String(23) }));
        var p2: PsPromise<{ prop: number }, { errText: any }>                  = p1.then(() => ({ prop: 23 }));
        var p3: PsPromise<number | { errText: any }, Error | { boom: string }> = p2.then<number, { errText: any }, Error, { boom: string }>(() => c, (err) => (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })));
        var p4: PsPromise<number | { errText: any }, PsPromise<number, Error>> = p3.then((res) => res, (err) => Defer.throwBack(c));

        var ary = [a, a, a];
        Defer.when(ary).then(function (res) {
            asr.deepEqual(res, ["start", "start", "start"]);
            done();
        }, function (err) {
            asr.equal(false, true, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("throwBack", function throwBackTest(done) {
        try {
            var res = Defer.throwBack("my-error");
            asr.equal(false, true, "expected error to be thrown by throwBack()");
            done();
        } catch (err) {
            asr.equal(err, "my-error");
            done();
        }
    });


    test("catch", function catchTest(done) {
        var b = Defer.newPromiseRejected<{ s: number }, { errText: string }>({ errText: "testing catch" });

        var r1: PsPromise<{ res2: string } | { err2: string }, void> = b.then(function (res) {
            return { res2: "return result" };
        }, function (err) {
            return { err2: "return from error catch" };
        });

        var r2 = b.then<{ res2: string }, { err2: string }, { errErr: string }, { errErr: string }>(function (res) {
            return { res2: "return result 2" };
        }, function (err) {
            return err ? Defer.throwBack({ errErr: "throw from error catch" }) : { err2: "return from error catch 2" };
        }).catch(function (err) {
            return err;
        });

        var r3: PsPromise<string | { s: number }, string | { errText: string }> = b.catch(function (err) {
            if (err.errText) {
                return err.errText;
            }
            else {
                return Defer.throwBack(err.errText);
            }
        });

        Defer.when([r1, r2, r3]).then(function ([res1, res2, res3]) {
            asr.deepEqual(res1, { err2: "return from error catch" });
            asr.deepEqual(res2, { errErr: "throw from error catch" });
            asr.equal(res3, "testing catch");
            done();
        }, function (err) {
            asr.isNotOk(err);
            done();
        });
    });


    var runInSeriesArgs = [2, 3, 5, 7];

    test("runActionForAllInSeries", function whenTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => dfd.resolve(num * 2)).done((res) => {
            asr.deepEqual(res, [4, 6, 10, 14]);
            done();
        }, (err) => {
            asr.ok(false, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("runActionForAllInSeries-success", function runActionForAllInSeriesSuccessTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), false).done((res) => {
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, (err) => {
            asr.equal(err, 14);
            done();
        });
    });


    test("runActionForAllInSeries-throw", function runActionForAllInSeriesThrowsTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), true).done((res) => {
            asr.equal(false, true, "unexpected success: " + JSON.stringify(res));
            done()
        }, (err) => {
            asr.equal(err, 6);
            done()
        });
    });

});

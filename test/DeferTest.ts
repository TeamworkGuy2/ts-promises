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
        var ary = [a, a, a];

        var dfd = Defer.newDefer<{ res: number }, { errText: string }>();
        var p1 = dfd.promise.then(() => Defer.newPromiseResolved<{ prop: string }, { errText: string }>(null), () => Defer.newPromiseResolved<{ prop: String }, { errText }>({ prop: new String(23) }));
        var p2 = p1.then(() => ({ prop: 23 }));
        var p3 = p2.then<number, { errText: any }, Error, { boom: string }>(() => c, (err) => (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })));
        var p4 = p3.then((res) => res, (err) => Defer.throwBack(err || c));

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

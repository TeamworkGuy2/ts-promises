/// <reference path="../../definitions/lib/chai.d.ts" />
/// <reference path="../../definitions/lib/mocha.d.ts" />
import chai = require("chai");
import Defer = require("../Defer");

var as = chai.assert;

suite("Defer", function DeferTest() {

    test("when", function whenTest(done) {
        var a = Defer.newPromiseResolved<string, void>("start");
        var b = Defer.newPromiseResolved<{ s: number }, void>({ s: 22 });
        var c = Defer.newPromiseResolved<number, Error>(10);
        var ary = [a, a, a];

        Defer.when(ary).then(function (res) {
            as.deepEqual(res, ["start", "start", "start"]);
            done();
        }, function (err) {
            as.equal(false, true, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("throwBack", function throwBackTest(done) {
        try {
            var res = Defer.throwBack("my-error");
            as.equal(false, true, "expected error to be thrown by throwBack()");
            done();
        } catch (err) {
            as.equal(err, "my-error");
            done();
        }
    });


    var runInSeriesArgs = [2, 3, 5, 7];

    test("runActionForAllInSeries", function whenTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => dfd.resolve(num * 2)).done((res) => {
            as.deepEqual(res, [4, 6, 10, 14]);
            done();
        }, (err) => {
            as.ok(false, "unexpected error: " + JSON.stringify(err));
            done();
        });
    });


    test("runActionForAllInSeries-success", function runActionForAllInSeriesSuccessTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), false).done((res) => {
            as.ok(false, "unexpected success: " + JSON.stringify(res));
            done();
        }, (err) => {
            as.equal(err, 14);
            done();
        });
    });


    test("runActionForAllInSeries-throw", function runActionForAllInSeriesThrowsTest(done) {
        var a = Defer.runActionForAllInSeries(runInSeriesArgs, (dfd, num) => (num > 2 ? dfd.reject(num * 2) : dfd.resolve(num * 2)), true).done((res) => {
            as.equal(false, true, "unexpected success: " + JSON.stringify(res));
            done()
        }, (err) => {
            as.equal(err, 6);
            done()
        });
    });

});

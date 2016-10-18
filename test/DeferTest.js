/// <reference path="../../definitions/chai/chai.d.ts" />
/// <reference path="../../definitions/mocha/mocha.d.ts" />
"use strict";
var chai = require("chai");
var Defer = require("../Defer");
var asr = chai.assert;
suite("Defer", function DeferTest() {
    test("when", function whenTest(done) {
        var a = Defer.newPromiseResolved("start");
        var b = Defer.newPromiseResolved({ s: 22 });
        var c = Defer.newPromiseResolved(10);
        var ary = [a, a, a];
        var dfd = Defer.newDefer();
        var p1 = dfd.promise.then(function () { return Defer.newPromiseResolved(null); }, function () { return Defer.newPromiseResolved({ prop: new String(23) }); });
        var p2 = p1.then(function () { return ({ prop: 23 }); });
        var p3 = p2.then(function () { return c; }, function (err) { return (Math.random() > 0.5 ? err : Defer.throwBack({ boom: "error" })); });
        var p4 = p3.then(function (res) { return res; }, function (err) { return Defer.throwBack(err || c); });
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
        }
        catch (err) {
            asr.equal(err, "my-error");
            done();
        }
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
            asr.equal(false, true, "unexpected success: " + JSON.stringify(res));
            done();
        }, function (err) {
            asr.equal(err, 6);
            done();
        });
    });
});

/// <reference types="chai" />
/// <reference types="mocha" />
import chai = require("chai");
import Defer = require("../Defer");

var asr = chai.assert;


suite("Defer", function DeferTest() {

    test("when", function whenTest(done) {
        var a = Defer.resolve<string, void>("start");
        var b = Defer.resolve<{ s: number }, void>({ s: 22 });
        var c = Defer.resolve<number, Error>(10);

        var dfd = Defer.newDefer<{ res: number }, { errText: string }>();
        var p1: PsPromise<{ prop: string | String } | null, { errText: any }>  = dfd.promise.then(() => Defer.resolve<{ prop: string } | null, { errText: string }>(null), () => Defer.resolve<{ prop: String }, { errText: any }>({ prop: new String(23) }));
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


    test("then", function thenTest(done) {
        var p = Defer.resolve<{ prop: number }, Error>({ prop: 23 });

        p.then((r) => {
            if (r.prop > 10) {
                return Defer.resolve<number, { errText: string }>(r.prop);
            }
            else {
                return Defer.reject<number, { errText: string }>({ errText: "p-error" });
            }
        }).then((r2) => {
            return r2.toFixed();
        }).catch((err) => {
            return Defer.throw((<Error>err).message ? { errText: (<Error>err).message } : <{ errText: string }>err);
        }).then((r3) => {
            asr.equal(r3, "23");
            done();
        }, (e3) => {
            asr.ok(false, "unexpecte error: " + JSON.stringify(e3));
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


    test("catch simple", function catchSimpleTest(done) {
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
        var init = Defer.reject<{ s: number }, { errText: string }>({ errText: "testing catch" });

        var r1: PsPromise<{ res2: string } | { err2: string }, void> = init.then(function (res) {
            return { res2: "return result" };
        }, function (err) {
            return { err2: "return from error catch" };
        });

        function rr(err: any) {
            return err ? Defer.throwBack({ errErr: "throw from error catch" }) : { err2: "return from error catch 2" };
        }

        var rrr = init.catch(rr);

        var r2 = init.then(function (res) {
            return <{ res2: string } | { errErr: string }>{ res2: "return result 2" };
        }, rr);
        r2 = r2.catch(function (err) {
            return err;
        });

        var r3: PsPromise<string | { s: number }, string | { errText: string }> = <any>init.catch(function (err) {
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
            asr.deepEqual(res2, <any>{ errErr: "throw from error catch" });
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
            asr.ok(false, "unexpected success: " + JSON.stringify(res));
            done()
        }, (err) => {
            asr.equal(err, 6);
            done()
        });
    });

});

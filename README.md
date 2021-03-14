TypeScript Typed Promises
==============

Dependencies:
none (`Defer.promiseImpl` must be assigned a value before the Defer class can be used)

Utility for creating and managing strongly typed promise/A+ type promises. 
`PsPromise` differs in that it also tracks the rejection type of the promise allow for powerful error tracking and handling.
See the `test/` directory for example usage of the functions in this project.

```ts
Defer.resolve<{ prop: number }, Error>({ prop: 23 })
    .then((r) => {
        return { value: r.prop, error: null };
    })
    .catch((err) => {
        return { value: null, error: { message: err.toString(), stack: err.stack } }; // err is Error
    })
    .then((res) => {
        res.value; // number | null
        res.error; // { message: string; stack: string } | null
    })
```
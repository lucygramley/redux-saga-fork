import { runSaga } from 'redux-saga';
function testRunSaga() {
    const task0 = runSaga({
        context: { a: 42 },
        channel: stdChannel,
        effectMiddlewares: [
            next => effect => {
                setTimeout(() => {
                    next(effect);
                }, 10);
            },
            next => effect => {
                setTimeout(() => {
                    next(effect);
                }, 10);
            },
        ],
        getState() {
            return { baz: true };
        },
        dispatch(input) {
            input.foo;
            // $ExpectError
            input.bar;
        },
        sagaMonitor: {
            effectTriggered() { },
            effectResolved() { },
            effectRejected() { },
            effectCancelled() { },
            actionDispatched() { },
        },
        onError(error) {
            console.error(error);
        },
    }, function* saga() {
        yield effect;
    });
    // $ExpectError
    runSaga();
    // $ExpectError
    runSaga({});
    // $ExpectError
    runSaga({}, iterator);
    runSaga({}, function* saga() {
        yield effect;
    });
    // TODO: https://github.com/Microsoft/TypeScript/issues/28803
    {
        // // $ExpectError
        // runSaga({}, function* saga(a: 'a'): SagaIterator {})
    }
    // $ExpectError
    runSaga({}, function* saga(a) { }, 1);
    runSaga({}, function* saga(a) { }, 'a');
    // TODO: https://github.com/Microsoft/TypeScript/issues/28803
    {
        // // $ExpectError
        // runSaga({}, function* saga(a: 'a', b: 'b'): SagaIterator {}, 'a')
    }
    // $ExpectError
    runSaga({}, function* saga(a, b) { }, 'a', 1);
    // $ExpectError
    runSaga({}, function* saga(a, b) { }, 1, 'b');
    runSaga({}, function* saga(a, b) { }, 'a', 'b');
    // test with any iterator i.e. when generator doesn't always yield Effects.
    runSaga({}, function* saga() {
        yield promise;
    });
    // $ExpectError
    runSaga({ context: 42 }, function* saga() { });
}

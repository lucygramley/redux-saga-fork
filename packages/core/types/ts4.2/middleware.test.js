import createSagaMiddleware from 'redux-saga';
import { applyMiddleware } from 'redux';
function testApplyMiddleware() {
    const middleware = createSagaMiddleware();
    const enhancer = applyMiddleware(middleware);
}
function testRun() {
    const middleware = createSagaMiddleware();
    middleware.run(function* saga() { });
    // TODO: https://github.com/Microsoft/TypeScript/issues/28803
    {
        // // $ExpectError
        // middleware.run(function* saga(a: 'a'): SagaIterator {})
    }
    // $ExpectError
    middleware.run(function* saga(a) { }, 1);
    middleware.run(function* saga(a) { }, 'a');
    // TODO: https://github.com/Microsoft/TypeScript/issues/28803
    {
        // // $ExpectError
        // middleware.run(function* saga(a: 'a', b: 'b'): SagaIterator {}, 'a')
    }
    // $ExpectError
    middleware.run(function* saga(a, b) { }, 'a', 1);
    // $ExpectError
    middleware.run(function* saga(a, b) { }, 1, 'b');
    middleware.run(function* saga(a, b) { }, 'a', 'b');
    // test with any iterator i.e. when generator doesn't always yield Effects.
    middleware.run(function* saga() {
        yield promise;
    });
}
function testOptions() {
    const emptyOptions = createSagaMiddleware({});
    const withOptions = createSagaMiddleware({
        onError(error) {
            console.error(error);
        },
        sagaMonitor: {
            effectTriggered() { },
        },
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
    });
    const withMonitor = createSagaMiddleware({
        sagaMonitor: {
            effectTriggered() { },
            effectResolved() { },
            effectRejected() { },
            effectCancelled() { },
            actionDispatched() { },
        },
    });
}
function testContext() {
    // $ExpectError
    createSagaMiddleware({ context: { c: 42 } });
    // $ExpectError
    createSagaMiddleware({ context: 42 });
    const middleware = createSagaMiddleware({
        context: { a: '', b: 42 },
    });
    // $ExpectError
    middleware.setContext({ c: 42 });
    middleware.setContext({ b: 42 });
    const task = middleware.run(function* () {
        yield effect;
    });
    task.setContext({ b: 42 });
    task.setContext({ a: '' });
    // $ExpectError
    task.setContext({ c: '' });
}

import { END, buffers, detach } from 'redux-saga';
import { take, takeMaybe, put, putResolve, call, apply, cps, fork, spawn, join, cancel, select, actionChannel, cancelled, flush, setContext, getContext, takeEvery, takeLatest, takeLeading, throttle, delay, retry, all, race, debounce, } from 'redux-saga/effects';
Object.assign(stringableActionCreator, {
    toString() {
        return 'my-action';
    },
});
const isMyAction = (action) => {
    return action.type === 'my-action';
};
function* testTake() {
    yield take();
    yield take('my-action');
    yield take((action) => action.type === 'my-action');
    yield take(isMyAction);
    // $ExpectError
    yield take(() => { });
    yield take(stringableActionCreator);
    yield take(['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction]);
    // $ExpectError
    yield take([() => { }]);
    yield takeMaybe(['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction]);
    yield take(channel);
    yield takeMaybe(channel);
    yield take(eventChannel);
    yield takeMaybe(eventChannel);
    yield take(multicastChannel);
    yield takeMaybe(multicastChannel);
    // $ExpectError
    yield take(multicastChannel, (input) => input.someField === 'foo');
    yield take(multicastChannel, (input) => input.someField === 'foo');
    const pattern1 = null;
    const pattern2 = null;
    yield take([pattern1, pattern2]);
    yield takeMaybe([pattern1, pattern2]);
}
function* testPut() {
    yield put({ type: 'my-action' });
    // $ExpectError
    yield put(channel, { type: 'my-action' });
    yield put(channel, { someField: '--' });
    yield put(channel, END);
    // $ExpectError
    yield put(eventChannel, { someField: '--' });
    // $ExpectError
    yield put(eventChannel, END);
    yield put(multicastChannel, { someField: '--' });
    yield put(multicastChannel, END);
    yield putResolve({ type: 'my-action' });
}
function* testCall() {
    // $ExpectError
    yield call();
    // $ExpectError
    yield call({});
    yield call(() => { });
    // $ExpectError
    yield call((a) => { });
    // TODO: https://github.com/Microsoft/TypeScript/issues/28803
    {
        // // $ExpectError
        // yield call(function*(a: 'a'): SagaIterator {})
    }
    // $ExpectError
    yield call((a) => { }, 1);
    // $ExpectError
    yield call(function* (a) { }, 1);
    yield call((a) => { }, 'a');
    yield call(function* (a) { }, 'a');
    yield call((a) => 1, 'a');
    // $ExpectError
    yield call((a, b) => { }, 'a');
    // $ExpectError
    yield call((a, b) => { }, 'a', 1);
    // $ExpectError
    yield call((a, b) => { }, 1, 'b');
    yield call((a, b) => { }, 'a', 'b');
    // $ExpectError
    yield call((a, b, c, d, e, f, g) => { }, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield call((a, b, c, d, e, f, g) => { }, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield call((a, b, c, d, e, f, g) => 1, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    const obj = {
        foo: 'bar',
        getFoo(arg) {
            return this.foo;
        },
    };
    // $ExpectError
    yield call([obj, obj.foo]);
    // $ExpectError
    yield call([obj, obj.getFoo]);
    yield call([obj, obj.getFoo], 'bar');
    // $ExpectError
    yield call([obj, obj.getFoo], 1);
    // $ExpectError
    yield call([obj, 'foo']);
    // $ExpectError
    yield call([obj, 'getFoo']);
    // $ExpectError
    yield call([obj, 'getFoo'], 1);
    yield call([obj, 'getFoo'], 'bar');
    yield call([obj, 'getFoo'], 'bar');
    // $ExpectError
    yield call({ context: obj, fn: obj.foo });
    // $ExpectError
    yield call({ context: obj, fn: obj.getFoo });
    yield call({ context: obj, fn: obj.getFoo }, 'bar');
    // $ExpectError
    yield call({ context: obj, fn: obj.getFoo }, 1);
    // $ExpectError
    yield call({ context: obj, fn: 'foo' });
    // $ExpectError
    yield call({ context: obj, fn: 'getFoo' });
    // $ExpectError
    yield call({ context: obj, fn: 'getFoo' }, 1);
    yield call({ context: obj, fn: 'getFoo' }, 'bar');
    yield call({ context: obj, fn: 'getFoo' }, 'bar');
}
function* testApply() {
    const obj = {
        foo: 'bar',
        getFoo() {
            return this.foo;
        },
        meth1(a) {
            return 1;
        },
        meth2(a, b) {
            return 1;
        },
        meth7(a, b, c, d, e, f, g) {
            return 1;
        },
    };
    // $ExpectError
    yield apply(obj, obj.foo, []);
    yield apply(obj, obj.getFoo, []);
    yield apply(obj, obj.getFoo, []);
    // $ExpectError
    yield apply(obj, 'foo', []);
    yield apply(obj, 'getFoo', []);
    yield apply(obj, 'getFoo', []);
    // $ExpectError
    yield apply(obj, obj.meth1);
    // $ExpectError
    yield apply(obj, obj.meth1, []);
    // $ExpectError
    yield apply(obj, obj.meth1, [1]);
    yield apply(obj, obj.meth1, ['a']);
    yield apply(obj, obj.meth1, ['a']);
    // $ExpectError
    yield apply(obj, 'meth1');
    // $ExpectError
    yield apply(obj, 'meth1', []);
    // $ExpectError
    yield apply(obj, 'meth1', [1]);
    yield apply(obj, 'meth1', ['a']);
    yield apply(obj, 'meth1', ['a']);
    // $ExpectError
    yield apply(obj, obj.meth2, ['a']);
    // $ExpectError
    yield apply(obj, obj.meth2, ['a', 'b']);
    // $ExpectError
    yield apply(obj, obj.meth2, [1, 'b']);
    yield apply(obj, obj.meth2, ['a', 1]);
    yield apply(obj, obj.meth2, ['a', 1]);
    // $ExpectError
    yield apply(obj, 'meth2', ['a']);
    // $ExpectError
    yield apply(obj, 'meth2', ['a', 'b']);
    // $ExpectError
    yield apply(obj, 'meth2', [1, 'b']);
    yield apply(obj, 'meth2', ['a', 1]);
    yield apply(obj, 'meth2', ['a', 1]);
    // $ExpectError
    yield apply(obj, obj.meth7, [1, 'b', 'c', 'd', 'e', 'f', 'g']);
    yield apply(obj, obj.meth7, ['a', 1, 'b', 2, 'c', 3, 'd']);
    yield apply(obj, obj.meth7, ['a', 1, 'b', 2, 'c', 3, 'd']);
    // $ExpectError
    yield apply(obj, 'meth7', [1, 'b', 'c', 'd', 'e', 'f', 'g']);
    yield apply(obj, 'meth7', ['a', 1, 'b', 2, 'c', 3, 'd']);
    yield apply(obj, 'meth7', ['a', 1, 'b', 2, 'c', 3, 'd']);
}
function* testCps() {
    // $ExpectError
    yield cps((a) => { });
    // $ExpectError
    yield cps((a, b) => { }, 42);
    yield cps(cb => {
        cb(null, 1);
    });
    yield cps((cb) => {
        cb(null, 1);
    });
    yield cps(cb => {
        cb(null, 1); // $ExpectError
    });
    yield cps(cb => {
        cb(null, 1);
    });
    yield cps(cb => {
        cb.cancel = () => { };
    });
    // $ExpectError
    yield cps((a, cb) => { });
    // $ExpectError
    yield cps((a, cb) => { }, 1);
    yield cps((a, cb) => { }, 'a');
    // $ExpectError
    yield cps((a, b, cb) => { }, 'a');
    // $ExpectError
    yield cps((a, b, cb) => { }, 'a', 1);
    // $ExpectError
    yield cps((a, b, cb) => { }, 1, 'b');
    yield cps((a, b, cb) => { }, 'a', 'b');
    // $ExpectError
    yield cps((a, b, c, d, cb) => { }, 1, 'b', 'c', 'd');
    yield cps((a, b, c, d, cb) => {
        cb(null, 1);
    }, 'a', 'b', 'c', 'd');
    yield cps((a, b, c, d, cb) => {
        cb(null, 1);
    }, 'a', 'b', 'c', 'd');
    // $ExpectError
    yield cps((a, b, c, d, e, f, cb) => { }, 1, 'b', 'c', 'd', 'e', 'f');
    yield cps((a, b, c, d, e, f, cb) => {
        cb(null, 1);
    }, 'a', 'b', 'c', 'd', 'e', 'f');
    yield cps((a, b, c, d, e, f, cb) => {
        cb(null, 1);
    }, 'a', 'b', 'c', 'd', 'e', 'f');
    const obj = {
        foo: 'bar',
        getFoo(arg, cb) {
            cb(null, this.foo);
        },
    };
    const objWithoutCb = {
        foo: 'bar',
        getFoo(arg) { },
    };
    // $ExpectError
    yield cps([obj, obj.foo]);
    // $ExpectError
    yield cps([obj, obj.getFoo]);
    // $ExpectError
    yield cps([obj, obj.getFoo], 1);
    yield cps([obj, obj.getFoo], 'bar');
    yield cps([obj, obj.getFoo], 'bar');
    // $ExpectError
    yield cps([objWithoutCb, objWithoutCb.getFoo]);
    // $ExpectError
    yield cps([obj, 'foo']);
    // $ExpectError
    yield cps([obj, 'getFoo']);
    // $ExpectError
    yield cps([obj, 'getFoo'], 1);
    yield cps([obj, 'getFoo'], 'bar');
    yield cps([obj, 'getFoo'], 'bar');
    // $ExpectError
    yield cps([objWithoutCb, 'getFoo']);
    // $ExpectError
    yield cps({ context: obj, fn: obj.foo });
    // $ExpectError
    yield cps({ context: obj, fn: obj.getFoo });
    // $ExpectError
    yield cps({ context: obj, fn: obj.getFoo }, 1);
    yield cps({ context: obj, fn: obj.getFoo }, 'bar');
    // $ExpectError
    yield cps({ context: objWithoutCb, fn: objWithoutCb.getFoo });
    // $ExpectError
    yield cps({ context: obj, fn: 'foo' });
    // $ExpectError
    yield cps({ context: obj, fn: 'getFoo' });
    // $ExpectError
    yield cps({ context: obj, fn: 'getFoo' }, 1);
    yield cps({ context: obj, fn: 'getFoo' }, 'bar');
    yield cps({ context: obj, fn: 'getFoo' }, 'bar');
    // $ExpectError
    yield cps({ context: objWithoutCb, fn: 'getFoo' });
}
function* testFork() {
    // $ExpectError
    yield fork();
    yield fork(() => { });
    // $ExpectError
    yield fork((a) => { });
    // $ExpectError
    yield fork((a) => { }, 1);
    yield fork((a) => { }, 'a');
    // $ExpectError
    yield fork((a, b) => { }, 'a');
    // $ExpectError
    yield fork((a, b) => { }, 'a', 1);
    // $ExpectError
    yield fork((a, b) => { }, 1, 'b');
    yield fork((a, b) => { }, 'a', 'b');
    // $ExpectError
    yield fork((a, b, c, d, e, f, g) => { }, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield fork((a, b, c, d, e, f, g) => { }, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    const obj = {
        foo: 'bar',
        getFoo(arg) {
            return this.foo;
        },
    };
    // $ExpectError
    yield fork([obj, obj.foo]);
    // $ExpectError
    yield fork([obj, obj.getFoo]);
    yield fork([obj, obj.getFoo], 'bar');
    // $ExpectError
    yield fork([obj, obj.getFoo], 1);
    // $ExpectError
    yield fork([obj, 'foo']);
    // $ExpectError
    yield fork([obj, 'getFoo']);
    yield fork([obj, 'getFoo'], 'bar');
    // $ExpectError
    yield fork([obj, 'getFoo'], 1);
    // $ExpectError
    yield fork({ context: obj, fn: obj.foo });
    // $ExpectError
    yield fork({ context: obj, fn: obj.getFoo });
    yield fork({ context: obj, fn: obj.getFoo }, 'bar');
    // $ExpectError
    yield fork({ context: obj, fn: obj.getFoo }, 1);
    // $ExpectError
    yield fork({ context: obj, fn: 'foo' });
    // $ExpectError
    yield fork({ context: obj, fn: 'getFoo' });
    yield fork({ context: obj, fn: 'getFoo' }, 'bar');
    // $ExpectError
    yield fork({ context: obj, fn: 'getFoo' }, 1);
}
function* testSpawn() {
    // $ExpectError
    yield spawn();
    yield spawn(() => { });
    // $ExpectError
    yield spawn((a) => { });
    // $ExpectError
    yield spawn((a) => { }, 1);
    yield spawn((a) => { }, 'a');
    // $ExpectError
    yield spawn((a, b) => { }, 'a');
    // $ExpectError
    yield spawn((a, b) => { }, 'a', 1);
    // $ExpectError
    yield spawn((a, b) => { }, 1, 'b');
    yield spawn((a, b) => { }, 'a', 'b');
    // $ExpectError
    yield spawn((a, b, c, d, e, f, g) => { }, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield spawn((a, b, c, d, e, f, g) => { }, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    const obj = {
        foo: 'bar',
        getFoo(arg) {
            return this.foo;
        },
    };
    // $ExpectError
    yield spawn([obj, obj.foo]);
    // $ExpectError
    yield spawn([obj, obj.getFoo]);
    yield spawn([obj, obj.getFoo], 'bar');
    // $ExpectError
    yield spawn([obj, obj.getFoo], 1);
    // $ExpectError
    yield spawn([obj, 'foo']);
    // $ExpectError
    yield spawn([obj, 'getFoo']);
    yield spawn([obj, 'getFoo'], 'bar');
    // $ExpectError
    yield spawn([obj, 'getFoo'], 1);
    // $ExpectError
    yield spawn({ context: obj, fn: obj.foo });
    // $ExpectError
    yield spawn({ context: obj, fn: obj.getFoo });
    yield spawn({ context: obj, fn: obj.getFoo }, 'bar');
    // $ExpectError
    yield spawn({ context: obj, fn: obj.getFoo }, 1);
    // $ExpectError
    yield spawn({ context: obj, fn: 'foo' });
    // $ExpectError
    yield spawn({ context: obj, fn: 'getFoo' });
    yield spawn({ context: obj, fn: 'getFoo' }, 'bar');
    // $ExpectError
    yield spawn({ context: obj, fn: 'getFoo' }, 1);
}
function* testJoin() {
    // $ExpectError
    yield join();
    // $ExpectError
    yield join({});
    yield join(task);
    // $ExpectError
    yield join(task, task);
    yield join([task, task]);
    yield join([task, task, task]);
    // $ExpectError
    yield join([task, task, {}]);
}
function* testCancel() {
    yield cancel();
    // $ExpectError
    yield cancel(undefined);
    // $ExpectError
    yield cancel({});
    yield cancel(task);
    // $ExpectError
    yield cancel(task, task);
    yield cancel([task, task]);
    yield cancel([task, task, task]);
    const tasks = [];
    yield cancel(tasks);
    // $ExpectError
    yield cancel([task, task, {}]);
}
function* testDetach() {
    yield detach(fork(() => { }));
    // $ExpectError
    yield detach(call(() => { }));
}
function* testSelect() {
    yield select();
    yield select((state) => state.foo);
    // $ExpectError
    yield select((state) => state.foo);
    yield select((state) => state.foo);
    // $ExpectError
    yield select((state, a) => state.foo);
    // $ExpectError
    yield select((state, a) => state.foo, 1);
    yield select((state, a) => state.foo, 'a');
    yield select((state, a) => state.foo, 'a');
    // $ExpectError
    yield select((state, a, b) => state.foo, 'a');
    // $ExpectError
    yield select((state, a, b) => state.foo, 'a', 1);
    // $ExpectError
    yield select((state, a, b) => state.foo, 1, 'b');
    yield select((state, a, b) => state.foo, 'a', 'b');
    yield select((state, a, b) => state.foo, 'a', 'b');
    // $ExpectError
    yield select((state, a, b, c, d, e, f) => state.foo, 1, 'b', 'c', 'd', 'e', 'f');
    yield select((state, a, b, c, d, e, f) => state.foo, 'a', 'b', 'c', 'd', 'e', 'f');
    yield select((state, a, b, c, d, e, f) => state.foo, 'a', 'b', 'c', 'd', 'e', 'f');
}
function* testActionChannel() {
    // $ExpectError
    yield actionChannel();
    /* action type */
    yield actionChannel('my-action');
    yield actionChannel('my-action', actionBuffer);
    // $ExpectError
    yield actionChannel('my-action', nonActionBuffer);
    /* action predicate */
    yield actionChannel((action) => action.type === 'my-action');
    yield actionChannel((action) => action.type === 'my-action', actionBuffer);
    // $ExpectError
    yield actionChannel((action) => action.type === 'my-action', nonActionBuffer);
    // $ExpectError
    yield actionChannel((item) => item.someField === '--', actionBuffer);
    // $ExpectError
    yield actionChannel(() => { });
    // $ExpectError
    yield actionChannel(() => { }, actionBuffer);
    /* stringable action creator */
    yield actionChannel(stringableActionCreator);
    yield actionChannel(stringableActionCreator, buffers.fixed());
    // $ExpectError
    yield actionChannel(stringableActionCreator, nonActionBuffer);
    /* array */
    yield actionChannel(['my-action', (action) => action.type === 'my-action', stringableActionCreator]);
    // $ExpectError
    yield actionChannel([() => { }]);
}
function* testCancelled() {
    yield cancelled();
    // $ExpectError
    yield cancelled(1);
}
function* testFlush() {
    // $ExpectError
    yield flush();
    // $ExpectError
    yield flush({});
    yield flush(channel);
    yield flush(eventChannel);
    // $ExpectError
    yield flush(multicastChannel);
}
function* testGetContext() {
    // $ExpectError
    yield getContext();
    // $ExpectError
    yield getContext({});
    yield getContext('prop');
}
function* testSetContext() {
    // $ExpectError
    yield setContext();
    // $ExpectError
    yield setContext('prop');
    yield setContext({ prop: 1 });
}
function* testTakeEvery() {
    // $ExpectError
    yield takeEvery();
    // $ExpectError
    yield takeEvery('my-action');
    yield takeEvery('my-action', (action) => { });
    yield takeEvery('my-action', (action) => { });
    yield takeEvery('my-action', function* (action) { });
    yield takeEvery('my-action', function* (action) { });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeEvery('my-action', helperWorker1);
    // $ExpectError
    yield takeEvery('my-action', helperWorker1, 1);
    yield takeEvery('my-action', helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeEvery('my-action', helperSaga1);
    // $ExpectError
    yield takeEvery('my-action', helperSaga1, 1);
    yield takeEvery('my-action', helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeEvery('my-action', helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeEvery('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeEvery('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    const helperWorker8 = (a, b, c, d, e, f, g) => { };
    // $ExpectError
    yield takeEvery('my-action', helperWorker8, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeEvery('my-action', helperWorker8, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeEvery('my-action', helperWorker8, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeEvery('my-action', helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeEvery('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeEvery('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeEvery((action) => action.type === 'my-action', (action) => { });
    yield takeEvery(isMyAction, action => action.customField);
    yield takeEvery(isMyAction, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    // $ExpectError
    yield takeEvery(() => { }, (action) => { });
    yield takeEvery(stringableActionCreator, action => action.customField);
    yield takeEvery(stringableActionCreator, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    yield takeEvery(['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction], (action) => { });
    // test inference of action types from action pattern
    const pattern1 = null;
    const pattern2 = null;
    yield takeEvery([pattern1, pattern2], action => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    });
    yield takeEvery([pattern1, pattern2], (arg, action) => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    }, { foo: 'bar' });
}
function* testChannelTakeEvery() {
    // $ExpectError
    yield takeEvery(channel);
    // $ExpectError
    yield takeEvery(channel, (action) => { });
    yield takeEvery(channel, (action) => { });
    yield takeEvery(channel, action => {
        // $ExpectError
        action.foo;
        action.someField;
    });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeEvery(channel, helperWorker1);
    // $ExpectError
    yield takeEvery(channel, helperWorker1, 1);
    yield takeEvery(channel, helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeEvery(channel, helperSaga1);
    // $ExpectError
    yield takeEvery(channel, helperSaga1, 1);
    yield takeEvery(channel, helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeEvery(channel, helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeEvery(channel, helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeEvery(channel, helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeEvery(channel, helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeEvery(eventChannel, (action) => { });
    yield takeEvery(multicastChannel, (action) => { });
}
function* testTakeLatest() {
    // $ExpectError
    yield takeLatest();
    // $ExpectError
    yield takeLatest('my-action');
    yield takeLatest('my-action', (action) => { });
    yield takeLatest('my-action', (action) => { });
    yield takeLatest('my-action', function* (action) { });
    yield takeLatest('my-action', function* (action) { });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeLatest('my-action', helperWorker1);
    // $ExpectError
    yield takeLatest('my-action', helperWorker1, 1);
    yield takeLatest('my-action', helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeLatest('my-action', helperSaga1);
    // $ExpectError
    yield takeLatest('my-action', helperSaga1, 1);
    yield takeLatest('my-action', helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeLatest('my-action', helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeLatest('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeLatest('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeLatest('my-action', helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeLatest('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeLatest('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLatest((action) => action.type === 'my-action', (action) => { });
    yield takeLatest(isMyAction, action => action.customField);
    yield takeLatest(isMyAction, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    // $ExpectError
    yield takeLatest(() => { }, (action) => { });
    yield takeLatest(stringableActionCreator, action => action.customField);
    yield takeLatest(stringableActionCreator, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    yield takeLatest(['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction], (action) => { });
    // test inference of action types from action pattern
    const pattern1 = null;
    const pattern2 = null;
    yield takeLatest([pattern1, pattern2], action => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    });
    yield takeLatest([pattern1, pattern2], (arg, action) => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    }, { foo: 'bar' });
}
function* testChannelTakeLatest() {
    // $ExpectError
    yield takeLatest(channel);
    // $ExpectError
    yield takeLatest(channel, (action) => { });
    yield takeLatest(channel, (action) => { });
    yield takeLatest(channel, action => {
        // $ExpectError
        action.foo;
        action.someField;
    });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeLatest(channel, helperWorker1);
    // $ExpectError
    yield takeLatest(channel, helperWorker1, 1);
    yield takeLatest(channel, helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeLatest(channel, helperSaga1);
    // $ExpectError
    yield takeLatest(channel, helperSaga1, 1);
    yield takeLatest(channel, helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeLatest(channel, helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLatest(channel, helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeLatest(channel, helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLatest(channel, helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLatest(eventChannel, (action) => { });
    yield takeLatest(multicastChannel, (action) => { });
}
function* testTakeLeading() {
    // $ExpectError
    yield takeLeading();
    // $ExpectError
    yield takeLeading('my-action');
    yield takeLeading('my-action', (action) => { });
    yield takeLeading('my-action', (action) => { });
    yield takeLeading('my-action', function* (action) { });
    yield takeLeading('my-action', function* (action) { });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeLeading('my-action', helperWorker1);
    // $ExpectError
    yield takeLeading('my-action', helperWorker1, 1);
    yield takeLeading('my-action', helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeLeading('my-action', helperSaga1);
    // $ExpectError
    yield takeLeading('my-action', helperSaga1, 1);
    yield takeLeading('my-action', helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeLeading('my-action', helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeLeading('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeLeading('my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeLeading('my-action', helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield takeLeading('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield takeLeading('my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLeading((action) => action.type === 'my-action', (action) => { });
    yield takeLeading(isMyAction, action => action.customField);
    yield takeLeading(isMyAction, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    // $ExpectError
    yield takeLeading(() => { }, (action) => { });
    yield takeLeading(stringableActionCreator, action => action.customField);
    yield takeLeading(stringableActionCreator, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    yield takeLeading(['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction], (action) => { });
    // test inference of action types from action pattern
    const pattern1 = null;
    const pattern2 = null;
    yield takeLeading([pattern1, pattern2], action => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    });
    yield takeLeading([pattern1, pattern2], (arg, action) => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    }, { foo: 'bar' });
}
function* testChannelTakeLeading() {
    // $ExpectError
    yield takeLeading(channel);
    // $ExpectError
    yield takeLeading(channel, (action) => { });
    yield takeLeading(channel, (action) => { });
    yield takeLeading(channel, action => {
        // $ExpectError
        action.foo;
        action.someField;
    });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield takeLeading(channel, helperWorker1);
    // $ExpectError
    yield takeLeading(channel, helperWorker1, 1);
    yield takeLeading(channel, helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield takeLeading(channel, helperSaga1);
    // $ExpectError
    yield takeLeading(channel, helperSaga1, 1);
    yield takeLeading(channel, helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield takeLeading(channel, helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLeading(channel, helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield takeLeading(channel, helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLeading(channel, helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield takeLeading(eventChannel, (action) => { });
    yield takeLeading(multicastChannel, (action) => { });
}
function* testThrottle() {
    // $ExpectError
    yield throttle(1);
    // $ExpectError
    yield throttle(1, 'my-action');
    yield throttle(1, 'my-action', (action) => { });
    yield throttle(1, 'my-action', (action) => { });
    yield throttle(1, 'my-action', function* (action) { });
    yield throttle(1, 'my-action', function* (action) { });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield throttle(1, 'my-action', helperWorker1);
    // $ExpectError
    yield throttle(1, 'my-action', helperWorker1, 1);
    yield throttle(1, 'my-action', helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield throttle(1, 'my-action', helperSaga1);
    // $ExpectError
    yield throttle(1, 'my-action', helperSaga1, 1);
    yield throttle(1, 'my-action', helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield throttle(1, 'my-action', helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield throttle(1, 'my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield throttle(1, 'my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield throttle(1, 'my-action', helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield throttle(1, 'my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield throttle(1, 'my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield throttle(1, (action) => action.type === 'my-action', (action) => { });
    yield throttle(1, isMyAction, action => action.customField);
    yield throttle(1, isMyAction, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    // $ExpectError
    yield throttle(1, () => { }, (action) => { });
    yield throttle(1, stringableActionCreator, action => action.customField);
    yield throttle(1, stringableActionCreator, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    yield throttle(1, ['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction], (action) => { });
    // test inference of action types from action pattern
    const pattern1 = null;
    const pattern2 = null;
    yield throttle(1, [pattern1, pattern2], action => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    });
    yield throttle(1, [pattern1, pattern2], (arg, action) => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    }, { foo: 'bar' });
}
function* testChannelThrottle() {
    // $ExpectError
    yield throttle(1, channel);
    // $ExpectError
    yield throttle(1, channel, (action) => { });
    yield throttle(1, channel, (action) => { });
    yield throttle(1, channel, action => {
        // $ExpectError
        action.foo;
        action.someField;
    });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield throttle(1, channel, helperWorker1);
    // $ExpectError
    yield throttle(1, channel, helperWorker1, 1);
    yield throttle(1, channel, helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield throttle(1, channel, helperSaga1);
    // $ExpectError
    yield throttle(1, channel, helperSaga1, 1);
    yield throttle(1, channel, helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield throttle(1, channel, helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield throttle(1, channel, helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield throttle(1, channel, helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield throttle(1, channel, helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield throttle(1, eventChannel, (action) => { });
    yield throttle(1, multicastChannel, (action) => { });
}
function* testDebounce() {
    // $ExpectError
    yield debounce(1);
    // $ExpectError
    yield debounce(1, 'my-action');
    yield debounce(1, 'my-action', (action) => { });
    yield debounce(1, 'my-action', (action) => { });
    yield debounce(1, 'my-action', function* (action) { });
    yield debounce(1, 'my-action', function* (action) { });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield debounce(1, 'my-action', helperWorker1);
    // $ExpectError
    yield debounce(1, 'my-action', helperWorker1, 1);
    yield debounce(1, 'my-action', helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield debounce(1, 'my-action', helperSaga1);
    // $ExpectError
    yield debounce(1, 'my-action', helperSaga1, 1);
    yield debounce(1, 'my-action', helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield debounce(1, 'my-action', helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield debounce(1, 'my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield debounce(1, 'my-action', helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield debounce(1, 'my-action', helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    // $ExpectError
    yield debounce(1, 'my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f');
    yield debounce(1, 'my-action', helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield debounce(1, (action) => action.type === 'my-action', (action) => { });
    yield debounce(1, isMyAction, action => action.customField);
    yield debounce(1, isMyAction, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    // $ExpectError
    yield debounce(1, () => { }, (action) => { });
    yield debounce(1, stringableActionCreator, action => action.customField);
    yield debounce(1, stringableActionCreator, (a, action) => {
        a.foo + action.customField;
    }, { foo: 'bar' });
    yield debounce(1, ['my-action', (action) => action.type === 'my-action', stringableActionCreator, isMyAction], (action) => { });
    // test inference of action types from action pattern
    const pattern1 = null;
    const pattern2 = null;
    yield debounce(1, [pattern1, pattern2], action => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    });
    yield debounce(1, [pattern1, pattern2], (arg, action) => {
        if (action.type === 'A') {
        }
        if (action.type === 'B') {
        }
        // $ExpectError
        if (action.type === 'C') {
        }
    }, { foo: 'bar' });
}
function* testChannelDebounce() {
    // $ExpectError
    yield debounce(1, channel);
    // $ExpectError
    yield debounce(1, channel, (action) => { });
    yield debounce(1, channel, (action) => { });
    yield debounce(1, channel, action => {
        // $ExpectError
        action.foo;
        action.someField;
    });
    const helperWorker1 = (a, action) => { };
    // $ExpectError
    yield debounce(1, channel, helperWorker1);
    // $ExpectError
    yield debounce(1, channel, helperWorker1, 1);
    yield debounce(1, channel, helperWorker1, 'a');
    function* helperSaga1(a, action) { }
    // $ExpectError
    yield debounce(1, channel, helperSaga1);
    // $ExpectError
    yield debounce(1, channel, helperSaga1, 1);
    yield debounce(1, channel, helperSaga1, 'a');
    const helperWorker7 = (a, b, c, d, e, f, g, action) => { };
    // $ExpectError
    yield debounce(1, channel, helperWorker7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield debounce(1, channel, helperWorker7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    function* helperSaga7(a, b, c, d, e, f, g, action) { }
    // $ExpectError
    yield debounce(1, channel, helperSaga7, 1, 'b', 'c', 'd', 'e', 'f', 'g');
    yield debounce(1, channel, helperSaga7, 'a', 'b', 'c', 'd', 'e', 'f', 'g');
    yield debounce(1, eventChannel, (action) => { });
    yield debounce(1, multicastChannel, (action) => { });
}
function* testDelay() {
    // $ExpectError
    yield delay();
    yield delay(1);
}
function* testRetry() {
    // $ExpectError
    yield retry();
    // $ExpectError
    yield retry(1, 0, 1);
    yield retry(1, 0, () => 1);
    yield retry(1, 0, () => 'foo');
    // $ExpectError
    yield retry(1, 0, () => 'foo');
    yield retry(1, 0, a => a + 1, 42);
    // $ExpectError
    yield retry(1, 0, (a) => a, 42);
    // $ExpectError
    yield retry(1, 0, a => a, 42);
    yield retry(1, 0, (a, b, c) => a, 1, 2, '3');
}
function* testAll() {
    yield all([call(() => { })]);
    // $ExpectError
    yield all([1]);
    // $ExpectError
    yield all([() => { }]);
    // $ExpectError
    yield all([promise]);
    // $ExpectError
    yield all([1, () => { }, promise]);
    yield all({
        named: call(() => { }),
    });
    // $ExpectError
    yield all({
        named: 1,
    });
    // $ExpectError
    yield all({
        named: () => { },
    });
    // $ExpectError
    yield all({
        named: promise,
    });
    // $ExpectError
    yield all({
        named1: 1,
        named2: () => { },
        named3: promise,
    });
}
function* testNonStrictAll() {
    yield all([1]);
    yield all([() => { }]);
    yield all([promise]);
    yield all([1, () => { }, promise]);
    yield all({
        named: 1,
    });
    yield all({
        named: () => { },
    });
    yield all({
        named: promise,
    });
    yield all({
        named1: 1,
        named2: () => { },
        named3: promise,
    });
}
function* testRace() {
    yield race({
        call: call(() => { }),
    });
    // $ExpectError
    yield race({
        named: 1,
    });
    // $ExpectError
    yield race({
        named: () => { },
    });
    // $ExpectError
    yield race({
        named: promise,
    });
    // $ExpectError
    yield race({
        named1: 1,
        named2: () => { },
        named3: promise,
    });
    const effectArray = [call(() => { }), call(() => { })];
    yield race([...effectArray]);
    // $ExpectError
    yield race([...effectArray, promise]);
}
function* testNonStrictRace() {
    yield race({
        named: 1,
    });
    yield race({
        named: () => { },
    });
    yield race({
        named: promise,
    });
    yield race({
        named1: 1,
        named2: () => { },
        named3: promise,
    });
    const effectArray = [call(() => { }), call(() => { })];
    yield race([...effectArray]);
    yield race([...effectArray, promise]);
}

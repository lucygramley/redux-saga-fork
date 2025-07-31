import { put } from 'redux-saga/effects';
import { cloneableGenerator } from '@redux-saga/testing-utils';
function testCloneableGenerator() {
    function* testSaga() {
        yield put({ type: 'my-action' });
    }
    const cloneableGen = cloneableGenerator(testSaga)();
    const value = cloneableGen.next().value;
    const clone = cloneableGen.clone();
    const cloneVal = clone.next().value;
}
function testCloneableGenerator1() {
    function* testSaga(n1) {
        yield put({ type: 'my-action' });
    }
    // $ExpectError
    cloneableGenerator(testSaga)();
    // $ExpectError
    cloneableGenerator(testSaga)('foo');
    cloneableGenerator(testSaga)(1);
}
function testCloneableGenerator2() {
    function* testSaga(n1, n2) {
        yield put({ type: 'my-action' });
    }
    cloneableGenerator(testSaga)(1, 2);
}
function testCloneableGenerator3() {
    function* testSaga(n1, n2, n3) {
        yield put({ type: 'my-action' });
    }
    // $ExpectError
    cloneableGenerator(testSaga)(1, 2);
    cloneableGenerator(testSaga)(1, 2, 3);
}
function testCloneableGenerator4() {
    function* testSaga(n1, n2, n3, n4) {
        yield put({ type: 'my-action' });
    }
    cloneableGenerator(testSaga)(1, 2, 3, 4);
}
function testCloneableGenerator5() {
    function* testSaga(n1, n2, n3, n4, n5) {
        yield put({ type: 'my-action' });
    }
    cloneableGenerator(testSaga)(1, 2, 3, 4, 5);
}
function testCloneableGenerator6() {
    function* testSaga(n1, n2, n3, n4, n5, n6) {
        yield put({ type: 'my-action' });
    }
    cloneableGenerator(testSaga)(1, 2, 3, 4, 5, 6);
}
function testCloneableGenerator6Rest() {
    function* testSaga(n1, n2, n3, n4, n5, n6, n7) {
        yield put({ type: 'my-action' });
    }
    cloneableGenerator(testSaga)(1, 2, 3, 4, 5, 6, 7);
}

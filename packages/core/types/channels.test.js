import { buffers, channel, END, eventChannel, multicastChannel, stdChannel, } from "redux-saga";
function testBuffers() {
    const b1 = buffers.none();
    const b2 = buffers.dropping();
    const b3 = buffers.dropping(42);
    const b4 = buffers.expanding();
    const b5 = buffers.expanding(42);
    const b6 = buffers.fixed();
    const b7 = buffers.fixed(42);
    const b8 = buffers.sliding();
    const b9 = buffers.sliding(42);
    const buffer = buffers.none();
    // $ExpectError
    buffer.put({ bar: 'bar' });
    buffer.put({ foo: 'foo' });
    const isEmpty = buffer.isEmpty();
    const item = buffer.take();
    // $ExpectError
    item.foo; // item may be undefined
    const foo = item.foo;
    if (buffer.flush)
        buffer.flush();
}
function testChannel() {
    const c1 = channel();
    const c2 = channel(buffers.none());
    // $ExpectError
    c1.take();
    // $ExpectError
    c1.take((message) => { });
    c1.take((message) => { });
    // $ExpectError
    c1.put({ bar: 1 });
    c1.put({ foo: 'foo' });
    c1.put(END);
    // $ExpectError
    c1.flush();
    // $ExpectError
    c1.flush((messages) => { });
    c1.flush((messages) => { });
    c1.close();
    // Testing that we can't define channels that pass void or undefined
    // $ExpectError
    const voidChannel = channel();
    // $ExpectError
    const voidChannel2 = channel();
    // $ExpectError
    const undefinedChannel = channel();
    // $ExpectError
    channel().put();
    // $ExpectError
    channel().put(undefined);
    // Testing that we can pass primitives into channels
    channel().put(42);
    channel().put('test');
    channel().put(true);
}
function testEventChannel(secs) {
    const subscribe = (emitter) => {
        const iv = setInterval(() => {
            secs -= 1;
            if (secs > 0) {
                emitter(secs);
            }
            else {
                emitter(END);
                clearInterval(iv);
            }
        }, 1000);
        return () => {
            clearInterval(iv);
        };
    };
    const c1 = eventChannel(subscribe);
    const c2 = eventChannel(subscribe, buffers.none()); // $ExpectError
    const c3 = eventChannel(subscribe, buffers.none());
    // $ExpectError
    c1.take();
    // $ExpectError
    c1.take((message) => { });
    c1.take((message) => { });
    // $ExpectError
    c1.put(1);
    // $ExpectError
    c1.flush();
    // $ExpectError
    c1.flush((messages) => { });
    c1.flush((messages) => { });
    c1.close();
    // $ExpectError
    const c4 = eventChannel(() => () => { });
    // $ExpectError
    const c5 = eventChannel(emit => {
        emit();
        return () => { };
    });
    const c6 = eventChannel(emit => {
        // $ExpectError
        emit();
        return () => { };
    });
}
function testMulticastChannel() {
    const c1 = multicastChannel();
    const c2 = stdChannel();
    // $ExpectError
    c1.take();
    // $ExpectError
    c1.take((message) => { });
    c1.take((message) => { });
    // $ExpectError
    c1.put({ bar: 1 });
    c1.put({ foo: 'foo' });
    c1.put(END);
    // $ExpectError
    c1.flush((messages) => { });
    c1.close();
    // $ExpectError
    const c3 = stdChannel();
    // $ExpectError
    const c4 = multicastChannel();
    // $ExpectError
    const c5 = stdChannel();
}

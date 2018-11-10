
let oldToBeMatcher = null;

// do it dirtily because `expect.extend()` uses a wrapper I want to bypass
// @see https://github.com/aaronabramov/jest/blob/f238a43f23611227d05fbab24da6199a0ff03f64/packages/jest-matchers/src/jest-matchers-object.js#L17
const getMatchersObject = () => global[Symbol.for('$$jest-matchers-object')].matchers;

const csiRegex = /\u001b/ug;
const escapeCSI = (str) => str.replace(csiRegex, '\\u001b');


function patch() {
    if (oldToBeMatcher !== null) throw new Error('Already patched?!');
    else {
        const matchers = getMatchersObject();
        oldToBeMatcher = matchers.toBe;
        matchers.toBe = function (actual, expected) {
            if (typeof actual === 'string' && typeof expected === 'string' && !Object.is(actual, expected)) {
                return oldToBeMatcher.call(this, escapeCSI(actual), escapeCSI(expected));
            } else {
                return oldToBeMatcher.call(this, actual, expected);
            }
        };
    }
}

function unpatch() {
    if (oldToBeMatcher === null) throw new Error('Not currently patched?!');
    else {
        const matchers = getMatchersObject();
        matchers.toBe = oldToBeMatcher;
        oldToBeMatcher = null;
    }
}

module.exports = { patch, unpatch };


let oldMatchers = {
    toBe: null,
    toEqual: null
};

// do it dirtily because `expect.extend()` uses a wrapper I want to bypass
// @see https://github.com/aaronabramov/jest/blob/f238a43f23611227d05fbab24da6199a0ff03f64/packages/jest-matchers/src/jest-matchers-object.js#L17
const getMatchersObject = () => global[Symbol.for('$$jest-matchers-object')].matchers;

const csiRegex = /\u001b/ug;
const spaceRegex = /\ /g;
const carriageReturnRegex = /\r\n/g
const returnRegex = /\n/g
const escape = (str) => ((str)
    .replace(csiRegex, '\\u001b')
    .replace(carriageReturnRegex, '\\r\\n')
    .replace(returnRegex, '\\n')
    .replace(spaceRegex, '*')
);

function labelNode(node) {
    const idParts = [];
    let index, current = node;
    while (current.parent) {
        index = current.parent.children.indexOf(current);
        if (index === -1) {
            idParts = ['MISSING-' + Math.floor(Math.random() * 1000000)];
            break;
        } else {
            idParts.push(index);
            current = current.parent;
        }
    }
    return [node.__proto__.constructor.name, ...idParts].join(':');
}
function replaceNode(base) {
    if (typeof base === 'object') {
        if (Array.isArray(base)) {
            return base.map(replaceNode);
        } else {
            if (base.__proto__.constructor.name === 'GridSpan') {
                return { ...base, node: labelNode(base.node) };
            } else return base;
        }
    } else return base;
}

function patch() {
    if (oldMatchers.toBe !== null) throw new Error('Already patched?!');
    else {
        const matchers = getMatchersObject();

        oldMatchers.toBe = matchers.toBe;
        oldMatchers.toEqual = matchers.toEqual;

        matchers.toBe = function (actual, expected) {
            if (typeof actual === 'string' && typeof expected === 'string' && !Object.is(actual, expected)) {
                return oldMatchers.toBe.call(this, escape(actual), escape(expected));
            } else {
                return oldMatchers.toBe.call(this, actual, expected);
            }
        };
        matchers.toEqual = function (actual, expected) {
            return oldMatchers.toEqual.call(this, replaceNode(actual), replaceNode(expected));
        };
    }
}

function unpatch() {
    if (oldToBeMatcher === null) throw new Error('Not currently patched?!');
    else {
        const matchers = getMatchersObject();
        matchers.toBe = oldMatchers.toBe;
        matchers.toEqual = oldMatchers.toEqual;
        oldMatchers = {
            toBe: null,
            toEqual: null
        };
    }
}

module.exports = { patch, unpatch };
